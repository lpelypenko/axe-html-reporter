# axe-html-reporter

Creates an HTML report from axe results object with list of violations, passes and incomplete results.

Allows specifying `url`, `projectKey` and `outputDir`.

See [sample report output](https://lpelypenko.github.io/axe-html-reporter/)

## Install

```
npm i axe-html-reporter
```

## Usage

### Example usage in TestCafe


To run TestCafe tests with axe-core, install testcafe, axe-core and [@testcafe-community/axe](https://www.npmjs.com/package/@testcafe-community/axe): 

```shell script
npm i -D axe-html-reporter testcafe axe-core @testcafe-community/axe
```

For TestCafe example add the following clientScript in your `.testcaferc.json` config:

```json
{
  "clientScripts":[{"module":"axe-core/axe.min.js"}]
}
```
In the example bellow `fileName` is not passed. In this case html report with default name `accessibilityReport.html` will be created in `artifacts` directory.

See full TestCafe test example is bellow: 

```javascript

import { runAxe } from '@testcafe-community/axe';
import { createHtmlReport } from 'axe-html-reporter';

fixture('TestCafe tests with Axe').page('http://example.com');

test('Automated accessibility testing', async (t) => {
    const axeContext = { exclude: [['select']] };
    const axeOptions = { rules: rulesMap() };
    const { error, results } = await runAxe(axeContext, axeOptions);
    await t.expect(error).eql(null, `axe check failed with an error: ${error.message}`);
    // creates html report with the default file name `accessibilityReport.html`
    createHtmlReport({
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        url: results.url,
        projectKey: 'EXAMPLE',
    });
});

```

Run TestCafe test:

```shell script
npx testcafe
 Running tests in:
 - Chrome 85.0.4183.121 / Linux

 TestCafe tests with Axe
HTML report was saved into the following directory /Users/axe-demos/artifacts/accessibilityReport.html
 ✓ Automated accessibility testing


 1 passed (1s)

```

### Example usage in any JS framework

```javascript

import { axeHtmlReporter } from 'axe-html-reporter';

(() => {
    const results = { violations: [], passes: [], incomplete: [], inapplicable: [], url: 'http://example.com' }; 
    // creates html report with the default name `accessibilityReport.html` file
    axeHtmlReporter({
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        inapplicable: results.inapplicable,
        url: results.url
    });
    // creates html report with the default name `accessibilityReport.html` file and adds url and projectKey
    axeHtmlReporter({
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        projectKey: 'JIRA_PROJECT_KEY',
        url: results.url,
    });
    // creates html report with the name `exampleReport.html` in 'axe-reports' directory and adds url and projectKey to the header
    axeHtmlReporter({
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        projectKey: 'JIRA_PROJECT_KEY',
        outputDir: 'axe-reports',
        url: results.url,
        fileName: 'exampleReport.html',
    });
})();
```

### CommonJS

```javascript
const { axeHtmlReporter } = require('axe-html-reporter');

(() => {
    // creates html report with the name `accessibilityReport.html` file
    axeHtmlReporter({ violations: results.violations });
})();
```
