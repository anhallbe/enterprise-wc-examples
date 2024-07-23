import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';
describe('Ids Hidden e2e Tests', () => {
    const url = 'http://localhost:4444/ids-hidden/example.html';
    beforeAll(async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });
    it('should not have errors', async () => {
        await expect(page.title()).resolves.toMatch('IDS Hidden Component');
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
            document.body.insertAdjacentHTML('beforeend', `<ids-hidden id="test" hide-up="md"></ids-hidden>`);
            document.querySelector('#test')?.remove();
        });
        expect(await countObjects(page)).toEqual(numberOfObjects);
    });
    it('should show hidden-1 el when on medium screens and down', async () => {
        const newPage = await browser.newPage();
        await newPage.setViewport({ width: 839, height: 9999, deviceScaleFactor: 1 });
        await newPage.goto('http://localhost:4444/ids-hidden/example.html');
        const hidden1IsVisible = await newPage.evaluate(`document.getElementById("hidden-1").visible`);
        const hidden2IsVisible = await newPage.evaluate(`document.getElementById("hidden-2").visible`);
        expect(hidden1IsVisible).toEqual('true');
        expect(hidden2IsVisible).toEqual(null);
    });
    it('should show hidden-2 el when on medium screens and up', async () => {
        const newPage = await browser.newPage();
        await newPage.setViewport({ width: 841, height: 9999, deviceScaleFactor: 1 });
        await newPage.goto('http://localhost:4444/ids-hidden/example.html');
        const hidden1IsVisible = await newPage.evaluate(`document.getElementById("hidden-1").visible`);
        const hidden2IsVisible = await newPage.evaluate(`document.getElementById("hidden-2").visible`);
        expect(hidden1IsVisible).toEqual(null);
        expect(hidden2IsVisible).toEqual('true');
    });
});
//# sourceMappingURL=ids-hidden-e2e-test.js.map