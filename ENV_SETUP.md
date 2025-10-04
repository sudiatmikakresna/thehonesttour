# Environment Variables Setup

This document explains how to set up environment variables for the Bali Honest Tour website.

## Required Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### 1. Strapi API Configuration

**NEXT_PUBLIC_API_BASE_URL**
- Description: Base URL for your Strapi CMS API
- Example: `http://209.97.173.149:1337/api`
- Note: Must include `/api` at the end

**STRAPI_API_TOKEN**
- Description: Authentication token for Strapi API
- How to get:
  1. Login to your Strapi admin panel
  2. Go to Settings → API Tokens
  3. Create a new token with appropriate permissions
  4. Copy the token value

### 2. EmailOctopus Configuration

**EMAILOCTOPUS_API_KEY**
- Description: API key for EmailOctopus email subscription service
- How to get:
  1. Login to EmailOctopus dashboard
  2. Go to Settings → API
  3. Copy your API key (starts with `eo_`)

**EMAILOCTOPUS_LIST_ID**
- Description: The ID of your EmailOctopus mailing list
- How to get:
  1. Go to your EmailOctopus dashboard
  2. Click on your mailing list
  3. Look at the URL - the List ID is the UUID in the URL
  4. Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## File Structure

- `.env.local` - Your local environment variables (DO NOT COMMIT)
- `.env.example` - Example template (safe to commit)
- `.gitignore` - Already configured to ignore `.env*` files

## Security Notes

⚠️ **IMPORTANT**: Never commit `.env.local` or any file containing actual API keys to version control!

- All sensitive keys are stored in `.env.local`
- This file is already in `.gitignore`
- Share `.env.example` with your team, not `.env.local`
- For production, set environment variables in your hosting platform (Vercel, Netlify, etc.)

## Troubleshooting

### API not working
- Check that all environment variables are set in `.env.local`
- Restart your development server after changing `.env.local`
- Check the browser console and server logs for errors

### EmailOctopus subscription not working
- Verify `EMAILOCTOPUS_API_KEY` and `EMAILOCTOPUS_LIST_ID` are correct
- Check that the List ID exists in your EmailOctopus dashboard
- Check server logs for detailed error messages

## Development vs Production

### Local Development
Environment variables are loaded from `.env.local`

### Production (Vercel/Netlify)
Set environment variables in your hosting platform:
1. Go to your project settings
2. Find Environment Variables section
3. Add all variables from `.env.example`
4. Redeploy your application
