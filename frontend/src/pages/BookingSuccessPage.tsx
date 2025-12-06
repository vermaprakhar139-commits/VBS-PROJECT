import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/client";

const BookingSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const bookingId = searchParams.get("bookingId");
  const pnr = searchParams.get("pnr") || bookingId;
  const bookingDataStr = searchParams.get("data");

  const [copied, setCopied] = useState(false);
  const [localBookingData, setLocalBookingData] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  React.useEffect(() => {
    if (bookingDataStr) {
      try {
        const data = JSON.parse(decodeURIComponent(bookingDataStr));
        setLocalBookingData(data);
        setBookingDetails(data);
      } catch (err) {
        console.error("Failed to parse booking data:", err);
      }
    }
  }, [bookingDataStr]);

  useEffect(() => {
    if (!bookingId || localBookingData) return;

    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}`);
        setBookingDetails(response.data.booking);
      } catch (error) {
        console.warn("Failed to fetch booking details:", error);
      }
    };

    fetchBooking();
  }, [bookingId, localBookingData]);

  useEffect(() => {
    if (!bookingId) {
      navigate("/");
    }
  }, [bookingId, navigate]);

  const handleCopyPNR = () => {
    if (pnr) {
      navigator.clipboard.writeText(pnr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTicket = async () => {
    if (!bookingId) {
      alert("Booking ID not found");
      return;
    }

    try {
      let booking = bookingDetails || localBookingData;

      // Try to fetch booking details from API if we don't have local data
      if (!booking) {
        try {
          const response = await api.get(`/bookings/${bookingId}`);
          booking = response.data.booking;
        } catch (err: any) {
          console.warn("Could not fetch booking details from API:", err);
          // If API fails and no local data, try to use basic info
          if (!booking) {
            booking = {
              _id: bookingId,
              fromCity: "From City",
              toCity: "To City",
              operatorName: "VBS Travels",
              busNumber: "VBS-0001",
              driver: {
                name: "On-duty Captain",
                phone: "+91 90000 00000",
                experienceYears: 5,
                rating: 4.7,
              },
              travelDate: new Date().toISOString(),
              seats: [],
              total: 0,
              subtotal: 0,
              tax: 0,
              fees: 0,
              status: "confirmed",
            };
          }
        }
      }

      // Merge local data with API data (local data has passenger/contact info)
      if (localBookingData && booking) {
        booking = { 
          ...booking, 
          passengers: localBookingData.passengers || booking.passengers || [],
          contactInfo: localBookingData.contactInfo || booking.contactInfo || {},
          departureTime: localBookingData.departureTime || booking.departureTime || "08:00 AM",
          arrivalTime: localBookingData.arrivalTime || booking.arrivalTime || "02:00 PM",
          duration: localBookingData.duration || booking.duration || "6h 0m",
          operatorName: localBookingData.operatorName || booking.operatorName,
          busNumber: localBookingData.busNumber || booking.busNumber,
          driver: localBookingData.driver || booking.driver,
        };
      }

      // Ensure we have booking data
      if (!booking) {
        alert("Booking data not available. Please try again.");
        return;
      }

      // Generate ticket HTML
      const ticketWindow = window.open("", "_blank");
      if (!ticketWindow) {
        alert("Please allow pop-ups to download the ticket");
        return;
      }

      const ticketHTML = generateTicketHTML(bookingId, pnr, booking);
      ticketWindow.document.write(ticketHTML);
      ticketWindow.document.close();

      // Wait for content to load, then print
      setTimeout(() => {
        ticketWindow.print();
      }, 500);
    } catch (error: any) {
      console.error("Error downloading ticket:", error);
      alert(`Failed to download ticket: ${error.message || "Unknown error"}. Please try again.`);
    }
  };

  if (!bookingId) {
    return null;
  }

  const displayBooking = bookingDetails || localBookingData;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your bus ticket has been booked successfully
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Booking ID</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{bookingId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">PNR Number</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{pnr}</p>
              <button
                onClick={handleCopyPNR}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                title="Copy PNR"
              >
                {copied ? "✓ Copied" : "📋 Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">What's Next?</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
              <li>Your booking confirmation has been sent to your email</li>
              <li>Please arrive at the bus stop 15 minutes before departure</li>
              <li>Carry a valid ID proof for verification</li>
              <li>Show your PNR number at the time of boarding</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadTicket}
              className="btn-secondary flex-1"
            >
              📥 Download Ticket
            </button>
            <button
              onClick={() => navigate("/my-bookings")}
              className="btn-secondary flex-1"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn-primary flex-1"
            >
              Book Another Trip
            </button>
          </div>
        </div>
      </div>

      {displayBooking && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Trip & Driver Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Route</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {displayBooking.fromCity || "From City"} → {displayBooking.toCity || "To City"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Operator</p>
              <p className="font-semibold text-gray-900 dark:text-white">{displayBooking.operatorName || "VBS Travels"}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Bus Number</p>
              <p className="font-semibold text-gray-900 dark:text-white">{displayBooking.busNumber || "VBS-0001"}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Driver</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {displayBooking.driver?.name || "On-duty Captain"} (⭐{" "}
                {Number(displayBooking.driver?.rating || 4.7).toFixed(1)}) • {displayBooking.driver?.experienceYears || 5}+ yrs exp
              </p>
              {displayBooking.driver?.phone && (
                <p className="text-xs text-gray-500 dark:text-gray-400">📞 {displayBooking.driver.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Need Help?</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          For any queries or support, contact us at{" "}
          <a href="mailto:support@vbs.com" className="underline">
            support@vbs.com
          </a>{" "}
          or call{" "}
          <a href="tel:+911800123456" className="underline">
            1800-123-456
          </a>
        </p>
      </div>
    </div>
  );
};

// Generate printable ticket HTML
const generateTicketHTML = (bookingId: string, pnr: string, booking: any): string => {
  const travelDate = booking?.travelDate 
    ? new Date(booking.travelDate).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const fromCity = booking?.fromCity || "From City";
  const toCity = booking?.toCity || "To City";
  const operatorName = booking?.operatorName || "Bus Operator";
  const busNumber = booking?.busNumber || "VBS-0001";
  const driver = booking?.driver || {};
  const seats = booking?.seats || [];
  const total = booking?.total || 0;
  const subtotal = booking?.subtotal || 0;
  const tax = booking?.tax || 0;
  const fees = booking?.fees || 0;
  const status = booking?.status || "confirmed";
  
  // Extract passenger details
  const passengers = booking?.passengers || [];
  const contactInfo = booking?.contactInfo || {};
  
  // Default times if not available
  const departureTime = booking?.departureTime || "08:00 AM";
  const arrivalTime = booking?.arrivalTime || "02:00 PM";
  const duration = booking?.duration || "6h 0m";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bus Ticket - ${bookingId}</title>
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
            <div class="city-name">${fromCity}</div>
            <div style="font-size: 12px; color: #6b7280;">FROM</div>
          </div>
          <div class="arrow">→</div>
          <div class="city">
            <div class="city-name">${toCity}</div>
            <div style="font-size: 12px; color: #6b7280;">TO</div>
          </div>
        </div>
      </div>

      <div class="ticket-section">
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Booking ID / PNR</div>
            <div class="detail-value">${pnr}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Travel Date</div>
            <div class="detail-value">${travelDate}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Operator</div>
            <div class="detail-value">${operatorName}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Bus Number</div>
            <div class="detail-value">${busNumber}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Status</div>
            <div class="detail-value">${status.toUpperCase()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Departure Time</div>
            <div class="detail-value">${departureTime}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Arrival Time</div>
            <div class="detail-value">${arrivalTime}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Duration</div>
            <div class="detail-value">${duration}</div>
          </div>
          ${driver?.name ? `
          <div class="detail-item">
            <div class="detail-label">Driver</div>
            <div class="detail-value">${driver.name} ${driver.rating ? `(⭐ ${Number(driver.rating).toFixed(1)})` : ""}</div>
          </div>
          ` : ""}
          ${driver?.phone ? `
          <div class="detail-item">
            <div class="detail-label">Driver Contact</div>
            <div class="detail-value">${driver.phone}</div>
          </div>
          ` : ""}
        </div>
      </div>

      ${contactInfo.name || contactInfo.email || contactInfo.phone ? `
      <div class="ticket-section">
        <div class="detail-label">Contact Information</div>
        <div class="details-grid">
          ${contactInfo.name ? `
          <div class="detail-item">
            <div class="detail-label">Passenger Name</div>
            <div class="detail-value">${contactInfo.name}</div>
          </div>
          ` : ""}
          ${contactInfo.email ? `
          <div class="detail-item">
            <div class="detail-label">Email</div>
            <div class="detail-value">${contactInfo.email}</div>
          </div>
          ` : ""}
          ${contactInfo.phone ? `
          <div class="detail-item">
            <div class="detail-label">Phone</div>
            <div class="detail-value">${contactInfo.phone}</div>
          </div>
          ` : ""}
        </div>
      </div>
      ` : ""}

      ${passengers.length > 0 ? `
      <div class="ticket-section">
        <div class="detail-label">Passenger Details</div>
        ${passengers.map((p: any, idx: number) => `
        <div style="margin-bottom: 15px; padding: 15px; background: #f9fafb; border-radius: 8px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">Passenger ${idx + 1}</div>
          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Name</div>
              <div class="detail-value">${p.name || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Age</div>
              <div class="detail-value">${p.age || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Gender</div>
              <div class="detail-value">${p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Seat Number</div>
              <div class="detail-value">${p.seatNumber || seats[idx]?.seatNumber || "N/A"}</div>
            </div>
          </div>
        </div>
        `).join("")}
      </div>
      ` : ""}

      ${seats.length > 0 ? `
      <div class="ticket-section">
        <div class="detail-label">Seat Numbers</div>
        <div class="seats-list">
          ${seats.map((seat: any) => `<span class="seat-badge">${seat.seatNumber || seat}</span>`).join("")}
        </div>
      </div>
      ` : ""}

      <div class="ticket-section">
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Subtotal</div>
            <div class="detail-value">₹${subtotal.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Tax (GST)</div>
            <div class="detail-value">₹${tax.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Service Fee</div>
            <div class="detail-value">₹${fees.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Total Amount</div>
            <div class="detail-value" style="color: #B91C1C; font-size: 20px;">₹${total.toLocaleString()}</div>
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

export default BookingSuccessPage;