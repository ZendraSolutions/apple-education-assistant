# Deployment Guide - GitHub Pages

Complete guide for deploying Apple Edu Assistant to GitHub Pages with automatic CI/CD.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Repository Setup](#repository-setup)
- [GitHub Pages Configuration](#github-pages-configuration)
- [Automatic Workflow](#automatic-workflow)
- [Manual Deployment](#manual-deployment)
- [Custom Domain Setup](#custom-domain-setup)
- [Troubleshooting](#troubleshooting)
- [Production URLs](#production-urls)

---

## Prerequisites

### Required

1. **GitHub Account** with repository access
2. **Repository** with the Apple Edu Assistant source code
3. **Repository Permissions**: Admin or Maintainer role

### Recommended

- Git installed locally for pushing changes
- Basic understanding of GitHub Actions

---

## Repository Setup

### 1. Fork or Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/apple-edu-assistant.git
cd apple-edu-assistant

# Or fork via GitHub UI and clone your fork
git clone https://github.com/YOUR-USERNAME/apple-edu-assistant.git
```

### 2. Verify Project Structure

Ensure these files exist in your repository root:

```
apple-edu-assistant/
├── index.html              # Main entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
├── css/
├── js/
├── data/
├── assets/
│   └── icons/
└── docs/
```

### 3. Verify Workflow File

The deployment workflow should exist at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## GitHub Pages Configuration

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**
   - This enables the automatic workflow deployment

![GitHub Pages Settings](https://docs.github.com/assets/cb-12207/mw-1440/images/help/pages/pages-source-actions.webp)

### Step 2: Verify Permissions

1. Go to **Settings** > **Actions** > **General**
2. Under **Workflow permissions**:
   - Select **Read and write permissions**
   - Check **Allow GitHub Actions to create and approve pull requests** (optional)

### Step 3: Run First Deployment

The deployment triggers automatically on:
- Push to `main` branch
- Manual trigger via **Actions** > **Deploy to GitHub Pages** > **Run workflow**

---

## Automatic Workflow

### How It Works

```
Push to main → GitHub Actions → Build Artifact → Deploy to Pages
```

1. **Trigger**: Push to `main` branch or manual dispatch
2. **Checkout**: Clones the repository
3. **Setup**: Configures GitHub Pages
4. **Upload**: Creates deployment artifact from root directory
5. **Deploy**: Publishes to GitHub Pages

### Workflow Details

| Step | Action | Purpose |
|------|--------|---------|
| Checkout | `actions/checkout@v4` | Clone repository |
| Setup Pages | `actions/configure-pages@v4` | Configure Pages settings |
| Upload artifact | `actions/upload-pages-artifact@v3` | Package files for deployment |
| Deploy | `actions/deploy-pages@v4` | Publish to GitHub Pages |

### Viewing Deployment Status

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. View deployment status and logs

### Deployment Environments

The workflow creates a `github-pages` environment:
- Go to **Settings** > **Environments**
- View deployment history and URLs

---

## Manual Deployment

### Trigger Manual Deployment

1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow** button

### Force Rebuild

To force a rebuild without code changes:

```bash
# Create an empty commit
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

---

## Custom Domain Setup

### Option 1: Subdomain (Recommended)

1. Create a `CNAME` file in repository root:
   ```
   app.yourdomain.com
   ```

2. Configure DNS:
   - Add CNAME record: `app` → `your-username.github.io`

3. Enable in GitHub:
   - **Settings** > **Pages** > **Custom domain**: `app.yourdomain.com`
   - Check **Enforce HTTPS**

### Option 2: Apex Domain

1. Create a `CNAME` file:
   ```
   yourdomain.com
   ```

2. Configure DNS with A records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

3. Configure AAAA records (IPv6):
   ```
   2606:50c0:8000::153
   2606:50c0:8001::153
   2606:50c0:8002::153
   2606:50c0:8003::153
   ```

4. Enable in GitHub Settings

### DNS Propagation

- DNS changes may take 24-48 hours to propagate
- Use [DNS Checker](https://dnschecker.org/) to verify propagation

---

## Troubleshooting

### Common Issues

#### 1. Deployment Fails: "Permission denied"

**Cause**: Insufficient workflow permissions

**Solution**:
1. Go to **Settings** > **Actions** > **General**
2. Set **Workflow permissions** to **Read and write permissions**

#### 2. 404 Error on Page Load

**Cause**: Incorrect base path configuration

**Solution**:
- For `username.github.io/repo-name/`:
  - Ensure `<base href="">` in `index.html` handles the path
  - Check that asset paths are relative, not absolute

**Verification**:
```html
<!-- index.html should handle base path dynamically -->
<script>
  // The app uses dynamic base path detection
  // No manual configuration needed
</script>
```

#### 3. Service Worker Not Working

**Cause**: HTTPS required for Service Workers

**Solution**:
1. Ensure HTTPS is enforced in **Settings** > **Pages**
2. Wait for SSL certificate provisioning (up to 15 minutes)

#### 4. Assets Not Loading

**Cause**: Incorrect paths for GitHub Pages subdirectory

**Solution**:
- Use relative paths: `./css/styles.css` not `/css/styles.css`
- The app's `getBasePath()` utility handles this automatically

#### 5. Workflow Not Triggering

**Cause**: Workflow file in wrong location or branch

**Solution**:
1. Ensure file is at `.github/workflows/deploy.yml`
2. Ensure pushing to `main` branch
3. Verify workflow is not disabled in **Actions** settings

### Debug Steps

1. **Check Actions logs**:
   - Go to **Actions** > Select failed workflow > View logs

2. **Verify file upload**:
   - Download artifact from workflow run
   - Verify all files are included

3. **Check browser console**:
   - Open deployed site
   - Check Developer Tools > Console for errors

4. **Verify Pages settings**:
   - Confirm source is set to **GitHub Actions**
   - Confirm environment shows deployment URL

---

## Production URLs

### Default GitHub Pages URL

```
https://YOUR-USERNAME.github.io/REPO-NAME/
```

**Example**:
```
https://john-doe.github.io/apple-edu-assistant/
```

### Organization URL

```
https://ORG-NAME.github.io/REPO-NAME/
```

### Custom Domain URL

```
https://app.yourdomain.com/
```

### Accessing the Deployment

1. **Via GitHub UI**:
   - Repository page > Right sidebar > **Deployments**
   - Or **Settings** > **Pages** > **Visit site**

2. **Via Actions**:
   - **Actions** > Latest successful run > Environment URL

---

## Deployment Checklist

Before deploying, verify:

- [ ] All files committed to `main` branch
- [ ] `index.html` exists in repository root
- [ ] `manifest.json` has correct paths
- [ ] `sw.js` service worker is present
- [ ] `.github/workflows/deploy.yml` exists
- [ ] GitHub Pages source set to **GitHub Actions**
- [ ] Workflow permissions set to **Read and write**

After deploying, verify:

- [ ] Site loads without errors
- [ ] PWA installs correctly
- [ ] Service Worker registers
- [ ] All assets load (CSS, JS, images)
- [ ] Offline functionality works
- [ ] Chatbot initializes (with API key)

---

## Updating the Deployment

### Regular Updates

```bash
# Make changes locally
git add .
git commit -m "feat: add new feature"
git push origin main
# Deployment triggers automatically
```

### Cache Versioning

When updating, bump the Service Worker cache version in `sw.js`:

```javascript
const CACHE_VERSION = 'v1.2.0'; // Update this
```

### Rolling Back

To rollback to a previous version:

1. Go to **Actions** tab
2. Find a previous successful deployment
3. Click **Re-run all jobs**

Or revert the commit:
```bash
git revert HEAD
git push origin main
```

---

## Security Considerations

### Secrets and API Keys

**NEVER commit API keys to the repository**

The app handles API keys client-side:
- Users enter their own API keys
- Keys are encrypted in browser storage
- No server-side secrets required

### HTTPS Enforcement

GitHub Pages enforces HTTPS by default:
- SSL certificate provided automatically
- HTTP redirects to HTTPS
- Required for Service Worker and PWA

### Content Security Policy

The app includes CSP headers via meta tags:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; ...">
```

---

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Custom Domains for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Troubleshooting GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)

---

**Version**: 1.0.0
**Last Updated**: 2025-01-15
**Maintained By**: Apple Edu Assistant Team
