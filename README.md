# DemoQA Automation Portfolio

Professional UI automation suite built with Playwright, TypeScript, and strict Page Object Model architecture.

Target application:
https://demoqa.com

## Tech Stack

- Playwright
- TypeScript
- Page Object Model (POM)

## Project Structure

```text
.
|-- fixtures/
|   `-- testData.json
|-- pages/
|   |-- base.page.ts
|   |-- forms.page.ts
|   |-- webTables.page.ts
|   `-- widgets.page.ts
|-- tests/
|   |-- forms.spec.ts
|   |-- webTables.spec.ts
|   `-- widgets.spec.ts
|-- utils/
|   `-- helpers.ts
|-- playwright.config.ts
|-- package.json
`-- tsconfig.json
```

## Architecture Rules

- Page objects contain locators and actions only.
- Assertions live only in test files.
- Tests do not use raw selectors.
- Test data is managed via JSON fixtures.
- No hard waits are used.

## Covered Flows

1. Web Tables
- Edit an existing record.
- Submit the form.
- Validate row data reflects the update.

2. Student Registration Form
- Submit multiple datasets from fixture data.
- Validate confirmation modal values.

3. Select Menu Widget
- Select from standard dropdown.
- Select from custom react-select dropdown.
- Select multiple values and validate selection state.

## Run Locally

```bash
npm install
npx playwright test
```

Container/headless-host headed run (no native display server):

```bash
npm run test:headed
```

Notes:
- Browser binaries are installed automatically during npm install through the postinstall script.
- On Linux containers/VMs, `npm run install:deps` may require `sudo` (it installs system packages Playwright needs, e.g. GTK/ATK libs).
- `npm run test:headed` uses xvfb-run so headed tests can run in environments without $DISPLAY.
- HTML report is generated in playwright-report.