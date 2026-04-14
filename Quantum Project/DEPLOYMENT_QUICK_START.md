# 🚀 Quick Start Deployment Guide

## Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local and add your VITE_GROQ_API_KEY

# Run development server
npm run dev

# Lint code
npm run lint
```

## Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_GROQ_API_KEY
# Enter your Groq API key when prompted

# Redeploy
vercel --prod
```

## Deployment to Netlify

```bash
# Build locally
npm run build

# Option 1: Drag and drop dist folder to Netlify
# Option 2: Connect GitHub repo for auto-deploy

# Set environment variables in Netlify dashboard:
# Settings → Build & deploy → Environment → Add variable
# VITE_GROQ_API_KEY = your_api_key
```

## Environment Variables

Required:
```
VITE_GROQ_API_KEY=your_groq_api_key
```

Get your API key:
1. Visit https://console.groq.com/keys
2. Create or copy your API key
3. Set in your deployment platform

## Troubleshooting

### Build fails with "terser not found"
```bash
npm install --save-dev terser
```

### API key not working
- Verify you set `VITE_GROQ_API_KEY` in your environment
- Check that the key is active in Groq console
- Verify no typos or extra whitespace

### Features not working in production
- Check that all environment variables are set
- Verify no console errors (press F12)
- Check browser network tab for API errors

## Performance Tips

- Gzip is automatically enabled
- CSS and JS are minified automatically
- Code splitting optimizes load time
- Consider using a CDN for static files
- Enable caching in your hosting provider

## Security Reminder

⚠️ **NEVER** commit `.env` file  
✅ **ALWAYS** use `.env.local` for development  
✅ **ALWAYS** set environment variables in deployment platform

---

For detailed information, see:
- `PRODUCTION_READY.md` - Full production checklist
- `SECURITY.md` - Security guidelines
- `DEPLOYMENT.md` - Deployment documentation
