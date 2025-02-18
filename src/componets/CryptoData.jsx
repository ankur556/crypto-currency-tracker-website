import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CryptoData({ currency }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      })
      .then((response) => {
        setCoins(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching crypto data:", error);
        setLoading(false);
      });
  }, [currency]); // Reload data when currency changes

  if (loading) {
    return <p className="text-center text-gray-500">Loading data...</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Top 10 Cryptos ({currency.toUpperCase()})</h2>
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Coin</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr key={coin.id} className="text-center">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                <Link to={`/crypto/${coin.id}`} className="text-blue-500 hover:underline">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </Link>
              </td>
              <td className="p-2 border">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency.toUpperCase(),
                }).format(coin.current_price)}
              </td>
              <td
                className={`p-2 border ${
                  coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
