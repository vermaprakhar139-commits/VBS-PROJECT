import{r as o,a as k,d as w,b as h,j as e}from"./index-Zpq7bZAM.js";const D=()=>{const[a,x]=o.useState([]),[c,d]=o.useState(!0),[m,v]=o.useState(null),l=k(),p=w(t=>t.user);o.useEffect(()=>{if(!p){l("/auth/login");return}g()},[p,l]);const g=async()=>{var t,s,r,n;d(!0),v(null);try{const b=(await h.get("/bookings/me")).data.bookings||[];console.log("Fetched bookings:",b),x(b)}catch(i){console.error("Failed to fetch bookings:",i),v(((s=(t=i.response)==null?void 0:t.data)==null?void 0:s.error)||((n=(r=i.response)==null?void 0:r.data)==null?void 0:n.message)||"Failed to load bookings")}finally{d(!1)}},f=async t=>{try{let s=a.find(i=>i._id===t);if(!s){alert("Booking not found");return}try{s=(await h.get(`/bookings/${t}`)).data.booking}catch{console.warn("Could not fetch booking details, using cached data")}const r=window.open("","_blank");if(!r){alert("Please allow pop-ups to download the ticket");return}const n=N(s);r.document.write(n),r.document.close(),setTimeout(()=>{r.print()},500)}catch(s){console.error("Error downloading ticket:",s),alert(`Failed to download ticket: ${s.message||"Unknown error"}`)}},y=t=>{switch(t){case"confirmed":return"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";case"cancelled":return"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";case"refunded":return"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";case"awaiting_payment":return"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";default:return"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"}},u=t=>new Date(t).toLocaleDateString("en-IN",{weekday:"short",year:"numeric",month:"short",day:"numeric"});return c?e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin mx-auto"}),e.jsx("p",{className:"mt-4 text-gray-600 dark:text-gray-400",children:"Loading bookings..."})]})}):e.jsx("div",{className:"min-h-screen bg-gray-50 dark:bg-neutral-900 py-8",children:e.jsxs("div",{className:"container-custom",children:[e.jsxs("div",{className:"mb-8",children:[e.jsx("h1",{className:"text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2",children:"My Bookings"}),e.jsx("p",{className:"text-neutral-600 dark:text-neutral-400 text-lg",children:"View and manage your bus ticket bookings"})]}),m&&e.jsx("div",{className:"mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg",children:m}),a.length===0?e.jsxs("div",{className:"bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-12 text-center",children:[e.jsx("div",{className:"text-6xl mb-4",children:"🎫"}),e.jsx("h2",{className:"text-2xl font-bold text-neutral-900 dark:text-white mb-2",children:"No bookings yet"}),e.jsx("p",{className:"text-neutral-600 dark:text-neutral-400 mb-6",children:"Start booking your bus tickets to see them here"}),e.jsx("button",{onClick:()=>l("/"),className:"btn-primary",children:"Book a Ticket"})]}):e.jsx("div",{className:"space-y-4",children:a.map(t=>e.jsx("div",{className:"bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 border border-neutral-200 dark:border-neutral-700",children:e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center md:justify-between gap-4",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsxs("h3",{className:"text-xl font-bold text-neutral-900 dark:text-white",children:[t.fromCity," → ",t.toCity]}),e.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-semibold ${y(t.status)}`,children:t.status.replace("_"," ").toUpperCase()})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-neutral-500 dark:text-neutral-400 mb-1",children:"Operator"}),e.jsx("p",{className:"font-semibold text-neutral-900 dark:text-white",children:t.operatorName})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-neutral-500 dark:text-neutral-400 mb-1",children:"Bus Number"}),e.jsx("p",{className:"font-semibold text-neutral-900 dark:text-white",children:t.busNumber||"TBD"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-neutral-500 dark:text-neutral-400 mb-1",children:"Travel Date"}),e.jsx("p",{className:"font-semibold text-neutral-900 dark:text-white",children:u(t.travelDate)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-neutral-500 dark:text-neutral-400 mb-1",children:"Seats"}),e.jsx("p",{className:"font-semibold text-neutral-900 dark:text-white",children:t.seats.map(s=>s.seatNumber).join(", ")})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-neutral-500 dark:text-neutral-400 mb-1",children:"Total Amount"}),e.jsxs("p",{className:"font-semibold text-primary-600 dark:text-primary-400",children:["₹",t.total.toLocaleString()]})]})]}),t.driver&&e.jsxs("div",{className:"mt-3 text-xs text-neutral-600 dark:text-neutral-400",children:["Driver: ",e.jsx("span",{className:"font-semibold text-neutral-900 dark:text-white",children:t.driver.name})," (",t.driver.experienceYears||5,"+ yrs, ⭐"," ",Number(t.driver.rating||4.7).toFixed(1),") • 📞 ",t.driver.phone]}),e.jsxs("div",{className:"mt-4 text-xs text-neutral-500 dark:text-neutral-400",children:["Booking ID: ",t._id," | Booked on: ",u(t.createdAt)]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[t.status==="confirmed"&&e.jsx("button",{onClick:()=>f(t._id),className:"btn-secondary whitespace-nowrap",children:"📥 Download Ticket"}),e.jsx("button",{onClick:()=>l(`/checkout/success?bookingId=${t._id}&pnr=${t._id}`),className:"btn-outline whitespace-nowrap",children:"View Details"})]})]})},t._id))})]})})},N=a=>{const c=new Date(a.travelDate).toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});return`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bus Ticket - ${a._id}</title>
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
            <div class="city-name">${a.fromCity}</div>
            <div style="font-size: 12px; color: #6b7280;">FROM</div>
          </div>
          <div class="arrow">→</div>
          <div class="city">
            <div class="city-name">${a.toCity}</div>
            <div style="font-size: 12px; color: #6b7280;">TO</div>
          </div>
        </div>
      </div>

      <div class="ticket-section">
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Booking ID / PNR</div>
            <div class="detail-value">${a._id}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Travel Date</div>
            <div class="detail-value">${c}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Operator</div>
            <div class="detail-value">${a.operatorName}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Bus Number</div>
            <div class="detail-value">${a.busNumber||"VBS-0001"}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Status</div>
            <div class="detail-value">${a.status.toUpperCase()}</div>
          </div>
          ${a.driver?`
          <div class="detail-item">
            <div class="detail-label">Driver</div>
            <div class="detail-value">${a.driver.name} (⭐ ${Number(a.driver.rating||4.7).toFixed(1)})</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Driver Contact</div>
            <div class="detail-value">${a.driver.phone}</div>
          </div>
          `:""}
        </div>
      </div>

      <div class="ticket-section">
        <div class="detail-label">Seat Numbers</div>
        <div class="seats-list">
          ${a.seats.map(d=>`<span class="seat-badge">${d.seatNumber}</span>`).join("")}
        </div>
      </div>

      <div class="ticket-section">
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Subtotal</div>
            <div class="detail-value">₹${a.subtotal.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Tax (GST)</div>
            <div class="detail-value">₹${a.tax.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Service Fee</div>
            <div class="detail-value">₹${a.fees.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Total Amount</div>
            <div class="detail-value" style="color: #B91C1C; font-size: 20px;">₹${a.total.toLocaleString()}</div>
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
  `};export{D as default};
