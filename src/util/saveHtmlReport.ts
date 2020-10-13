import fs from 'fs';

interface SaveReportOptions {
    htmlContent: string;
    reportFileName?: string;
    outputDir?: string;
}
/**
 * Saves the file with specified file name or with default file name index.thml
 * @param htmlContent
 * @param fileName
 */
export function saveHtmlReport({
    htmlContent,
    reportFileName,
    outputDir,
}: SaveReportOptions): void {
    try {
        const reportDirectory = `${process.cwd()}/${outputDir || 'artifacts'}`;
        if (!fs.existsSync(reportDirectory)) {
            fs.mkdirSync(reportDirectory, {
                recursive: true,
            });
        }
        const reportFilePath = `${reportDirectory}/${reportFileName || 'accessibilityReport.html'}`;
        fs.writeFileSync(reportFilePath, htmlContent);
        console.info(`HTML report was saved into the following directory ${reportFilePath}`);
    } catch (err) {
        console.error(`Error happened while trying to save html report. ${err}`);
    }
}
