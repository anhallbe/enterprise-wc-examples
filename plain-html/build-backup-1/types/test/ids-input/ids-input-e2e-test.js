import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';
describe('Ids Input e2e Tests', () => {
    const url = 'http://localhost:4444/ids-input/example.html';
    beforeAll(async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });
    it('should not have errors', async () => {
        await expect(page.title()).resolves.toMatch('IDS Input Component');
    });
    it('should be able to createElement', async () => {
        let hasError = false;
        try {
            await page.evaluate(() => {
                document.createElement('ids-input');
            });
        }
        catch (err) {
            hasError = true;
        }
        await expect(hasError).toEqual(false);
    });
    it('should pass Axe accessibility tests', async () => {
        await page.setBypassCSP(true);
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        const results = await new AxePuppeteer(page).analyze();
        expect(results.violations.length).toBe(0);
    });
    it.skip('should not have memory leaks', async () => {
        const numberOfObjects = await countObjects(page);
        await page.evaluate(() => {
            document.body.insertAdjacentHTML('beforeend', `<ids-input id="test" type="text" label="First Name" placeholder="Normal text Field"></ids-input>`);
            document.querySelector('#test')?.remove();
        });
        expect(await countObjects(page)).toEqual(numberOfObjects);
    });
});
//# sourceMappingURL=ids-input-e2e-test.js.map