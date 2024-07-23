import percySnapshot from '@percy/puppeteer';
describe('Ids Color Picker Percy Tests', () => {
    const url = 'http://localhost:4444/ids-color-picker/example.html';
    it('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForTimeout(220);
        await percySnapshot(page, 'ids-color-picker-new-light');
    });
    it('should not have visual regressions in new dark theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
        });
        await page.waitForTimeout(220);
        await percySnapshot(page, 'ids-color-picker-new-dark');
    });
    it('should not have visual regressions in new contrast theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
        });
        await page.waitForTimeout(220);
        await percySnapshot(page, 'ids-color-picker-new-contrast');
    });
});
//# sourceMappingURL=ids-color-picker-percy-test.js.map