# Oslo Languages Website

A modern, responsive website for Oslo Languages school built with Next.js, TypeScript, and Tailwind CSS. This project serves as a marketing platform for language courses offered in Oslo, Norway.

## Project Overview

Oslo Languages Website is designed to provide clear marketing content for Norwegian, English, and Spanish language courses in Oslo. The site features an intuitive, engaging, and accessible interface for diverse audiences, facilitating student inquiries through a contact form integrated with SendGrid for email delivery.

### Key Objectives

- Create an engaging, responsive website for language course marketing
- Enhance conversion through clear CTAs and compelling content
- Build a platform that effectively communicates school values and success stories
- Provide a simple admin interface for content management

## Technologies Used

- **Frontend**
  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations

- **Backend & API**
  - Custom API endpoints built with Next.js API routes
  - SendGrid integration for contact form submission
  - NextAuth.js for admin authentication

- **DevOps & Tooling**
  - ESLint for code linting
  - PostCSS with Autoprefixer
  - Next.js Bundle Analyzer (optional)

## Key Features

### Marketing Pages
- **Home Page**: Hero section, course overview, testimonials, and CTAs
- **About Page**: School history, teaching methodology, teacher profiles
- **Courses Page**: Detailed course listings with filtering options
- **Blog**: Dynamic blog with categories, search, and pagination
- **Contact Page**: Form with real-time validation and SendGrid integration
- **Legal Pages**: Privacy policy and terms of service

### Admin Interface
- Secure login with NextAuth.js
- Dashboard with key metrics
- Blog post management (create, edit, delete)
- Content management for static pages
- Course management

### Technical Features
- Mobile-first responsive design
- SEO optimization with metadata
- Optimized images and lazy loading
- Animated components with Framer Motion
- Accessibility compliance
- Type-safe development with TypeScript

## Project Structure

```
oslo-languages-website/
├── public/                  # Static assets (images, favicon, etc.)
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (marketing)/     # Public-facing pages
│   │   ├── admin/           # Admin pages
│   │   └── api/             # API endpoints
│   ├── components/          # Reusable React components
│   │   ├── common/          # Shared UI components
│   │   ├── features/        # Feature-specific components
│   │   └── layout/          # Layout components
│   ├── data/                # Static data and mock content
│   ├── lib/                 # Utility functions and services
│   │   ├── auth.ts          # Authentication configuration
│   │   └── utils/           # Utility functions
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── .env.local               # Environment variables (not in repo)
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
└── package.json             # Project dependencies
```

## Local Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/josuejero/oslo-languages.git
   cd oslo-languages
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # SendGrid API Key for email functionality
   SENDGRID_API_KEY=your_sendgrid_api_key
   
   # Admin email for receiving contact form submissions
   ADMIN_EMAIL=admin@example.com
   
   # NextAuth secret for session encryption
   NEXTAUTH_SECRET=your_random_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Deployment

The easiest way to deploy this Next.js app is using the Vercel Platform:

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import the project in Vercel
3. Set the required environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Project Link: [https://github.com/josuejero/oslo-languages](https://github.com/josuejero/oslo-languages)