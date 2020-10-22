export interface Summary {
    description: string;
    id: string;
    wcag: string;
    help: string;
    impact: string;
    nodes: number;
}

interface NodeResult {
    html: string;
    targetNodes: string;
    index: number;
}

interface Details {
    wcag: string;
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    nodes: NodeResult[];
}

export interface AxeReport {
    violationsSummary: string;
    violationsSummaryTable?: Summary[];
    violationsDetails?: Details[];
    checksPassed?: Summary[];
    checksIncomplete?: Summary[];
    checksInapplicable?: Summary[];
}
