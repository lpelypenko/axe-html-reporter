import { existsSync, writeFileSync } from 'fs';
import { Resource } from '../resources';
import https from 'https';
import { basename, join } from 'path';
import crypto from 'crypto';

export default function downloadAndVerifyResource(resource: Resource, reportDirectory: string): Promise<void> {
    const filePath = join(reportDirectory, basename(resource.path));

    if (existsSync(filePath)) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        https.get(resource.path, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to download from ${resource.path}. Status: ${response.statusCode}`));
            }

            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (resource.integrity) {
                    const integrityValid = verifyIntegrity(data, resource.integrity);
                    if (!integrityValid) {
                        return reject(new Error(`Integrity check failed for ${resource.path}`));
                    }
                }

                writeFileSync(filePath, data);
                resolve();
            });

            response.on('error', (err) => {
                reject(new Error(`Error downloading resource: ${err.message}`));
            });
        });
    });
}

async function verifyIntegrity(content: string, expectedIntegrity: string): Promise<boolean> {
    const hash = crypto.createHash('sha256');
    hash.update(content);
    const calculatedHash = hash.digest('base64');

    return calculatedHash === expectedIntegrity;
}
