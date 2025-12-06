import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";

interface Booking {
  _id: string;
  operatorName: string;
  busNumber?: string;
  fromCity: string;
  toCity: string;
  travelDate: string;
  seats: Array<{
    seatNumber: string;
    price: number;
    class: string;
  }>;
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  status: "pending" | "awaiting_payment" | "confirmed" | "cancelled" | "refunded";
  createdAt: string;
  paymentProvider?: string;
  paymentId?: string;
  driver?: {
    name: string;
    phone: string;
    experienceYears?: number;
    rating?: number;
  };
}

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/bookings/me");
      const bookingsData = response.data.bookings || [];
      console.log("Fetched bookings:", bookingsData);
      setBookings(bookingsData);
    } catch (err: any) {
      console.error("Failed to fetch bookings:", err);
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (bookingId: string) => {
    try {
      // Try to fetch full booking details from API
      let booking = bookings.find((b) => b._id === bookingId);
      
      if (!booking) {
        alert("Booking not found");
        return;
      }

      // Try to fetch additional details from API
      try {
        const response = await api.get(`/bookings/${bookingId}`);
        booking = response.data.booking;
      } catch (err) {
        console.warn("Could not fetch booking details, using cached data");
      }

      const ticketWindow = window.open("", "_blank");
      if (!ticketWindow) {
        alert("Please allow pop-ups to download the ticket");
        return;
      }

      const ticketHTML = generateTicketHTML(booking);
      ticketWindow.document.write(ticketHTML);
      ticketWindow.document.close();

      // Wait for content to load, then print
      setTimeout(() => {
        ticketWindow.print();
      }, 500);
    } catch (error: any) {
      console.error("Error downloading ticket:", error);
      alert(`Failed to download ticket: ${error.message || "Unknown error"}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "refunded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "awaiting_payment":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            View and manage your bus ticket bookings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              No bookings yet
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Start booking your bus tickets to see them here
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary"
            >
              Book a Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        {booking.fromCity} → {booking.toCity}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-1">Operator</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {booking.operatorName}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-1">Bus Number</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {booking.busNumber || "TBD"}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-1">Travel Date</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {formatDate(booking.travelDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-1">Seats</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {booking.seats.map((s) => s.seatNumber).join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-1">Total Amount</p>
                        <p className="font-semibold text-primary-600 dark:text-primary-400">
                          ₹{booking.total.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {booking.driver && (
                      <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
                        Driver: <span className="font-semibold text-neutral-900 dark:text-white">{booking.driver.name}</span> ({booking.driver.experienceYears || 5}+ yrs, ⭐{" "}
                        {Number(booking.driver.rating || 4.7).toFixed(1)}) • 📞 {booking.driver.phone}
                      </div>
                    )}

                    <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                      Booking ID: {booking._id} | Booked on: {formatDate(booking.createdAt)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => handleDownloadTicket(booking._id)}
                        className="btn-secondary whitespace-nowrap"
                      >
                        📥 Download Ticket
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/checkout/success?bookingId=${booking._id}&pnr=${booking._id}`)}
                      className="btn-outline whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Generate printable ticket HTML
const generateTicketHTML = (booking: Booking): string => {
  const travelDate = new Date(booking.travelDate);
  const formattedDate = travelDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bus Ticket - ${booking._id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    .ticket {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .ticket-header {
      background: linear-gradient(135deg, #B91C1C 0%, #991B1B 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .ticket-header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }
    .ticket-body {
      padding: 30px;
    }
    .ticket-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px dashed #e5e5e5;
    }
    .ticket-section:last-child {
      border-bottom: none;
    }
    .route-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .city {
      text-align: center;
    }
    .city-name {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 5px;
    }
    .arrow {
      font-size: 32px;
      color: #B91C1C;
      margin: 0 20px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    .detail-item {
      margin-bottom: 15px;
    }
    .detail-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .detail-value {
      font-size: 16px;
      font-weight: bold;
      color: #1f2937;
    }
    .seats-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    .seat-badge {
      background: #f3f4f6;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      color: #1f2937;
    }
    .qr-placeholder {
      width: 150px;
      height: 150px;
      background: #f3f4f6;
      border: 2px dashed #d1d5db;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px auto;
      border-radius: 8px;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    @media print {
      body { background: white; padding: 0; }
      .ticket { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <h1>🚌 Virtual Bus Services</h1>
      <p>E-Ticket / Booking Confirmation</p>
    </div>
    
    <div class="ticket-body">
      <div class="ticket-section">
        <div class="route-info">
          <div class="city">
            <div class="city-name">${booking.fromCity}</div>
            <div style="font-size: 12px; color: #6b7280;">FROM</div>
          </div>
          <div class="arrow">→</div>
          <div class="city">
            <div class="city-name">${booking.toCity}</div>
            <div style="font-size: 12px; color: #6b7280;">TO</div>
          </div>
        </div>
      </div>

      <div class="ticket-section">
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Booking ID / PNR</div>
            <div class="detail-value">${booking._id}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Travel Date</div>
            <div class="detail-value">${formattedDate}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Operator</div>
            <div class="detail-value">${booking.operatorName}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Bus Number</div>
            <div class="detail-value">${booking.busNumber || "VBS-0001"}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Status</div>
            <div class="detail-value">${booking.status.toUpperCase()}</div>
          </div>
          ${
            booking.driver
              ? `
          <div class="detail-item">
            <div class="detail-label">Driver</div>
            <div class="detail-value">${booking.driver.name} (⭐ ${Number(booking.driver.rating || 4.7).toFixed(1)})</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Driver Contact</div>
            <div class="detail-value">${booking.driver.phone}</div>
          </div>
          `
              : ""
          }
        </div>
      </div>

      <div class="ticket-section">
        <div class="detail-label">Seat Numbers</div>
        <div class="seats-list">
          ${booking.seats.map((seat) => `<span class="seat-badge">${seat.seatNumber}</span>`).join("")}
        </div>
      </div>

      <div class="ticket-section">
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Subtotal</div>
            <div class="detail-value">₹${booking.subtotal.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Tax (GST)</div>
            <div class="detail-value">₹${booking.tax.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Service Fee</div>
            <div class="detail-value">₹${booking.fees.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Total Amount</div>
            <div class="detail-value" style="color: #B91C1C; font-size: 20px;">₹${booking.total.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div class="qr-placeholder">
        <div style="text-align: center; color: #9ca3af;">
          <div style="font-size: 24px; margin-bottom: 5px;">📱</div>
          <div style="font-size: 10px;">QR Code</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>Important Instructions:</strong></p>
      <p>• Please arrive at the bus stop 15 minutes before departure</p>
      <p>• Carry a valid ID proof for verification</p>
      <p>• Show this ticket or PNR number at the time of boarding</p>
      <p style="margin-top: 15px;">For support, contact: support@vbs.com | 1800-123-456</p>
    </div>
  </div>
</body>
</html>
  `;
};

export default MyBookingsPage;
