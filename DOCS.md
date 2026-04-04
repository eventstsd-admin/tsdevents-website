# 📚 TSD Events - Documentation Index

Welcome to the TSD Events project documentation! Here's a guide to all available resources.

---

## 🚀 Getting Started

Start here if you're new to the project:

1. **[QUICKSTART.md](./QUICKSTART.md)** ⚡ (5 minutes)
   - Quick setup instructions
   - Environment configuration
   - Common issues and solutions
   - **Start here if you just want to run the app**

2. **[supabase/SETUP.md](./supabase/SETUP.md)** 🗄️
   - Supabase integration overview
   - What was done
   - How to use the database operations
   - Database table schema
   - Troubleshooting guide

3. **[supabase/](./supabase/)** 📁 (New Folder!)
   - Organized Supabase configuration
   - README.md - Overview
   - SETUP.md - Integration guide
   - SCHEMA.md - Database schema
   - schema.sql - SQL script

---

## 📖 Detailed Documentation

These files provide in-depth information about the project:

4. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** 🏗️
   - Complete directory structure
   - Technology stack
   - File organization standards
   - Development workflow
   - Common development tasks
   - Deployment instructions
   - **Read this for project overview and architecture**

5. **[supabase/SCHEMA.md](./supabase/SCHEMA.md)** 🛢️
   - Database schema SQL
   - How to run the schema in Supabase
   - Table descriptions
   - **Use this to create tables in Supabase**

---

## 📋 Reference Files

### Configuration Files
- `.env` - Your Supabase credentials (don't commit!)
- `.env.example` - Template for environment variables
- `package.json` - Project dependencies
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration

### Source Files
- `src/supabase.ts` - Supabase client and CRUD operations
- `src/app/pages/AdminDashboard.tsx` - Supabase-powered admin panel
- `src/app/routes.tsx` - Route definitions
- `src/main.tsx` - Application entry point

### Assets
- `src/app/images/` - Image assets including logo
- `public/` - Static public assets

---

## 🎯 Quick Links by Task

### "I want to..."

#### ...set up the project
→ Read [QUICKSTART.md](./QUICKSTART.md)

#### ...understand the project structure  
→ Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

#### ...create the database tables
→ Use [supabase/SCHEMA.md](./supabase/SCHEMA.md)

#### ...add a new page
→ See "Add New Page" in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

#### ...add a database table
→ See "Add New Database Table" in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

#### ...use Supabase in my component
→ See "How to Use" in [supabase/SETUP.md](./supabase/SETUP.md)

#### ...debug an issue
→ See "Troubleshooting" sections in [QUICKSTART.md](./QUICKSTART.md) or [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

## 💻 Development Workflow

```
1. Run: npm install
   └─ Install all dependencies

2. Configure: Update .env with Supabase credentials
   └─ Get from supabase.com project settings

3. Database: Run SQL from supabase/SCHEMA.md in Supabase
   └─ Creates events, inquiries, photos tables

4. Develop: npm run dev
   └─ Start development server on http://localhost:5173

5. Build: npm run build
   └─ Create production build
```

---

## 🔑 Key Concepts

### Supabase Integration
- All database operations are in `src/supabase.ts`
- Import what you need: `import { pastEventOperations } from '@/supabase'`
- Async/await pattern for all database calls
- Error handling with try/catch recommended

### Admin Dashboard
- Located at `/admin` route
- Loads data from Supabase automatically
- Shows helpful error messages if not configured
- Main sections: Dashboard, Past Events, Photos

### Environment Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public API key
- Never commit `.env` file to git
- Use `.env.example` as template

### Database Tables
- **past_events** - Past event records with details
- **event_photos** - Photo gallery for events
- **inquiries** - Customer inquiries/messages
- All tables have timestamps and proper indexing

---

## 🚀 Deployment

For deploying to production:

1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred host
3. Set environment variables on the hosting platform
4. Create a production Supabase project (or use same with RLS policies)

See "Deployment" section in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for details.

---

## 🆘 Getting Help

### Common Issues

**Problem**: "Supabase Not Configured" in admin panel
- **Solution**: Check `.env` file has correct credentials

**Problem**: Tables not found error
- **Solution**: Run SQL schema from supabase/SCHEMA.md in Supabase

**Problem**: npm install fails
- **Solution**: Delete `node_modules` and `package-lock.json`, reinstall

### External Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev  
- **TypeScript Docs**: https://www.typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **Vite**: https://vitejs.dev

---

## 📦 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + Radix UI
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Routing**: React Router v7
- **Icons**: Lucide React

---

## 📅 Version Info

- **Project Version**: 1.0.0
- **Last Updated**: April 2026
- **Status**: Production Ready with Supabase Integration

---

## ✅ Checklist

Before going live, make sure you've:

- [ ] Read QUICKSTART.md
- [ ] Ran `npm install`
- [ ] Created Supabase project
- [ ] Executed database schema
- [ ] Updated `.env` with credentials
- [ ] Tested admin dashboard
- [ ] Verified all features work
- [ ] Reviewed PROJECT_STRUCTURE.md

---

**Questions?** Check the relevant documentation file above!  
**Ready to start?** Open [QUICKSTART.md](./QUICKSTART.md) 🚀
