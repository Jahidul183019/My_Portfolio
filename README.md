# Portfolio

A modern, responsive personal portfolio website showcasing projects, skills, and experience with a sleek glassmorphism UI design.

## Features

- **Responsive Design** - Optimized for mobile, tablet, and desktop with iOS 26 glass morphism styling
- **Home Page** - Hero section with animated gradient background and call-to-action buttons
- **About/Bio Page** - Profile information, skills showcase, and educational background
- **Projects Gallery** - Display projects with filtering, detailed modal views, and project descriptions
- **Contact Form** - Fully functional contact form with email integration via Nodemailer
- **Smooth Animations** - Modern animations and transitions throughout the site
- **Mobile-First** - Priority on mobile experience with adaptive layouts
- **Fast Performance** - Built with Next.js 16+ and Turbopack for optimal speed

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Runtime**: React 18+
- **Styling**: Custom CSS with animations and glass morphism effects
- **Email Service**: Nodemailer
- **Build Tool**: Turbopack
- **Language**: TypeScript/JavaScript

## Project Structure

```
/app
  ├── page.js                 # Home page
  ├── layout.tsx              # Root layout with Navbar
  ├── globals.css             # Global styles
  ├── home.css                # Home page styles
  ├── api/
  │   └── contact/
  │       └── route.js        # Contact form API endpoint
  ├── bio/
  │   ├── page.js            # About/Bio page
  │   └── bio.css            # Bio page styles
  ├── projects/
  │   ├── page.js            # Projects showcase page
  │   └── projects.css       # Projects page styles
  ├── contact/
  │   ├── page.js            # Contact page
  │   └── contact.css        # Contact page styles
  └── components/
      ├── Navbar.js          # Navigation bar
      ├── Navbar.css         # Navbar styles
      ├── Modal.js           # Project details modal
      └── ProjectCard.js     # Project card component
/public                        # Static assets
package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd My_Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env.local` file in the project root:
   ```
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   EMAIL_TO=your_destination_email
   ```
   
   **Note**: Use [Gmail App Password](https://support.google.com/accounts/answer/185833) for `EMAIL_PASS`, not your regular password.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the portfolio.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Build the project for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |

## Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Gmail address for sending emails | `your.email@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `EMAIL_TO` | Destination email for contact form | `contact@example.com` |

## Email Setup (Gmail)

1. Enable 2-Step Verification in your Google Account
2. Generate an [App Password](https://support.google.com/accounts/answer/185833) for Node.js
3. Use the 16-character app password in `EMAIL_PASS`

## Building & Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your repository to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and select your repository
4. Set environment variables:
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_TO`
5. Click "Deploy"

The site will be live at `your-project.vercel.app`

### Deploy to Other Platforms

The project can be deployed to:
- Netlify
- Heroku
- AWS
- Azure
- Any Node.js hosting provider

## Pages & Features

### Home (`/`)
- Hero section with gradient background
- Animated title with call-to-action buttons
- Quick links to projects and contact

### About/Bio (`/bio`)
- Profile picture and introduction
- Skills showcase with category filtering
- Education and experience timeline
- About cards with key information

### Projects (`/projects`)
- Grid layout of all projects
- Filter projects by category
- Click to view project details in modal
- Project descriptions, tech stack, and links

### Contact (`/contact`)
- Contact form with validation
- Email integration
- Form submission feedback
- Contact information display

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsiveness

The portfolio is fully responsive with breakpoints at:
- **768px** - Tablet devices
- **480px** - Mobile devices

## Performance

- **Lighthouse Score**: Optimized for speed and accessibility
- **Turbopack**: Fast development builds
- **CSS Optimization**: Minified and optimized styles
- **Image Optimization**: Next.js Image component for responsive images

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is open source and available under the MIT License.

## Author

Md. Jahidul Islam

## Support

For issues or questions, please open an issue on GitHub or contact via the portfolio contact form.
