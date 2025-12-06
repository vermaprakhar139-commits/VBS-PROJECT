import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import PriceSlider from "../components/common/PriceSlider";

interface Bus {
  id: string;
  operatorName: string;
  busType: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMins: number;
  price: number;
  availableSeats: number;
  rating: number;
  amenities: string[];
}

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    busType: "",
    priceRange: [500, 2500] as [number, number], // Replace minPrice/maxPrice
    departureTime: "",
  });
  const [sortBy, setSortBy] = useState("price");

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";

  useEffect(() => {
    if (from && to && date) {
      fetchBuses();
    }
  }, [from, to, date, filters, sortBy]);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from,
        to,
        date,
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        ...Object.fromEntries(
          Object.entries({
            busType: filters.busType,
            departureTime: filters.departureTime,
          }).filter(([_, v]) => v !== "")
        ),
        sortBy,
      });
      const { data } = await api.get(`/buses/search?${params}`);
      setBuses(data.results || []);
    } catch (error) {
      console.error("Failed to fetch buses:", error);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      busType: "",
      priceRange: [500, 2500],
      departureTime: "",
    });
  };

  if (!from || !to || !date) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-600">Missing search parameters. Please search again.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 btn-primary"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse bg-white dark:bg-gray-800">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
                <div className="w-32">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear All
            </button>
          </div>
          
          {/* Bus Type */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bus Type</label>
            <select
              value={filters.busType}
              onChange={(e) => setFilters({ ...filters, busType: e.target.value })}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Sleeper">Sleeper</option>
              <option value="Seater">Seater</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price Range (₹)</label>
            <PriceSlider
              min={500}
              max={2500}
              value={filters.priceRange}
              onChange={(range) => setFilters({ ...filters, priceRange: range })}
            />
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Departure Time</label>
            <div className="space-y-2">
              {[
                { value: "early", label: "Early Morning (6 AM - 12 PM)" },
                { value: "mid", label: "Afternoon (12 PM - 6 PM)" },
                { value: "late", label: "Evening (6 PM - 12 AM)" },
              ].map((time) => (
                <label key={time.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="departureTime"
                    value={time.value}
                    checked={filters.departureTime === time.value}
                    onChange={(e) => setFilters({ ...filters, departureTime: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{time.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Buses from {from} to {to}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Travel Date: {new Date(date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto md:w-64"
            >
              <option value="price">Price: Low to High</option>
              <option value="duration">Duration: Shortest</option>
              <option value="departure">Departure: Earliest</option>
              <option value="rating">Rating: Highest</option>
            </select>
          </div>

          {buses.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No buses found</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">Try adjusting your filters or search again</p>
              <button
                onClick={() => navigate("/")}
                className="btn-primary"
              >
                Search Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{bus.operatorName}</h3>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{bus.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {bus.busType}
                      </p>
                      <div className="flex flex-wrap gap-6 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>Bus No: <span className="font-semibold text-gray-800 dark:text-gray-100">{bus.busNumber || "TBD"}</span></span>
                        {bus.driver && (
                          <span>
                            Driver: <span className="font-semibold text-gray-800 dark:text-gray-100">{bus.driver.name}</span> • ⭐{" "}
                            {Number(bus.driver.rating ?? 4.7).toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span className="font-medium text-gray-800 dark:text-gray-100">{bus.departureTime}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{bus.arrivalTime}</span>
                        <span className="text-gray-500 dark:text-gray-400">({bus.duration})</span>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {bus.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="text-xs bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {bus.availableSeats} seats available
                      </p>
                    </div>
                    <div className="text-right md:text-right w-full md:w-auto">
                      <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">₹{bus.price}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">per seat</p>
                      <button
                        onClick={() => {
                          const params = new URLSearchParams({
                            date,
                            price: bus.price.toString(),
                            from,
                            to,
                            operator: bus.operatorName,
                            busType: bus.busType,
                            busNumber: bus.busNumber || "",
                            driverName: bus.driver?.name || "",
                            driverPhone: bus.driver?.phone || "",
                            driverRating: bus.driver?.rating?.toString() || "",
                            driverExperience: bus.driver?.experienceYears?.toString() || "",
                          });
                          navigate(`/seat-selection/${bus.id}?${params.toString()}`);
                        }}
                        className="btn-primary w-full md:w-auto"
                      >
                        View Seats
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;