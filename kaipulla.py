from pyppeteer import launch 
from pyppeteer_stealth import stealth
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import asyncio

# https://www.google.com/search?q=

hipper_links = set()
async def browser():
    options ={
        "headless":False,
        'args': ['--no-sandbox', '--disable-setuid-sandbox','--start-maximized','--disable-infobars'],
        "executablePath": "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    }
    browser = await launch(options)
    page = await browser.newPage()
    await stealth(page)
    return browser,page

async def main(url):
    browse,driver = await browser()
    await driver.goto(url) 

async def main2():
    for count in range(0,10000,10):
        await main("https://www.google.com/search?q=inurl%3A+%2Fsecurity&start="+str(count))

asyncio.get_event_loop().run_until_complete(main2())
