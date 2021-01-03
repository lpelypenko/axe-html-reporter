/**
 * Axe returns variety of tags that are not necessary for our purposes.
 * We are interested only in WCAG related tags and Best Practices.
 * Function tries to determine if tag belongs to Best Practice or any WCAG 2.x, otherwise all tags will be returned raw
 * @param tags
 * @returns {string}
 */
export function getWcagReference(tags: string[]): string {
    // case 1: tags includes best-practice
    if (tags.includes('best-practice')) {
        return 'Best practice';
    }
    // case 2: tags does not include best-practice and include one or more wcag tags
    const foundWcagTags = tags.filter((tag) => tag.includes('wcag'));
    if (foundWcagTags.length > 0) {
        return foundWcagTags
            .map((tag) => {
                const sectionNumberMatch = tag.match(/\d+/);
                const levelMatch = tag.match(/wcag\d+(a+)/);
                const sectionNumber =
                    sectionNumberMatch && sectionNumberMatch.length >= 1
                        ? sectionNumberMatch[0].split('').join('.')
                        : ''; // wcag section number, e.g 2 in 'wcag2aa' or 411 in 'wcag411' tag
                const level =
                    levelMatch && levelMatch.length > 1
                        ? ` Level ${levelMatch[1].toUpperCase()}`
                        : ''; // wcag level, e.g aa in 'wcag2aa' or a in 'wcag21a' tag
                return `WCAG ${sectionNumber}${level}`;
            })
            .join(', ');
    }
    // case 3: tags does not include best-practice or wcag, return raw tags comma separated

    return tags.join(',');
}
