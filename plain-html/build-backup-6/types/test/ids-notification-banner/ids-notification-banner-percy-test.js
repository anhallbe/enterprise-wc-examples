import percySnapshot from '@percy/puppeteer';
describe('Ids Notification Banner Percy Tests', () => {
    const url = 'http://localhost:4444/ids-notification-banner/example.html';
    it('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await percySnapshot(page, 'ids-notification-banner-new-light');
    });
});
//# sourceMappingURL=ids-notification-banner-percy-test.js.map