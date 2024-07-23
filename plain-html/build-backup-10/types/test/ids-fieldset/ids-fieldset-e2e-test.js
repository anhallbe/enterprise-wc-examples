import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';
describe('Ids Fieldset e2e Tests', () => {
    const url = 'http://localhost:4444/ids-fieldset/example.html';
    beforeAll(async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });
    it('should not have errors', () => {
        expect(page.title()).resolves.toMatch('IDS Fieldset Component');
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
            document.body.insertAdjacentHTML('beforeend', `<ids-fieldset id="test">
        <legend><ids-text font-size="20" type="h2" id="user-info">User Information</ids-text></legend>
      </ids-fieldset>`);
            document.querySelector('#test')?.remove();
        });
        expect(await countObjects(page)).toEqual(numberOfObjects);
    });
});
//# sourceMappingURL=ids-fieldset-e2e-test.js.map