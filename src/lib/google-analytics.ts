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

// Handle various formats of private key from different environments
function parsePrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  
  let parsed = key;
  
  // Remove surrounding quotes if present
  if ((parsed.startsWith('"') && parsed.endsWith('"')) || 
      (parsed.startsWith("'") && parsed.endsWith("'"))) {
    parsed = parsed.slice(1, -1);
  }
  
  // Coolify/Docker can escape \n multiple times:
  // \\\\n -> \\n -> \n (newline)
  // Keep replacing until no more escaped newlines
  while (parsed.includes("\\n")) {
    parsed = parsed.replace(/\\n/g, "\n");
  }
  
  // Remove any leftover backslashes before newlines (from \\\n patterns)
  parsed = parsed.replace(/\\\n/g, "\n");
  
  // Log for debugging
  console.log("[GA] Private key parsed:", {
    length: parsed.length,
    lineCount: parsed.split("\n").length,
    hasBegin: parsed.includes("-----BEGIN"),
    hasEnd: parsed.includes("-----END"),
    firstChars: parsed.substring(0, 30),
  });
  
  // Ensure proper PEM format
  if (!parsed.includes("-----BEGIN")) {
    console.error("[GA] Private key doesn't contain BEGIN marker after parsing");
    console.error("[GA] Raw key first 100 chars:", key.substring(0, 100));
  }
  
  return parsed;
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
  newUsers: number;
  activeUsers: number;
  pageViews: number;
  sessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  engagementRate: number;
  pagesPerSession: number;
  sessionsPerUser: number;
  weeklyUsers: { label: string; value: number }[];
  weeklyPageViews: { label: string; value: number }[];
  topPages: { path: string; views: number; avgDuration: number }[];
  topCountries: { country: string; users: number }[];
  deviceCategories: { device: string; users: number }[];
  browsers: { browser: string; users: number }[];
  trafficSources: { source: string; users: number; sessions: number }[];
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
    // Fetch main metrics (30 days)
    const [metricsResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "totalUsers" },
        { name: "newUsers" },
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
        { name: "engagementRate" },
        { name: "screenPageViewsPerSession" },
        { name: "sessionsPerUser" },
      ],
    });

    const row = metricsResponse.rows?.[0];
    const metrics = {
      totalUsers: parseInt(row?.metricValues?.[0]?.value || "0"),
      newUsers: parseInt(row?.metricValues?.[1]?.value || "0"),
      activeUsers: parseInt(row?.metricValues?.[2]?.value || "0"),
      pageViews: parseInt(row?.metricValues?.[3]?.value || "0"),
      sessions: parseInt(row?.metricValues?.[4]?.value || "0"),
      avgSessionDuration: parseFloat(row?.metricValues?.[5]?.value || "0"),
      bounceRate: parseFloat(row?.metricValues?.[6]?.value || "0") * 100,
      engagementRate: parseFloat(row?.metricValues?.[7]?.value || "0") * 100,
      pagesPerSession: parseFloat(row?.metricValues?.[8]?.value || "0"),
      sessionsPerUser: parseFloat(row?.metricValues?.[9]?.value || "0"),
    };

    // Fetch daily users for the last 7 days
    const [weeklyResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    // Fetch daily page views for the last 7 days
    const [weeklyPageViewsResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "screenPageViews" }],
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

    const weeklyPageViews = (weeklyPageViewsResponse.rows || []).map((row) => {
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

    // Fetch top pages with avg duration
    const [pagesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    });

    const topPages = (pagesResponse.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || "",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
      avgDuration: parseFloat(row.metricValues?.[1]?.value || "0"),
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

    // Fetch browsers
    const [browsersResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "browser" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 5,
    });

    const browsers = (browsersResponse.rows || []).map((row) => ({
      browser: row.dimensionValues?.[0]?.value || "",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
    }));

    // Fetch traffic sources
    const [sourcesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 6,
    });

    const trafficSources = (sourcesResponse.rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || "",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0"),
    }));

    return {
      ...metrics,
      weeklyUsers,
      weeklyPageViews,
      topPages,
      topCountries,
      deviceCategories,
      browsers,
      trafficSources,
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
