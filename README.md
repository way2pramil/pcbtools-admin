# PCBtools Admin Dashboard

Admin dashboard for managing [pcbtools.xyz](https://pcbtools.xyz) - hosted at [admin.pcbtools.xyz](https://admin.pcbtools.xyz).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (shared with main site)
- **Auth**: NextAuth.js with Google OAuth
- **Deployment**: Docker → Coolify

---

## Features

- 📊 **Dashboard** - Overview metrics (users, bugs, activity)
- 🐛 **Bug Reports** - Manage KiNotes bug reports
- 👥 **Users** - View and manage registered users
- 🔒 **Admin Only** - Environment-based email whitelist

---

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/pcbtools"
ADMIN_EMAILS="your@email.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Start Dev Server

```bash
npm run dev
```

Visit: http://localhost:3001

---

## Deployment (Coolify)

### 1. Create New Service

- **Type**: Docker
- **Repo**: `way2pramil/pcbtools-admin`
- **Domain**: `admin.pcbtools.xyz`
- **Port**: `3001`

### 2. Environment Variables

Add in Coolify:
```
DATABASE_URL=postgresql://...
ADMIN_EMAILS=pramil.wakchaure@gmail.com
NEXTAUTH_URL=https://admin.pcbtools.xyz
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### 3. Build Settings

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

---

## Admin Access

Only emails listed in `ADMIN_EMAILS` can access the dashboard.

To add admins:
```env
ADMIN_EMAILS="admin1@example.com,admin2@example.com"
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── login/page.tsx          # Admin login
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout with sidebar
│       ├── page.tsx            # Dashboard home
│       ├── bugs/page.tsx       # Bug reports management
│       └── users/page.tsx      # User management
├── components/
│   ├── sidebar.tsx             # Navigation sidebar
│   ├── header.tsx              # Top header with user info
│   ├── stats-card.tsx          # Metric cards
│   └── status-badge.tsx        # Status indicators
└── lib/
    ├── prisma.ts               # Database client
    ├── auth.ts                 # Admin check utility
    └── utils.ts                # Helper functions
```

---

## Database

Shares the same PostgreSQL database with the main pcbtools.xyz site.

**Models Used:**
- `User` - Registered users
- `BugReport` - User-submitted bugs
- `Session` - Auth sessions
- `OAuthAccount` - OAuth connections

---

## Security

- ✅ Environment-based admin whitelist
- ✅ OAuth-only authentication (no passwords)
- ✅ Database-level access control
- ✅ Separate domain from main site

---

## Maintenance

### View Logs
```bash
docker logs -f <container-id>
```

### Database Management
```bash
npm run prisma:studio
```

### Update Dependencies
```bash
npm update
npm audit fix
```

---

## Contributing

This is a solo developer project. For issues, contact pramil.wakchaure@gmail.com.

---

## License

Proprietary - Part of pcbtools.xyz
