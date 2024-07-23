import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';
describe('Ids Process Indicator e2e Tests', () => {
    const exampleUrl = 'http://localhost:4444/ids-process-indicator/example.html';
    const emptyLabelExampleUrl = `http://localhost:4444/ids-process-indicator/empty-label.html`;
    it('should not have errors', async () => {
        await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
        await expect(page.title()).resolves.toMatch('IDS Process Indicator Component');
        await page.goto(emptyLabelExampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });
    it('should pass Axe accessibility tests', async () => {
        await page.setBypassCSP(true);
        await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
        const results = await new AxePuppeteer(page).disableRules(['color-contrast']).analyze();
        expect(results.violations.length).toBe(0);
    });
    it('should show hide details on resize', async () => {
        await page.setViewport({
            width: 375,
            height: 1080
        });
        await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
        await page.waitForSelector('ids-process-indicator-step [slot="detail"]', {
            visible: false,
        });
        const size = await page.evaluate('document.querySelector("ids-process-indicator-step [slot=\'detail\']").style.width');
        expect(Number(size.replace('px', ''))).toBe(0);
    });
    it.skip('should not have memory leaks', async () => {
        const numberOfObjects = await countObjects(page);
        await page.evaluate(() => {
            document.body.insertAdjacentHTML('beforeend', `<ids-process-indicator id="test">
      <ids-process-indicator-step label="Process Started" status="done">
      </ids-process-indicator-step></<ids-process-indicator>`);
            document.querySelector('#test')?.remove();
        });
        expect(await countObjects(page)).toEqual(numberOfObjects);
    });
});
//# sourceMappingURL=ids-process-indicator-e2e-test.js.map