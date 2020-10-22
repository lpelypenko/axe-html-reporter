import { createHtmlReport } from '../src';
import fs from 'fs';
import path from 'path';
const axeRawViolations = require('./rawViolations.json');
const axeRawPassed = require('./rawPasses.json');
const axeRawIncomplete = require('./rawIncomplete.json');
const axeRawInapplicable = require('./rawInapplicable.json');

describe('createHtmlReport() test', () => {
    it('Verify throwing an error if required parameters are not passed', async () => {
        expect(() => {
            //@ts-ignore
            createHtmlReport({ passes: [] });
        }).toThrow(
            "violations and url parameters are required for HTML accessibility report. Example: createHtmlReport({violations: Result[], url: 'www.example.com'})"
        );
    });
    it('Verify report is created only with violations because passes and incomplete are not passed', async () => {
        createHtmlReport({
            violations: axeRawViolations,
            url: 'https://dequeuniversity.com/demo/mars/',
        });
        const pathToTheReport = path.resolve(
            process.cwd(),
            'artifacts',
            'accessibilityReport.html'
        );
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report is created with violations and passes', async () => {
        createHtmlReport({
            violations: axeRawViolations,
            passes: axeRawPassed,
            reportFileName: 'tcPassesAndViolations.html',
            url: 'https://dequeuniversity.com/demo/mars/',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'artifacts', 'tcPassesAndViolations.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report is created with violations, passes and incomplete with optional reportFileName and outputDir params', async () => {
        createHtmlReport({
            violations: axeRawViolations,
            passes: axeRawPassed,
            incomplete: axeRawIncomplete,
            reportFileName: 'tcPassesViolationsIncomplete.html',
            outputDir: 'temp',
            url: 'https://dequeuniversity.com/demo/mars/',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'temp', 'tcPassesViolationsIncomplete.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report is created with violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        createHtmlReport({
            violations: axeRawViolations,
            passes: axeRawPassed,
            incomplete: axeRawIncomplete,
            reportFileName: 'tcWithTheKey.html',
            projectKey: 'DEQUE',
            url: 'https://dequeuniversity.com/demo/mars/',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'artifacts', 'tcWithTheKey.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report with no violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        createHtmlReport({
            violations: [],
            passes: axeRawPassed,
            incomplete: axeRawIncomplete,
            reportFileName: 'tcAllPassed.html',
            projectKey: 'DEQUE',
            url: 'https://dequeuniversity.com/demo/mars/',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'artifacts', 'tcAllPassed.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report with no violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        createHtmlReport({
            violations: axeRawViolations,
            passes: axeRawPassed,
            incomplete: axeRawIncomplete,
            inapplicable: axeRawInapplicable,
            reportFileName: 'tcInapplicablePresent.html',
            url: 'https://dequeuniversity.com/demo/mars/',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'artifacts', 'tcAllPassed.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report with no violations, no passes, no incomplete, no inapplicable', async () => {
        createHtmlReport({
            violations: [],
            passes: [],
            incomplete: [],
            inapplicable: [],
            reportFileName: 'tcOnlyPasses.html',
            url: 'https://dequeuniversity.com/demo/mars/',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'artifacts', 'tcOnlyPasses.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report is created with violations and custom summary', async () => {
        const customSummary = `Test Case: Full page analysis
        <br>Steps:</br>
        <ol style="margin: 0">
        <li>Open https://dequeuniversity.com/demo/mars/</li>
        <li>Analyze full page with all rules enabled</li>
        </ol>`;
        createHtmlReport({
            violations: axeRawViolations,
            url: 'https://dequeuniversity.com/demo/mars/',
            customSummary,
            reportFileName: 'tcIncludingCustomSummary.html'
        });
        const pathToTheReport = path.resolve(
            process.cwd(),
            'artifacts',
            'tcIncludingCustomSummary.html'
        );
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });

    it('All optional parameters present', async () => {
        const customSummary = `Test Case: Full page analysis
        <br>Steps:</br>
        <ol style="margin: 0">
        <li>Open https://dequeuniversity.com/demo/mars/</li>
        <li>Analyze full page with all rules enabled</li>
        </ol>`;
        createHtmlReport({
            violations: axeRawViolations,
            passes: axeRawPassed,
            incomplete: [],
            inapplicable: axeRawInapplicable,
            projectKey: 'DEQUE',
            url: 'https://dequeuniversity.com/demo/mars/',
            customSummary,
            outputDir: 'docs',
            reportFileName: 'index.html'
        });
        const pathToTheReport = path.resolve(
            process.cwd(),
            'artifacts',
            'tcIncludingCustomSummary.html'
        );
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
});
