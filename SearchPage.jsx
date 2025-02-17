import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import useDarkMode from "./hooks/usedarkmode";
import "./SearchPage.css";
import RefreshButton from "./RefreshButton";

export default function SearchPage() {
  const { theme, toggleTheme } = useDarkMode();
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = (pageNum = 1) => {
    setIsLoading(true);
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 50,
          page: pageNum,
          sparkline: false,
        },
      })
      .then((response) => {
        if (pageNum === 1) {
          setCoins(response.data);
        } else {
          setCoins((prevCoins) => [...prevCoins, ...response.data]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching crypto data:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData(page);
  }, [currency, page]);

  const refreshData = () => {
    setPage(1);
    fetchData(1);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Crypto Currency Tracker 💸🤑</h1>
      
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex gap-4 mb-4 md:mb-0">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded-md transition-colors duration-200 hover:bg-gray-700 dark:hover:bg-gray-300"
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <RefreshButton onClick={refreshData} />
        </div>

        <div className="flex items-center">
          <label className="mr-2 text-lg">Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border rounded bg-white dark:bg-gray-700 transition-colors duration-200"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
            <option value="jpy">JPY</option>
            <option value="inr">INR</option>
          </select>
        </div>
      </div>

      <div className="relative flex items-center w-full max-w-md mb-8">
        <input
          type="search"
          id="search-input"
          placeholder="Search coins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-gray-300 bg-transparent px-4 py-2 leading-[1.6] outline-none 
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
          dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400
          transition-colors duration-200"
        />
      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors duration-200">
        <h2 className="text-2xl font-bold p-4 bg-gray-100 dark:bg-gray-700 text-center">Top Cryptos</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Coin</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">24h Change</th>
                <th className="p-3 text-right">Market Cap</th>
                <th className="p-3 text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.length > 0 ? (
                filteredCoins.map((coin, index) => (
                  <tr 
                    key={coin.id} 
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 flex items-center gap-2">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                      <span>{coin.name} <span className="text-gray-500 dark:text-gray-400">({coin.symbol.toUpperCase()})</span></span>
                    </td>
                    <td className="p-3 text-right">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: currency.toUpperCase(),
                      }).format(coin.current_price)}
                    </td>
                    <td className={`p-3 text-right ${
                      coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                    <td className="p-3 text-right">${coin.market_cap.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <Link
                        to={`/${coin.id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={() => setPage(page + 1)}
        className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Load More Coins'}
      </button>
    </div>
  );
}
