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

describe('createHtmlReport() test', () => {
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

    it('Verify report is created only with violations because passes and incomplete are not passed', async () => {
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
        });
        expect(fs.readFileSync(getPathToCreatedReport(), { encoding: 'utf8' })).toMatchSnapshot();
    });
    const customSummary = `Test Case: Full page analysis
        <br>Steps:</br>
        <ol style="margin: 0">
        <li>Open https://dequeuniversity.com/demo/mars/</li>
        <li>Analyze full page with all rules enabled</li>
        </ol>`;
    it('Verify report is created even if no violations passed', async () => {
        const reportFileName = 'tcAllPassedOnlyViolations.html';
        createHtmlReport({
            results: {
                violations: [],
            },
            options: { customSummary, reportFileName },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });

    it('URL is not passed', async () => {
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
    it('Verify report is created with violations and passes', async () => {
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
    it('Verify report is created with violations, passes and incomplete with optional reportFileName and outputDir params', async () => {
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
    it('Verify report is created with violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        const reportFileName = 'tcWithTheKey.html';
        createHtmlReport({
            results: {
                violations: axeRawViolations,
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
    it('Verify report with no violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        const reportFileName = 'tcAllPassed.html';
        createHtmlReport({
            results: {
                violations: [],
                passes: axeRawPassed,
                incomplete: axeRawIncomplete,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            options: { reportFileName, projectKey: 'DEQUE' },
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(reportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });
    it('Verify report with no violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
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
    it('Verify report with no violations, no passes, no incomplete, no inapplicable', async () => {
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
    it('Verify report is created with violations and custom summary', async () => {
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
    it('All optional parameters present', async () => {
        const reportFileName = 'tsAllOptionalParametersPresent.html';
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
    it('AxeResults passed', async () => {
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
});
