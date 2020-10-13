/**
 * Axe returns variety of tags that are not necessary for our purposes.
 * We are interested only in WCAG related tags and Best Practices.
 * Function tries to determine if tag belongs to Best Practice or any WCAG 2.x, otherwise all tags will be returned raw
 * @param tags
 * @returns {string}
 */
export function getWcagReference(tags: string[]): string {
    const tagsNames = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];
    const foundTags = tags.filter((tag) => tagsNames.includes(tag));

    const tagNamesToAccessibilityStandard: Record<string, string> = {
        wcag2a: 'WCAG 2.0 Level A',
        wcag2aa: 'WCAG 2.0 Level AA',
        wcag21a: 'WCAG 2.1 Level A',
        wcag21aa: 'WCAG 2.1 Level AA',
        'best-practice': 'Best practice',
    };

    if (foundTags.length > 0) {
        return foundTags.map((tag) => tagNamesToAccessibilityStandard[tag]).join(',');
    }

    return tags.join(',');
}
