"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { BarChart, AreaChart, PieChart } from "@/components/charts";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Eye, 
  Clock, 
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  AlertCircle,
  Loader2,
  ExternalLink
} from "lucide-react";

interface AnalyticsData {
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

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

const deviceIcons: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        
        if (json.configured === false) {
          setConfigured(false);
          setLoading(false);
          return;
        }
        
        if (json.error) {
          setError(json.error);
        } else {
          setData(json.data);
        }
      } catch (err) {
        setError("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Usage statistics and trends for pcbtools.xyz
          </p>
        </div>

        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-amber-500/10 p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold">Google Analytics Not Configured</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              To see real analytics data, you need to set up a Google Cloud service account 
              and configure the following environment variables:
            </p>
            <div className="mt-4 rounded-lg bg-muted/50 p-4 text-left font-mono text-xs">
              <p>GA_PROPERTY_ID=your-property-id</p>
              <p>GA_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com</p>
              <p>GA_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----</p>
            </div>
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Open Google Cloud Console
              <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Usage statistics and trends for pcbtools.xyz
          </p>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Failed to Load Analytics</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {error || "An unexpected error occurred"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Users", 
      value: formatNumber(data.totalUsers), 
      icon: Users,
      subtitle: "Last 30 days"
    },
    { 
      label: "Page Views", 
      value: formatNumber(data.pageViews), 
      icon: Eye,
      subtitle: "Last 30 days"
    },
    { 
      label: "Avg. Session", 
      value: formatDuration(data.avgSessionDuration), 
      icon: Clock,
      subtitle: "Duration"
    },
    { 
      label: "Bounce Rate", 
      value: `${data.bounceRate.toFixed(1)}%`, 
      icon: TrendingUp,
      subtitle: "Single page visits"
    },
  ];

  // Prepare device data for pie chart
  const deviceData = data.deviceCategories.map((d, i) => ({
    label: d.device.charAt(0).toUpperCase() + d.device.slice(1),
    value: d.users,
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Real-time data from Google Analytics for pcbtools.xyz
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Active Users</CardTitle>
            <p className="text-xs text-muted-foreground">User activity over the past 7 days</p>
          </CardHeader>
          <CardContent>
            {data.weeklyUsers.length > 0 ? (
              <BarChart data={data.weeklyUsers} height={220} />
            ) : (
              <div className="flex h-[220px] items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Device Categories</CardTitle>
            <p className="text-xs text-muted-foreground">Users by device type</p>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-4">
            {deviceData.length > 0 ? (
              <PieChart data={deviceData} size={160} />
            ) : (
              <div className="flex h-[160px] items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Growth Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">User Trend</CardTitle>
          <p className="text-xs text-muted-foreground">Daily active users over the past week</p>
        </CardHeader>
        <CardContent>
          {data.weeklyUsers.length > 0 ? (
            <AreaChart data={data.weeklyUsers} height={240} />
          ) : (
            <div className="flex h-[240px] items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Pages</CardTitle>
            <p className="text-xs text-muted-foreground">Most viewed pages (30 days)</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topPages.slice(0, 8).map((page, i) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {i + 1}
                    </span>
                    <span className="text-sm font-mono truncate max-w-[200px]" title={page.path}>
                      {page.path}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {formatNumber(page.views)}
                  </span>
                </div>
              ))}
              {data.topPages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Top Countries
            </CardTitle>
            <p className="text-xs text-muted-foreground">Users by location (30 days)</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topCountries.map((country, i) => {
                const percentage = data.totalUsers > 0 
                  ? ((country.users / data.totalUsers) * 100).toFixed(1)
                  : "0";
                return (
                  <div key={country.country} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{country.country}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(country.users)} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary/60 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {data.topCountries.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
