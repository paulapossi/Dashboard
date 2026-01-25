# 🧪 Test Checklist - Nach Optimierungen

## ✅ TypeScript & Build

- [x] **TypeScript Kompilierung**: `npm run type-check` - Erfolgreich
- [x] **Production Build**: `npm run build` - Erfolgreich
- [x] **Keine ESLint Errors**: Code sauber
- [x] **Type Definitions**: @types/estree, @types/json-schema installiert

---

## 🔍 Code Quality Checks

### **1. React Cache Implementation**
- [x] `getWeeklySport()` - wrapped mit `cache()`
- [x] `getWeeklyReading()` - wrapped mit `cache()`
- [x] `getTodayNutrition()` - wrapped mit `cache()`
- [x] `getMentalData()` - wrapped mit `cache()`
- [x] `getWeeklyUniStats()` - wrapped mit `cache()`
- [x] `getTodayRelationship()` - wrapped mit `cache()`

**Expected Result**: Deduplizierte DB Queries bei parallel Fetches

### **2. Constants Konsolidierung**
- [x] `BottleCard.tsx` nutzt `COLOR_THEMES` aus `constants.ts`
- [x] `BottleCard.tsx` nutzt `BOTTLE_SHAPES` aus `constants.ts`
- [x] Keine Duplikate mehr

### **3. Database Connection**
- [x] Supabase Pooling konfiguriert (max: 1)
- [x] Timeouts gesetzt (30s idle, 10s connection)
- [x] Production Logging reduziert (nur errors)

### **4. Vercel Config**
- [x] Image Optimization aktiviert
- [x] Server Actions Body Limit gesetzt
- [x] Webpack Fallbacks konfiguriert

### **5. CI/CD**
- [x] GitHub Actions Workflow erstellt
- [x] Type-check in Pipeline
- [x] Build Test in Pipeline

---

## 🧪 Runtime Tests (Manuell)

### **Dashboard (`/`)**
- [ ] Dashboard lädt ohne Errors
- [ ] Alle 6 Widgets werden angezeigt
- [ ] Progress Bars zeigen korrekten Wert
- [ ] Quick Capture funktioniert
- [ ] Keine doppelten DB Queries (Check DevTools Network)

### **Sport (`/sport`)**
- [ ] Checkboxen togglen funktioniert
- [ ] State Update sofort sichtbar
- [ ] Revalidation triggert Dashboard Update
- [ ] Progress korrekt berechnet

### **Lesen (`/lesen`)**
- [ ] 7-Tage Grid funktioniert
- [ ] Toggle Days funktioniert
- [ ] Streak Calculation korrekt

### **Ernährung (`/ernaehrung`)**
- [ ] 4 Habits togglebar
- [ ] History wird angezeigt
- [ ] Sweets Counter funktioniert

### **Paula (`/paula`)**
- [ ] Toggle Together funktioniert
- [ ] Check-in speichern funktioniert
- [ ] History lädt

### **Mental (`/mental`)**
- [ ] Me-Time Counter funktioniert
- [ ] Brain Dumps werden gespeichert
- [ ] Journal Entry funktioniert

### **Uni (`/uni`)**
- [ ] Deep Work Log funktioniert
- [ ] Tasks erstellen/löschen
- [ ] Stats korrekt

---

## ⚡ Performance Tests

### **Lighthouse Score (Production)**
- [ ] Performance: >90
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >80

### **Network Tab**
- [ ] Deduplizierte Fetches (cache() wirkt)
- [ ] Keine redundanten DB Calls
- [ ] Images optimiert durch Vercel

### **Bundle Size**
- [ ] First Load JS < 200KB
- [ ] Route Chunks < 50KB each

---

## 🚀 Vercel Deployment Test

### **Environment Variables**
- [ ] `DATABASE_URL` mit `:6543` (Pooler)
- [ ] `NODE_ENV=production`

### **Build Logs**
- [ ] Keine Fehler im Build
- [ ] Prisma Generate erfolgreich
- [ ] Alle Routen kompiliert

### **Runtime**
- [ ] Keine Connection Pool Errors
- [ ] DB Queries < 100ms
- [ ] Cold Start < 2s

---

## 🔐 Security Checks

- [ ] `.env.local` in `.gitignore`
- [ ] Keine Secrets im Code
- [ ] DATABASE_URL nicht exposed
- [ ] Rate Limiting (optional)

---

## 📊 Database Checks (Supabase)

### **Connection Pooler**
- [ ] Nutzt Port 6543 in Production
- [ ] Keine "too many connections" Errors
- [ ] Query Performance < 50ms

### **Indexes**
```sql
-- Check ob Indexes existieren
SELECT * FROM pg_indexes WHERE tablename IN ('WeeklySport', 'DailyLog', 'WeeklyReading');
```

**Empfohlen**:
```sql
CREATE INDEX IF NOT EXISTS idx_weekly_sport_week 
  ON "WeeklySport"(weekNumber, year);

CREATE INDEX IF NOT EXISTS idx_daily_log_date 
  ON "DailyLog"(date DESC);

CREATE INDEX IF NOT EXISTS idx_weekly_reading_week 
  ON "WeeklyReading"(weekNumber, year);
```

---

## 🐛 Known Issues to Test

1. **Cache Invalidation**: Prüfen ob `revalidatePath()` nach Mutations korrekt feuert
2. **Hydration**: Client/Server State Sync bei Widgets
3. **Connection Leaks**: Nach mehreren Deployments Supabase Dashboard checken
4. **Image Optimization**: Falls Images langsam → Vercel Image Config prüfen

---

## 📝 Quick Test Commands

```bash
# Local Dev
npm run dev

# Type Check
npm run type-check

# Build Test
npm run build

# Lint
npm run lint

# Prisma Studio (DB prüfen)
npx prisma studio
```

---

## ✅ Success Criteria

- ✅ Alle TypeScript Checks grün
- ✅ Production Build erfolgreich
- ⏳ Keine Runtime Errors beim Navigieren
- ⏳ Cache Deduplication funktioniert
- ⏳ Vercel Deployment erfolgreich
- ⏳ Performance Score >90

---

**Status**: 🟡 Build erfolgreich, Runtime Tests ausstehend

**Next**: Starte `npm run dev` und teste manuell alle Routes!
