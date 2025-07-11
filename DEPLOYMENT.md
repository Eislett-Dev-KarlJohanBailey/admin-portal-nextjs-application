# Deployment Guide

## Netlify Deployment

This application is configured to deploy on Netlify with serverless functions to handle API routes.

### Environment Variables

Set these environment variables in your Netlify dashboard:

1. **BACKEND_URL**: The URL of your backend API (e.g., `https://your-backend-api.com`)

### Build Settings

The application is configured to:
- Build with `npm run build`
- Publish from the `out` directory
- Use Netlify functions for API routes

### API Routes

All API routes (`/api/*`) are proxied to Netlify functions that forward requests to your backend API.

### Troubleshooting

If you encounter 500 errors:

1. Check that `BACKEND_URL` environment variable is set correctly
2. Verify your backend API is accessible from Netlify's servers
3. Check Netlify function logs in the dashboard

### Alternative: Deploy to Vercel

For better Next.js support, consider deploying to Vercel:

1. Connect your repository to Vercel
2. Set the `BACKEND_URL` environment variable
3. Deploy - Vercel will handle Next.js API routes natively

### Local Development

For local development, the Next.js API routes work as expected:

```bash
npm run dev
```

The API routes will proxy to your local backend at `http://localhost:8000` by default. 