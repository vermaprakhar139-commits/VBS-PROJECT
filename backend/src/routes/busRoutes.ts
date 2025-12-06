import { Router, Request, Response } from "express";

const router = Router();

// Route distance mapping (for pricing)
const routeDistances: Record<string, number> = {
  "Delhi-Mumbai": 1400,
  "Mumbai-Delhi": 1400,
  "Bangalore-Chennai": 350,
  "Chennai-Bangalore": 350,
  "Kolkata-Delhi": 1500,
  "Delhi-Kolkata": 1500,
  "Mumbai-Pune": 150,
  "Pune-Mumbai": 150,
  "Hyderabad-Bangalore": 570,
  "Bangalore-Hyderabad": 570,
  "Delhi-Jaipur": 280,
  "Jaipur-Delhi": 280,
};

// Get base price based on route distance
const getBasePriceForRoute = (from: string, to: string): number => {
  const routeKey = `${from}-${to}`;
  const distance = routeDistances[routeKey] || 500; // Default 500km
  // Base price: ₹1.5 per km
  return Math.round(distance * 1.5);
};

const driverProfiles = [
  { name: "Arjun Mehta", phone: "+91 98765 43210", experienceYears: 8, rating: 4.7 },
  { name: "Suman Rao", phone: "+91 91234 56780", experienceYears: 10, rating: 4.8 },
  { name: "Ravi Pillai", phone: "+91 93456 78123", experienceYears: 6, rating: 4.6 },
  { name: "Nisha Fernandes", phone: "+91 90909 12345", experienceYears: 9, rating: 4.9 },
  { name: "Harish Patil", phone: "+91 99876 54321", experienceYears: 7, rating: 4.5 }
];

// Sample bus data generator
const generateSampleBuses = (from: string, to: string, date: string) => {
  const operators = [
    "VBS Travels",
    "RedBus Express",
    "GreenLine",
    "Orange Tours",
    "Blue Star",
    "Royal Travels",
    "Super Fast",
    "Comfort Line",
    "Luxury Express",
    "Premium Bus",
  ];

  const busTypes = [
    "AC Sleeper",
    "Non-AC Sleeper",
    "AC Seater",
    "Non-AC Seater",
    "AC Semi-Sleeper",
    "Non-AC Semi-Sleeper",
  ];
  
  const times = [
    { dep: "06:00", arr: "02:00", duration: 20 },
    { dep: "08:00", arr: "04:00", duration: 20 },
    { dep: "10:00", arr: "06:00", duration: 20 },
    { dep: "12:00", arr: "08:00", duration: 20 },
    { dep: "14:00", arr: "10:00", duration: 20 },
    { dep: "16:00", arr: "12:00", duration: 20 },
    { dep: "18:00", arr: "14:00", duration: 20 },
    { dep: "20:00", arr: "16:00", duration: 20 },
    { dep: "22:00", arr: "18:00", duration: 20 },
    { dep: "23:30", arr: "19:30", duration: 20 },
  ];

  const baseRoutePrice = getBasePriceForRoute(from, to);

  return operators.map((operator, idx) => {
    const time = times[idx % times.length];
    const busType = busTypes[idx % busTypes.length];
    const isAC = busType.includes("AC");
    const isSleeper = busType.includes("Sleeper");
    
    // Calculate price based on route, bus type, and operator
    let priceMultiplier = 1.0;
    if (isAC) priceMultiplier *= 1.4; // AC costs 40% more
    if (isSleeper) priceMultiplier *= 1.3; // Sleeper costs 30% more
    
    // Different operators have different pricing
    const operatorMultiplier = 0.8 + (idx % 5) * 0.1; // Range from 0.8 to 1.2
    
    // Add some randomness but keep it reasonable
    const randomVariation = 0.9 + Math.random() * 0.2; // ±10% variation
    
    const basePrice = Math.round(baseRoutePrice * priceMultiplier * operatorMultiplier * randomVariation);
    
    // Ensure minimum price
    const finalPrice = Math.max(300, basePrice);
    
    const rating = (3.5 + Math.random() * 1.5).toFixed(1);
    const driverProfile = driverProfiles[idx % driverProfiles.length];
    const driver = {
      ...driverProfile,
      experienceYears: driverProfile.experienceYears + Math.floor(Math.random() * 3),
      rating: parseFloat((driverProfile.rating + Math.random() * 0.2).toFixed(1))
    };
    const busNumber = `${from.slice(0, 2).toUpperCase()}-${to.slice(0, 2).toUpperCase()}-${(idx + 1)
      .toString()
      .padStart(2, "0")}${Math.floor(Math.random() * 90 + 10)}`;
    
    return {
      id: `bus-${from}-${to}-${idx + 1}-${Date.now()}`,
      operatorName: operator,
      operatorLogo: null,
      busType: busType,
      busNumber,
      fromCity: from,
      toCity: to,
      departureTime: time.dep,
      arrivalTime: time.arr,
      durationMins: time.duration * 60,
      duration: `${time.duration} hours`,
      price: finalPrice,
      availableSeats: Math.floor(Math.random() * 40) + 5,
      totalSeats: 40,
      rating: parseFloat(rating),
      amenities: isAC
        ? ["AC", "WiFi", "Charging", "Blanket", "Water"]
        : ["WiFi", "Charging", "Water"],
      driver,
      cancellationPolicy: "Free cancellation up to 24 hours",
    };
  });
};

// GET /api/buses/search?from=DEL&to=BOM&date=2025-12-05&passengers=1
router.get("/search", (req: Request, res: Response) => {
  const from = req.query.from as string;
  const to = req.query.to as string;
  const date = req.query.date as string;
  const passengers = parseInt(req.query.passengers as string) || 1;

  if (!from || !to || !date) {
    return res.status(400).json({ error: "Missing required parameters: from, to, date" });
  }

  // Validate date is not in the past
  const travelDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (travelDate < today) {
    return res.status(400).json({ error: "Travel date cannot be in the past" });
  }

  let buses = generateSampleBuses(from, to, date);
  
  // Apply filters if provided
  const busType = req.query.busType as string;
  const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : null;
  const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : null;
  const departureTime = req.query.departureTime as string; // "early" | "mid" | "late"

  if (busType) {
    buses = buses.filter((b) => b.busType.toLowerCase().includes(busType.toLowerCase()));
  }

  if (minPrice !== null) {
    buses = buses.filter((b) => b.price >= minPrice);
  }

  if (maxPrice !== null) {
    buses = buses.filter((b) => b.price <= maxPrice);
  }

  if (departureTime) {
    if (departureTime === "early") {
      buses = buses.filter((b) => {
        const depHour = parseInt(b.departureTime.split(":")[0]);
        return depHour >= 6 && depHour < 12;
      });
    } else if (departureTime === "mid") {
      buses = buses.filter((b) => {
        const depHour = parseInt(b.departureTime.split(":")[0]);
        return depHour >= 12 && depHour < 18;
      });
    } else if (departureTime === "late") {
      buses = buses.filter((b) => {
        const depHour = parseInt(b.departureTime.split(":")[0]);
        return depHour >= 18;
      });
    }
  }

  // Sort options
  const sortBy = (req.query.sortBy as string) || "price";
  if (sortBy === "price") {
    buses.sort((a, b) => a.price - b.price);
  } else if (sortBy === "duration") {
    buses.sort((a, b) => a.durationMins - b.durationMins);
  } else if (sortBy === "departure") {
    buses.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  } else if (sortBy === "rating") {
    buses.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    results: buses,
    count: buses.length,
    searchParams: { from, to, date, passengers },
  });
});

export default router;
