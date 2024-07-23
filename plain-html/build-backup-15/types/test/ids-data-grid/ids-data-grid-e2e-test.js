import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';
describe('Ids Data Grid e2e Tests', () => {
    const url = 'http://localhost:4444/ids-data-grid/example.html';
    beforeAll(async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });
    it('should not have errors', async () => {
        await expect(page.title()).resolves.toMatch('IDS Data Grid Component');
    });
    it('should pass Axe accessibility tests', async () => {
        await page.setBypassCSP(true);
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        const results = await new AxePuppeteer(page).disableRules(['aria-valid-attr-value', 'aria-required-children']).analyze();
        expect(results.violations.length).toBe(0);
    });
    it.skip('should not have memory leaks', async () => {
        const numberOfObjects = await countObjects(page);
        await page.evaluate(() => {
            document.body.insertAdjacentHTML('beforeend', `<ids-data-grid id="test" row-selection="multiple" label="Books" row-height="md"></ids-data-grid>`);
            document.querySelector('#test')?.remove();
        });
        expect(await countObjects(page)).toEqual(numberOfObjects);
    });
});
describe('Ids Data Grid Virtual Scroll e2e Tests', () => {
    const url = 'http://localhost:4444/ids-data-grid/virtual-scroll.html';
    it.skip('should render some rows', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('pierce/.ids-data-grid-row');
        const count = (await page.$$('pierce/.ids-data-grid-row')).length;
        expect(count).toEqual(33);
    });
});
//# sourceMappingURL=ids-data-grid-e2e-test.js.map