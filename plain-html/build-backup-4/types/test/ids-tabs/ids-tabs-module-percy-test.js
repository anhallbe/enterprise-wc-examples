import percySnapshot from '@percy/puppeteer';
describe('Ids Tabs Percy Tests (Module Tabs)', () => {
    const url = 'http://localhost:4444/ids-tabs/module.html';
    it.skip('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle0', 'load'] });
        await page.waitForSelector('ids-tab[selected]');
        await percySnapshot(page, 'ids-tabs-module-new-light');
    });
    it.skip('should not have visual regressions in new dark theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle0', 'load'] });
        await page.waitForSelector('ids-tab[selected]');
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
        });
        await percySnapshot(page, 'ids-tabs-module-new-dark');
    });
    it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle0', 'load'] });
        await page.waitForSelector('ids-tab[selected]');
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
        });
        await percySnapshot(page, 'ids-tabs-module-new-contrast');
    });
});
//# sourceMappingURL=ids-tabs-module-percy-test.js.map