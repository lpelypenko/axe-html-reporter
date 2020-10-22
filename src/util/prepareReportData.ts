import { AxeReport } from './AxeReport';
import { getWcagReference } from './getWcagReference';
import { PreparedResults } from '../index';
import { Result } from 'axe-core';
import { Summary } from './AxeReport';

function simplifyAxeResultForSummary(results: Result[]): Summary[] {
    return results.map(({ nodes, description, help, id, tags, impact }, resultIndex) => ({
        index: resultIndex + 1,
        description,
        id,
        help,
        wcag: getWcagReference(tags),
        impact: impact || 'n/a',
        nodes: nodes.length,
    }));
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
    const violationsSummary = `axe-core found ${violationsTotal} violation${
        violationsTotal === 1 ? '' : 's'
    }`;
    if (violations.length === 0) {
        return {
            violationsSummary:
                'No violations were found by axe-core with enabled rules and axe check options',
            checksPassed: passedChecks,
            checksIncomplete: incompleteChecks,
            checksInapplicable: inapplicableChecks
        };
    }
    // Prepare data to show summary
    const violationsSummaryTable = simplifyAxeResultForSummary(violations);
    // Prepare data to show detailed list of violations
    const violationsDetails = violations.map(
        ({ nodes, impact, description, help, id, tags, helpUrl }, issueIndex) => {
            return {
                index: issueIndex + 1,
                wcag: getWcagReference(tags),
                id,
                impact: impact || 'n/a',
                description,
                help,
                helpUrl,
                nodes: nodes.map(({ target, html }, nodeIndex) => {
                    const targetNodes = target.map((node) => `"${node}"`).join(', ');
                    return { targetNodes, html, index: nodeIndex + 1 };
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
