import percySnapshot from '@percy/puppeteer';
describe('Ids Area Chart Percy Tests', () => {
    const url = 'http://localhost:4444/ids-area-chart/no-animation.html';
    it('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('pierce/.chart-legend');
        await percySnapshot(page, 'ids-area-chart-new-light');
    });
    it('should not have visual regressions in new dark theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
        });
        await page.waitForSelector('pierce/.chart-legend');
        await percySnapshot(page, 'ids-area-chart-new-dark');
    });
    it('should not have visual regressions in new contrast theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
        });
        await page.waitForSelector('pierce/.chart-legend');
        await percySnapshot(page, 'ids-area-chart-new-contrast');
    });
});
//# sourceMappingURL=ids-area-chart-percy-test.js.map