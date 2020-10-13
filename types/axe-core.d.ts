// Type definitions for axe-core
// Project: https://github.com/dequelabs/axe-core
// Definitions by: Marcy Sutton <https://github.com/marcysutton>
/// <reference types="node" />

declare module 'axe-core' {
    type ImpactValue = 'minor' | 'moderate' | 'serious' | 'critical' | null;

    type TagValue = string;

    type ReporterVersion = 'v1' | 'v2' | 'raw' | 'raw-env' | 'no-passes';

    type RunOnlyType = 'rule' | 'rules' | 'tag' | 'tags';

    type resultGroups = 'inapplicable' | 'passes' | 'incomplete' | 'violations';

    type ContextObject = {
        include?: string[] | string[][];
        exclude?: string[] | string[][];
    };

    type RunCallback = (error: Error, results: AxeResults) => void;

    type ElementContext = Node | string | ContextObject;

    interface TestEngine {
        name: string;
        version: string;
    }

    interface TestRunner {
        name: string;
    }

    interface TestEnvironment {
        userAgent: string;
        windowWidth: number;
        windowHeight: number;
        orientationAngle?: number;
        orientationType?: string;
    }

    interface RunOnly {
        type: RunOnlyType;
        values: TagValue[] | string[];
    }

    interface RuleObject {
        [key: string]: {
            enabled: boolean;
        };
    }

    interface RunOptions {
        runOnly?: RunOnly | TagValue[] | string[];
        rules?: RuleObject;
        reporter?: ReporterVersion;
        resultTypes?: resultGroups[];
        selectors?: boolean;
        ancestry?: boolean;
        xpath?: boolean;
        absolutePaths?: boolean;
        iframes?: boolean;
        elementRef?: boolean;
        frameWaitTime?: number;
        preload?: boolean;
        performanceTimer?: boolean;
    }

    interface AxeResults {
        toolOptions: RunOptions;
        testEngine: TestEngine;
        testRunner: TestRunner;
        testEnvironment: TestEnvironment;
        url: string;
        timestamp: string;
        passes: Result[];
        violations: Result[];
        incomplete: Result[];
        inapplicable: Result[];
    }

    interface Result {
        description: string;
        help: string;
        helpUrl: string;
        id: string;
        impact?: ImpactValue;
        tags: TagValue[];
        nodes: NodeResult[];
    }

    interface NodeResult {
        html: string;
        impact?: ImpactValue;
        target: string[];
        xpath?: string[];
        ancestry?: string[];
        any: CheckResult[];
        all: CheckResult[];
        none: CheckResult[];
        failureSummary?: string;
        element?: HTMLElement;
    }

    interface CheckResult {
        id: string;
        impact: string;
        message: string;
        data: any;
        relatedNodes?: RelatedNode[];
    }

    interface RelatedNode {
        target: string[];
        html: string;
    }

    /**
     * Object for axe Results
     */
    var AxeResults: AxeResults;

    /**
     * Runs a number of rules against the provided HTML page and returns the resulting issue list
     *
     * @param   {ElementContext} context  Optional The `Context` specification object @see Context
     * @param   {RunOptions}     options  Optional Options passed into rules or checks, temporarily modifying them.
     * @param   {RunCallback}    callback Optional The function to invoke when analysis is complete.
     * @returns {Promise<AxeResults>|void} If the callback was not defined, axe will return a Promise.
     */
    function run(context?: ElementContext): Promise<AxeResults>;
    function run(options: RunOptions): Promise<AxeResults>;
    function run(callback: (error: Error, results: AxeResults) => void): void;
    function run(context: ElementContext, callback: RunCallback): void;
    function run(options: RunOptions, callback: RunCallback): void;
    function run(context: ElementContext, options: RunOptions): Promise<AxeResults>;
    function run(context: ElementContext, options: RunOptions, callback: RunCallback): void;
}
