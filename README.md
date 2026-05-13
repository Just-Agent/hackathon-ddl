# Hackathon-DDL

[![Daily Crawl](https://github.com/Just-Agent/hackathon-ddl/actions/workflows/daily-crawl.yml/badge.svg)](https://github.com/Just-Agent/hackathon-ddl/actions/workflows/daily-crawl.yml)
[![Deploy to Pages](https://github.com/Just-Agent/hackathon-ddl/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Just-Agent/hackathon-ddl/actions/workflows/deploy-pages.yml)

> **Worldwide Hackathon Deadline Tracker** �?全球 Hackathon 截止时间追踪平台

A community-driven platform for tracking hackathon deadlines worldwide. Inspired by [ccfddl](https://ccfddl.github.io/), built for hackers.

[Live Website](https://just-agent.github.io/hackathon-ddl/) | [Contribute](#contributing) | [Data Schema](CONTRIBUTING.md#schema-reference)

---

## Features

| Feature | Description |
|---------|-------------|
| **Real-time Countdown** | Live countdown to the nearest deadline for each hackathon |
| **Multi-phase Tracking** | Track Registration, Hacking, Submission, and Demo Day deadlines |
| **Prize Heat Map** | Visual prize pool comparison with color-coded bars |
| **Smart Filters** | Filter by theme (AI/ML, Web3, IoT...), format (Online/In-person/Hybrid), platform |
| **iCal/ICS Export** | One-click calendar subscription for all deadlines |
| **Dark/Light Theme** | Comfortable viewing in any environment |
| **Mobile Responsive** | Optimized for phones, tablets, and desktops |
| **Community Driven** | Data maintained via GitHub Pull Requests |
| **Auto Crawler** | Daily automated data scraping from major platforms |

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS | Free |
| Hosting | GitHub Pages | Free |
| Data | GitHub YAML + PR Collaboration | Free |
| Crawler | Python + GitHub Actions (Daily cron) | Free |
| **Total** | | **$0/month** |

## Architecture

```
 GitHub Repo (Data + Code + CI/CD)
 ├── data/2026/*.yml          # Hackathon data (YAML)
 ├── src/                      # React frontend
 ├── scripts/
 �?  ├── scraper.py            # Multi-platform crawler
 �?  ├── validator.py          # YAML schema validator
 �?  └── ics_generator.py      # Calendar export
 ├── .github/workflows/
 �?  ├── daily-crawl.yml       # Daily scraping (00:00 UTC)
 �?  ├── pr-check.yml          # PR validation
 �?  └── deploy-pages.yml      # Auto-deploy frontend
 └── public/                   # Static assets
```

**No server required.** Everything runs on GitHub's free infrastructure:
- **GitHub Pages** serves the static React site
- **GitHub Actions** runs the daily crawler
- **GitHub YAML files** store the data
- Community contributes via **Pull Requests**

## Supported Platforms

| Platform | Coverage | Method |
|----------|----------|--------|
| [Devpost](https://devpost.com/hackathons) | Global | Web scraping |
| [MLH](https://mlh.io) | North America/Europe | API + scraping |
| [DoraHacks](https://dorahacks.io) | Asia/Global | API |
| [Devfolio](https://devfolio.co) | India/Asia | Planned |
| [Unstop](https://unstop.com) | India | Planned |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

### Quick Add (3 Steps)

1. **Fork** this repository
2. **Add data** to `data/2026/MM_mon.yml` (see schema below)
3. **Submit PR** �?CI validates automatically

### Minimal Entry

```yaml
- title: "Hackathon Name 2026"
  platform: "devpost"
  url: "https://example.devpost.com"
  is_online: false
  phases:
    - name: "Registration Deadline"
      deadline: "2026-09-01T23:59:59-04:00"
  status: "upcoming"
```

## Project Roadmap

- [x] Frontend MVP with real-time countdown
- [x] Multi-phase deadline tracking
- [x] Prize heat visualization
- [x] Theme and format filtering
- [x] iCal/ICS calendar export
- [x] Dark/light theme
- [x] Mobile responsive design
- [x] YAML data schema + validator
- [x] GitHub Actions CI/CD
- [x] Auto-deploy to GitHub Pages
- [ ] Daily scraper (Devpost, MLH, DoraHacks)
- [ ] WeChat Mini Program
- [ ] CLI tool (`pip install hackathon-ddl`)
- [ ] Chrome extension
- [ ] Team matching feature
- [ ] Historical win rate analysis

## Acknowledgements

Inspired by [ccfddl](https://ccfddl.github.io/) �?the academic conference deadline tracker that proved community-driven data curation works.

## License

MIT License �?free for personal and commercial use.

---

**Maintained by the community.** If you find it useful, [star us on GitHub](https://github.com/Just-Agent/hackathon-ddl)!

*Data is manually collected and automatically crawled for reference purposes only.*
