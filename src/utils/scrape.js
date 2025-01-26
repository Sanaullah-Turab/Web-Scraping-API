import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

/**
 * @param {string} partNumber
 * @returns {Promise<object>}
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
 *
 * @param {string} partNumber
 * @returns {Promise<object>}
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
 *
 * @param {string} partNumber
 * @param {Array<string>} links
 * @returns {Promise<object>}
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
 *
 * @param {Array<string>} links
 * @returns {Promise<object>}
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
 *
 * @param {Array<string>} links
 * @returns {Promise<object>}
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
