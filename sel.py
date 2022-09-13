from distutils.filelist import findall
import time
import json
import re
from pyppeteer import launch
import asyncio
from bs4 import BeautifulSoup

#global veriables
hipper_boy = set()
regex_boy = set()


#no url can't escape from my boy
async def regex(source):
    re_gx = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
    valichu_edu = await re.findall(re_gx,source)
    return [x[0] for x in valichu_edu]


#hypper cutter 
async def hipper_links(sweet_html):
    for hipper_link in sweet_html.find_all('a'):
        hipper_boy.add(hipper_link)


# headless browser thala illa thala
async def browser():
    options ={
        "headless":True
    }
    browser = await launch(options)
    page = await browser.newPage()
    return browser,page


# my beautifull html tags
async def beauty_html(souce):
    return BeautifulSoup(souce,'html.parser')


# messa kara ungle save pannuvaru
def save_form(source,file_name):
    try: 
        with open(file_name) as file:
            file.write(source) 
    except:
        print("File format Not supported.!")


# ivanga ellarai anbu valkaiyoda inikira ivara than main function
async def main(url):
    driver = await browser()
    await driver.goto(url)
    sweet_html = await beauty_html(await driver.content())
    


asyncio.get_event_loop().run_until_complete(main())