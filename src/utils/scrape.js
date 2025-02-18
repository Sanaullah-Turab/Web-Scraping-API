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
 * @param {string} partNumber
 * @returns {Promise<object>}
 */
export async function scrapeWithScrapersOnly(partNumber) {
  try {
    const response = await axios.post(
      `${BASE_URL}/scrape-with-scrapers-only/`,
      {
        part_number: partNumber,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error scraping with scrapers only:", error);
    throw new Error(
      "Failed to scrape with scrapers only. Please check your backend."
    );
  }
}

/**
 * @param {string} partNumber
 * @param {Array<string>} links
 * @returns {Promise<object>}
 */
export async function scrapeWithOllama(partNumber, links) {
  try {
    if (!links || links.length === 0) {
      console.log("Fetching links for Ollama...");
      const linkResponse = await fetchLinks(partNumber);
      links = linkResponse.links || [];
      if (links.length === 0) {
        throw new Error("No links available for Ollama.");
      }
    }

    console.log("Scraping with Ollama using links:", links);

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
 * @param {string} partNumber
 * @param {Array<string>} links
 * @returns {Promise<object>}
 */
export async function scrapeWithOpenAI(partNumber, links) {
  try {
    if (!links || links.length === 0) {
      console.log("Fetching links for OpenAI...");
      const linkResponse = await fetchLinks(partNumber);
      links = linkResponse.links || [];
      if (links.length === 0) {
        throw new Error("No links available for OpenAI.");
      }
    }

    console.log("Scraping with OpenAI using links:", links);

    const response = await axios.post(`${BASE_URL}/scrape-with-openai/`, {
      search_links: links,
    });
    return response.data;
  } catch (error) {
    console.error("Error scraping with OpenAI:", error);
    throw new Error("Failed to scrape with OpenAI. Please check your backend.");
  }
}

/**
 * Scrapes data using all available scrapers with fallback logic.
 * @param {string} partNumber
 * @returns {Promise<object>}
 */
export async function scrapeWithFallback(partNumber) {
  try {
    console.log("Scraping with all scrapers...");
    const allScrapersResponse = await scrapeAllScrapers(partNumber);
    return allScrapersResponse;
  } catch (error) {
    console.warn("All scrapers failed, falling back to Ollama:", error);
    try {
      const linksResponse = await fetchLinks(partNumber);
      const ollamaResponse = await scrapeWithOllama(
        partNumber,
        linksResponse.links
      );
      return ollamaResponse;
    } catch (ollamaError) {
      console.warn("Ollama failed, falling back to OpenAI:", ollamaError);
      try {
        const linksResponse = await fetchLinks(partNumber);
        const openAIResponse = await scrapeWithOpenAI(
          partNumber,
          linksResponse.links
        );
        return openAIResponse;
      } catch (openAIError) {
        console.error("OpenAI also failed:", openAIError);
        throw new Error("All scraping methods failed.");
      }
    }
  }
}
