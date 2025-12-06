import { Router, Request, Response } from "express";

const router = Router();

// Sample cities data (move to database/JSON file later)
const CITIES = [
  { id: "DEL", name: "Delhi", state: "Delhi" },
  { id: "BOM", name: "Mumbai", state: "Maharashtra" },
  { id: "BLR", name: "Bangalore", state: "Karnataka" },
  { id: "MAA", name: "Chennai", state: "Tamil Nadu" },
  { id: "CCU", name: "Kolkata", state: "West Bengal" },
  { id: "HYD", name: "Hyderabad", state: "Telangana" },
  { id: "PNQ", name: "Pune", state: "Maharashtra" },
  { id: "JAI", name: "Jaipur", state: "Rajasthan" },
  { id: "GOI", name: "Goa", state: "Goa" },
  { id: "IXC", name: "Chandigarh", state: "Chandigarh" },
  { id: "DHM", name: "Dharamshala", state: "Himachal Pradesh" },
  { id: "MYQ", name: "Mysore", state: "Karnataka" },
  { id: "AMD", name: "Ahmedabad", state: "Gujarat" },
  { id: "LKO", name: "Lucknow", state: "Uttar Pradesh" },
  { id: "NDC", name: "Nagpur", state: "Maharashtra" },
  { id: "COK", name: "Kochi", state: "Kerala" },
  { id: "TRV", name: "Trivandrum", state: "Kerala" },
  { id: "VNS", name: "Varanasi", state: "Uttar Pradesh" },
  { id: "PAT", name: "Patna", state: "Bihar" },
  { id: "RPR", name: "Raipur", state: "Chhattisgarh" },
];

// GET /api/misc/cities?q=del
router.get("/cities", (req: Request, res: Response) => {
  const query = (req.query.q as string)?.toLowerCase() || "";
  
  if (!query) {
    return res.json({ cities: [] });
  }

  const filtered = CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(query) ||
      city.id.toLowerCase().includes(query) ||
      city.state.toLowerCase().includes(query)
  );

  res.json({ cities: filtered.slice(0, 10) });
});

router.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

export default router;