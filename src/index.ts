import mustache from 'mustache';
import { Result } from 'axe-core';
import { loadTemplate } from './util/loadTemplate';
import { prepareReportData } from './util/prepareReportData';
import { saveHtmlReport } from './util/saveHtmlReport';

export interface CreateReport {
    violations: Result[];
    url: string;
    passes?: Result[];
    incomplete?: Result[];
    reportFileName?: string;
    outputDir?: string;
    projectKey?: string;
}

export function createHtmlReport({
    violations,
    url,
    passes,
    incomplete,
    reportFileName,
    outputDir,
    projectKey,
}: CreateReport): void {
    if (!violations || !url) {
        throw new Error(
            "violations and url parameters are required for HTML accessibility report. Example: createHtmlReport({violations: Result[], url: 'www.example.com'})"
        );
    }
    try {
        const template = loadTemplate();
        const reportData = prepareReportData({ violations, passes, incomplete, url });
        const htmlContent = mustache.render(template, {
            url,
            totalWrapped: `Axe core library found ${reportData.violationsTotal} violation${
                reportData.violationsTotal === 1 ? '' : 's'
            }`,
            isViolationPresent: reportData.violationsTotal !== 0,
            violations: reportData.violationsSummaryTable,
            violationDetails: reportData.violationsDetails,
            isPassedPresent: !!passes,
            checksPassed: reportData.checksPassed,
            passedTotal: reportData.checksPassed ? reportData.checksPassed.length : 0,
            isIncompletePresent: !!incomplete,
            checksIncomplete: reportData.checksIncomplete,
            incompleteTotal: reportData.checksIncomplete ? reportData.checksIncomplete.length : 0,
            projectKey,
        });
        saveHtmlReport({ htmlContent, reportFileName, outputDir });
    } catch (e) {
        console.warn(`HTML report was not created due to the error ${e.message}`);
    }
}
