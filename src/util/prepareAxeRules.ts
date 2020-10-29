import { RuleObject } from 'axe-core';

export interface ReformattedRulesObject {
    index: number;
    rule: string;
    enabled: boolean;
}
export function prepareAxeRules(rules: RuleObject): ReformattedRulesObject[] {
    return Object.keys(rules).map((id, index) => {
        return { index: ++ index, rule: id, enabled: rules[id].enabled };
    });
}
