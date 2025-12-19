/**
 * Google Analytics Data API Service
 * 
 * Fetches real analytics data from GA4 using a service account.
 * 
 * Setup required:
 * 1. Go to Google Cloud Console
 * 2. Create a service account
 * 3. Download JSON key file
 * 4. Add service account email to GA4 property (Admin > Property Access Management)
 * 5. Set environment variables (see below)
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Environment variables needed:
// GA_PROPERTY_ID - Your GA4 property ID (e.g., "123456789")
// GA_CLIENT_EMAIL - Service account email
// GA_PRIVATE_KEY - Service account private key

const propertyId = process.env.GA_PROPERTY_ID;
const clientEmail = process.env.GA_CLIENT_EMAIL;

// Handle both escaped \n and actual newlines in private key
function parsePrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  // First try replacing escaped \n, then handle double-escaped \\n
  return key.replace(/\\n/g, "\n").replace(/\n\n/g, "\n");
}

const privateKey = parsePrivateKey(process.env.GA_PRIVATE_KEY);

let analyticsClient: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient | null {
  if (!propertyId || !clientEmail || !privateKey) {
    console.warn("Google Analytics credentials not configured", {
      hasPropertyId: !!propertyId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
      keyStartsWith: privateKey?.substring(0, 30),
    });
    return null;
  }

  if (!analyticsClient) {
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }

  return analyticsClient;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  sessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  weeklyUsers: { label: string; value: number }[];
  topPages: { path: string; views: number }[];
  topCountries: { country: string; users: number }[];
  deviceCategories: { device: string; users: number }[];
}

/**
 * Fetch overview analytics for the last 30 days
 */
export async function getAnalyticsOverview(): Promise<AnalyticsData> {
  const client = getClient();
  if (!client || !propertyId) {
    throw new Error("Google Analytics client not configured");
  }

  try {
    // Fetch main metrics
    const [metricsResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "totalUsers" },
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
    });

    const row = metricsResponse.rows?.[0];
    const metrics = {
      totalUsers: parseInt(row?.metricValues?.[0]?.value || "0"),
      activeUsers: parseInt(row?.metricValues?.[1]?.value || "0"),
      pageViews: parseInt(row?.metricValues?.[2]?.value || "0"),
      sessions: parseInt(row?.metricValues?.[3]?.value || "0"),
      avgSessionDuration: parseFloat(row?.metricValues?.[4]?.value || "0"),
      bounceRate: parseFloat(row?.metricValues?.[5]?.value || "0") * 100,
    };

    // Fetch daily users for the last 7 days
    const [weeklyResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyUsers = (weeklyResponse.rows || []).map((row) => {
      const dateStr = row.dimensionValues?.[0]?.value || "";
      const date = new Date(
        parseInt(dateStr.slice(0, 4)),
        parseInt(dateStr.slice(4, 6)) - 1,
        parseInt(dateStr.slice(6, 8))
      );
      return {
        label: dayNames[date.getDay()],
        value: parseInt(row.metricValues?.[0]?.value || "0"),
      };
    });

    // Fetch top pages
    const [pagesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    });

    const topPages = (pagesResponse.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || "",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
    }));

    // Fetch top countries
    const [countriesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 5,
    });

    const topCountries = (countriesResponse.rows || []).map((row) => ({
      country: row.dimensionValues?.[0]?.value || "",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
    }));

    // Fetch device categories
    const [devicesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    });

    const deviceCategories = (devicesResponse.rows || []).map((row) => ({
      device: row.dimensionValues?.[0]?.value || "",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
    }));

    return {
      ...metrics,
      weeklyUsers,
      topPages,
      topCountries,
      deviceCategories,
    };
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    // Re-throw with more context
    throw error;
  }
}

/**
 * Check if Google Analytics is configured
 */
export function isGAConfigured(): boolean {
  return !!(propertyId && clientEmail && privateKey);
}
