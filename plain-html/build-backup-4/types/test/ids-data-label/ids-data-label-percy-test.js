import percySnapshot from '@percy/puppeteer';
describe('Ids Data Label e2e Tests', () => {
    const url = 'http://localhost:4444/ids-data-label/example.html';
    it('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await percySnapshot(page, 'ids-data-label-new-light');
    });
    it('should not have visual regressions in new dark theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
        });
        await percySnapshot(page, 'ids-data-label-new-dark');
    });
    it('should not have visual regressions in new contrast theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
        });
        await percySnapshot(page, 'ids-data-label-new-contrast');
    });
});
//# sourceMappingURL=ids-data-label-percy-test.js.map