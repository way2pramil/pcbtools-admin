// Direct test of GA API with key parsing
// Run with: node test-ga-api.js

require('dotenv').config({ path: '.env.ga' });

const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const propertyId = process.env.GA_PROPERTY_ID;
const clientEmail = process.env.GA_CLIENT_EMAIL;
let privateKey = process.env.GA_PRIVATE_KEY;

console.log("=== Environment Variables ===");
console.log("Property ID:", propertyId);
console.log("Client Email:", clientEmail);
console.log("Private Key Length:", privateKey?.length);
console.log("Private Key (first 50):", privateKey?.substring(0, 50));

// Parse the key
if (privateKey) {
  // Remove quotes
  if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || 
      (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
    privateKey = privateKey.slice(1, -1);
  }
  // Replace \n
  privateKey = privateKey.replace(/\\n/g, "\n");
}

console.log("\n=== Parsed Key ===");
console.log("Length:", privateKey?.length);
console.log("Line count:", privateKey?.split("\n").length);
console.log("Has BEGIN:", privateKey?.includes("-----BEGIN"));
console.log("Has END:", privateKey?.includes("-----END"));

console.log("\n=== Testing GA API ===");

async function testGA() {
  try {
    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });

    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [{ name: "activeUsers" }],
    });

    console.log("SUCCESS! Active users:", response.rows?.[0]?.metricValues?.[0]?.value);
  } catch (error) {
    console.error("ERROR:", error.message);
    console.error("Full error:", error);
  }
}

testGA();
