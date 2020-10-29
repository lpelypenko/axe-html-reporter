import mustache from 'mustache';
import { AxeResults, Result } from 'axe-core';
import { loadTemplate } from './util/loadTemplate';
import { prepareReportData } from './util/prepareReportData';
import { saveHtmlReport } from './util/saveHtmlReport';

export interface ResultsMinimal {
    violations: Result[];
    url?: string;
    passes?: Result[];
    incomplete?: Result[];
    inapplicable?: Result[];
}

export interface Options {
    reportFileName?: string;
    outputDir?: string;
    projectKey?: string;
    customSummary?: string;
}

export interface CreateReport {
    results: AxeResults | ResultsMinimal; // user can decide to pass only 'violations' or full AxeResults object
    options?: Options;
}

export interface PreparedResults {
    violations: Result[];
    passes?: Result[];
    incomplete?: Result[];
    inapplicable?: Result[];
}

export const missingRequiredParamsError =
    "'violations' is required for HTML accessibility report. Example: createHtmlReport({ results : { violations: Result[] } })";

export function createHtmlReport({ results, options }: CreateReport): void {
    if (!results.violations) {
        throw new Error(missingRequiredParamsError);
    }
    try {
        const template = loadTemplate();
        const preparedReportData = prepareReportData({
            violations: results.violations,
            passes: results.passes,
            incomplete: results.incomplete,
            inapplicable: results.inapplicable,
        });
        const htmlContent = mustache.render(template, {
            url: results.url || undefined,
            violationsSummary: preparedReportData.violationsSummary,
            violations: preparedReportData.violationsSummaryTable,
            violationDetails: preparedReportData.violationsDetails,
            checksPassed: preparedReportData.checksPassed,
            checksIncomplete: preparedReportData.checksIncomplete,
            checksInapplicable: preparedReportData.checksInapplicable,
            hasPassed: results.passes !== undefined,
            hasIncomplete: results.incomplete !== undefined,
            hasInapplicable: results.inapplicable !== undefined,
            incompleteTotal: preparedReportData.checksIncomplete
                ? preparedReportData.checksIncomplete.length
                : 0,
            projectKey: options?.projectKey,
            customSummary: options?.customSummary,
        });
        saveHtmlReport({
            htmlContent,
            reportFileName: options?.reportFileName,
            outputDir: options?.outputDir,
        });
    } catch (e) {
        console.warn(`HTML report was not created due to the error ${e.message}`);
    }
}
