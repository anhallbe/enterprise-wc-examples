import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';
describe('Ids Treemap e2e Tests', () => {
    const url = 'http://localhost:4444/ids-treemap/example.html';
    beforeAll(async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });
    it('should not have errors', async () => {
        await expect(page.title()).resolves.toMatch('IDS Treemap Component');
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
            document.body.insertAdjacentHTML('beforeend', `<ids-treemap id="test" title="Storage Utilization (78 GB)"></ids-treemap>`);
            document.querySelector('#test')?.remove();
        });
        expect(await countObjects(page)).toEqual(numberOfObjects);
    });
    it('should resize the width when the viewport changes', async () => {
        await page.setViewport({ width: 589, height: 9999, deviceScaleFactor: 1 });
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForTimeout(400);
        let treemapWidth = await page.evaluate(`document.querySelector("ids-treemap").width`);
        let containerWidth = await page.evaluate(`document.querySelector("ids-treemap").container.offsetWidth`);
        expect(treemapWidth).toEqual(containerWidth);
        await page.setViewport({ width: 989, height: 9999, deviceScaleFactor: 1 });
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForTimeout(400);
        treemapWidth = await page.evaluate(`document.querySelector("ids-treemap").width`);
        containerWidth = await page.evaluate(`document.querySelector("ids-treemap").container.offsetWidth`);
        expect(treemapWidth).toEqual(containerWidth);
    });
});
//# sourceMappingURL=ids-treemap-e2e-test.js.map