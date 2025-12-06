// Utility functions for testing - can be used in browser console

export const testAPIs = async () => {
  console.log("🧪 Testing APIs...\n");
  
  // Test Cities API
  try {
    const citiesRes = await fetch("/api/misc/cities?q=del");
    const citiesData = await citiesRes.json();
    console.log("✅ Cities API:", citiesData.cities?.length || 0, "results");
    if (citiesData.cities?.length > 0) {
      console.log("   Sample:", citiesData.cities[0]);
    }
  } catch (e) {
    console.error("❌ Cities API failed:", e);
  }
  
  // Test Bus Search API
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    const busesRes = await fetch(`/api/buses/search?from=Delhi&to=Mumbai&date=${dateStr}`);
    const busesData = await busesRes.json();
    console.log("✅ Bus Search API:", busesData.results?.length || 0, "buses");
    if (busesData.results?.length > 0) {
      console.log("   Sample bus:", busesData.results[0].operatorName);
    }
  } catch (e) {
    console.error("❌ Bus Search API failed:", e);
  }
  
  // Test Health Check
  try {
    const healthRes = await fetch("/health");
    const healthData = await healthRes.json();
    console.log("✅ Health Check:", healthData.status);
  } catch (e) {
    console.error("❌ Health Check failed:", e);
  }
  
  console.log("\n✨ API tests complete!");
};

// Run in browser console: testAPIs()
