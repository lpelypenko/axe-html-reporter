import { createHtmlReport, missingRequiredParamsError } from '../src';
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
        }).toThrow(missingRequiredParamsError);
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
    it('Verify report is created with violations and passes', async () => {
        const file = 'tcPassesAndViolations.html';
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                passes: axeRawPassed,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            reportFileName: file,
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(file), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });
    it('Verify report is created with violations, passes and incomplete with optional reportFileName and outputDir params', async () => {
        const customReportFileName = 'tcPassesViolationsIncomplete.html';
        const customOutputDir = 'temp';
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                passes: axeRawPassed,
                incomplete: axeRawIncomplete,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            reportFileName: customReportFileName,
            outputDir: customOutputDir,
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(customReportFileName, customOutputDir), {
                encoding: 'utf8',
            })
        ).toMatchSnapshot();
    });
    it('Verify report is created with violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        const customReportFileName = 'tcWithTheKey.html';
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                passes: axeRawPassed,
                incomplete: axeRawIncomplete,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            reportFileName: customReportFileName,
            projectKey: 'DEQUE',
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(customReportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });
    it('Verify report with no violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        const customReportFileName = 'tcAllPassed.html';
        createHtmlReport({
            results: {
                violations: [],
                passes: axeRawPassed,
                incomplete: axeRawIncomplete,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            reportFileName: customReportFileName,
            projectKey: 'DEQUE',
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(customReportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });
    it('Verify report with no violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        const customReportFileName = 'tcInapplicablePresent.html';
        createHtmlReport({
            results: {
                violations: axeRawViolations,
                passes: axeRawPassed,
                incomplete: axeRawIncomplete,
                inapplicable: axeRawInapplicable,
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            reportFileName: customReportFileName,
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(customReportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });
    it('Verify report with no violations, no passes, no incomplete, no inapplicable', async () => {
        const customReportFileName = 'tcOnlyPasses.html';
        createHtmlReport({
            results: {
                violations: [],
                passes: [],
                incomplete: [],
                inapplicable: [],
                url: 'https://dequeuniversity.com/demo/mars/',
            },
            reportFileName: customReportFileName,
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(customReportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });
    it('Verify report is created with violations and custom summary', async () => {
        const customReportFileName = 'tcIncludingCustomSummary.html';
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
            reportFileName: customReportFileName,
            customSummary,
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(customReportFileName), { encoding: 'utf8' })
        ).toMatchSnapshot();
    });

    it('All optional parameters present', async () => {
        const customReportFileName = 'index.html';
        const customOutputDir = 'docs';
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
            projectKey: 'DEQUE',
            customSummary,
            outputDir: customOutputDir,
            reportFileName: customReportFileName,
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(customReportFileName, customOutputDir), {
                encoding: 'utf8',
            })
        ).toMatchSnapshot();
    });
    it('AxeResults passed', async () => {
        const customReportFileName = 'tcAxeResults.html';
        createHtmlReport({
            results: rawAxeResults,
            projectKey: 'DEQUE',
            reportFileName: customReportFileName,
        });
        expect(
            fs.readFileSync(getPathToCreatedReport(customReportFileName), {
                encoding: 'utf8',
            })
        ).toMatchSnapshot();
    });
});
