import React from "react";
import { useNavigate } from "react-router-dom";
import CityAutocomplete from "../components/common/CityAutocomplete";
import ThemeToggle from "../components/home/layout/ThemeToggle";
import { useAuthStore } from "../store/authStore";
import api from "../api/client";

const HomePage: React.FC = () => {
  const [fromCity, setFromCity] = React.useState("");
  const [toCity, setToCity] = React.useState("");
  const [date, setDate] = React.useState("");
  const [returnDate, setReturnDate] = React.useState("");
  const [isRoundTrip, setIsRoundTrip] = React.useState(false);
  const [passengers, setPassengers] = React.useState(1);
  const [seatClass, setSeatClass] = React.useState("");
  const [recentBookings, setRecentBookings] = React.useState<any[]>([]);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // --- SVG background prepared safely for JSX (avoid nested-quote parsing issues) ---
  const svg = `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#ffffff" fill-opacity="0.05"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>`;
  const encoded = encodeURIComponent(svg);
  const dataUrl = `url("data:image/svg+xml,${encoded}")`;
  // -------------------------------------------------------------------------------

  const popularRoutes = [
    { from: "Delhi", to: "Mumbai", fromCode: "DEL", toCode: "BOM", price: "₹1,200", discount: "15%", savings: "₹180" },
    { from: "Bangalore", to: "Chennai", fromCode: "BLR", toCode: "MAA", price: "₹800", discount: "10%", savings: "₹80" },
    { from: "Kolkata", to: "Delhi", fromCode: "CCU", toCode: "DEL", price: "₹1,500", discount: "20%", savings: "₹300" },
    { from: "Mumbai", to: "Pune", fromCode: "BOM", toCode: "PNQ", price: "₹500", discount: "5%", savings: "₹25" },
    { from: "Hyderabad", to: "Bangalore", fromCode: "HYD", toCode: "BLR", price: "₹900", discount: "12%", savings: "₹108" },
    { from: "Delhi", to: "Jaipur", fromCode: "DEL", toCode: "JAI", price: "₹600", discount: "8%", savings: "₹48" },
  ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!fromCity || !toCity || !date) {
      alert("Please fill all required fields");
      return;
    }
    if (isRoundTrip && !returnDate) {
      alert("Please select return date for round trip");
      return;
    }
    const params = new URLSearchParams({
      from: fromCity,
      to: toCity,
      date: date,
      passengers: passengers.toString(),
    });
    if (seatClass) params.append("seatClass", seatClass);
    if (isRoundTrip && returnDate) {
      params.append("returnDate", returnDate);
    }
    navigate(`/search?${params.toString()}`);
  }

  function handleRouteClick(from: string, to: string) {
    setFromCity(from);
    setToCity(to);
    const params = new URLSearchParams({
      from,
      to,
      date: date || new Date(Date.now() + 86400000).toISOString().split("T")[0],
    });
    navigate(`/search?${params.toString()}`);
  }

  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchRecentBookings();
    }
  }, [user]);

  const fetchRecentBookings = async () => {
    try {
      const response = await api.get("/bookings/me");
      const bookings = response.data.bookings || [];
      // Get only confirmed bookings, limit to 3
      setRecentBookings(bookings.filter((b: any) => b.status === "confirmed").slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];
  const minReturnDate = date || minDate;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Top Promo Bar */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white py-2.5 shadow-md relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: dataUrl }}
          aria-hidden="true"
        />
        <div className="container-custom relative z-10">
          <div className="flex items-center justify-center gap-3 text-sm font-medium">
            <span className="text-xl">🚌</span>
            <p className="font-semibold">Book now and get up to <strong>20% OFF</strong> on your first booking!</p>
            <span className="hidden sm:inline">Use code:</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-bold border border-white/30">FIRST20</span>
            <button className="ml-2 underline font-bold hover:opacity-90 transition-opacity">Apply</button>
          </div>
        </div>
      </div>

      {/* Main Header - Clean VirtualBus Design */}
      <header className="bg-white dark:bg-neutral-900 shadow-sm sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">🚌</div>
              <span className="text-2xl font-bold text-neutral-900 dark:text-white">VirtualBus</span>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <button 
                onClick={() => navigate("/")}
                className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  // Scroll to search form on home page
                  const searchSection = document.getElementById("search-section");
                  if (searchSection) {
                    searchSection.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/");
                    setTimeout(() => {
                      const section = document.getElementById("search-section");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 100);
                  }
                }}
                className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Routes
              </button>
              <button 
                onClick={() => navigate("/my-bookings")}
                className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                My Bookings
              </button>
              <button 
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {user.name}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {user.email}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate("/my-bookings")}
                    className="px-5 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    My Bookings
                  </button>
                  <button 
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="px-5 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => navigate("/auth/login")}
                    className="px-5 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate("/auth/register")}
                    className="px-5 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Search Section - Clean Modern Design */}
      <section id="search-section" className="py-8 md:py-12 relative bg-gray-50 dark:bg-neutral-900">
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 md:p-10 border border-neutral-200 dark:border-neutral-700">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                  Search Buses
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">Book bus tickets in 3 easy steps</p>
              </div>
              
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Trip Type Toggle - Enhanced */}
                <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl w-fit mx-auto">
                  <button
                    type="button"
                    onClick={() => setIsRoundTrip(false)}
                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                      !isRoundTrip
                        ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-md scale-105"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    One Way
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRoundTrip(true)}
                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                      isRoundTrip
                        ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-md scale-105"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    Round Trip
                  </button>
                </div>

                {/* Search Fields Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <CityAutocomplete
                      value={fromCity}
                      onChange={setFromCity}
                      placeholder="From City"
                      label="From"
                      required
                    />
                  </div>
                  <div>
                    <CityAutocomplete
                      value={toCity}
                      onChange={setToCity}
                      placeholder="To City"
                      label="To"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Date of Journey <span className="text-primary-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={minDate}
                      className="w-full px-4 py-3 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/30 outline-none transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      required
                    />
                  </div>

                  {isRoundTrip && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Return Date <span className="text-primary-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={minReturnDate}
                        className="w-full px-4 py-3 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/30 outline-none transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        required={isRoundTrip}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Passengers
                    </label>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/30 outline-none transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Bus Type
                    </label>
                    <select
                      value={seatClass}
                      onChange={(e) => setSeatClass(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/30 outline-none transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    >
                      <option value="">All Types</option>
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                    </select>
                  </div>
                </div>

                {/* Search Button - Clean & Modern */}
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-lg flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🚌</span>
                  <span>Search Buses</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes - Clean Cards */}
      <section className="container-custom py-12 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Popular Routes</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">Book your favorite routes with exclusive discounts</p>
          </div>
          <button 
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              const dateStr = tomorrow.toISOString().split("T")[0];
              navigate(`/search?from=Delhi&to=Mumbai&date=${dateStr}`);
            }}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm flex items-center gap-1 transition-colors"
          >
            View All <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => handleRouteClick(route.from, route.to)}
              className="bg-white dark:bg-neutral-800 rounded-xl p-5 cursor-pointer group hover:shadow-lg transition-all duration-200 border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {route.fromCode}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{route.from}</p>
                </div>
                <div className="text-primary-500 text-xl font-bold">→</div>
                <div className="text-right">
                  <p className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {route.toCode}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{route.to}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Starting from</p>
                    <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{route.price}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{route.discount} OFF</span>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">
                      Save {route.savings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Bookings Section - Only for logged in users */}
      {user && recentBookings.length > 0 && (
        <section className="container-custom py-12 bg-gray-50 dark:bg-neutral-800">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
              Your Recent Bookings
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              Quick access to your upcoming trips
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                onClick={() => navigate(`/checkout/success?bookingId=${booking._id}&pnr=${booking._id}`)}
                className="bg-white dark:bg-neutral-800 rounded-xl p-5 cursor-pointer group hover:shadow-lg transition-all duration-200 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {booking.fromCity} → {booking.toCity}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      {new Date(booking.travelDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Seats</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">
                        {booking.seats.map((s: any) => s.seatNumber).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total</p>
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        ₹{booking.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/my-bookings")}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm flex items-center gap-1 transition-colors mx-auto"
            >
              View All Bookings <span>→</span>
            </button>
          </div>
        </section>
      )}

      {/* Features Section - Clean Design */}
      <section className="bg-gray-50 dark:bg-neutral-800 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Why Choose VBS?</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">Experience the best in bus travel booking</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "🔒", title: "Safe & Secure", desc: "Bank-level encryption for all transactions", color: "from-blue-500 to-blue-600" },
              { icon: "💺", title: "Choose Your Seat", desc: "Interactive seat map for preferred selection", color: "from-green-500 to-green-600" },
              { icon: "💰", title: "Best Prices", desc: "Exclusive discounts and competitive rates", color: "from-yellow-500 to-yellow-600" },
              { icon: "⚡", title: "Instant Booking", desc: "Get confirmed tickets in seconds", color: "from-purple-500 to-purple-600" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-neutral-800 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 border border-neutral-200 dark:border-neutral-700">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section - Clean Design */}
      <section id="offers" className="container-custom py-12 bg-white dark:bg-neutral-900">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Special Offers</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">Grab these amazing deals before they expire!</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "First Booking", discount: "20% OFF", code: "FIRST20", gradient: "from-primary-500 via-primary-600 to-primary-700", icon: "🎁", desc: "For new users only" },
            { title: "Weekend Special", discount: "15% OFF", code: "WEEKEND15", gradient: "from-accent-500 via-accent-600 to-accent-700", icon: "🎉", desc: "Valid on weekends" },
            { title: "Group Booking", discount: "10% OFF", code: "GROUP10", gradient: "from-green-500 via-green-600 to-green-700", icon: "👥", desc: "Book 5+ tickets" },
          ].map((offer, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${offer.gradient} rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">{offer.icon}</div>
                <h3 className="font-bold text-2xl mb-2">{offer.title}</h3>
                <p className="text-5xl font-black mb-2">{offer.discount}</p>
                <p className="text-sm opacity-90 mb-4">{offer.desc}</p>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl mb-4">
                  <p className="text-xs opacity-90 mb-1">Use code:</p>
                  <p className="font-black text-lg">{offer.code}</p>
                </div>
                <button className="bg-white/30 hover:bg-white/40 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition-all w-full">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white dark:bg-neutral-900 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Contact Us</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">Get in touch with our support team</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Khushi Kumari</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Support & Customer Service</p>
                <div className="space-y-2 text-sm">
                  <p className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold">Email:</span>{" "}
                    <a href="mailto:khushi.kumari@vbs.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                      khushi.kumari@vbs.com
                    </a>
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold">Phone:</span>{" "}
                    <a href="tel:+917845632109" className="text-primary-600 dark:text-primary-400 hover:underline">
                      +91 78456 32109
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Prakhar Verma</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Technical Support & Suggestions</p>
                <div className="space-y-2 text-sm">
                  <p className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold">Email:</span>{" "}
                    <a href="mailto:prakhar.verma@vbs.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                      prakhar.verma@vbs.com
                    </a>
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold">Phone:</span>{" "}
                    <a href="tel:+919876123456" className="text-primary-600 dark:text-primary-400 hover:underline">
                      +91 98761 23456
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              For general inquiries, support, or suggestions, feel free to reach out to us
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="mailto:support@vbs.com" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                📧 support@vbs.com
              </a>
              <span className="text-neutral-400">|</span>
              <a href="tel:+911800123456" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                📞 1800-123-456
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Professional */}
      <footer className="bg-neutral-900 text-white py-12 mt-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                  VBS
                </div>
                <span className="font-bold text-lg">Virtual Bus Services</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Your trusted partner for bus bookings across India. Book tickets easily, travel safely, and enjoy the journey.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="/my-bookings" className="hover:text-white transition-colors">My Bookings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cancel Ticket</a></li>
                <li><a href="#offers" className="hover:text-white transition-colors">Offers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Print Ticket</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Support</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Follow Us</h3>
              <div className="flex gap-3 mb-6">
                {["📘", "🐦", "📷", "💼"].map((icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 bg-neutral-800 hover:bg-primary-600 rounded-xl flex items-center justify-center text-xl transition-all transform hover:scale-110">
                    {icon}
                  </a>
                ))}
              </div>
              <p className="text-sm text-neutral-400 mb-3">Download our app</p>
              <div className="flex gap-2">
                <button className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex-1">
                  📱 App Store
                </button>
                <button className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex-1">
                  🤖 Play Store
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800 text-center text-sm text-neutral-500">
            <p>&copy; 2024 Virtual Bus Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
