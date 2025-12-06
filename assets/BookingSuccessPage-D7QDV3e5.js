import{b as T,u as D,r as h,R as B,j as a}from"./index-C-YOLkM3.js";import{a as $}from"./client-DpaTewj7.js";const k=()=>{var b,x,r,g;const[m]=T(),n=D(),e=m.get("bookingId"),o=m.get("pnr")||e,p=m.get("data"),[N,f]=h.useState(!1),[i,s]=h.useState(null),[v,y]=h.useState(null);B.useEffect(()=>{if(p)try{const t=JSON.parse(decodeURIComponent(p));s(t),y(t)}catch(t){console.error("Failed to parse booking data:",t)}},[p]),h.useEffect(()=>{if(!e||i)return;(async()=>{try{const c=await $.get(`/bookings/${e}`);y(c.data.booking)}catch(c){console.warn("Failed to fetch booking details:",c)}})()},[e,i]),h.useEffect(()=>{e||n("/")},[e,n]);const j=()=>{o&&(navigator.clipboard.writeText(o),f(!0),setTimeout(()=>f(!1),2e3))},w=async()=>{if(!e){alert("Booking ID not found");return}try{let t=v||i;if(!t)try{t=(await $.get(`/bookings/${e}`)).data.booking}catch(u){console.warn("Could not fetch booking details from API:",u),t||(t={_id:e,fromCity:"From City",toCity:"To City",operatorName:"VBS Travels",busNumber:"VBS-0001",driver:{name:"On-duty Captain",phone:"+91 90000 00000",experienceYears:5,rating:4.7},travelDate:new Date().toISOString(),seats:[],total:0,subtotal:0,tax:0,fees:0,status:"confirmed"})}if(i&&t&&(t={...t,passengers:i.passengers||t.passengers||[],contactInfo:i.contactInfo||t.contactInfo||{},departureTime:i.departureTime||t.departureTime||"08:00 AM",arrivalTime:i.arrivalTime||t.arrivalTime||"02:00 PM",duration:i.duration||t.duration||"6h 0m",operatorName:i.operatorName||t.operatorName,busNumber:i.busNumber||t.busNumber,driver:i.driver||t.driver}),!t){alert("Booking data not available. Please try again.");return}const c=window.open("","_blank");if(!c){alert("Please allow pop-ups to download the ticket");return}const l=S(e,o,t);c.document.write(l),c.document.close(),setTimeout(()=>{c.print()},500)}catch(t){console.error("Error downloading ticket:",t),alert(`Failed to download ticket: ${t.message||"Unknown error"}. Please try again.`)}};if(!e)return null;const d=v||i;return a.jsxs("div",{className:"max-w-3xl mx-auto px-4 py-12",children:[a.jsxs("div",{className:"text-center mb-8",children:[a.jsx("div",{className:"w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4",children:a.jsx("span",{className:"text-4xl",children:"✓"})}),a.jsx("h1",{className:"text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2",children:"Booking Confirmed!"}),a.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Your bus ticket has been booked successfully"})]}),a.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6",children:[a.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-500 dark:text-gray-400 mb-1",children:"Booking ID"}),a.jsx("p",{className:"text-lg font-bold text-gray-800 dark:text-gray-100",children:e})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-500 dark:text-gray-400 mb-1",children:"PNR Number"}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("p",{className:"text-lg font-bold text-primary-600 dark:text-primary-400",children:o}),a.jsx("button",{onClick:j,className:"text-sm text-primary-600 dark:text-primary-400 hover:underline",title:"Copy PNR",children:N?"✓ Copied":"📋 Copy"})]})]})]}),a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{className:"bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg",children:[a.jsx("h3",{className:"font-semibold mb-2 text-gray-800 dark:text-gray-100",children:"What's Next?"}),a.jsxs("ul",{className:"text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside",children:[a.jsx("li",{children:"Your booking confirmation has been sent to your email"}),a.jsx("li",{children:"Please arrive at the bus stop 15 minutes before departure"}),a.jsx("li",{children:"Carry a valid ID proof for verification"}),a.jsx("li",{children:"Show your PNR number at the time of boarding"})]})]}),a.jsxs("div",{className:"flex flex-col sm:flex-row gap-3",children:[a.jsx("button",{onClick:w,className:"btn-secondary flex-1",children:"📥 Download Ticket"}),a.jsx("button",{onClick:()=>n("/my-bookings"),className:"btn-secondary flex-1",children:"View My Bookings"}),a.jsx("button",{onClick:()=>n("/"),className:"btn-primary flex-1",children:"Book Another Trip"})]})]})]}),d&&a.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6",children:[a.jsx("h3",{className:"font-semibold text-gray-900 dark:text-white mb-4",children:"Trip & Driver Details"}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-gray-500 dark:text-gray-400",children:"Route"}),a.jsxs("p",{className:"font-semibold text-gray-900 dark:text-white",children:[d.fromCity||"From City"," → ",d.toCity||"To City"]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-gray-500 dark:text-gray-400",children:"Operator"}),a.jsx("p",{className:"font-semibold text-gray-900 dark:text-white",children:d.operatorName||"VBS Travels"})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-gray-500 dark:text-gray-400",children:"Bus Number"}),a.jsx("p",{className:"font-semibold text-gray-900 dark:text-white",children:d.busNumber||"VBS-0001"})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-gray-500 dark:text-gray-400",children:"Driver"}),a.jsxs("p",{className:"font-semibold text-gray-900 dark:text-white",children:[((b=d.driver)==null?void 0:b.name)||"On-duty Captain"," (⭐"," ",Number(((x=d.driver)==null?void 0:x.rating)||4.7).toFixed(1),") • ",((r=d.driver)==null?void 0:r.experienceYears)||5,"+ yrs exp"]}),((g=d.driver)==null?void 0:g.phone)&&a.jsxs("p",{className:"text-xs text-gray-500 dark:text-gray-400",children:["📞 ",d.driver.phone]})]})]})]}),a.jsxs("div",{className:"bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4",children:[a.jsx("h3",{className:"font-semibold mb-2 text-blue-800 dark:text-blue-300",children:"Need Help?"}),a.jsxs("p",{className:"text-sm text-blue-700 dark:text-blue-400",children:["For any queries or support, contact us at"," ",a.jsx("a",{href:"mailto:support@vbs.com",className:"underline",children:"support@vbs.com"})," ","or call"," ",a.jsx("a",{href:"tel:+911800123456",className:"underline",children:"1800-123-456"})]})]})]})},S=(m,n,e)=>{const o=e!=null&&e.travelDate?new Date(e.travelDate).toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),p=(e==null?void 0:e.fromCity)||"From City",N=(e==null?void 0:e.toCity)||"To City",f=(e==null?void 0:e.operatorName)||"Bus Operator",i=(e==null?void 0:e.busNumber)||"VBS-0001",s=(e==null?void 0:e.driver)||{},v=(e==null?void 0:e.seats)||[],y=(e==null?void 0:e.total)||0,j=(e==null?void 0:e.subtotal)||0,w=(e==null?void 0:e.tax)||0,d=(e==null?void 0:e.fees)||0,b=(e==null?void 0:e.status)||"confirmed",x=(e==null?void 0:e.passengers)||[],r=(e==null?void 0:e.contactInfo)||{},g=(e==null?void 0:e.departureTime)||"08:00 AM",t=(e==null?void 0:e.arrivalTime)||"02:00 PM",c=(e==null?void 0:e.duration)||"6h 0m";return`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bus Ticket - ${m}</title>
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
            <div class="city-name">${p}</div>
            <div style="font-size: 12px; color: #6b7280;">FROM</div>
          </div>
          <div class="arrow">→</div>
          <div class="city">
            <div class="city-name">${N}</div>
            <div style="font-size: 12px; color: #6b7280;">TO</div>
          </div>
        </div>
      </div>

      <div class="ticket-section">
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Booking ID / PNR</div>
            <div class="detail-value">${n}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Travel Date</div>
            <div class="detail-value">${o}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Operator</div>
            <div class="detail-value">${f}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Bus Number</div>
            <div class="detail-value">${i}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Status</div>
            <div class="detail-value">${b.toUpperCase()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Departure Time</div>
            <div class="detail-value">${g}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Arrival Time</div>
            <div class="detail-value">${t}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Duration</div>
            <div class="detail-value">${c}</div>
          </div>
          ${s!=null&&s.name?`
          <div class="detail-item">
            <div class="detail-label">Driver</div>
            <div class="detail-value">${s.name} ${s.rating?`(⭐ ${Number(s.rating).toFixed(1)})`:""}</div>
          </div>
          `:""}
          ${s!=null&&s.phone?`
          <div class="detail-item">
            <div class="detail-label">Driver Contact</div>
            <div class="detail-value">${s.phone}</div>
          </div>
          `:""}
        </div>
      </div>

      ${r.name||r.email||r.phone?`
      <div class="ticket-section">
        <div class="detail-label">Contact Information</div>
        <div class="details-grid">
          ${r.name?`
          <div class="detail-item">
            <div class="detail-label">Passenger Name</div>
            <div class="detail-value">${r.name}</div>
          </div>
          `:""}
          ${r.email?`
          <div class="detail-item">
            <div class="detail-label">Email</div>
            <div class="detail-value">${r.email}</div>
          </div>
          `:""}
          ${r.phone?`
          <div class="detail-item">
            <div class="detail-label">Phone</div>
            <div class="detail-value">${r.phone}</div>
          </div>
          `:""}
        </div>
      </div>
      `:""}

      ${x.length>0?`
      <div class="ticket-section">
        <div class="detail-label">Passenger Details</div>
        ${x.map((l,u)=>{var C;return`
        <div style="margin-bottom: 15px; padding: 15px; background: #f9fafb; border-radius: 8px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">Passenger ${u+1}</div>
          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Name</div>
              <div class="detail-value">${l.name||"N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Age</div>
              <div class="detail-value">${l.age||"N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Gender</div>
              <div class="detail-value">${l.gender?l.gender.charAt(0).toUpperCase()+l.gender.slice(1):"N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Seat Number</div>
              <div class="detail-value">${l.seatNumber||((C=v[u])==null?void 0:C.seatNumber)||"N/A"}</div>
            </div>
          </div>
        </div>
        `}).join("")}
      </div>
      `:""}

      ${v.length>0?`
      <div class="ticket-section">
        <div class="detail-label">Seat Numbers</div>
        <div class="seats-list">
          ${v.map(l=>`<span class="seat-badge">${l.seatNumber||l}</span>`).join("")}
        </div>
      </div>
      `:""}

      <div class="ticket-section">
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Subtotal</div>
            <div class="detail-value">₹${j.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Tax (GST)</div>
            <div class="detail-value">₹${w.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Service Fee</div>
            <div class="detail-value">₹${d.toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Total Amount</div>
            <div class="detail-value" style="color: #B91C1C; font-size: 20px;">₹${y.toLocaleString()}</div>
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
  `};export{k as default};
