import percySnapshot from '@percy/puppeteer';
describe('Ids Form e2e Tests', () => {
    const url = 'http://localhost:4444/ids-form/example.html';
    it('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await percySnapshot(page, 'ids-form-new-light');
    });
    it('should not have visual regressions in new dark theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
        });
        await percySnapshot(page, 'ids-form-new-dark');
    });
    it('should not have visual regressions in new contrast theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
        });
        await percySnapshot(page, 'ids-form-new-contrast');
    });
});
//# sourceMappingURL=ids-form-percy-test.js.map