/* global page */

jest.setTimeout(15 * 1000);

describe('03_actions', () => {
  it('should work with events', async () => {
    await page.goto(`http://localhost:${process.env.PORT || '8080'}/`);

    await page.waitForSelector('button');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('button');
    await page.waitForSelector('button');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('button');
    await page.waitForSelector('button');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();
  });
});
