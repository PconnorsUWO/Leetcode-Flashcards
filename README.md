﻿# Leetcode-Flashcards

A collection of scripts and utilities to interact with LeetCode data, including:

- Fetching the most recent accepted submissions from LeetCode.
- Downloading full problem statements and flashcard-like details.
- Updating a local JSON file (`solved_problems.json`) with submission code.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
  - [1. Retrieve Most Recent Accepted Submissions](#1-retrieve-most-recent-accepted-submissions)
  - [2. Fetch Problem Details](#2-fetch-problem-details)
  - [3. Retrieve Submission Code and Update JSON](#3-retrieve-submission-code-and-update-json)
- [Usage Examples](#usage-examples)
- [Notes & Troubleshooting](#notes--troubleshooting)
- [License](#license)

---

## Overview

This project uses the [**leetcode-query**](https://www.npmjs.com/package/leetcode-query) package and **Playwright** (with stealth plugins) to automate interactions with LeetCode. It aims to help you:

1. Grab your most recent accepted submissions from LeetCode and store them in `solved_problems.json`.
2. Retrieve detailed problem statements (title, difficulty, content, hints, etc.) for flashcard creation.
3. Enrich your local data with actual code from your successful submissions.

This is especially useful for building a personal knowledge base, studying, or migrating your solutions to GitHub.

---

## Features

1. **Fetch All Accepted Submissions**  
   Retrieves up to 2000 recent submissions from your account, filters out only those marked "Accepted," and stores the latest submission per problem.

2. **Generate JSON Output**  
   A summary JSON file (`solved_problems.json`) is created, containing:
   - General summary data (total submissions, total accepted, etc.).
   - An array of objects, each representing the most recent accepted submission details.

3. **Download Problem Statement**  
   Ability to convert the raw HTML problem description into plain text (using `html-to-text`). This can be saved locally for offline reference.

4. **Update Submission Data**  
   Option to open each submission page via Playwright (headless browser), scrape the actual code, and inject it back into your local JSON.

5. **Modular Design**  
   Each functionality (fetching solutions, problem details, updating JSON, etc.) is housed in separate scripts for clarity and maintainability.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- npm or yarn (to install dependencies)
- A valid LeetCode account and your `LEETCODE_SESSION_COOKIE`. 

> **Note**: You must already be logged in to your LeetCode account in a browser to retrieve your session cookie. This approach is **only** for personal, private use. **Do not share** your session cookie.

---

## Project Structure
src
├── leetcode_solutions.js
├── leetcode_solutions.ts
├── problem.js
├── problem.ts
├── problem_details.js
├── problem_details.ts
├── update_json.js
└── update_json.ts

- **`leetcode_solutions.ts`**: Fetches your recent submissions from LeetCode and writes them to `solved_problems.json`.
- **`problem.ts`**: Fetches and converts problem statements (including example test cases and hints) for a given slug.
- **`problem_details.ts`**: Uses Playwright to scrape the code for a given submission ID (via its URL).
- **`update_json.ts`**: Reads `solved_problems.json`, scrapes each submission’s code, and adds it back into the JSON.

Compiled JavaScript files (`.js`) are produced by the TypeScript compiler from their `.ts` counterparts.

---

