<h1 align="center" style="display:flex;align-items:center;justify-content:center;border-bottom:0;">
    <img src="logo.svg" width="6%" style="margin-right:10px;" />
    <span>mizuhub</span>
</h1>

<p align="center">
  CRM system for small-medium sized businesses
</p>
<br />

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/ashleyjtaylor/mizuhub/ci-api.yml?logo=github&style=flat-square&label=API build" />
  <img src="https://img.shields.io/sonar/coverage/ashleyjtaylor_mizuhub_api?server=https%3A%2F%2Fsonarcloud.io&logo=sonarcloud&style=flat-square&label=API" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white&style=flat-square" />
</p>


## Prerequisites

#### Installations

- docker
- homebrew
  - Create `/opt/homebrew/var/mongodb` directory for the `mongodb` data store.
- Create a `SonarCloud` project for each monorepo app and apply the project attributes to the `sonar-project.properties` file

```bash
brew install mongodb-community
```

#### Variables

- ✅ `SONAR_TOKEN` added to GitHub secrets


## Getting started

Install project dependencies:

```
npm install
```

Run Docker to get the MongoDb instance started:

```
docker compose up
```