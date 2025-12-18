# pcbtools-admin - AI Guide

> Quick reference for AI assistants modifying this codebase.

---

## Stack

| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 16 | App Router |
| React | 19 | UI |
| Tailwind | v4 | Styling (CSS-first) |
| Prisma | 7.2.0 | Database ORM |
| Better Auth | 1.x | Authentication |
| Bun | 1.x | Runtime/Package Manager |

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # Auth API routes
│   ├── dashboard/         # Protected admin pages
│   │   ├── page.tsx       # Overview
│   │   ├── bugs/          # Bug management
│   │   ├── users/         # User management
│   │   ├── analytics/     # Analytics charts
│   │   └── settings/      # Admin settings
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Tailwind v4 config
│
├── components/
│   ├── index.ts           # Master export (use this)
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── data/              # Data display components
│   └── charts/            # SVG chart components
│
├── lib/
│   ├── auth/              # Better Auth setup
│   │   ├── index.ts       # Main auth config
│   │   ├── client.ts      # Client-side hooks
│   │   ├── server.ts      # Server-side helpers
│   │   └── admin.ts       # Admin email whitelist
│   ├── prisma.ts          # Database client
│   ├── env.ts             # Environment variables
│   └── utils.ts           # cn() helper
│
└── types/
    ├── index.ts           # Domain types
    └── api.ts             # API types
```

---

## Import Patterns

### ✅ Correct
```tsx
// From master export
import { Button, Card, DataTable, StatsCard } from "@/components";

// By category
import { Button, Badge } from "@/components/ui";
import { Sidebar } from "@/components/layout";
import { BarChart } from "@/components/charts";

// Types
import type { BugReport, BugStatus } from "@/types";
```

### ❌ Avoid
```tsx
// Don't import from deep paths
import { Button } from "@/components/ui/button";
```

---

## Component Conventions

### File Size
- **Max 150 lines** per component
- Split if larger

### Naming
- `PascalCase` for components: `StatsCard.tsx`
- `kebab-case` for files: `stats-card.tsx`
- Export name matches component: `export function StatsCard`

### Props Interface
```tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  // ...
}
```

---

## Adding New Components

### 1. Create component file
```tsx
// src/components/ui/new-component.tsx
import { cn } from "@/lib/utils";

interface NewComponentProps {
  // props
}

export function NewComponent({ ...props }: NewComponentProps) {
  return <div>...</div>;
}
```

### 2. Export from category index
```tsx
// src/components/ui/index.ts
export * from "./new-component";
```

### 3. Use via master export
```tsx
import { NewComponent } from "@/components";
```

---

## Adding New Pages

### Dashboard page pattern
```tsx
// src/app/dashboard/new-page/page.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const dynamic = "force-dynamic"; // For DB queries

export default async function NewPage() {
  const data = await prisma.someModel.findMany();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Title</h1>
        <p className="text-sm text-muted-foreground">Description</p>
      </div>
      
      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Section</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ... */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Add to sidebar navigation
```tsx
// src/components/layout/sidebar.tsx
const navItems = [
  // ... existing items
  { href: "/dashboard/new-page", label: "New Page", icon: SomeIcon },
];
```

---

## API Routes Pattern

```tsx
// src/app/api/some-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/lucia";
import { isAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // 1. Auth check
  const { user } = await validateRequest();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  const body = await req.json();

  // 3. Database operation
  const result = await prisma.someModel.update({...});

  // 4. Return response
  return NextResponse.json({ data: result });
}
```

---

## Styling

### Tailwind v4 (CSS-first)
- Config in `src/app/globals.css` using `@theme` block
- No `tailwind.config.ts` needed

### CSS Variables
```css
/* Light mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;

/* Dark mode (.dark class) */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
```

### Using cn() utility
```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-classes", conditional && "conditional-class")} />
```

---

## Database (Prisma)

### Schema location
- Main site schema: `packages/db/prisma/schema.prisma`
- Admin uses same DB via `DATABASE_URL`

### Common queries
```tsx
// Count
const count = await prisma.user.count();

// Find with relations
const bugs = await prisma.bugReport.findMany({
  include: { user: { select: { name: true, email: true } } },
  orderBy: { createdAt: "desc" },
});
```

---

## Auth (Better Auth)

### Check auth in Server Components
```tsx
import { getSession, getAuthUser } from "@/lib/auth/server";
import { isAdmin } from "@/lib/auth/admin";

const session = await getSession();
const user = getAuthUser(session);
if (!user || !isAdmin(user.email)) {
  redirect("/login");
}
```

### Client-side auth (hooks)
```tsx
"use client";
import { signIn, signOut, useSession } from "@/lib/auth/client";

// Sign in with Google
await signIn.social({ provider: "google", callbackURL: "/dashboard" });

// Sign out
await signOut();

// Get session in client component
const { data: session } = useSession();
```

### User type
```tsx
type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
};
```

---

## Available Components

### UI (`@/components/ui`)
| Component | Use For |
|-----------|---------|
| `Button` | Actions, links |
| `Card`, `CardHeader`, `CardContent`, `CardTitle` | Content containers |
| `Badge` | Status labels |
| `Input` | Form inputs |
| `Select` | Dropdowns |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` | Data tables |
| `Avatar`, `AvatarImage`, `AvatarFallback` | User avatars |
| `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` | Modals |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Tab navigation |
| `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` | Menus |

### Layout (`@/components/layout`)
| Component | Use For |
|-----------|---------|
| `Sidebar` | Main navigation |
| `Header` | Top bar with user info |
| `Breadcrumb` | Path navigation |

### Data (`@/components/data`)
| Component | Use For |
|-----------|---------|
| `StatsCard` | Metric display |
| `DataTable` | Sortable/filterable tables |
| `ActivityFeed` | Recent activity list |

### Charts (`@/components/charts`)
| Component | Use For |
|-----------|---------|
| `BarChart` | Bar visualizations |
| `AreaChart` | Trend lines |
| `PieChart` | Distribution |

---

## Commands

```bash
# Development
bun run dev          # Start on port 3001

# Build
bun run build        # Production build

# Database
bun prisma generate  # Generate client
bun prisma studio    # Open Prisma Studio

# Type check
bun tsc --noEmit     # Check types
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://...
ADMIN_EMAILS=email1@example.com,email2@example.com
NEXT_PUBLIC_APP_URL=https://admin.pcbtools.xyz
AUTH_GOOGLE_CLIENT_ID=xxx
AUTH_GOOGLE_CLIENT_SECRET=xxx
BETTER_AUTH_SECRET=xxx  # Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Rules

1. **No files > 200 lines** - Split into smaller modules
2. **No `any` types** - Use proper TypeScript
3. **Use barrel exports** - Import from `@/components`
4. **Auth on all API routes** - Use `getSession()` + `isAdmin()`
5. **`force-dynamic`** - Add to pages with DB queries
