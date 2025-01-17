import * as dotenv from 'dotenv';
import { chromium } from 'playwright-extra';
import type { BrowserContext } from 'playwright';
const stealth = require('puppeteer-extra-plugin-stealth')();

dotenv.config(); // Loads environment variables from .env
chromium.use(stealth);

const BASE_URL = 'https://leetcode.com';

/**
 * Opens the specified LeetCode submission page (using the session cookie from .env)
 * and returns the submission code as a string.
 */
export async function openAndParseLeetCodeSubmission(
  submissionId: string
): Promise<string> {
  const LEETCODE_SESSION = process.env.LEETCODE_SESSION_COOKIE;

  if (!LEETCODE_SESSION) {
    throw new Error(
      'LEETCODE_SESSION_COOKIE is not set in the .env file.'
    );
  }

  // 1. Launch the browser in headless mode for speed
  const browser = await chromium.launch({ headless: true });
  let context: BrowserContext | null = null;

  try {
    // 2. Create a new context and set the authentication cookie
    context = await browser.newContext();
    await context.addCookies([
      {
        name: 'LEETCODE_SESSION',
        value: LEETCODE_SESSION,
        domain: 'leetcode.com',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      },
    ]);

    // 3. Open a new page and navigate to the submission detail URL
    const page = await context.newPage();
    const submissionUrl = `${BASE_URL}/submissions/detail/${submissionId}/`;

    // Use a faster "waitUntil" strategy; adjust if some data isn't loaded in time
    await page.goto(submissionUrl, { waitUntil: 'domcontentloaded' });

    // 4. Get the full HTML content
    const htmlContent = await page.content();

    // 5. Extract the `var pageData = {...}` object from the HTML
    const pageDataRegex = /var pageData = (\{[\s\S]*?\});/;
    const match = htmlContent.match(pageDataRegex);

    if (!match) {
      throw new Error('Could not find var pageData in the page HTML.');
    }

    // 6. Safely parse the JS object to get the submission code
    const dataString = match[1]; // The {...} JSON-like string
    const jsonData = new Function(`return ${dataString}`)();

    if (!jsonData.submissionCode) {
      throw new Error('No submission code found in page data.');
    }

    // 7. Return the code
    
    return jsonData.submissionCode;
  } finally {
    await browser.close();
  }
}

