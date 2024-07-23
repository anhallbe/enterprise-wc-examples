import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';
describe('Ids Text e2e Tests', () => {
    const url = 'http://localhost:4444/ids-text/example.html';
    beforeAll(async () => {
        await page.goto(url, { waitUntil: 'load' });
    });
    it('should not have errors', async () => {
        await expect(page.title()).resolves.toMatch('IDS Text Component');
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
            const template = `<ids-text id="test" translate-text="true">Example</ids-text>`;
            document.body.insertAdjacentHTML('beforeend', template);
            document.querySelector('#test')?.remove();
        });
        expect(await countObjects(page)).toEqual(numberOfObjects);
    });
});
//# sourceMappingURL=ids-text-e2e-test.js.map