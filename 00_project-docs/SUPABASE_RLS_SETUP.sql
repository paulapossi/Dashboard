-- Row Level Security (RLS) Setup für Life OS Dashboard
-- Diese SQL-Commands in Supabase SQL Editor ausführen

-- 1. RLS für alle Tabellen aktivieren
ALTER TABLE "WeeklySport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WeeklyReading" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WeeklyMental" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyNutrition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RelationshipDaily" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BrainDumpItem" ENABLE ROW LEVEL SECURITY;

-- 2. Policies erstellen (nur eingeloggte User haben Zugriff)
-- WeeklySport
CREATE POLICY "Enable all for authenticated users" ON "WeeklySport"
  FOR ALL USING (auth.uid() IS NOT NULL);

-- WeeklyReading
CREATE POLICY "Enable all for authenticated users" ON "WeeklyReading"
  FOR ALL USING (auth.uid() IS NOT NULL);

-- WeeklyMental
CREATE POLICY "Enable all for authenticated users" ON "WeeklyMental"
  FOR ALL USING (auth.uid() IS NOT NULL);

-- DailyNutrition
CREATE POLICY "Enable all for authenticated users" ON "DailyNutrition"
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RelationshipDaily
CREATE POLICY "Enable all for authenticated users" ON "RelationshipDaily"
  FOR ALL USING (auth.uid() IS NOT NULL);

-- DailyLog
CREATE POLICY "Enable all for authenticated users" ON "DailyLog"
  FOR ALL USING (auth.uid() IS NOT NULL);

-- JournalEntry
CREATE POLICY "Enable all for authenticated users" ON "JournalEntry"
  FOR ALL USING (auth.uid() IS NOT NULL);

-- BrainDumpItem
CREATE POLICY "Enable all for authenticated users" ON "BrainDumpItem"
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ✅ Fertig! Jetzt sind alle Daten nur für eingeloggte User zugänglich.
