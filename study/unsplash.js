const fs = require('fs');
const puppeteer = require('puppeteer');
const add_to_sheet = require('./add_to_sheet');
const axios = require('axios');

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://unsplash.com');
    const srcs = await page.evaluate(() => {});
  } catch (e) {}
};
crawler();
