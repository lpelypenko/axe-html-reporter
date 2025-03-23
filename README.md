# axe-html-reporter

Creates an HTML report from Axe-core® library AxeResults object listing violations, passes, incomplete and incompatible results.

Allows specifying report creation options: `reportFileName`, `outputDir`, `outputDirPath`, `projectKey` and `customSummary`.

Notes: 

- `customSummary` allows having html parameters
- `outputDirPath` allows specifying absolute path

Please check [sample report output.](https://lpelypenko.github.io/axe-html-reporter/)

`createHtmlReport` returns HTML content that can be additionally used for specific integrations.

If only HTML content needed, user can pass `doNotCreateReportFile: true` to stop report file creation.

Suggestion on how to use this library if you don't need a report file but need only HTML it produces: 

```javascript
const reportHTML = await createHtmlReport({
    results: rawAxeResults,
    options: {
        projectKey: 'I need only raw HTML',
        doNotCreateReportFile: true,
    },
});
console.log('reportHTML will have full content of HTML file.');
// suggestion on how to create file by yourself
if (!fs.existsSync('build/reports/saveReportHere.html')) {
    fs.mkdirSync('build/reports', {
        recursive: true,
    });
}
fs.writeFileSync('build/reports/saveReportHere.html', reportHTML);
```

If you want to serve the external HTML resources (i.e. css, JS) yourself, you can:

```javascript
await createHtmlReport({ results: 'AxeCoreResults', options: { serveResources: true } }); 
```

The `serveResources` option will download the required assets if they do not already exist in the output directory, in addition to ensuring the report points to the local version of these resources.

## Install

```
npm i -D axe-html-reporter
```

## Usage

### Example usage in TestCafe

To run TestCafe tests with Axe-core®, install [testcafe](https://www.npmjs.com/package/testcafe), [axe-core](https://www.npmjs.com/package/axe-core) and [@testcafe-community/axe](https://www.npmjs.com/package/@testcafe-community/axe):

```shell script
npm i -D axe-html-reporter testcafe axe-core @testcafe-community/axe
```

For TestCafe example add the following clientScript in your `.testcaferc.json` config:

```json
{
    "clientScripts": [{ "module": "axe-core/axe.min.js" }]
}
```

In the example bellow `fileName` is not passed. If `fileName` is not passed, HTML report will be created with default name `accessibilityReport.html` in `artifacts` directory.

See full TestCafe test example is bellow:

```javascript
import { runAxe } from '@testcafe-community/axe';
import { createHtmlReport } from 'axe-html-reporter';

fixture('TestCafe tests with Axe-core®').page('http://example.com');

test('Automated accessibility testing', async (t) => {
    const axeContext = { exclude: [['select']] };
    const axeOptions = {
        rules: {
            'object-alt': { enabled: true },
            'role-img-alt': { enabled: true },
            'input-image-alt': { enabled: true },
            'image-alt': { enabled: true },
        },
    };
    const { error, results } = await runAxe(axeContext, axeOptions);
    await t.expect(error).notOk(`axe check failed with an error: ${error.message}`);
    // creates html report with the default file name `accessibilityReport.html`
    createHtmlReport({
        results,
        options: {
            projectKey: 'EXAMPLE',
        },
    });
});
```

Run TestCafe test:

```shell script
npx testcafe
 Running tests in:
 - Chrome 85.0.4183.121 / Linux

 TestCafe tests with Axe-core®
HTML report was saved into the following directory /Users/axe-demos/artifacts/accessibilityReport.html
 ✓ Automated accessibility testing


 1 passed (1s)

```

### Example usage in any JS framework

```javascript
import { createHtmlReport } from 'axe-html-reporter';

(() => {
    // creates html report with the default name `accessibilityReport.html` file
    createHtmlReport({ results: 'AxeCoreResults' }); // full AxeResults object
    // creates html report with the default name `accessibilityReport.html` file and all supported AxeResults values
    createHtmlReport({ results: { violations: 'Result[]' } }); // passing only violations from axe.run output
    // creates html report with the default name `accessibilityReport.html` file and adds url and projectKey
    createHtmlReport({
        results: 'AxeCoreResults',
        options: { projectKey: 'JIRA_PROJECT_KEY' },
    });
    // creates html report with the name `exampleReport.html` in 'axe-reports' directory and adds projectKey to the header
    createHtmlReport({
        results: 'AxeCoreResults',
        options: {
            projectKey: 'JIRA_PROJECT_KEY',
            outputDir: 'axe-core-reports',
            reportFileName: 'exampleReport.html',
        },
    });
    // creates html report with all optional parameters, saving the report into 'docs' directory with report file name 'index.html'
    const customSummary = `Test Case: Full page analysis
    <br>Steps:</br>
    <ol style="margin: 0">
    <li>Open https://dequeuniversity.com/demo/mars/</li>
    <li>Analyze full page with all rules enabled</li>
    </ol>`;
    createHtmlReport({
        results: 'AxeResults',
        options: {
            projectKey: 'DEQUE',
            customSummary,
            outputDir: 'docs',
            reportFileName: 'index.html',
        },
    });
})();
```

### CommonJS

```javascript
const { createHtmlReport } = require('axe-html-reporter');

(() => {
    // creates html report with the name `accessibilityReport.html` file
    createHtmlReport({ results: { violations: 'Result[]' } });
})();
```
