import { getWcagReference } from '../src/util/getWcagReference';
const axeRawViolations = require('./rawViolations.json');
const axeAllJViolations = require('./rawAllJViolations.json');
const axeAllCViolations = require('./rawAllCViolations.json');

describe('Successful tests', () => {
    it('Tags for general set of violations', async () => {
        // @ts-ignore
        const simplifiedTags = axeRawViolations.map(({ id, tags }) => ({
            id,
            tags,
            wcag: getWcagReference(tags),
        }));

        expect(simplifiedTags).toMatchSnapshot();
    });

    it('Tags for all J', async () => {
        // @ts-ignore
        const simplifiedTags = axeAllJViolations.map(({ id, tags }) => ({
            id,
            tags,
            wcag: getWcagReference(tags),
        }));

        expect(simplifiedTags).toMatchSnapshot();
    });
    it('Tags for all C', async () => {
        // @ts-ignore
        const simplifiedTags = axeAllCViolations.map(({ id, tags }) => ({
            id,
            tags,
            wcag: getWcagReference(tags),
        }));

        expect(simplifiedTags).toMatchSnapshot();
    });
});
