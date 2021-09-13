import { createHtmlReport } from '../src';
import { defaultReportFileName } from '../src/util/saveHtmlReport';
import fs from 'fs';
import path from 'path';
const axeRawViolations = require('./rawViolations.json');
const axeRawPassed = require('./rawPasses.json');
const axeRawIncomplete = require('./rawIncomplete.json');
const axeRawInapplicable = require('./rawInapplicable.json');
const rawAxeResults = require('./rawAxeResults.json');

function getPathToCreatedReport(customFileName?: string, customOutputDir?: string) {
    return path.resolve(
        process.cwd(),
        customOutputDir ? customOutputDir : 'artifacts',
        customFileName ? customFileName : defaultReportFileName
    );
}

describe('Error handling', () => {
    it('Verify throwing an error if required parameters are not passed', async () => {
        expect(() => {
            createHtmlReport({
                // @ts-ignore
                results: {
                    passes: [],
                },
            });
        }).toThrow(
            "'violations' is required for HTML accessibility report. Example: createHtmlReport({ results : { violations: Result[] } })"
        );
    });
});

describe('Successful tests', () => {
    // Verifies report with empty violations
    it('Empty violations', async () => {
        const reportFileName = 'tcAllPassedOnlyViolations.html';
        createHtmlReport({
            results: {
                violations: [],
            },
            options: {
                reportFileName,
            },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), {
                encoding: 'utf8',
            })
        ).toMatchSnapshot();
    });

    // Verifies report is created with default name in default directory with violations(passes and incomplete are not provided).
    // Creates html report file with name 'accessibilityReport.html' in default directory 'artifacts'
    it('Violations and URL with default report file name', async () => {
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
        });
        expect(fs.readFileSync(getPathToCreatedReport(), { encoding: 'utf8' })).toMatchSnapshot();
    });

    // Verifies report with if violations are not empty
    it('Violations', async () => {
        const reportFileName = 'urlIsNotPassed.html';
        createHtmlReport({
            results: {
                violations: axeRawViolations,
            },
            options: { reportFileName },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });

    // Verifies report is created with violations and passes
    it('Violations, passes and url', async () => {
        const reportFileName = 'tcPassesAndViolations.html';
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                passes: axeRawPassed,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            options: { reportFileName },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });

    // Verifies report is created with violations, passes and incomplete with optional reportFileName and outputDir params
    it('Violations, passes, incomplete, url with reportFileName & outputDir', async () => {
        const reportFileName = 'tcPassesViolationsIncomplete.html';
        const outputDir = 'temp';
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                passes: axeRawPassed,
                incomplete: axeRawIncomplete,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            options: {
                reportFileName,
                outputDir,
            },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName, outputDir), {
                encoding: 'utf8',
            })
        ).toMatchSnapshot();
    });

    // Verifies report is created with violations, passes, incomplete url with optional
    // reportFileName and projectKey
    it('No violations found, passes, incomplete, url + reportFileName & projectKey', async () => {
        const reportFileName = 'tcWithTheKey.html';
        createHtmlReport({
            results: {
                violations: [],
                passes: axeRawPassed,
                incomplete: axeRawIncomplete,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            options: {
                reportFileName,
                projectKey: 'DEQUE',
            },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });

    // Verifies report with inapplicable present in 'results'
    it('Inapplicable present', async () => {
        const reportFileName = 'tcInapplicablePresent.html';
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                passes: axeRawPassed,
                incomplete: axeRawIncomplete,
                inapplicable: axeRawInapplicable,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            options: { reportFileName },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });

    // Verifies report with empty violations, empty passes, empty incomplete, empty inapplicable
    it('Empty all: violation, passes, incomplete, inapplicable', async () => {
        const reportFileName = 'tcOnlyPasses.html';
        createHtmlReport({
            results: {
                violations: [],
                passes: [],
                incomplete: [],
                inapplicable: [],
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            options: { reportFileName },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });

    // Verify report is created with violations and custom summary
    it('Custom Summary present', async () => {
        const reportFileName = 'tcIncludingCustomSummary.html';
        const customSummary = `Test Case: Full page analysis
        <br>Steps:</br>
        <ol style="margin: 0">
        <li>Open https://dequeuniversity.com/demo/mars/</li>
        <li>Analyze full page with all rules enabled</li>
        </ol>`;
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            options: { reportFileName, customSummary },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });

    // Verifies report with all optional parameters
    it('All optional parameters present', async () => {
        const reportFileName = 'tsAllOptionalParametersPresent.html';
        const customSummary = `Test Case: Full page analysis
        <br>Steps:</br>
        <ol style="margin: 0">
        <li>Open https://dequeuniversity.com/demo/mars/</li>
        <li>Analyze full page with all rules enabled</li>
        </ol>`;

        createHtmlReport({
            results: {
                violations: axeRawViolations,
                passes: axeRawPassed,
                incomplete: [],
                inapplicable: axeRawInapplicable,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            options: { projectKey: 'DEQUE', customSummary, reportFileName },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), {
                encoding: 'utf8',
            })
        ).toMatchSnapshot();
    });

    it('Raw AxeResults passed and all optional params', async () => {
        const customSummary = `Test Case: Full page analysis
        <br>Steps:</br>
        <ol style="margin: 0">
        <li>Open https://dequeuniversity.com/demo/mars/</li>
        <li>Analyze full page with all rules enabled</li>
        </ol>`;

        const reportFileName = 'index.html';
        const outputDir = 'docs';
        createHtmlReport({
            results: rawAxeResults,
            options: { projectKey: 'DEQUE', customSummary, outputDir, reportFileName },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName, outputDir), {
                encoding: 'utf8',
            })
        ).toMatchSnapshot();
    });
    it('File will not be created and raw HTML result will be returned', async () => {
        const customSummary = `Test Case: Full page analysis
        <br>Steps:</br>
        <ol style="margin: 0">
        <li>Open https://dequeuniversity.com/demo/mars/</li>
        <li>Analyze full page with all rules enabled</li>
        </ol>`;

        const reportHTML = createHtmlReport({
            results: rawAxeResults,
            options: {
                projectKey: 'I need only raw HTML',
                customSummary,
                doNotCreateReportFile: true,
                reportFileName: 'shouldNotBeSaved.html',
            },
        });
        expect(reportHTML).toMatchSnapshot();
        const isReportFileExist = fs.existsSync(getPathToCreatedReport('shouldNotBeSaved.html'));
        expect(isReportFileExist).toBe(false);
    });
});
