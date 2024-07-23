import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';
const imgSrcExists = '../assets/images/placeholdeer-60x60.png';
const imgSrcNotFound = '../assets/images/non-existant.jpg';
const placeholderEl = '#e2e-placeholder';
const fallbackEl = '#e2e-fallback';
describe('Ids Image e2e Tests', () => {
    const url = 'http://localhost:4444/ids-image/example.html';
    beforeAll(async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });
    it('should not have errors', async () => {
        await expect(page.title()).resolves.toMatch('IDS Image Component');
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
            document.body.insertAdjacentHTML('beforeend', `<ids-image id="test" initials="mn" round tabindex="0"></ids-image>`);
            document.querySelector('#test')?.remove();
        });
        expect(await countObjects(page)).toEqual(numberOfObjects);
    });
    it('should render placeholder on image error', async () => {
        const hasPlaceholder = await page.$eval(fallbackEl, (el) => el.shadowRoot?.querySelector('.placeholder'));
        expect(hasPlaceholder).toBeTruthy();
    });
    it('should render placeholder via attribute', async () => {
        const hasPlaceholder = await page.$eval(placeholderEl, (el) => el.shadowRoot?.querySelector('.placeholder'));
        expect(hasPlaceholder).toBeTruthy();
    });
    it('should change placeholder to src', async () => {
        await page.evaluate((el, src) => {
            const element = document.querySelector(el);
            element.placeholder = false;
            element.src = src;
        }, placeholderEl, imgSrcExists);
        const hasImage = await page.$eval(placeholderEl, (el) => el.shadowRoot?.querySelector('img'));
        expect(hasImage).toBeTruthy();
    });
    it('should render placeholder if src changed and img failed to load', async () => {
        await page.evaluate((el, src) => {
            const element = document.querySelector(el);
            element.src = src;
        }, fallbackEl, imgSrcNotFound);
        // Image failed to load - placeholder appears
        await page.waitForFunction(() => document.querySelector('#e2e-fallback')?.shadowRoot?.querySelector('.placeholder'));
        const hasPlaceholder = await page.$eval(fallbackEl, (el) => el.shadowRoot?.querySelector('.placeholder'));
        expect(hasPlaceholder).toBeTruthy();
    });
});
//# sourceMappingURL=ids-image-e2e-test.js.map