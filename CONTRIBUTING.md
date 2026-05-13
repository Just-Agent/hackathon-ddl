# Contributing to Hackathon-DDL

Thank you for your interest in contributing! This document describes how to add or update hackathon data.

## Quick Start (3 Steps)

### 1. Fork the Repository

Click the **Fork** button on GitHub to create your own copy.

### 2. Add Your Hackathon Data

Create or edit YAML files in `data/2026/` (or the appropriate year directory).

Files are organized by month: `01_jan.yml`, `02_feb.yml`, etc. Place the hackathon in the file corresponding to its **registration open** month.

#### Minimal Example (Required Fields Only)

```yaml
- title: "My Hackathon 2026"
  platform: "devpost"
  url: "https://myhackathon.devpost.com"
  is_online: false
  phases:
    - name: "Registration Deadline"
      deadline: "2026-08-01T23:59:59-04:00"
    - name: "Project Submission"
      deadline: "2026-09-15T09:00:00-04:00"
  status: "upcoming"
```

#### Full Example (All Fields)

```yaml
- title: "My Awesome Hackathon 2026"
  platform: "devpost"
  url: "https://myhackathon.devpost.com"
  location: "San Francisco, CA, USA"
  is_online: false
  is_hybrid: true
  themes: ["AI/ML", "Open Innovation"]
  prize_pool: "$50,000+"
  currency: "USD"
  prize_value: 50000
  phases:
    - name: "Registration Opens"
      deadline: "2026-06-01T00:00:00-07:00"
    - name: "Registration Closes"
      deadline: "2026-08-31T23:59:59-07:00"
    - name: "Hacking Starts"
      deadline: "2026-09-15T09:00:00-07:00"
    - name: "Project Submission"
      deadline: "2026-09-17T09:00:00-07:00"
    - name: "Demo Day"
      deadline: "2026-09-17T14:00:00-07:00"
  sponsors: ["Google", "OpenAI"]
  eligibility: "Open to all university students"
  status: "upcoming"
  date_range: "September 15-17, 2026"
  added_at: "2026-05-10"
```

## Schema Reference

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Hackathon name with year |
| `platform` | enum | Yes | Source platform. One of: `devpost`, `mlh`, `dorahacks`, `devfolio`, `unstop`, `hackerearth`, `other` |
| `url` | string | Yes | Official hackathon URL |
| `location` | string | No | City and country (omit for online-only events) |
| `is_online` | boolean | Yes | `true` if fully online |
| `is_hybrid` | boolean | No | `true` if hybrid format |
| `themes` | string[] | No | Tags from: AI/ML, Web3, IoT, Climate, Open Source, Healthcare, FinTech, EdTech, DeFi, Blockchain, Open Innovation, Beginner Friendly |
| `prize_pool` | string | No | Display text, e.g. "$50,000+" |
| `currency` | enum | No | `USD`, `EUR`, `GBP`, `CAD`, `SGD`, `AUD`, `CNY`, `JPY` |
| `prize_value` | number | No | Numeric value for sorting (USD equivalent) |
| `phases` | array | Yes | Deadline phases. Each needs `name` and `deadline` |
| `sponsors` | string[] | No | List of sponsor company names |
| `eligibility` | string | No | Who can participate |
| `status` | enum | Yes | `upcoming`, `ongoing`, `ended`, or `cancelled` |
| `date_range` | string | No | Human-readable dates, e.g. "September 15-17, 2026" |
| `added_at` | string | No | Date added in `YYYY-MM-DD` format |

### Phase Format

Each phase must have:
- `name`: Human-readable phase name
- `deadline`: ISO 8601 datetime with timezone offset (e.g. `2026-09-15T09:00:00-04:00`)
  - Use `TBD` if the exact date is not yet announced

### Timezone Format

Always include timezone offset in deadlines:
- Eastern Time (ET): `-05:00` or `-04:00` (DST)
- Pacific Time (PT): `-08:00` or `-07:00` (DST)
- UTC: `+00:00` or `Z`

## 3. Submit a Pull Request

1. Commit your changes with a clear message:
   ```bash
   git add data/2026/05_may.yml
   git commit -m "data: add My Hackathon 2026"
   ```

2. Push to your fork and open a Pull Request.

3. The CI will automatically validate your YAML. If it passes, a maintainer will review and merge.

## Validation

Run the validator locally before submitting:

```bash
pip install pyyaml
python scripts/validator.py data/2026/
```

## Questions?

- Open an [Issue](https://github.com/Just-Agent/hackathon-ddl/issues) for questions
- Join discussions in existing issues

## Code of Conduct

Be respectful and constructive. We're all here to help the hackathon community!
