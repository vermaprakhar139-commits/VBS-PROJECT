import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import SeatMap from "../components/home/buses/SeatMap";

interface BusDetails {
  id: string;
  operatorName: string;
  busType: string;
  busNumber: string;
  fromCity: string;
  toCity: string;
  price: number;
  driver: {
    name: string;
    phone: string;
    rating?: number;
    experienceYears?: number;
  };
}

const SeatSelectionPage: React.FC = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const date = searchParams.get("date") || "";
  const fromCity = searchParams.get("from") || "From City";
  const toCity = searchParams.get("to") || "To City";
  const operatorNameParam = searchParams.get("operator") || "VBS Travels";
  const busTypeParam = searchParams.get("busType") || "AC Sleeper";
  const priceParam = parseFloat(searchParams.get("price") || "1200");

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [busDetails, setBusDetails] = useState<BusDetails | null>(null);
  const [blockedSeats, setBlockedSeats] = useState<string[]>([]);
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!scheduleId) return;

    setLoading(true);
    setBusDetails({
      id: scheduleId,
      operatorName: operatorNameParam,
      busType: busTypeParam,
      busNumber: searchParams.get("busNumber") || "VBS-0001",
      fromCity,
      toCity,
      price: priceParam,
      driver: {
        name: searchParams.get("driverName") || "Lead Captain",
        phone: searchParams.get("driverPhone") || "+91 90000 00000",
        rating: searchParams.get("driverRating") ? parseFloat(searchParams.get("driverRating") as string) : undefined,
        experienceYears: searchParams.get("driverExperience")
          ? parseInt(searchParams.get("driverExperience") as string, 10)
          : undefined,
      },
    });
    setPricePerSeat(priceParam || 1200);
    setBlockedSeats(["1A", "2B", "5C", "10D", "3A", "7B"]);
    setLoading(false);
  }, [scheduleId, operatorNameParam, busTypeParam, fromCity, toCity, priceParam, searchParams]);

  const subtotal = selectedSeats.length * pricePerSeat;
  const tax = subtotal * 0.18; // 18% GST
  const serviceFee = selectedSeats.length > 0 ? 50 : 0;
  const total = subtotal + tax + serviceFee;

  const handleContinue = () => {
    if (!scheduleId) {
      alert("Missing schedule information. Please select a bus again.");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    const baseFare = subtotal;
    const params = new URLSearchParams({
      scheduleId: scheduleId || "",
      seats: selectedSeats.join(","),
      date,
      price: baseFare.toFixed(2),
      from: fromCity,
      to: toCity,
      operator: busDetails?.operatorName || "VBS Travels",
      busNumber: busDetails?.busNumber || "",
      busType: busDetails?.busType || "",
      driverName: busDetails?.driver.name || "",
      driverPhone: busDetails?.driver.phone || "",
      driverRating: (busDetails?.driver.rating || 0).toString(),
      driverExperience: (busDetails?.driver.experienceYears || 0).toString(),
    });
    navigate(`/checkout?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!busDetails) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-red-600">Bus not found</p>
        <button onClick={() => navigate("/")} className="btn-primary mt-4">
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-600 dark:text-primary-400 hover:underline mb-2"
        >
          ← Back to Results
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Select Your Seats</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {busDetails.operatorName} • {busDetails.busType} • Bus No: {busDetails.busNumber}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Driver: <span className="font-semibold text-gray-800 dark:text-gray-100">{busDetails.driver.name}</span>{" "}
          ({busDetails.driver.experienceYears || 5}+ yrs exp) • Contact: {busDetails.driver.phone}
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <SeatMap
              rows={10}
              cols={4}
              blockedSeats={blockedSeats}
              selected={selectedSeats}
              onChange={setSelectedSeats}
              pricePerSeat={pricePerSeat}
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">Fare Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Seats ({selectedSeats.length})</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Service Fee</span>
                <span>₹{serviceFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg text-gray-800 dark:text-gray-100">
                <span>Total</span>
                <span className="text-primary-600 dark:text-primary-400">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Selected Seats:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-sm"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className="btn-primary w-full"
            >
              Continue to Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;