# QuantumNav Security & Deployment Guide

## Critical Security Considerations

### 1. **Environment Variables & Secrets**

**NEVER** commit the `.env` file to version control. It contains sensitive information:
- API keys
- Configuration tokens
- Credentials

**Do:**
- Use `.env.example` to document required variables
- Set environment variables in your deployment platform:
  - Vercel: Settings → Environment Variables
  - Netlify: Site settings → Build & deploy → Environment
  - Docker: Use secrets management
  - Traditional servers: Use your hosting provider's secret management

**Example for Vercel:**
```bash
vercel env add VITE_GROQ_API_KEY
# Enter the key when prompted
```

### 2. **API Key Management**

The Groq API key is required for AI-powered traffic prediction:

```bash
# Local Development
cp .env.example .env.local
# Edit .env.local and add your Groq API key
```

**Production Deployment:**
- Never use the same API key across environments (dev, staging, prod)
- Rotate keys regularly
- Monitor API usage for unauthorized access
- Set rate limits on the API key

### 3. **CORS & API Security**

The app communicates with:
- **Groq API**: `https://api.groq.com/openai/v1/chat/completions`
- **OpenStreetMap Tiles**: `https://tile.openstreetmap.org`

These are properly configured without exposing credentials in the frontend code.

### 4. **Content Security Policy (CSP)**

For production, consider adding CSP headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https:; connect-src 'self' https://api.groq.com https://tile.openstreetmap.org;
```

### 5. **Browser Security**

The app includes security headers in `index.html`:
- `referrer-policy: strict-origin-when-cross-origin`
- `X-UA-Compatible: IE=edge`
- Preconnect to external APIs

### 6. **Data Privacy**

#### Local Storage
- Route history is stored in browser localStorage
- User preferences are stored locally
- **Note**: Not encrypted; disable if handling sensitive data

#### Clearing Data
- Implement data retention policy (currently 30 days auto-expiry)
- Provide user option to export/delete data
- Do not send user data to external services without consent

#### third-party Dependencies
- All dependencies are from npm
- Regular security audits recommended: `npm audit`

### 7. **Code Security**

#### Input Validation
- Waypoint coordinates are validated (lat: -90 to 90, lng: -180 to 180)
- Number of waypoints limited to 10
- All API responses are JSON validated before use

#### Error Handling
- Errors are caught and logged appropriately
- Sensitive error information not exposed in production
- Error boundaries prevent app crashes

### 8. **Build & Deployment Security**

#### Production Build
```bash
npm run build
```

This automatically:
- Minifies all code
- Removes console logs and debug code
- Creates optimized bundles
- Disables source maps in production

#### Deployment Checklist

- [ ] Environment files are NOT committed
- [ ] API keys are set in deployment platform
- [ ] Build runs successfully: `npm run build`
- [ ] No console errors or warnings
- [ ] Security headers are configured
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] API rate limiting is set
- [ ] Monitoring/error tracking is enabled
- [ ] Backups are configured
- [ ] Staging environment matches production

### 9. **Monitoring & Logging**

#### Development
- Console logging enabled
- Full error stack traces shown
- Diagnostic information logged

#### Production
- Console logging disabled (minified out)
- Only critical errors logged to console
- Consider enabling error reporting service (e.g., Sentry)

#### Recommended Services
- **Error Tracking**: Sentry, Rollbar, or LogRocket
- **Monitoring**: Datadog, New Relic, or AWS CloudWatch
- **Analytics**: Plausible, Fathom, or PostHog

### 10.  **Dependency Security**

Keep dependencies updated:

```bash
# Check for vulnerabilities
npm audit

# Update packages
npm update

# Check for outdated packages
npm outdated
```

### 11. **DDoS & Rate Limiting**

Consider implementing rate limiting on the backend:
- Limit API requests per IP
- Implement request queuing
- Use CDN caching for static assets

### 12. **Legal & Compliance**

- Add Privacy Policy to `/public`
- Add Terms of Service documentation
- Comply with GDPR if serving EU users
- Add cookie consent banner if tracking users
- Disclose third-party service usage (Groq API, OpenStreetMap)

## Deployment Platforms

### Vercel (Recommended for Next.js-like apps)
```bash
npm install -g vercel
vercel
# Follow prompts to deploy
# Set environment variables in Vercel dashboard
```

### Netlify
```bash
npm run build
# Drag 'dist' folder to Netlify, or connect GitHub
# Set environment variables in Netlify dashboard
```

### Docker (Self-hosted)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "run", "preview"]
```

### Traditional Server (AWS EC2, DigitalOcean, etc.)
```bash
git clone <repo>
cd quantum-nav
npm install
npm run build
pm2 start "npm run preview" --name quantum-nav
```

## Incident Response

If a security issue is discovered:

1. **Rotate API keys** immediately
2. **Audit logs** for unauthorized access
3. **Notify users** if their data was affected
4. **Create a fix** and deploy ASAP
5. **Post-mortem** to prevent recurrence

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)
- [Frontend Security](https://cheatsheetseries.owasp.org/)
- [Groq API Documentation](https://console.groq.com/docs)

## Questions?

Contact your security team or refer to your organization's security policies.

---

**Last Updated**: 2026-04-13
**Status**: Production Ready
