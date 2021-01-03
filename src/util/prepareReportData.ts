import { AxeReport, FixSummary, Summary } from './AxeReport';
import { getWcagReference } from './getWcagReference';
import { PreparedResults } from '../index';
import { Result } from 'axe-core';

function simplifyAxeResultForSummary(results: Result[]): Summary[] {
    return results.map(({ nodes, description, help, id, tags, impact }, resultIndex) => ({
        index: resultIndex + 1,
        description,
        id,
        help,
        wcag: getWcagReference(tags),
        tags,
        impact: impact || 'n/a',
        nodes: nodes.length,
    }));
}

function prepareFixSummary(failureSummary: string, defaultHighlight: FixSummary): FixSummary[] {
    const failureSummariesSplit = failureSummary.split('\n\n');
    return failureSummariesSplit.map((summary) => {
        const fixSummarySplit = summary.split('\n');
        if (fixSummarySplit.length == 0) {
            return defaultHighlight;
        } else {
            return {
                highlight: fixSummarySplit.shift() || '',
                list: fixSummarySplit,
            };
        }
    });
}
/**
 * Prepare report splitting it into sections:
 * - total accessibility violations (counting nodes)
 * - summary of violations that could be printed as table
 * - detailed list of violations that could be printed as formatted text
 */
export function prepareReportData({
    violations,
    passes,
    incomplete,
    inapplicable,
}: PreparedResults): AxeReport {
    const passedChecks = passes ? simplifyAxeResultForSummary(passes) : undefined;
    const incompleteChecks = incomplete ? simplifyAxeResultForSummary(incomplete) : undefined;
    const inapplicableChecks = inapplicable ? simplifyAxeResultForSummary(inapplicable) : undefined;
    const violationsTotal = violations.reduce((acc, { nodes }) => {
        acc += nodes.length;
        return acc;
    }, 0);
    if (violations.length === 0) {
        return {
            violationsSummary:
                'axe-core found <span class="badge badge-success">0</span> violations',
            checksPassed: passedChecks,
            checksIncomplete: incompleteChecks,
            checksInapplicable: inapplicableChecks,
        };
    }
    const violationsSummary = `axe-core found <span class="badge badge-warning">${violationsTotal}</span> violation${
        violationsTotal === 1 ? '' : 's'
    }`;
    // Prepare data to show summary
    const violationsSummaryTable = simplifyAxeResultForSummary(violations);
    // Prepare data to show detailed list of violations
    const violationsDetails = violations.map(
        ({ nodes, impact, description, help, id, tags, helpUrl }, issueIndex) => {
            return {
                index: issueIndex + 1,
                wcag: getWcagReference(tags),
                tags,
                id,
                impact: impact || 'n/a',
                description,
                help,
                helpUrl,
                nodes: nodes.map(({ target, html, failureSummary, any }, nodeIndex) => {
                    const targetNodes = target.join('\n');
                    const defaultHighlight = {
                        highlight: 'Recommendation with the fix was not provided by axe result',
                    };
                    const fixSummaries: FixSummary[] = failureSummary
                        ? prepareFixSummary(failureSummary, defaultHighlight)
                        : [defaultHighlight];
                    const relatedNodesAny: string[] = [];
                    any.forEach((checkResult) => {
                        if (checkResult.relatedNodes && checkResult.relatedNodes.length > 0) {
                            checkResult.relatedNodes.forEach((node) => {
                                if (node.target.length > 0) {
                                    relatedNodesAny.push(node.target.join('\n'));
                                }
                            });
                        }
                    });

                    return {
                        targetNodes,
                        html,
                        fixSummaries,
                        relatedNodesAny,
                        index: nodeIndex + 1,
                    };
                }),
            };
        }
    );

    return {
        violationsSummary,
        violationsSummaryTable,
        violationsDetails,
        checksPassed: passedChecks,
        checksIncomplete: incompleteChecks,
        checksInapplicable: inapplicableChecks,
    };
}
