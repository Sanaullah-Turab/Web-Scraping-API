"use client";

import React, { useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [partNumber, setPartNumber] = useState("");
  const [scrapeMethod, setScrapeMethod] = useState("all"); // Default to 'all'
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/${
          scrapeMethod === "all"
            ? "check-in-all-scrapers"
            : scrapeMethod === "openai"
            ? "scrape-with-openai/"
            : "scrape-with-ollama/"
        }`,
        { part_number: partNumber }
      );

      setTableData(response.data.scraped_data || []);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (tableData.length === 0) {
      alert("No data to download!");
      return;
    }

    const csvData = [["Key", "Value"], ...Object.entries(tableData)]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${partNumber}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Part Number Scraper</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter Part Number"
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
          className="px-4 py-2 border rounded-md w-64"
        />
        <select
          value={scrapeMethod}
          onChange={(e) => setScrapeMethod(e.target.value)}
          className="px-4 py-2 border rounded-md ml-2"
        >
          <option value="all">All Scrapers</option>
          <option value="openai">OpenAI</option>
          <option value="ollama">Ollama</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {tableData.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Scraped Data</h2>
          <table className="border-collapse border border-gray-400 w-full text-left">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Key</th>
                <th className="border border-gray-400 px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tableData).map(([key, value]) => (
                <tr key={key}>
                  <td className="border border-gray-400 px-4 py-2">{key}</td>
                  <td className="border border-gray-400 px-4 py-2">
                    {JSON.stringify(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleDownload}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Download as Excel
      </button>
    </div>
  );
}
