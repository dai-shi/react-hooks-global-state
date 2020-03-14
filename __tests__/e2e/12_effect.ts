/* global page */

jest.setTimeout(15 * 1000);

describe('02_typescript', () => {
  it('should work with events', async () => {
    await page.goto(`http://localhost:${process.env.PORT || '8080'}/`);
    await page.waitForSelector('div:nth-of-type(1) > button:nth-of-type(1)');

    await page.click('div:nth-of-type(1) > button:nth-of-type(1)');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('div:nth-of-type(1) > button:nth-of-type(2)');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('div:nth-of-type(2) > button:nth-of-type(1)');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('div:nth-of-type(2) > button:nth-of-type(2)');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();
  });
});
