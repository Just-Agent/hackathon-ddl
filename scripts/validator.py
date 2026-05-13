#!/usr/bin/env python3
"""
Hackathon-DDL YAML Data Validator
Validates hackathon YAML files against the required schema.

Usage:
    python scripts/validator.py data/2026/

Exit codes:
    0 - All files valid
    1 - Validation errors found
"""

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml


# Required fields for each hackathon entry
REQUIRED_FIELDS = {
    "title": str,
    "platform": str,
    "url": str,
    "is_online": bool,
    "phases": list,
    "status": str,
}

# Optional fields with type hints
OPTIONAL_FIELDS = {
    "location": str,
    "is_hybrid": bool,
    "themes": list,
    "prize_pool": str,
    "currency": str,
    "prize_value": (int, float),
    "sponsors": list,
    "eligibility": str,
    "date_range": str,
    "added_at": str,
    "updated_at": str,
}

VALID_PLATFORMS = {
    "devpost", "mlh", "dorahacks", "devfolio", "unstop",
    "hackerearth", "other",
}

VALID_STATUSES = {"upcoming", "ongoing", "ended", "cancelled"}

VALID_THEMES = {
    "AI/ML", "Web3", "IoT", "Climate", "Open Source", "Healthcare",
    "FinTech", "EdTech", "DeFi", "Blockchain", "Open Innovation",
    "Beginner Friendly", "Gaming", "Social Good", "Cybersecurity",
}

VALID_CURRENCIES = {"USD", "EUR", "GBP", "CAD", "SGD", "AUD", "CNY", "JPY"}


def log_error(filepath: Path, entry_idx: int, field: str, message: str):
    print(f"  ERROR [{filepath.name}][#{entry_idx}] {field}: {message}")


def log_warning(filepath: Path, entry_idx: int, field: str, message: str):
    print(f"  WARNING [{filepath.name}][#{entry_idx}] {field}: {message}")


def validate_entry(entry: dict, filepath: Path, entry_idx: int) -> bool:
    """Validate a single hackathon entry. Returns True if valid."""
    valid = True

    # Check required fields
    for field, expected_type in REQUIRED_FIELDS.items():
        if field not in entry:
            log_error(filepath, entry_idx, field, "Missing required field")
            valid = False
        elif not isinstance(entry[field], expected_type):
            log_error(
                filepath, entry_idx, field,
                f"Expected {expected_type.__name__}, got {type(entry[field]).__name__}"
            )
            valid = False

    if not valid:
        return False  # Can't validate further without required fields

    # Validate platform
    platform = entry.get("platform", "").lower()
    if platform not in VALID_PLATFORMS:
        log_error(
            filepath, entry_idx, "platform",
            f"Invalid platform '{platform}'. Must be one of: {', '.join(sorted(VALID_PLATFORMS))}"
        )
        valid = False

    # Validate URL
    url = entry.get("url", "")
    if not url.startswith(("http://", "https://")):
        log_error(filepath, entry_idx, "url", f"Invalid URL: {url}")
        valid = False

    # Validate status
    status = entry.get("status", "")
    if status not in VALID_STATUSES:
        log_error(
            filepath, entry_idx, "status",
            f"Invalid status '{status}'. Must be one of: {', '.join(sorted(VALID_STATUSES))}"
        )
        valid = False

    # Validate phases
    phases = entry.get("phases", [])
    if not phases:
        log_error(filepath, entry_idx, "phases", "At least one phase is required")
        valid = False
    else:
        phase_names = set()
        for phase_idx, phase in enumerate(phases):
            if not isinstance(phase, dict):
                log_error(filepath, entry_idx, f"phases[{phase_idx}]", "Must be a dict")
                valid = False
                continue
            if "name" not in phase:
                log_error(filepath, entry_idx, f"phases[{phase_idx}]", "Missing 'name'")
                valid = False
            elif phase["name"] in phase_names:
                log_warning(
                    filepath, entry_idx, f"phases[{phase_idx}]",
                    f"Duplicate phase name '{phase['name']}'"
                )
            else:
                phase_names.add(phase["name"])

            if "deadline" not in phase:
                log_error(filepath, entry_idx, f"phases[{phase_idx}]", "Missing 'deadline'")
                valid = False
            elif phase["deadline"] != "TBD":
                try:
                    datetime.fromisoformat(phase["deadline"].replace("Z", "+00:00"))
                except (ValueError, AttributeError):
                    log_error(
                        filepath, entry_idx, f"phases[{phase_idx}].deadline",
                        f"Invalid ISO 8601 datetime: {phase['deadline']}"
                    )
                    valid = False

    # Validate optional fields
    if "themes" in entry and isinstance(entry["themes"], list):
        for theme in entry["themes"]:
            if theme not in VALID_THEMES:
                log_warning(
                    filepath, entry_idx, "themes",
                    f"Unknown theme '{theme}'. Known themes: {', '.join(sorted(VALID_THEMES))}"
                )

    if "currency" in entry:
        currency = entry["currency"]
        if currency not in VALID_CURRENCIES:
            log_warning(
                filepath, entry_idx, "currency",
                f"Unknown currency '{currency}'. Known: {', '.join(sorted(VALID_CURRENCIES))}"
            )

    if "prize_value" in entry and isinstance(entry.get("prize_value"), (int, float)):
        if entry["prize_value"] < 0:
            log_error(filepath, entry_idx, "prize_value", "Must be non-negative")
            valid = False

    if "is_hybrid" in entry and "is_online" in entry:
        if entry["is_hybrid"] and entry["is_online"]:
            log_warning(
                filepath, entry_idx, "format",
                "is_hybrid=True and is_online=True is contradictory"
            )

    return valid


def validate_file(filepath: Path) -> tuple[int, int]:
    """Validate a single YAML file. Returns (entry_count, error_count)."""
    print(f"\n  Validating: {filepath}")

    try:
        with open(filepath, encoding="utf-8") as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as e:
        print(f"  ERROR: Invalid YAML syntax: {e}")
        return 0, 1
    except FileNotFoundError:
        print(f"  ERROR: File not found: {filepath}")
        return 0, 1

    if data is None:
        print(f"  WARNING: Empty file")
        return 0, 0

    if not isinstance(data, list):
        print(f"  ERROR: Root must be a YAML list")
        return 0, 1

    entry_count = len(data)
    error_count = 0

    for idx, entry in enumerate(data):
        if not isinstance(entry, dict):
            log_error(filepath, idx, "root", f"Expected dict, got {type(entry).__name__}")
            error_count += 1
            continue
        if not validate_entry(entry, filepath, idx):
            error_count += 1

    status = "OK" if error_count == 0 else f"{error_count} ERRORS"
    print(f"  Result: {entry_count} entries, {status}")

    return entry_count, error_count


def main():
    parser = argparse.ArgumentParser(description="Hackathon-DDL YAML Validator")
    parser.add_argument("paths", nargs="+", help="YAML files or directories to validate")
    parser.add_argument("--strict", action="store_true", help="Treat warnings as errors")
    args = parser.parse_args()

    all_files: list[Path] = []
    for path_str in args.paths:
        path = Path(path_str)
        if path.is_dir():
            all_files.extend(sorted(path.glob("*.yml")))
        elif path.suffix in (".yml", ".yaml"):
            all_files.append(path)

    if not all_files:
        print("No YAML files found to validate")
        sys.exit(0)

    print(f"Hackathon-DDL YAML Validator")
    print(f"Found {len(all_files)} YAML file(s) to validate")

    total_entries = 0
    total_errors = 0

    for filepath in all_files:
        entries, errors = validate_file(filepath)
        total_entries += entries
        total_errors += errors

    print(f"\n{'=' * 50}")
    print(f"Summary: {total_entries} entries across {len(all_files)} files")
    if total_errors == 0:
        print(f"Result: ALL VALID")
        sys.exit(0)
    else:
        print(f"Result: {total_errors} ERROR(S) FOUND")
        sys.exit(1)


if __name__ == "__main__":
    main()
