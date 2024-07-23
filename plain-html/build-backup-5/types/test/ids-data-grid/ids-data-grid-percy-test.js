import percySnapshot from '@percy/puppeteer';
describe('Ids Data Grid Percy Tests', () => {
    const url = 'http://localhost:4444/ids-data-grid/example.html';
    it('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-new-light');
    });
    it('should not have visual regressions in standalone css', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
        await percySnapshot(page, 'ids-data-grid-standalone-css', { widths: [1280] });
    });
    it('should not have visual regressions in new dark theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
        });
        await percySnapshot(page, 'ids-data-grid-new-dark');
    });
    it('should not have visual regressions in new contrast theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
        });
        await percySnapshot(page, 'ids-data-grid-new-contrast');
    });
});
describe('Ids Data Grid List Style Percy Tests', () => {
    const url = 'http://localhost:4444/ids-data-grid/list-style.html';
    it('should not have visual regressions in new light theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-list-style-new-light');
    });
    it('should not have visual regressions in new dark theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
        });
        await page.waitForTimeout(200);
        await percySnapshot(page, 'ids-data-grid-list-style-new-dark');
    });
    it('should not have visual regressions in new contrast theme (percy)', async () => {
        await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await page.evaluate(() => {
            document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
        });
        await page.waitForTimeout(200);
        await percySnapshot(page, 'ids-data-grid-list-style-new-contrast');
    });
});
describe('Ids Data Grid Other Percy Tests', () => {
    it('should not have visual regressions in auto fit (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/auto-fit.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-auto-fit-light');
    });
    it('should not have visual regressions in auto fit to bottom (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/auto-fit-bottom.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-auto-fit-bottom-light');
    });
    it('should not have visual regressions in auto columns (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/columns-auto.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-columns-auto-light');
    });
    it('should not have visual regressions in fixed columns (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/columns-fixed.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-columns-fixed-light');
    });
    it('should not have visual regressions in percent columns (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/columns-percent.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-columns-percent-light');
    });
    it('should not have visual regressions in column formatters (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/columns-formatters.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-columns-formatters-light');
    });
    it('should not have visual regressions in column formatters (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/columns-alignment.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-columns-alignment-light');
    });
    it('should not have visual regressions in column groups (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/columns-groups.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-columns-groups-light');
    });
    it('should not have visual regressions in column stretch (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/columns-stretch.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-columns-stretch-light');
    });
    it('should not have visual regressions in column frozen (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/columns-frozen.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-columns-frozen-light');
    });
    it('should not have visual regressions in column frozen (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/alternate-row-shading.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-columns-row-shading');
    });
    it('should not have visual regressions in expandable row (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/expandable-row.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-expandable-row');
    });
    it('should not have visual regressions in tree grid (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/tree-grid.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-tree-grid');
    });
    it('should not have visual regressions in editable inline grid (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/editable-inline.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-editable-inline-grid');
    });
    it('should not have visual regressions in editable grid (percy)', async () => {
        await page.goto('http://localhost:4444/ids-data-grid/editable.html', { waitUntil: ['networkidle2', 'load'] });
        await page.waitForSelector('ids-layout-grid-cell');
        await percySnapshot(page, 'ids-data-grid-editable-grid');
    });
});
//# sourceMappingURL=ids-data-grid-percy-test.js.map