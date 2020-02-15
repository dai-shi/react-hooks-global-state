/* global page */

jest.setTimeout(15 * 1000);

describe('05_onmount', () => {
  it('should work with events', async () => {
    await page.goto(`http://localhost:${process.env.PORT || '8080'}/`);

    await page.waitForSelector('body > div > div > span');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();
  });
});
