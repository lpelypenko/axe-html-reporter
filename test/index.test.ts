import { createHtmlReport } from '../src';
import fs from 'fs';
import path from 'path';
const axeRawViolations = require('./rawViolations.json');
const axeRawPassed = require('./rawPasses.json');
const axeRawIncomplete = require('./rawIncomplete.json');

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
            url: 'https://lumos.sandbox.stage.indeed.net/analytics/reporting/ads',
        });
        const pathToTheReport = path.resolve(
            process.cwd(),
            'artifacts',
            'accessibilityReport.html'
        );
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // clean up
        try {
            fs.unlinkSync(pathToTheReport);
        } catch (e) {
            // do nothing if file can't be deleted
        }
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report is created with violations and passes', async () => {
        createHtmlReport({
            violations: axeRawViolations,
            passes: axeRawPassed,
            reportFileName: 'tc2.html',
            url: 'https://lumos.sandbox.stage.indeed.net/analytics/reporting/ads',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'artifacts', 'tc2.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // clean up
        try {
            fs.unlinkSync(pathToTheReport);
        } catch (e) {
            // do nothing if file can't be deleted
        }
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report is created with violations, passes and incomplete with optional reportFileName and outputDir params', async () => {
        createHtmlReport({
            violations: axeRawViolations,
            passes: axeRawPassed,
            incomplete: axeRawIncomplete,
            reportFileName: 'tc3.html',
            outputDir: 'temp',
            url: 'https://lumos.sandbox.stage.indeed.net/analytics/reporting/ads',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'temp', 'tc3.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // clean up
        try {
            fs.unlinkSync(pathToTheReport);
        } catch (e) {
            // do nothing if file can't be deleted
        }
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report is created with violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        createHtmlReport({
            violations: axeRawViolations,
            passes: axeRawPassed,
            incomplete: axeRawIncomplete,
            reportFileName: 'tcWithTheKey.html',
            projectKey: 'EAXR',
            url: 'https://lumos.sandbox.stage.indeed.net/analytics/reporting/ads',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'artifacts', 'tcWithTheKey.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
    it('Verify report wiht no violations, passes and incomplete with optional reportFileName, url and project key params', async () => {
        createHtmlReport({
            violations: [],
            passes: axeRawPassed,
            incomplete: axeRawIncomplete,
            reportFileName: 'tcAllPassed.html',
            projectKey: 'EAXR',
            url: 'https://lumos.sandbox.stage.indeed.net/analytics/reporting/ads',
        });
        const pathToTheReport = path.resolve(process.cwd(), 'artifacts', 'tcAllPassed.html');
        const htmlFileContent = fs.readFileSync(pathToTheReport, {
            encoding: 'utf8',
        });
        // do not clean up to verify results manually
        // validate
        expect(htmlFileContent).toMatchSnapshot();
    });
});
