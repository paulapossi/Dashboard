-- CreateTable
CREATE TABLE "UniTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'IMPORTANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mainTask" TEXT,
    "goalDeepWorkMinutes" INTEGER,
    "actualDeepWorkMinutes" INTEGER NOT NULL DEFAULT 0,
    "focusLevel" INTEGER NOT NULL DEFAULT 0,
    "distraction" TEXT,
    "outputProduced" BOOLEAN NOT NULL DEFAULT false,
    "topic" TEXT,
    "understandingLevel" INTEGER NOT NULL DEFAULT 0,
    "canExplain" BOOLEAN NOT NULL DEFAULT false,
    "technicalConcept" TEXT,
    "businessExplanation" TEXT,
    "talkedToSenior" BOOLEAN NOT NULL DEFAULT false,
    "realityCheckBusy" BOOLEAN NOT NULL DEFAULT false,
    "realityCheckAvoided" BOOLEAN NOT NULL DEFAULT false,
    "realWorldApplication" TEXT,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklySkillStack" (
    "id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "analysisSkill" TEXT NOT NULL DEFAULT 'EQUAL',
    "communicationSkill" TEXT NOT NULL DEFAULT 'EQUAL',
    "structureSkill" TEXT NOT NULL DEFAULT 'EQUAL',
    "toolSkill" TEXT NOT NULL DEFAULT 'EQUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklySkillStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklySport" (
    "id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "gym1" BOOLEAN NOT NULL DEFAULT false,
    "gym2" BOOLEAN NOT NULL DEFAULT false,
    "run1" BOOLEAN NOT NULL DEFAULT false,
    "run2" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklySport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReading" (
    "id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "day1" BOOLEAN NOT NULL DEFAULT false,
    "day2" BOOLEAN NOT NULL DEFAULT false,
    "day3" BOOLEAN NOT NULL DEFAULT false,
    "day4" BOOLEAN NOT NULL DEFAULT false,
    "day5" BOOLEAN NOT NULL DEFAULT false,
    "day6" BOOLEAN NOT NULL DEFAULT false,
    "day7" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyNutrition" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "protein" BOOLEAN NOT NULL DEFAULT false,
    "vitamins" BOOLEAN NOT NULL DEFAULT false,
    "water" BOOLEAN NOT NULL DEFAULT false,
    "sweets" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyNutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyMental" (
    "id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "meTimeHours" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyMental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrainDumpItem" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrainDumpItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipDaily" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isTogether" BOOLEAN NOT NULL DEFAULT false,
    "qualityTime" BOOLEAN NOT NULL DEFAULT false,
    "communication" BOOLEAN NOT NULL DEFAULT false,
    "gratitude" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelationshipDaily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySport_weekNumber_year_key" ON "WeeklySport"("weekNumber", "year");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReading_weekNumber_year_key" ON "WeeklyReading"("weekNumber", "year");

-- CreateIndex
CREATE UNIQUE INDEX "DailyNutrition_date_key" ON "DailyNutrition"("date");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyMental_weekNumber_year_key" ON "WeeklyMental"("weekNumber", "year");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipDaily_date_key" ON "RelationshipDaily"("date");
