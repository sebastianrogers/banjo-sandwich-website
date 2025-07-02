# Banjo Sandwich Website

Official website for Banjo Sandwich, a bluegrass band featuring Julie, Rob, Sally, Sebastian, Simon, and Steve.

## Preview Locally

To preview the website on your local machine:

**Linux:**

```bash
python3 -m http.server 8000
```

**Windows:**

```powershell
py -m http.server 8000
```

Then open your browser to http://localhost:8000

## Deploy to GitHub Pages

### Basic GitHub Pages Setup

1. Push all changes to the main branch
2. Go to your repository settings on GitHub
3. Navigate to Pages section
4. Select "Deploy from a branch" as the source
5. Choose "main" branch and "/ (root)" folder
6. Click Save

Your website will be available at: `https://[username].github.io/banjo-sandwich-website`

### Custom Domain Setup

To use a custom domain (e.g., `www.banjosandwich.com`) with GitHub Pages:

#### Step 1: Configure DNS with Your Domain Provider

Set up DNS records with your domain registrar:

**For a subdomain (recommended):**

- Create a CNAME record pointing `www.yourdomain.com` to `[username].github.io`

**For an apex domain:**

- Create A records pointing your domain to GitHub's IP addresses:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Create a CNAME record pointing `www.yourdomain.com` to `[username].github.io`

#### Step 2: Add CNAME File to Repository

Create a `CNAME` file in the root of your repository:

```bash
echo "www.yourdomain.com" > CNAME
```

Replace `www.yourdomain.com` with your actual domain.

#### Step 3: Configure GitHub Pages Settings

1. Go to your repository settings on GitHub
2. Navigate to the Pages section
3. In the "Custom domain" field, enter your domain (e.g., `www.yourdomain.com`)
4. Check "Enforce HTTPS" (recommended)
5. Click Save

#### Step 4: Verify Setup

- DNS propagation can take up to 24 hours
- GitHub will automatically verify your domain configuration
- Once verified, your site will be available at your custom domain with HTTPS

#### Troubleshooting Custom Domains

- **DNS not propagating**: Use tools like `dig` or online DNS checkers to verify your records
- **HTTPS certificate issues**: Uncheck and re-check "Enforce HTTPS" in GitHub Pages settings
- **404 errors**: Ensure your CNAME file contains only your domain name with no extra characters

## Project Structure

- `index.html` - Main website page
- `styles.css` - Website styling
- `asset/` - Logo files and brand assets
- `_config.yml` - GitHub Pages configuration
- `CNAME` - Custom domain configuration (if using custom domain)

## Features

- Responsive design that works on mobile and desktop
- Band member showcase
- Official Banjo Sandwich branding and colors
- Optimized for GitHub Pages hosting
- Custom domain support
