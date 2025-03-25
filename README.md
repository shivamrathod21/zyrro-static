# Zyro Visuals - Gaming Video Editing Portfolio

A professional dark-themed portfolio website for a gaming video editor, featuring interactive elements, video showcases, and admin CMS functionality.

![Zyro Visuals](https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/zyro-visuals.png)

## Project Overview

Zyro Visuals is a modern, responsive portfolio website built for a gaming video editor. The site showcases the editor's work with a dark theme (black background, white text, yellow accents) and features interactive elements like a custom cursor, animated navigation, and video showcases.

### Features Implemented

- ✅ Dark theme design with black background (#000000), white text (#FFFFFF), and yellow accents (#FFD700)
- ✅ Sticky dynamic Iceland-style header with animated transitions
- ✅ Custom cursor with interactive animations (follows mouse movement)
- ✅ Hero section with background video and "I KEEP THEM HOOKED" headline
- ✅ Animated wave lines at the bottom similar to Prime Entertainment
- ✅ Services section with service cards
- ✅ Portfolio grid with project showcases
- ✅ Interactive before/after comparison slider
- ✅ Testimonials section with horizontal scrolling cards
- ✅ Creators showcase with subscriber counts
- ✅ Contact form for booking inquiries
- ✅ Admin CMS for content management
- ✅ Responsive design for all screen sizes

### Tech Stack

- **Frontend**: React.js with TypeScript
- **UI Framework**: TailwindCSS with shadcn/ui components
- **Animations**: Framer Motion
- **Routing**: Wouter
- **State Management**: React Query/Context
- **Forms**: React Hook Form with Zod validation
- **Backend**: Express.js
- **Database**: In-memory (can be replaced with PostgreSQL)

## Implemented Features/Tasks

- [x] Custom cursor with interactive animations 
- [x] Portfolio filtering options with advanced filters
- [x] Admin dashboard with content management
- [x] SEO enhancements with meta tags and structured data
- [x] LinkedIn social media integration
- [x] Image loading performance optimizations
- [x] Responsive design for all device sizes

## Next Steps / Future Enhancements

- [ ] Image upload functionality for portfolio items and creators
- [ ] Video embedding from YouTube for portfolio showcases
- [ ] User authentication improvements with JWT
- [ ] Email notification system for booking inquiries
- [ ] Additional animation effects
- [ ] Internationalization support
- [ ] Dark/light theme toggle
- [ ] Client dashboard for project tracking

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/shivamrathod21/ZYRO_VISUAL.git
   cd ZYRO_VISUAL
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

### Admin Access

To access the admin dashboard:

1. Navigate to `/admin/login`
2. Use the following credentials:
   - Username: `shakti`
   - Password: `shivit721`

## Deployment Guide

### Deploying Locally

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Files Not Required for Deployment

When deploying to production, the following files/directories can be excluded:

- `.git/` - Git version control files
- `node_modules/` - Development dependencies (will be reinstalled in production)
- `.github/` - GitHub specific files
- `*.log` - Log files
- `.DS_Store` - macOS specific files
- `attached_assets/` - Development assets and screenshots
- `drizzle/` - Database migration files (if not using them)
- `.env.local` or `.env.development` - Development environment variables
- `*test*` or `*spec*` files - Testing files

### Deploying to AWS

#### Prerequisites

- AWS account
- AWS CLI installed and configured
- Basic knowledge of AWS services (EC2, S3, etc.)

#### Setup with EC2

1. Create an EC2 instance (recommended: t2.micro with Ubuntu)

2. Configure security groups to allow HTTP (80) and HTTPS (443) traffic

3. SSH into your instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

4. Install Node.js and npm:
   ```bash
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

5. Clone the repository:
   ```bash
   git clone https://github.com/shivamrathod21/ZYRO_VISUAL.git
   cd ZYRO_VISUAL
   ```

6. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

7. Install PM2 to manage the Node.js process:
   ```bash
   sudo npm install -g pm2
   ```

8. Start the server with PM2:
   ```bash
   pm2 start npm --name "zyro-visuals" -- start
   ```

9. (Optional) Configure Nginx as a reverse proxy:
   ```bash
   sudo apt-get install nginx
   ```

   Create a new Nginx configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/zyro-visuals
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/zyro-visuals /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

10. (Optional) Set up SSL with Let's Encrypt:
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ```

### Alternative Deployment Options

#### Replit Deployment

This project is Replit-ready and can be deployed directly from the Replit interface by clicking the "Deploy" button.

#### Vercel / Netlify (Frontend Only)

If you want to deploy just the frontend:

1. Set up a separate backend API server
2. Update the API URLs in the frontend code
3. Deploy the frontend to Vercel or Netlify following their documentation

## Project Structure

- `/client`: Frontend React application
  - `/src/components`: UI components
  - `/src/pages`: Page components
  - `/src/lib`: Utility functions
  - `/src/hooks`: Custom React hooks
- `/server`: Backend Express application
  - `index.ts`: Entry point
  - `routes.ts`: API routes
  - `storage.ts`: Data storage implementation
- `/shared`: Shared code between frontend and backend
  - `schema.ts`: Data schema definitions using Zod

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Wouter](https://github.com/molefrog/wouter)
- [Express](https://expressjs.com/)
- Free stock videos from [Mixkit](https://mixkit.co/)# web9
