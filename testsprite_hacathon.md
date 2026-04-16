# TestSprite MCP + Season 2 Hackathon — Full Context

## 1. What TestSprite Is

TestSprite is an AI-powered software testing agent that automates test planning, test generation, execution, debugging, and reporting with minimal manual input. [page:1]  
The MCP Server allows IDE-based AI assistants to orchestrate TestSprite directly from the editor, enabling autonomous or semi-autonomous testing flows. [page:2]

TestSprite markets itself as handling UI, API, and end-to-end testing so developers can focus on shipping features while the agent handles the heavy testing workload. [page:1][page:2]

---

## 2. MCP Server: Core Concepts

### 2.1 Purpose of MCP Server

The MCP Server is the integration point between your development environment (IDE + AI assistant) and TestSprite’s testing backend. It is responsible for: [page:2][page:4]

- Generating comprehensive test plans.
- Creating executable automated tests.
- Executing tests in the cloud.
- Producing detailed test reports.
- Supporting iterative test refinement and code fixes based on failures.

### 2.2 Typical MCP Workflow

The “getting started” and “first test” docs describe a guided workflow: [page:2][page:4]

1. Install and configure TestSprite MCP Server.
2. Run your application locally (frontend, backend, or both).
3. In your IDE, open the AI assistant chat and ask something like:  
   `Can you test this project with TestSprite?`
4. The assistant opens a browser-based TestSprite configuration page.
5. You configure testing parameters (test type, URLs, credentials, PRD).
6. The MCP Server orchestrates test generation and execution.
7. Artifacts and reports are written into a `testsprite_tests/` folder in your project.
8. You can ask the assistant to analyze failures and help fix your code, then rerun tests.

---

## 3. Requirements for Using MCP

The docs outline several expectations before running your first MCP test: [page:2][page:4]

- **Running Application**  
  Your application must be up and reachable (e.g., `http://localhost:3000`) before starting MCP-driven tests.

- **IDE + MCP Installed**  
  You need a compatible IDE (like VS Code with AI chat) and the TestSprite MCP Server installed and configured with your TestSprite account and API key.

- **Configuration Inputs**  
  During the first run, you must provide:
  - **Test Type**:  
    - *Frontend*: for UI and user-flow testing.  
    - *Backend*: for API/service/server logic testing.
  - **URLs**:  
    Frontend and/or backend URLs for the running app.
  - **Credentials**:  
    Test account login details if the app requires authentication.
  - **PRD (Product Requirements Document)**:  
    The docs emphasize PRD upload as required, but clarify that even a rough, imperfect PRD is acceptable because TestSprite normalizes it into a structured internal format.

---

## 4. Generated Artifacts: `testsprite_tests/` Folder

After a successful MCP testing run, TestSprite writes results and artifacts into a `testsprite_tests/` directory in your project. A typical example structure from the docs looks like: [page:4]

```text
testsprite_tests/
├── tmp/
│   ├── prd_files/
│   ├── config.json
│   ├── code_summary.json
│   ├── report_prompt.json
│   └── test_results.json
├── standard_prd.json
├── TestSprite_MCP_Test_Report.md
├── TestSprite_MCP_Test_Report.html
├── TC001_....py
├── TC002_....py
└── ...
```

The docs describe these artifacts as: [page:4]

- **`tmp/`**: Internal working files and metadata.
- **`prd_files/`**: Stored PRD-related artifacts.
- **`config.json`**: Captured configuration for the test run.
- **`code_summary.json`**: Summary of key parts of your codebase.
- **`report_prompt.json`**: Prompting context used to generate reports.
- **`test_results.json`**: Machine-readable test results.
- **`standard_prd.json`**: Normalized PRD representation.
- **`TestSprite_MCP_Test_Report.md` / `.html`**: Human-readable reports.
- **Test case files** (e.g., `TC001_*.py`): Generated automated test scripts.

These files are expected to be **committed** to source control, especially for workflows involving GitHub integration or hackathon submissions. [page:3][page:4]

---

## 5. Automatic Bug Fixing Loop

The docs highlight that TestSprite is not only for detecting failures but can participate in fixing them. After a test run: [page:4]

- You inspect failures.
- You ask the IDE assistant (powered by MCP) to fix code based on TestSprite’s results.
- The assistant patches the code.
- You re-run the tests.
- You iterate until tests pass or quality is acceptable.

This closed-loop testing and fixing cycle is an important part of the “agentic” story TestSprite emphasizes, and in the hackathon context, it directly aligns with the judging emphasis on improvements between testing rounds. [page:1][page:4]

---

## 6. GitHub Integration (App + Actions)

### 6.1 What GitHub Integration Does

The GitHub Integration docs stress that the GitHub App/Action: [page:3]

- **Runs** existing TestSprite tests on pull requests.
- **Does not generate** new tests itself.

Generation must happen via MCP in your IDE first, and the resulting tests must be committed to the repository inside `testsprite_tests/`. [page:3][page:4]

### 6.2 High-Level GitHub App Workflow

Described in the docs as: [page:3]

1. A pull request is opened on a connected repository.
2. Your deployment platform (e.g., Vercel, Netlify, Render, Railway, Fly.io) creates a preview deployment.
3. TestSprite detects the preview URL.
4. The GitHub App runs the committed tests from `testsprite_tests/` against that deployed environment.
5. The app posts a PR comment summarizing test results and linking to detailed reports in the TestSprite portal.

### 6.3 Prerequisites for GitHub Integration

The docs list the following prerequisites: [page:3]

- TestSprite MCP already used to generate tests.
- `testsprite_tests/` committed in the repository.
- A GitHub repository available.
- A deployment platform configured for pull-request preview deployments.

### 6.4 GitHub App vs GitHub Action

The docs draw this comparison: [page:3]

- **GitHub App**
  - Easiest setup.
  - No workflow YAML required.
  - Auto-detects previews from popular platforms (Vercel, Netlify, Render, Railway, Fly.io).
  - Managed via TestSprite Web Portal.

- **GitHub Action**
  - Offers more granular control for custom CI/CD pipelines.
  - Requires:
    - A workflow `.yml` file.
    - Repository secrets (API keys, etc.).
  - Suitable for teams not using the managed preview-based platforms.

### 6.5 Setup Flow (GitHub App)

Typical steps described in the docs: [page:3]

1. Ensure your repo is hooked into a preview-capable deployment platform.
2. In TestSprite Web Portal, open the **GitHub App** section under settings.
3. Click **Connect With GitHub App** and authorize the GitSprite app in GitHub.
4. Choose the repositories to grant access to.
5. Configure PR behavior:
   - Run on PRs.
   - Include or exclude draft PRs.
   - Whether test outcomes are blocking for merge.
6. Save configuration.

After setup, PRs should automatically trigger deployments and subsequent TestSprite test runs, with results reported as comments. [page:3]

---

## 7. Season 2 Hackathon: “Build with AI. Test with TestSprite”

### 7.1 Overview

The Season 2 hackathon page (“Build with AI. Test with TestSprite”) describes a 7-day event focused on using TestSprite AI to test software projects. Key topline details: [page:1]

- **Prize Pool**: $3,000 total.
- **Winners**: 5 winners.
- **Duration**: 7 days to build.

Prize breakdown: [page:1]

- 1st place (Grand Champion): $1,500.
- 2nd place (Runner Up): $750.
- 3rd place: $450.
- 4th place (Honorable Mention): $150.
- 5th place (Honorable Mention): $150.

Prizes are distributed via **Stripe**, **PayPal**, or **bank transfer**. [page:1]

### 7.2 Project Rules: Old or New

The hackathon explicitly welcomes: [page:1]

- **Existing projects** (old codebases).
- **New projects** started from scratch.

The positioning is that TestSprite helps “level up” a project by handling heavy testing, uncovering bugs, and helping participants improve and prepare to ship. [page:1]

### 7.3 How to Join

Two required steps to participate: [page:1]

1. **Follow on X**  
   Follow the official **TestSprite** account on X to get announcements, milestones, countdowns, and winner info.

2. **Join Discord**  
   All rules, judging criteria, submission details, and Q&A live in Discord.  
   Joining the TestSprite Discord server is **mandatory** to participate and submit.

### 7.4 How It Works (High-Level Flow)

The hackathon describes a 4-step flow: [page:1]

1. **Build Your Project**
   - “Write code. Build an app, API, tool, or anything you want. Solo or team — no limits.”

2. **Test with TestSprite**
   - Use **TestSprite MCP** to auto-generate test cases.  
   - The AI agent can handle UI, API, and E2E testing.

3. **Push to GitHub**
   - Commit your project to a **public** repository.
   - The repository must contain:
     - A `testsprite_tests/` subfolder.
     - A `README.md`.
     - An optional `demo.mp4` (demo video).

4. **Submit on Discord**
   - Submit your GitHub link in the specified Discord channel to enter.

### 7.5 Example Required Project Structure

The page shows an example structure labeled “Required project structure”: [page:1]

```text
├── src/
│   └── your-code-here
├── testsprite_tests/   ← AI-generated test cases go here
├── README.md           ← Required: explain what you built
└── demo.mp4            ← Bonus: include a demo video
```

The intent is to emphasize that `testsprite_tests/`, a clear README, and (optionally) a demo video should live at repo root, while your application code lives under `src/`. [page:1]

---

## 8. Hackathon Guardrails (Participant Prerequisites)

The “Guardrails” section sets explicit expectations: [page:1]

1. **Powered by TestSprite**
   - Participants must **use** TestSprite MCP (not just install it).
   - **Two rounds of testing are mandatory.**

2. **Verified Repos**
   - A `testsprite_tests/` subfolder must exist in your GitHub repository.
   - This folder must contain all generated test cases.

3. **Public Access**
   - The GitHub repository **must be public** so judges can access it.

4. **Clear Description**
   - A short description or **README is strictly mandatory**.
   - The README should explain what you built and why.
   - Goal: judges should understand the project in *about 30 seconds*.

5. **Visual Proof (Optional but Recommended)**
   - Demo videos are optional.
   - Projects with a demo video will rank higher.

6. **New or Existing Project**
   - Participants may bring existing work; starting from zero is not required.

---

## 9. How to Submit & Winner Contact

### 9.1 Submission Channel

Submissions must be made via Discord: [page:1]

- Post the **public GitHub repository link** in the channel  
  `#hackathon-s02-submission` (exact channel string as given on page).
- Only submissions posted there are counted:
  - Submissions via X/Twitter or other channels are **not accepted**.

### 9.2 Deadline

- **Deadline**: April 17, 2026, 11:59 PM PST. [page:1]
- Submissions after the deadline **will not** be reviewed. [page:1]
- Participants are advised to ensure:
  - Repo is public.
  - README is complete.
  - All required artifacts (`testsprite_tests/`) are present **before** submitting.

### 9.3 Winner Contact

- Winners are contacted via **Discord DM**. [page:1]
- Participants are warned:
  - Keep Discord DMs open.
  - Check messages frequently after the deadline.
- If TestSprite cannot reach a winner, the prize can move to the next runner-up. [page:1]

---

## 10. Judging Criteria

The hackathon uses a points-based judging system: [page:1]

- **50 points – Project Quality**
  - Overall craft, polish, completeness.
  - Does the project work well?
  - Is the code clean?

- **30 points – Test Quality**
  - Quality of generated tests.
  - Coverage and meaningful assertions.
  - Degree of improvement between **Round 1** and **Round 2**.

- **20 points – Innovation**
  - Creativity and ambition of the project or approach.
  - Uniqueness, “pushing the boundaries.”

- **10 points (Bonus) – Engagement**
  - Discord activity.
  - Participation in polls.
  - Sharing on X.
  - General active presence during the hackathon.

The criteria make clear that both **project quality** and **test quality** are heavily weighted, and that demonstrating improved testing between rounds is important. [page:1]

---

## 11. Engagement Bonus Breakdown (10 Points)

The “Engagement Scoring” section details how the 10 bonus points are assigned: [page:1]

- **3 points – Discord Polls**
  - Polls are posted during hackathon week.
  - 1 point per poll.
  - Maximum 3 points per participant.

- **5 points – Share on X**
  - Share your “most satisfied test result” on X using TestSprite’s built-in share feature.
  - Then post the tweet link in the **#Hackathon-Season-2** Discord channel.
  - Only one share per person counts.

- **2 points – Discord Activity**
  - For constructive participation:
    - Helping others.
    - Sharing progress.
    - Providing feedback in hackathon channels.

---

## 12. Showcase and Previous Winners

The Season 2 page lists previous hackathon winners and projects as examples, including project descriptions and GitHub links. Examples include: [page:1]

- **Creator Skill Generator**  
  “Turns creator content into reusable AI skills.”  
  Author handle: `@YASH`.

- **Sharetopus**  
  “Post once, share everywhere.”  
  Author handle: `@INTERFERON`.

- **Text2Form AI**  
  “Build beautiful forms and quizzes in seconds using natural language.”  
  Author handle: `@ayush17_08`.

- **MeetOps**  
  A modern workplace operations platform for meeting-room management and scheduling.  
  Author handle: `@JitPlaiez`.

- **war room**  
  Multi-agent AI crisis simulation platform where users act as “Chairman” or “Director” coordinating specialized AI advisors.  
  Author handle: `@Okey`.

Each example includes a GitHub link on the page. [page:1]

---

## 13. Season 2 Timeline

The execution timeline is given as: [page:1]

- **April 11 – Launch Day**
  - Hackathon opens.
  - Join Discord, install MCP, start building.

- **April 11–17 – Build Phase**
  - 7 days of building and testing.
  - Milestone updates shared on X.
  - Community Q&A in Discord.

- **April 17, 11:59 PM PST – Submissions Close**
  - Final deadline.
  - Projects must be submitted in the designated Discord channel.
  - No late entries.

- **April 20–22 – Review Period**
  - Judges review submissions and score against criteria.
  - Round 1 vs Round 2 test results are compared.

- **April 23 – Winners Announced**
  - Winners announced on X and Discord.
  - Winners contacted via Discord DM.
  - Winning projects featured on TestSprite’s LinkedIn and X.

---

## 14. Related Links and Sections on the Hackathon Page

The page also includes navigation and related resource links: [page:1]

- **Top-level**
  - Sign In / Get Started Free.
  - Season 1 view link.
- **Solutions**
  - MCP Server.
  - Backend Testing.
  - Frontend Testing.
  - Data Testing.
  - AI Agent/Model Testing.
- **Resources**
  - Docs.
  - Changelog.
  - Hackathon.
  - Discover (project gallery).
- **Company**
  - About.
  - Blog.
  - Use Cases.
- **Legal**
  - Terms & Conditions.
  - Privacy Policy.

Additionally, it lists past offline/online events (with Luma links) and social links (YouTube, X, Discord, LinkedIn). [page:1]

---

## 15. Pure Key Points (Docs + Hackathon)

- TestSprite MCP is the main interface for generating and running tests via an IDE + AI workflow; GitHub integration only **runs** those tests, not generate them. [page:2][page:3][page:4]
- MCP testing outputs are stored in a `testsprite_tests/` folder, including test scripts and detailed reports, which are expected to be tracked in source control. [page:4]
- The Season 2 hackathon requires: [page:1]
  - Use of TestSprite MCP with **two rounds** of testing.
  - A **public** GitHub repo.
  - A `testsprite_tests/` directory with all generated test cases.
  - A clear **README**.
  - Submission via the specified Discord channel by the deadline.
- Judging heavily weights project quality, test quality (especially improvement from Round 1 to Round 2), innovation, and engagement. [page:1]
