const puppeteer = require('puppeteer')
export default async function (_req, res) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox'
    ]
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 960, height: 540 })
  await page.goto('http://127.0.0.1:3000')

  const imageBuffer = await page.screenshot({
    type: 'png',
    omitBackground: false
  })

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': imageBuffer.length
  })

  res.write(imageBuffer)
  res.end()
  await browser.close()
}
