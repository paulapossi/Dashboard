# Life-OS Dashboard

> A personal productivity dashboard to track and optimize all areas of your life.

## 🎯 Overview

Life-OS Dashboard is a gamified personal operating system that helps you track and improve across 6 core life categories:

- 🎓 **Uni** - Deep work sessions, skill development, task management
- 💪 **Sport** - Weekly fitness goals (2x Gym, 2x Running)
- 📚 **Lesen** - Daily reading habit tracking
- 🥗 **Ernährung** - Nutrition habits (Protein, Vitamins, Water, Sweets)
- ❤️ **Paula** - Relationship quality time and communication
- 🧠 **Mental** - Me-time hours, journaling, brain dumps

## ✨ Features

- **Bottle Visualizations** - Animated liquid-fill progress indicators with various shapes
- **Weekly Tracking** - Automatic week-based data aggregation
- **Quick Capture** - Brain dump functionality for instant thought capture
- **Server Actions** - Optimized data mutations with Next.js 15
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Updates** - Automatic revalidation on data changes

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/Possi15/Dashy.git
cd Dashy/life-os-dashboard/02_frontend
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/lifeosdb"
```

4. Setup database
```bash
npx prisma generate
npx prisma db push
```

5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📁 Project Structure

```
02_frontend/
├── src/
│   ├── actions/          # Server actions for data mutations
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   │   ├── dashboard/   # Dashboard widgets
│   │   ├── ui/          # Reusable UI components
│   │   └── ...
│   ├── lib/             # Utilities and helpers
│   │   ├── db.ts        # Database client
│   │   ├── constants.ts # App constants
│   │   └── quotes.ts    # Daily quotes
│   └── types/           # TypeScript type definitions
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## 📊 Database Models

- **UniTask** - University tasks with priorities
- **DailyLog** - Daily deep work and learning logs
- **WeeklySport** - Weekly fitness tracking
- **WeeklyReading** - 7-day reading streaks
- **DailyNutrition** - Daily nutrition habits
- **WeeklyMental** - Me-time hours tracking
- **RelationshipDaily** - Relationship quality tracking
- **BrainDumpItem** - Quick thought captures
- **JournalEntry** - Daily journaling

## 🎨 Design Philosophy

- **Gamification** - Progress visualization through animated bottles
- **Minimalism** - Clean, dark UI with glass-morphism effects
- **Data-Driven** - Weekly goals and real-time progress tracking
- **Habit Formation** - Consistent daily/weekly tracking

## 🔧 Configuration

Weekly goals can be adjusted in `src/lib/constants.ts`:

```typescript
export const WEEKLY_GOALS = {
  SPORT_SESSIONS: 4,
  READING_DAYS: 7,
  NUTRITION_HABITS: 4,
  RELATIONSHIP_DAYS: 5,
  MENTAL_ME_TIME_HOURS: 5,
  UNI_SESSIONS: 5,
};
```

## 📝 License

MIT

## 👤 Author

**Possi15**

---

*Built with ❤️ to optimize life, one habit at a time.*
