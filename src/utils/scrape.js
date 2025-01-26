import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000"; // Ensure this matches your backend URL

/**
 * Fetches links for a part number using the `/get-links/` API endpoint.
 * @param {string} partNumber - The part number to search for.
 * @returns {Promise<object>} - Links fetched from the API.
 */
export async function fetchLinks(partNumber) {
  try {
    const response = await axios.post(`${BASE_URL}/get-links/`, {
      part_number: partNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching links:", error);
    throw new Error("Failed to fetch links. Please check your backend.");
  }
}

/**
 * Scrapes data using all available scrapers for a given part number.
 * @param {string} partNumber - The part number to scrape.
 * @returns {Promise<object>} - Scraped data from all scrapers.
 */
export async function scrapeAllScrapers(partNumber) {
  try {
    const response = await axios.post(`${BASE_URL}/check-in-all-scrapers`, {
      part_number: partNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Error scraping with all scrapers:", error);
    throw new Error(
      "Failed to scrape with all scrapers. Please check your backend."
    );
  }
}

/**
 * Scrapes data using specific scrapers based on provided links.
 * @param {string} partNumber - The part number to scrape.
 * @param {Array<string>} links - Array of URLs to scrape.
 * @returns {Promise<object>} - Scraped data.
 */
export async function scrapeWithScrapers(partNumber, links) {
  try {
    const response = await axios.post(`${BASE_URL}/scrape-with-scrapers/`, {
      part_number: partNumber,
      search_links: links,
    });
    return response.data;
  } catch (error) {
    console.error("Error scraping with scrapers:", error);
    throw new Error(
      "Failed to scrape with specified scrapers. Please check your backend."
    );
  }
}

/**
 * Scrapes data using Ollama for provided links.
 * @param {Array<string>} links - Array of URLs to scrape.
 * @returns {Promise<object>} - Scraped data.
 */
export async function scrapeWithOllama(links) {
  try {
    const response = await axios.post(`${BASE_URL}/scrape-with-ollama/`, {
      search_links: links,
    });
    return response.data;
  } catch (error) {
    console.error("Error scraping with Ollama:", error);
    throw new Error("Failed to scrape with Ollama. Please check your backend.");
  }
}

/**
 * Scrapes data using OpenAI for provided links.
 * @param {Array<string>} links - Array of URLs to scrape.
 * @returns {Promise<object>} - Scraped data.
 */
export async function scrapeWithOpenAI(links) {
  try {
    const response = await axios.post(`${BASE_URL}/scrape-with-openai/`, {
      search_links: links,
    });
    return response.data;
  } catch (error) {
    console.error("Error scraping with OpenAI:", error);
    throw new Error("Failed to scrape with OpenAI. Please check your backend.");
  }
}
