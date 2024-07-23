import percySnapshot from '@percy/puppeteer';
describe('Ids Input Validation Message Percy Tests', () => {
    const url = 'http://localhost:4444/ids-input/validation-message.html';
    it('should not have visual regressions (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await percySnapshot(page, 'ids-input-validation-message');
    });
});
//# sourceMappingURL=ids-input-validation-message-percy-test.js.map