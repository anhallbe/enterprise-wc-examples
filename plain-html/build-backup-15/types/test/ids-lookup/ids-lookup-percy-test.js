import percySnapshot from '@percy/puppeteer';
describe('Ids Lookup Percy Tests', () => {
    const url = 'http://localhost:4444/ids-lookup/example.html';
    it('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await percySnapshot(page, 'ids-lookup-new-light');
    });
    it('should not have visual regressions in new dark theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
        });
        await percySnapshot(page, 'ids-lookup-new-dark');
    });
    it('should not have visual regressions in new contrast theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
        });
        await percySnapshot(page, 'ids-lookup-new-contrast');
    });
});
//# sourceMappingURL=ids-lookup-percy-test.js.map