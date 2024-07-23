import percySnapshot from '@percy/puppeteer';
describe('Ids Error Page Percy Tests', () => {
    const url = 'http://localhost:4444/ids-error-page/example.html';
    it('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForTimeout(200);
        await percySnapshot(page, 'ids-error-page-new-light');
    });
    it('should not have visual regressions in new dark theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
        });
        await page.waitForTimeout(200);
        await percySnapshot(page, 'ids-error-page-new-dark');
    });
    it('should not have visual regressions in new contrast theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
        });
        await page.waitForTimeout(200);
        await percySnapshot(page, 'ids-error-page-new-contrast');
    });
});
//# sourceMappingURL=ids-error-page-percy-test.js.map