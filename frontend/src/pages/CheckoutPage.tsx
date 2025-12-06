import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";

interface PassengerInfo {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  seatNumber: string;
}

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const scheduleId = searchParams.get("scheduleId");
  const seatsParam = searchParams.get("seats");
  const date = searchParams.get("date");
  const totalPrice = parseFloat(searchParams.get("price") || "0");
  const routeFrom = searchParams.get("from") || "From City";
  const routeTo = searchParams.get("to") || "To City";
  const operatorNameParam = searchParams.get("operator") || "VBS Travels";
  const busNumberParam = searchParams.get("busNumber") || "VBS-0001";
  const busTypeParam = searchParams.get("busType") || "AC Sleeper";
  const driverNameParam = searchParams.get("driverName") || "Lead Captain";
  const driverPhoneParam = searchParams.get("driverPhone") || "+91 90000 00000";
  const driverRatingRaw = parseFloat(searchParams.get("driverRating") || "4.7");
  const driverRatingParam = Number.isFinite(driverRatingRaw) ? driverRatingRaw : 4.7;
  const driverExperienceRaw = parseInt(searchParams.get("driverExperience") || "5", 10);
  const driverExperienceParam = Number.isFinite(driverExperienceRaw) ? driverExperienceRaw : 5;

  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const selectedSeats = seatsParam?.split(",") || [];

  // Available promo codes
  const promoCodes: Record<string, { discount: number; description: string }> = {
    FIRST20: { discount: 20, description: "20% off on first booking" },
    WEEKEND15: { discount: 15, description: "15% off on weekends" },
    GROUP10: { discount: 10, description: "10% off on group bookings (5+ tickets)" },
    SAVE500: { discount: 500, description: "Flat ₹500 off" },
    VBS2024: { discount: 12, description: "12% off on all bookings" },
  };

  useEffect(() => {
    if (!user) {
      setError("Please login to complete booking");
      setTimeout(() => navigate("/auth/login"), 2000);
      return;
    }
    if (!scheduleId || !seatsParam || !date) {
      setError("Invalid booking details. Please start over.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    // Initialize passengers array
    setPassengers(
      selectedSeats.map((seat) => ({
        name: "",
        age: 0,
        gender: "male" as const,
        seatNumber: seat,
      }))
    );
  }, [scheduleId, seatsParam, date, navigate]);

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string | number) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleContactChange = (field: string, value: string) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  const validateForm = () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      setError("Please fill all contact details");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(contactInfo.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }

    for (const passenger of passengers) {
      if (!passenger.name || passenger.age < 1 || passenger.age > 120) {
        setError("Please fill all passenger details correctly");
        return false;
      }
    }

    return true;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Mock OTP sending - In production, call API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpSent(true);
      // In production: const { data } = await api.post("/auth/send-otp", { phone: contactInfo.phone });
      // For demo, set OTP to "123456"
      alert("OTP sent to your phone. For demo, use OTP: 123456");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    // Mock OTP verification - In production, call API
    if (otp === "123456" || otp === "000000") {
      setOtpVerified(true);
      setError(null);
    } else {
      setError("Invalid OTP. Please try again. (Demo: Use 123456)");
    }
  };

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoCode.toUpperCase().trim();
    
    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }

    const promo = promoCodes[code];
    if (!promo) {
      setPromoError("Invalid promo code");
      return;
    }

    // Check if group booking promo
    if (code === "GROUP10" && selectedSeats.length < 5) {
      setPromoError("Group booking promo requires 5+ tickets");
      return;
    }

    setAppliedPromo({ code, discount: promo.discount });
    setPromoCode("");
    setPromoError(null);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError(null);
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    const baseFare = totalPrice;
    if (appliedPromo.discount >= 100) {
      // Flat discount
      return Math.min(appliedPromo.discount, baseFare);
    } else {
      // Percentage discount
      return (baseFare * appliedPromo.discount) / 100;
    }
  };

  const discount = calculateDiscount();
  const subtotal = totalPrice;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * 0.18;
  const serviceFee = selectedSeats.length > 0 ? 50 : 0;
  const finalTotal = taxableAmount + tax + serviceFee;

  const handlePayment = async () => {
    if (!otpVerified) {
      setError("Please verify OTP first");
      return;
    }

    if (!user) {
      setError("Please login to complete booking");
      navigate("/auth/login");
      return;
    }

    if (!scheduleId || !date || selectedSeats.length === 0) {
      setError("Missing required booking information. Please start over.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create booking in backend (mock payment flow)
      const bookingResponse = await api.post("/bookings", {
        scheduleId,
        date,
        seats: selectedSeats,
        fromCity: routeFrom,
        toCity: routeTo,
        operatorName: operatorNameParam,
        busNumber: busNumberParam,
        driver: {
          name: driverNameParam,
          phone: driverPhoneParam,
          rating: driverRatingParam,
          experienceYears: driverExperienceParam,
        },
        passengers,
        contactInfo,
        totalPrice: Math.max(0, finalTotal),
        couponCode: appliedPromo?.code,
      });

      const booking = bookingResponse.data.booking;
      const bookingId = booking?._id || booking?.id;

      if (!bookingId) {
        throw new Error("Failed to create booking - no booking ID returned");
      }

      // Simulate payment processing delay (demo only)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const bookingData = {
        ...booking,
        passengers,
        contactInfo,
        operatorName: operatorNameParam,
        busNumber: busNumberParam,
        busType: busTypeParam,
        driver: {
          name: driverNameParam,
          phone: driverPhoneParam,
          rating: driverRatingParam,
          experienceYears: driverExperienceParam,
        },
        departureTime: "08:00 AM",
        arrivalTime: "02:00 PM",
        duration: "6h 0m",
      };

      const bookingDataStr = encodeURIComponent(JSON.stringify(bookingData));
      navigate(`/checkout/success?bookingId=${bookingId}&pnr=${bookingId}&data=${bookingDataStr}`);
    } catch (err: any) {
      console.error("Booking error:", err);
      let errorMessage = "Payment failed. Please try again.";
      
      if (err.response) {
        const errorData = err.response.data;
        if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (err.response.status === 401) {
          errorMessage = "Please login to complete booking";
        } else if (err.response.status === 400) {
          errorMessage = errorData?.error || "Invalid booking data. Please check your details.";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        errorMessage = err.message || "An unexpected error occurred.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!scheduleId || !seatsParam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-600">Invalid booking details. Please start over.</p>
        <button onClick={() => navigate("/")} className="btn-primary mt-4">
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-600 dark:text-primary-400 hover:underline mb-2"
        >
          ← Back to Seat Selection
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Complete Your Booking</h1>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => handleContactChange("name", e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  className="input-field"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                  className="input-field"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="btn-primary mt-4 w-full"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <div className="mt-4 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="input-field flex-1"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otpVerified}
                    className="btn-primary"
                  >
                    {otpVerified ? "✓ Verified" : "Verify"}
                  </button>
                </div>
                {otpVerified && (
                  <p className="text-sm text-green-600 dark:text-green-400">✓ OTP verified successfully</p>
                )}
              </div>
            )}
          </div>

          {/* Passenger Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Passenger Details ({passengers.length})
            </h2>
            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                    Passenger {index + 1} - Seat {passenger.seatNumber}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                        className="input-field"
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={passenger.age || ""}
                        onChange={(e) => handlePassengerChange(index, "age", parseInt(e.target.value) || 0)}
                        className="input-field"
                        placeholder="Age"
                        min={1}
                        max={120}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, "gender", e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
            <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-100">Booking Summary</h3>
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 text-sm mb-4 space-y-1">
              <p className="text-gray-600 dark:text-gray-300">
                Route: <span className="font-semibold text-gray-900 dark:text-white">{routeFrom}</span> →{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{routeTo}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Operator: <span className="font-semibold text-gray-900 dark:text-white">{operatorNameParam}</span> • Bus No:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{busNumberParam}</span> ({busTypeParam})
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Driver: <span className="font-semibold text-gray-900 dark:text-white">{driverNameParam}</span> (
                {driverExperienceParam}+ yrs) • 📞 {driverPhoneParam}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Rating: ⭐ {driverRatingParam.toFixed(1)}</p>
            </div>
            
            {/* Promo Code Section */}
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              {!appliedPromo ? (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="input-field flex-1 text-sm"
                      placeholder="Enter code"
                      maxLength={20}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="btn-secondary text-sm whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{promoError}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Try: FIRST20, WEEKEND15, GROUP10, SAVE500, VBS2024
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                      ✓ {appliedPromo.code} Applied
                    </span>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-xs text-green-600 dark:text-green-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    {promoCodes[appliedPromo.code]?.description}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Seats ({selectedSeats.length})</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Service Fee</span>
                <span>₹{serviceFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg text-gray-800 dark:text-gray-100">
                <span>Total</span>
                <span className="text-primary-600 dark:text-primary-400">₹{Math.max(0, finalTotal).toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  You saved ₹{discount.toFixed(2)}!
                </p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Selected Seats:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || !otpVerified}
              className="btn-primary w-full"
            >
              {loading ? "Processing Payment..." : `Pay ₹${Math.max(0, finalTotal).toFixed(2)}`}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              🔒 Demo payment only – no real charges applied
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;