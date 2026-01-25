# Supabase + Vercel Setup Guide

## 📋 Supabase Configuration

### 1. Database URL
In Supabase Dashboard → Settings → Database:

```bash
# Transaction Mode (für Prisma)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# Session Mode mit Pooling (empfohlen für Vercel)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
```

### 2. Connection Pooling
- Port **5432**: Direct Connection (Development)
- Port **6543**: Connection Pooler (Production - Vercel)

### 3. Row Level Security (Optional)
Wenn du RLS nutzen willst:
```sql
-- Enable RLS
ALTER TABLE "WeeklySport" ENABLE ROW LEVEL SECURITY;

-- Policy (Beispiel: Alle können lesen)
CREATE POLICY "Public read access" ON "WeeklySport"
  FOR SELECT USING (true);
```

---

## 🚀 Vercel Deployment

### 1. Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```bash
# Production
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
NODE_ENV=production

# Preview (Optional)
DATABASE_URL_PREVIEW=...
```

### 2. Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `life-os-dashboard/02_frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Functions Configuration
- **Region**: Nearest to Supabase (meist `iad1` - US East)
- **Max Duration**: 10s (Free) / 60s (Pro)

---

## 🔧 Migration Commands

```bash
# Development (mit Direct Connection)
DATABASE_URL="postgresql://...5432/postgres" npx prisma migrate dev

# Production (Prisma Studio)
DATABASE_URL="postgresql://...5432/postgres" npx prisma studio

# Deploy Migrations
DATABASE_URL="postgresql://...5432/postgres" npx prisma migrate deploy
```

---

## ⚡ Performance Tips

1. **Nutze Connection Pooler** (Port 6543) in Production
2. **Aktiviere Prepared Statements** in Prisma
3. **Index wichtige Queries**:
   ```sql
   CREATE INDEX idx_weekly_sport ON "WeeklySport"(weekNumber, year);
   ```
4. **Monitoring**: Supabase Dashboard → Database → Query Performance

---

## 🔐 Security Checklist

- [ ] DATABASE_URL in `.env.local` (nicht committen!)
- [ ] Secrets in Vercel Environment Variables
- [ ] RLS aktiviert (wenn Multi-User)
- [ ] API Rate Limiting (Vercel Edge Config)
- [ ] CORS konfiguriert

---

## 📊 Monitoring

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Supabase Logs
Dashboard → Logs → Database Logs

---

**Next Step**: Pushe zu GitHub → Automatisches Vercel Deployment! 🚀
