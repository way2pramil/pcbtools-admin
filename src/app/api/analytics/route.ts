/**
 * Analytics API Route
 * 
 * Fetches Google Analytics data for the admin dashboard.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { getAnalyticsOverview, isGAConfigured } from "@/lib/google-analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  // Check auth
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if GA is configured
  if (!isGAConfigured()) {
    return NextResponse.json(
      { 
        error: "Google Analytics not configured",
        configured: false,
        message: "Set GA_PROPERTY_ID, GA_CLIENT_EMAIL, and GA_PRIVATE_KEY environment variables"
      },
      { status: 200 }
    );
  }

  try {
    const data = await getAnalyticsOverview();
    
    if (!data) {
      return NextResponse.json(
        { error: "Failed to fetch analytics data", configured: true },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, configured: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error", configured: true },
      { status: 500 }
    );
  }
}
