from main_updated_3 import get_all_links,check_in_all_scrapers,scrape_with_scrapers,scrape_with_openai,scrape_with_ollama
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException

app = FastAPI()
class PartNumberRequest(BaseModel):
    part_number: str

class LinksRequest(BaseModel):
    part_number: str
    search_links: List[str]
    
class links(BaseModel):
    search_links: List[str]
    
@app.post("/get-links/")
def get_links(request: PartNumberRequest):
    try:
        links = get_all_links(request.part_number)
        return {"part_number": request.part_number, "links": links}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching links: {e}")
    
@app.post("/check-in-all-scrapers")
def api_check_in_all_scrapers(data: PartNumberRequest):
    result = check_in_all_scrapers(data.part_number)
    return {"part_number": data.part_number, "scraped_data": result}
    
@app.post("/scrape-with-scrapers/")
def scrape_with_scrapers_api(request: LinksRequest):
    try:
        data_from_scrapers = scrape_with_scrapers(request.part_number, request.search_links)
        return {
            "part_number": request.part_number,
            "scraped_data": data_from_scrapers,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping data: {e}")
    
@app.post("/scrape-with-ollama/")
def scrape_with_ollama_api(request: links):
    try:
        data_from_ollama = scrape_with_ollama(request.search_links)
        return {
            "search_links": request.search_links,
            "scraped_data": data_from_ollama,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping with Ollama: {e}")


@app.post("/scrape-with-openai/")
def scrape_with_openai_api(request: links):
    try:
        data_from_openai = scrape_with_openai(request.search_links)
        return {
            "search_links": request.search_links,
            "scraped_data": data_from_openai,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping with OpenAI: {e}")