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
    inapplicable?: Result[];
    reportFileName?: string;
    outputDir?: string;
    projectKey?: string;
    customSummary?: string;
}

export interface PreparedResults {
    violations: Result[];
    passes?: Result[];
    incomplete?: Result[];
    inapplicable?: Result[];
}

export function createHtmlReport({
    violations,
    url,
    passes,
    incomplete,
    inapplicable,
    reportFileName,
    outputDir,
    projectKey,
    customSummary,
}: CreateReport): void {
    if (!violations || !url) {
        throw new Error(
            "violations and url parameters are required for HTML accessibility report. Example: createHtmlReport({violations: Result[], url: 'www.example.com'})"
        );
    }
    try {
        const template = loadTemplate();
        const reportData = prepareReportData({ violations, passes, incomplete, inapplicable });
        const htmlContent = mustache.render(template, {
            url,
            violationsSummary: reportData.violationsSummary,
            violations: reportData.violationsSummaryTable,
            violationDetails: reportData.violationsDetails,
            checksPassed: reportData.checksPassed,
            checksIncomplete: reportData.checksIncomplete,
            checksInapplicable: reportData.checksInapplicable,
            hasPassed: passes !== undefined,
            hasIncomplete: incomplete !== undefined,
            hasInapplicable: inapplicable !== undefined,
            incompleteTotal: reportData.checksIncomplete ? reportData.checksIncomplete.length : 0,
            projectKey,
            customSummary,
        });
        saveHtmlReport({ htmlContent, reportFileName, outputDir });
    } catch (e) {
        console.warn(`HTML report was not created due to the error ${e.message}`);
    }
}
