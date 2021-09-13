import mustache from 'mustache';
import { AxeResults, Result } from 'axe-core';
import { loadTemplate } from './util/loadTemplate';
import { prepareReportData } from './util/prepareReportData';
import { prepareAxeRules } from './util/prepareAxeRules';
import { saveHtmlReport } from './util/saveHtmlReport';

export interface Options {
    reportFileName?: string;
    outputDir?: string;
    projectKey?: string;
    customSummary?: string;
    outputDirPath?: string;
    doNotCreateReportFile?: boolean;
    /**
     * A function to generate screenshot based on the selector
     * @param selector
     *  DOM selector
     * @return
     *  the generated screenshot image encoded in base64.
     */
    screenshotFunction?: (selector: string) => Promise<string>;
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
        throw new Error(
            "'violations' is required for HTML accessibility report. Example: createHtmlReport({ results : { violations: Result[] } })"
        );
    }
    try {
        const template = loadTemplate();
        const preparedReportData = prepareReportData({
            violations: results.violations,
            passes: results.passes,
            incomplete: results.incomplete,
            inapplicable: results.inapplicable,
        });
        if (options?.screenshotFunction && preparedReportData.violationsDetails) {
            for (let details of preparedReportData.violationsDetails) {
                for (let node of details.nodes) {
                    if (options.screenshotFunction) {
                        node.screenshot = await options.screenshotFunction(node.targetNodes);
                    }
                }
            }
        }
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
        });
        if (options?.doNotCreateReportFile === true) {
            console.info('Report file will not be created because user passed options.doNotCreateReportFile = true. Use HTML output of the function to create report file');
        } else {
            saveHtmlReport({
                htmlContent,
                reportFileName: options?.reportFileName,
                outputDir: options?.outputDir,
                outputDirPath: options?.outputDirPath
            });
        }

        return htmlContent;
    } catch (e) {
        console.warn(`HTML report was not created due to the error ${e.message}`);

        return `Failed to create HTML report due to an error ${e.message}`;
    }
}
