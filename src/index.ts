import mustache from 'mustache';
import { AxeResults, Result } from 'axe-core';
import { loadTemplate } from './util/loadTemplate';
import { prepareReportData } from './util/prepareReportData';
import { prepareAxeRules } from './util/prepareAxeRules';
import { saveHtmlReport } from './util/saveHtmlReport';
import { prepareResources } from './util/prepareResources';
import { scripts, styleSheets } from './resources';

export interface Options {
    reportFileName?: string;
    outputDir?: string;
    projectKey?: string;
    customSummary?: string;
    outputDirPath?: string;
    doNotCreateReportFile?: boolean;
    serveResources?: boolean;
}

export interface CreateReport {
    results: Partial<AxeResults>;
    options?: Options;
}

export interface PreparedResults {
    violations: Result[];
    passes?: Result[];
    incomplete?: Result[];
    inapplicable?: Result[];
}

export async function createHtmlReport({ results, options }: CreateReport): Promise<string> {
    if (!results.violations) {
        return Promise.reject(
            "'violations' is required for HTML accessibility report. Example: createHtmlReport({ results : { violations: Result[] } })"
        );
    }
    try {
        const template = loadTemplate();
        const preparedReportData = prepareReportData({
            violations: results.violations,
            passes: results.passes,
            incomplete: results.incomplete,
            inapplicable: results.inapplicable
        });
        const htmlContent = mustache.render(template, {
            url: results.url,
            violationsSummary: preparedReportData.violationsSummary,
            violations: preparedReportData.violationsSummaryTable,
            violationDetails: preparedReportData.violationsDetails,
            checksPassed: preparedReportData.checksPassed,
            checksIncomplete: preparedReportData.checksIncomplete,
            checksInapplicable: preparedReportData.checksInapplicable,
            hasPassed: Boolean(results.passes),
            hasIncomplete: Boolean(results.incomplete),
            hasInapplicable: Boolean(results.inapplicable),
            incompleteTotal: preparedReportData.checksIncomplete
                ? preparedReportData.checksIncomplete.length
                : 0,
            projectKey: options?.projectKey,
            customSummary: options?.customSummary,
            hasAxeRawResults: Boolean(results?.timestamp),
            rules: prepareAxeRules(results?.toolOptions?.rules || {}),
            scripts: prepareResources(scripts, options?.serveResources),
            styleSheets: prepareResources(styleSheets, options?.serveResources)
        });
        if (!options || options.doNotCreateReportFile === undefined || !options.doNotCreateReportFile) {
            await saveHtmlReport({
                htmlContent,
                reportFileName: options?.reportFileName,
                outputDir: options?.outputDir,
                outputDirPath: options?.outputDirPath,
                serveResources: options?.serveResources
            });
        }

        return htmlContent;
    } catch (e) {
        // @ts-ignore
        console.warn(`HTML report was not created due to the error ${e.message}`);

        // @ts-ignore
        return `Failed to create HTML report due to an error ${e.message}`;
    }
}
