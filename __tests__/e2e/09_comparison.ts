/* global page */

jest.setTimeout(15 * 1000);

let base = '';

const run = async () => {
  await page.waitForSelector(`${base}div:nth-of-type(1) > button:nth-of-type(1)`);

  await page.click(`${base}div:nth-of-type(1) > button:nth-of-type(1)`);
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.click(`${base}div:nth-of-type(1) > button:nth-of-type(2)`);
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.click(`${base}div:nth-of-type(2) > button:nth-of-type(1)`);
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.click(`${base}div:nth-of-type(2) > button:nth-of-type(2)`);
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(3) > div:nth-of-type(1) > input`, '1');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(3) > div:nth-of-type(2) > input`, '2');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(3) > div:nth-of-type(3) > input`, '3');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(4) > div:nth-of-type(1) > input`, '4');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(4) > div:nth-of-type(2) > input`, '5');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(4) > div:nth-of-type(3) > input`, '6');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();
};


describe('09_comparison', () => {
  it('should work with events', async () => {
    await page.goto(`http://localhost:${process.env.PORT || '8080'}/`);

    base = 'body > div > div > div:nth-of-type(1) > ';
    await run();

    base = 'body > div > div > div:nth-of-type(2) > ';
    await run();
  });
});
