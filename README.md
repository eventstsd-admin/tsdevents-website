
  # TSD Events & Decor

  Professional event management and decoration services website. A fully-functional, production-ready platform for showcasing event services, managing bookings, and gallery uploads.

  ## Features

  - 🎨 Premium UI/UX design
  - 📱 Fully responsive and mobile-friendly
  - 🖼️ Photo gallery with portfolio showcase
  - 📧 Contact and inquiry forms
  - 👨‍💼 Admin dashboard for managing events and inquiries
  - 🖼️ Image uploads to Cloudinary
  - 🔐 Secure admin authentication
  - 📊 Event management system

  ## Getting Started

  ### Prerequisites
  - Node.js 18+ installed
  - npm or pnpm package manager

  ### Installation

  1. Clone the repository
  2. Install dependencies:
     ```bash
     npm install
     ```

  3. Create a `.env` file with your Supabase and Cloudinary credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_key
     VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
     VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
     VITE_GOOGLE_AI_API_KEY=your_api_key
     ```

  ### Running Locally

  Start the development server:
  ```bash
  npm run dev
  ```

  The website will be available at `http://localhost:5173`

  ### Building for Production

  Build the optimized production bundle:
  ```bash
  npm run build
  ```

  ## Technologies Used

  - **Frontend:** React 18 + TypeScript + Vite
  - **Styling:** Tailwind CSS
  - **Database:** Supabase (PostgreSQL)
  - **Image Hosting:** Cloudinary
  - **Authentication:** Supabase Auth
  - **UI Components:** Shadcn/ui + Radix UI
  - **Router:** React Router v7
  - **Animations:** Motion (Framer Motion)

  ## Project Structure

  ```
  src/
  ├── app/
  │   ├── components/    # Reusable UI components
  │   ├── pages/         # Page components
  │   ├── images/        # Static images and logos
  │   └── utils/         # Utility functions
  ├── styles/            # Global CSS
  ├── supabase.ts        # Supabase client and operations
  └── main.tsx           # Application entry point
  ```

  ## Admin Dashboard

  Access the admin panel at `/admin`:
  - Login with your admin credentials
  - Manage past events and gallery
  - View customer inquiries
  - Upload event photos

  ## Deployment

  The application is ready to deploy to services like Vercel, Netlify, or any static hosting platform.

  For detailed deployment instructions, see `DEPLOYMENT_GUIDE.md`

  ## Documentation

  - `PWA_SETUP_GUIDE.md` - Progressive Web App configuration
  - `RATE_LIMITING_GUIDE.md` - Request rate limiting setup
  - `IMPLEMENTATION_PRIORITIES.md` - Feature implementation roadmap
  - `DATABASE_REVIEW.md` - Database structure and usage

  ## License

  This project is proprietary and confidential.
  
  