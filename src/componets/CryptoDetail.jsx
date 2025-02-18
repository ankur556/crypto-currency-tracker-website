import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CryptoDetail({currency="usd"}) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  // const currency = searchParams.get("currency") || "usd";
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then((response) => {
        setCoin(response.data);
      })
      .catch((error) => {
        console.error("Error fetching coin details:", error);
      });

    axios
      .get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        params: {
          vs_currency: currency,
          days: 7,
          interval: "daily",
        },
      })
      .then((response) => {
        const formattedData = response.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price,
        }));
        setHistory(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching historical data:", error);
      });
  }, [id, currency]);

  if (!coin) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h1>
      <img src={coin.image.large} alt={coin.name} className="w-24 h-24 my-4" />
      <p className="text-lg">Current Price: {new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(coin.market_data.current_price[currency])}</p>
      <p>Market Cap: ${coin.market_data.market_cap[currency].toLocaleString()}</p>
      <p>All-Time High: {new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(coin.market_data.ath[currency])}</p>

      <div className="w-full max-w-2xl mt-6">
        <h2 className="text-xl font-bold mb-2">7-Day Price Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
