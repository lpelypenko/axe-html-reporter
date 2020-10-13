import fs from 'fs';
import path from 'path';

export function loadTemplate(): string {
    try {
        return fs.readFileSync(path.resolve(__dirname, 'template', 'pageTemplate.html'), {
            encoding: 'utf8',
        });
    } catch (err) {
        throw new Error(`Error happened while trying to get page template. ${err}`);
    }
}
