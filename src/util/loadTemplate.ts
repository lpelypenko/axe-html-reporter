import fs from 'fs';
import path from 'path';

export function loadTemplate(tpath:string=path.resolve(__dirname, 'template', 'pageTemplate.html')): string {
    try {
        return fs.readFileSync(tpath, {
            encoding: 'utf8',
        });
    } catch (err) {
        throw new Error(`Error happened while trying to get page template. ${err}`);
    }
}
