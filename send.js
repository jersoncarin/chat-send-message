const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

// Load dotenv
require('dotenv').config();

const send = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  const page = await browser.newPage();

  await (async () => {
    // login
    await page.goto('https://mbasic.facebook.com', {
      waitUntil: 'networkidle2',
      timeout: 0
    });

    console.log("Logging in...");

    // Ensure that page is loaded and has login inputs
    await page.waitForSelector('#m_login_email');

    await page.type('#m_login_email', process.env.FB_USER);
    await page.type('input[name="pass"]', process.env.FB_PASS);
    await page.click("input[name='login']");

    console.log("Sucessfully login");
  })();

  console.log('Finding given MSG_URL...');

  await page.goto(process.env.FB_MSG_URL,{
    waitUntil: 'networkidle2',
    timeout: 0
  });

  console.log('MSG_URL has been successfully find');
  console.log('Waiting for message...');

  const input = await page.$('#composerInput');

  console.log("Getting random quotes...");

  let quote = await fetch('https://zenquotes.io/api/random')
    .then((res) => res.json())
    .then((res) => res.shift())
    .then((res) => res.q)
    .then((res) => {
      console.log("Random quotes has been fetch.");
      return res
    });

  console.log("Sending message...");

  if(!quote)
    quote = 'hello world'

  await page.evaluate(async (input,quote) => {
    if(input) {
      const today  = new Date();
      input.value = `\`${quote}\` \n\nSent via automated cron job, please don't reply \nTime: ${today.toLocaleString()}`
      return input.value
    }
    return 'hello world'
  },input,quote);

  await page.click('input[name="send"]');

  console.log(`Message has been sent\n`);

  browser.close();
}

module.exports = send
