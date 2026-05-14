<div align="center">

# Hackathon-DDL

全球黑客松、线上挑战赛与开发者竞赛截止日追踪。

Just-DDL Network 的黑客松专题仓库，一专题一仓库，独立抓取、独立部署、统一汇总。

[![GitHub Pages](https://img.shields.io/badge/Pages-live-F97316?style=for-the-badge)](https://just-agent.github.io/hackathon-ddl/)
[![Daily Crawl](https://img.shields.io/badge/Action-daily%20crawl-2563EB?style=for-the-badge)](https://github.com/Just-Agent/hackathon-ddl/actions)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-FBBF24?style=for-the-badge)](https://vite.dev/)

[在线访问](https://just-agent.github.io/hackathon-ddl/) · [专题总入口](https://just-agent.github.io/just-ddl/) · [提交 DDL](https://github.com/Just-Agent/hackathon-ddl/issues) · [GitHub 仓库](https://github.com/Just-Agent/hackathon-ddl)

</div>

## 项目定位

Hackathon-DDL 只负责黑客松专题：收集 Devpost、MLH、DoraHacks、Kaggle、企业挑战赛等公开赛事的报名、提交、决赛和评审截止日。它既可以独立作为 GitHub Pages 页面运行，也会被 Just-DDL 汇总为一个专题入口。

## 产品入口

| 入口 | 地址 | 用途 |
| --- | --- | --- |
| GitHub Pages | https://just-agent.github.io/hackathon-ddl/ | 黑客松专题线上页面 |
| Just-DDL Hub | https://just-agent.github.io/just-ddl/ | 汇总全部 DDL 专题 |
| Repository | https://github.com/Just-Agent/hackathon-ddl | 数据、代码、Actions 与贡献入口 |
| Issues | https://github.com/Just-Agent/hackathon-ddl/issues | 补充赛事、修正日期、报告失效链接 |

## Just-DDL Network

| 专题 | 仓库 | Pages | 状态 |
| --- | --- | --- | --- |
| Hackathon-DDL | [Just-Agent/hackathon-ddl](https://github.com/Just-Agent/hackathon-ddl) | [访问](https://just-agent.github.io/hackathon-ddl/) | 已发布 |
| Agent-DDL | [Just-Agent/agent-ddl](https://github.com/Just-Agent/agent-ddl) | [访问](https://just-agent.github.io/agent-ddl/) | 已发布 |
| Just-DDL Hub | [Just-Agent/just-ddl](https://github.com/Just-Agent/just-ddl) | [访问](https://just-agent.github.io/just-ddl/) | 已发布 |
| CV-DDL | [Just-Agent/cv-ddl](https://github.com/Just-Agent/cv-ddl) | [访问](https://just-agent.github.io/cv-ddl/) | 专题骨架 |
| NLP-DDL | [Just-Agent/nlp-ddl](https://github.com/Just-Agent/nlp-ddl) | [访问](https://just-agent.github.io/nlp-ddl/) | 专题骨架 |
| Academic-DDL | [Just-Agent/academic-ddl](https://github.com/Just-Agent/academic-ddl) | [访问](https://just-agent.github.io/academic-ddl/) | 专题骨架 |

## 功能范围

| 模块 | 当前能力 | 说明 |
| --- | --- | --- |
| DDL 列表 | 赛事名称、截止日、平台、状态、标签 | 面向快速浏览和收藏 |
| 倒计时 | 按截止日期自动计算剩余时间 | 页面端轻量展示 |
| 数据采集 | GitHub Actions 定时抓取 | 本地不依赖生产构建环境 |
| Pages 部署 | main 分支自动部署 | 与专题总入口保持联动 |
| 社区贡献 | Issue / PR 补充数据 | 适合持续维护赛事源 |

## 数据结构

```yaml
id: hackathon-example-2026
name: Example Hackathon 2026
platform: Devpost
url: https://example.com
region: Global
deadline: 2026-08-15T23:59:00Z
tags:
  - AI
  - Web
  - Student
status: upcoming
```

## 自动化

| Workflow | 触发方式 | 目标 |
| --- | --- | --- |
| `daily-crawl.yml` | 定时 / 手动 | 更新黑客松数据源 |
| `deploy-pages.yml` | main 分支 / 手动 | 部署 GitHub Pages |
| `pr-check.yml` | Pull Request | 基础校验，避免坏数据进入主分支 |

> 本仓库遵循“本地不构建生产包”的协作约定。构建、打包和发布交给 GitHub Actions。

## 本地开发

```bash
npm install
npm run dev
```

生产部署请以 GitHub Actions 结果为准。本地命令只用于开发预览，不作为生产机部署证明。

## 路线图

| 阶段 | 事项 | 状态 |
| --- | --- | --- |
| 1 | 专题仓库与 Pages 独立部署 | 完成 |
| 2 | Just-DDL Hub 统一展示仓库、Pages 与专题信息 | 进行中 |
| 3 | 自动抓取源扩展到更多赛事平台 | 计划中 |
| 4 | 微信小程序专题页复用同一数据模型 | 计划中 |
| 5 | PC / App 个人 DDL 与官方 DDL 聚合 | 计划中 |

## 贡献

欢迎通过 Issue 提交新的黑客松、修正时间、补充官方链接。提交时请尽量提供官网地址、截止日时区、报名/提交/决赛的不同阶段时间。

## License

当前仓库处于产品孵化阶段。正式开源协议会在发布稳定版本前补齐。
