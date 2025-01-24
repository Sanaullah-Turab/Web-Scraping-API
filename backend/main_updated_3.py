import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import json
from excel_export import save_to_excel
from get_links import fetch_search_results
import extract_dict

# Available scrapers
from steritool import scrape_data as st_part
from wouterdrost import get_product_data as wd_part
from fordpartsgiant import get_data as ford_part
from gmpartsgiant import get_data as gm_part
from autopartstoyota import get_data as toyota_part
from machinecloud import machiningcloud as mc_part
from mscdirect import get_product_details as msc_part
from finditparts import scrape_product_data as findit_part
from raptor_supplies import parse_raptor_product as raptor_part

import ollama_main
import ollama_summary

from openai_scrape import openai_parse
from openai_summary import get_summary_and_title_with_openai



### **1. Function to Fetch All Links**
def get_all_links(part_number):
    """
    Fetch search result links for the given part number using Bing.

    Args:
        part_number (str): The part number to search for.

    Returns:
        list: A list of URLs from Bing search results.
    """
    print(f"Fetching search results for part number: {part_number}")
    return fetch_search_results(part_number)

# Function to check in all availible scrapers
def check_in_all_scrapers(part_number):
    """
    Checks for the part number in all the available scrapers.

    Args:
        part_number (str): The part number to search for.

    Returns:
        dict: A dictionary containing data scraped from all available scrapers.
    """
    scrapers = {
        "Steritool": st_part,
        "Wouter Drost": wd_part,
        "Ford Parts Giant": ford_part,
        "GM Parts Giant": gm_part,
        "Auto Parts Toyota": toyota_part,
        "Machining Cloud": mc_part,
        "MSC Direct": msc_part,
        "Find It Parts": findit_part,
        "Raptor Supplies": raptor_part
    }

    data_collection = {}
    for scraper_name, scraper_func in scrapers.items():
        try:
            print(f"Checking {scraper_name} scraper for part number: {part_number}")
            data = scraper_func(part_number)
            if data:
                data_collection[scraper_name] = data
                print(f"Data found in {scraper_name}.")
        except Exception as e:
            print(f"Error while using {scraper_name} scraper: {e}")

    return data_collection


### **2. Function to Scrape Using Available Scrapers**
def scrape_with_scrapers(part_number, search_links):
    """
    Scrape data using all available scrapers based on search links.

    Args:
        part_number (str): The part number to search for.
        search_links (list): List of URLs to check against scrapers.

    Returns:
        dict: A dictionary of data scraped from available scrapers.
    """
    data_collection = {}
    for url in search_links:
        domain = urlparse(url).netloc


        try:
            print(f"Checking and scraping data from {domain}...")
            scrapers = {
                "steritool.com": st_part,
                "wouterdrost.nl": wd_part,
                "fordpartsgiant.com": ford_part,
                "gmpartsgiant.com": gm_part,
                "autoparts.toyota": toyota_part,
                "machiningcloud.com": mc_part,
                "mscdirect.com": msc_part,
                "finditparts.com": findit_part,
                "raptorsupplies.com": raptor_part,
            }
            if domain in scrapers:
                data = scrapers[domain](part_number)
                if data:
                    data_collection[domain] = data
                    print(f"Successfully scraped data from {domain}.")
        except Exception as e:
            print(f"Error scraping data from {domain}: {e}")
    return data_collection


### **3. Function to Scrape Using Ollama**
def scrape_with_ollama(search_links):
    """
    Scrape data using Ollama for all given search links.

    Args:
        search_links (list): List of URLs to process with Ollama.

    Returns:
        dict: A dictionary of data scraped using Ollama.
    """
    data_collection = {}
    for url in search_links:
        domain = urlparse(url).netloc

        try:
            print(f"Scraping data from {domain} using Ollama...")
            scraped_ollama = ollama_main.scrape_and_parse(url)
            parsed_dict = extract_dict.extract(scraped_ollama)
            data_collection[domain] = parsed_dict
            print(f"Successfully scraped data from {domain} using Ollama.")
        except Exception as e:
            print(f"Error scraping data from {domain} using Ollama: {e}")
    return data_collection


### **4. Function to Scrape Using OpenAI**
def scrape_with_openai(search_links):
    """
    Scrape data using OpenAI for all given search links.

    Args:
        search_links (list): List of URLs to process with OpenAI.

    Returns:
        dict: A dictionary of data scraped using OpenAI.
    """
    data_collection = {}
    for url in search_links:
        domain = urlparse(url).netloc

        try:
            print(f"Scraping data from {domain} using OpenAI...")
            scraped_openai = openai_parse(url)
            parsed_dict = extract_dict.extract(scraped_openai)
            data_collection[domain] = parsed_dict
            print(f"Successfully scraped data from {domain} using OpenAI.")
        except Exception as e:
            print(f"Error scraping data from {domain} using OpenAI: {e}")
    return data_collection


### **Main Execution**
if __name__ == "__main__":
    part_number = "17801-35020-83"

    # Step 1: Get All Links
    search_links = get_all_links(part_number)

    # Step 2: Scrape Using Scrapers
    print("\n--- Scraping with Available Scrapers ---")
    data_from_scrapers = scrape_with_scrapers(part_number, search_links)

    # Step 3: Scrape Using Ollama
    if len(data_from_scrapers) < 2:
        print("\n--- Scraping with Ollama ---")
        data_from_ollama = scrape_with_ollama(search_links)
        data_from_scrapers.update(data_from_ollama)

    # Step 4: Scrape Using OpenAI
    if len(data_from_scrapers) < 2:
        print("\n--- Scraping with OpenAI ---")
        data_from_openai = scrape_with_openai(search_links)
        data_from_scrapers.update(data_from_openai)

    # Step 5: Generate Summary and Title
    print("\n--- Generating Summary and Title ---")
    try:
        title_summary = get_summary_and_title_with_openai(data_from_scrapers)
        title_summary = extract_dict.extract(title_summary)
        print("Summary and Title Generated Successfully.")
    except Exception as e:
        print(f"Error generating summary: {e}")
        title_summary = {"title": "Error", "summary": "Could not generate summary."}

    # Step 6: Save to Excel
    print("\n--- Saving to Excel ---")
    try:
        save_to_excel(data_from_scrapers, title_summary, "part_number_data.xlsx")
        print("Data saved to 'part_number_data.xlsx'.")
    except Exception as e:
        print(f"Error saving to Excel: {e}")
