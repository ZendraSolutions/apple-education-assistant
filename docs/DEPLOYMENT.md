# Deployment Guide - Jamf Assistant

**Audience:** IT Administrators, DevOps Engineers, System Administrators

This guide covers the complete deployment process for Jamf Assistant in production environments, including server setup, HTTPS configuration, domain management, and security hardening.

---

## Table of Contents

- [System Requirements](#system-requirements)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment Methods](#deployment-methods)
- [Server Setup](#server-setup)
- [HTTPS Configuration](#https-configuration)
- [Domain Configuration](#domain-configuration)
- [Security Hardening](#security-hardening)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Disaster Recovery](#backup-and-disaster-recovery)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

### Server Requirements

**Minimum Specifications:**
- **CPU**: 1 vCPU (2 vCPUs recommended)
- **RAM**: 512 MB (1 GB recommended)
- **Storage**: 500 MB (1 GB recommended for logs)
- **Network**: 100 Mbps (1 Gbps recommended)

**Operating System:**
- Ubuntu 20.04 LTS or later
- Debian 11 or later
- CentOS 8 / Rocky Linux 8 or later
- Windows Server 2019 or later (IIS)

**Web Server:**
- **Nginx** 1.18+ (recommended)
- **Apache** 2.4+
- **IIS** 10.0+ (Windows)
- **Caddy** 2.0+ (auto-HTTPS)

### Client Requirements

**Supported Browsers:**
- Safari 14+ (recommended for iOS/iPadOS)
- Chrome 90+
- Edge 90+
- Firefox 88+

**Devices:**
- iPads (iPadOS 14+)
- Macs (macOS 11+)
- Windows PCs (Windows 10+)
- Android tablets (Chrome 90+)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] **Domain name** registered and configured (e.g., `jamf-assistant.school.edu`)
- [ ] **SSL/TLS certificate** (Let's Encrypt, commercial, or internal CA)
- [ ] **DNS access** to create A/CNAME records
- [ ] **Server access** (SSH for Linux, RDP for Windows)
- [ ] **Firewall rules** configured (ports 80, 443)
- [ ] **Backup strategy** in place
- [ ] **Monitoring tools** ready (optional)

---

## Deployment Methods

### Method 1: Static File Hosting (Simplest)

**Best for:** Small deployments, quick testing, CDN hosting

Jamf Assistant is a **static Progressive Web App (PWA)** - no backend server required.

**Steps:**
1. Copy all project files to web root
2. Configure web server to serve files
3. Enable HTTPS
4. Done!

**Pros:**
- Simple setup
- No database required
- Low maintenance
- CDN-compatible

**Cons:**
- No server-side analytics
- Manual updates

### Method 2: Nginx Reverse Proxy (Recommended)

**Best for:** Production deployments, multiple apps, load balancing

Uses Nginx for advanced features:
- URL rewriting
- Caching
- Security headers
- Rate limiting

### Method 3: Docker Container

**Best for:** Microservices, cloud deployments, scalability

Containerized deployment with:
- Isolated environment
- Easy updates
- Kubernetes support

### Method 4: Cloud Hosting

**Best for:** Global accessibility, auto-scaling, managed infrastructure

Platforms:
- **Netlify** (easiest, free tier)
- **Vercel** (next.js optimized)
- **GitHub Pages** (free, simple)
- **AWS S3 + CloudFront** (enterprise)
- **Azure Static Web Apps** (Microsoft ecosystem)

---

## Server Setup

### Option A: Ubuntu/Debian with Nginx

#### 1. Install Nginx

```bash
# Update package lists
sudo apt update

# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

#### 2. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall (if not already enabled)
sudo ufw enable

# Check firewall status
sudo ufw status
```

#### 3. Create Application Directory

```bash
# Create directory for the app
sudo mkdir -p /var/www/jamf-assistant

# Set ownership (replace 'www-data' with your user if needed)
sudo chown -R www-data:www-data /var/www/jamf-assistant

# Set permissions
sudo chmod -R 755 /var/www/jamf-assistant
```

#### 4. Upload Application Files

```bash
# Option A: Using SCP from local machine
scp -r /path/to/jamf-assistant/* user@server:/var/www/jamf-assistant/

# Option B: Using rsync (preserves permissions)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /path/to/jamf-assistant/ user@server:/var/www/jamf-assistant/

# Option C: Git clone (if using version control)
cd /var/www/jamf-assistant
sudo git clone https://github.com/your-org/jamf-assistant.git .
```

#### 5. Configure Nginx Virtual Host

Create configuration file:

```bash
sudo nano /etc/nginx/sites-available/jamf-assistant
```

**Basic Configuration:**

```nginx
server {
    listen 80;
    server_name jamf-assistant.yourdomain.com;

    root /var/www/jamf-assistant;
    index index.html;

    # Logging
    access_log /var/log/nginx/jamf-assistant-access.log;
    error_log /var/log/nginx/jamf-assistant-error.log;

    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (CSS, JS, images)
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker (must not be cached)
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # Manifest and icons
    location ~* \.(webmanifest|json)$ {
        add_header Cache-Control "no-cache";
        expires 1d;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Disable directory listing
    autoindex off;
}
```

#### 6. Enable Site and Test Configuration

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/jamf-assistant /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## HTTPS Configuration

### Option A: Let's Encrypt (Free, Automated)

**Recommended for production**

#### 1. Install Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/Rocky Linux
sudo dnf install certbot python3-certbot-nginx -y
```

#### 2. Obtain SSL Certificate

```bash
# Automatic configuration (modifies Nginx config)
sudo certbot --nginx -d jamf-assistant.yourdomain.com

# Manual certificate only (you configure Nginx)
sudo certbot certonly --nginx -d jamf-assistant.yourdomain.com
```

**Follow prompts:**
- Enter email address (for renewal notifications)
- Agree to Terms of Service
- Choose to redirect HTTP to HTTPS (recommended)

#### 3. Auto-Renewal

Certbot automatically sets up renewal. Test it:

```bash
# Dry run to test renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

**Manual renewal (if needed):**

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Option B: Commercial SSL Certificate

If using a purchased certificate:

#### 1. Generate CSR (Certificate Signing Request)

```bash
# Create private key
sudo openssl genrsa -out /etc/nginx/ssl/jamf-assistant.key 2048

# Generate CSR
sudo openssl req -new -key /etc/nginx/ssl/jamf-assistant.key \
  -out /etc/nginx/ssl/jamf-assistant.csr

# Fill in details (Common Name = your domain)
```

#### 2. Submit CSR to Certificate Authority

- Purchase certificate from CA (DigiCert, Sectigo, etc.)
- Submit CSR file
- Complete domain validation
- Download certificate files

#### 3. Install Certificate

```bash
# Copy certificate files to server
sudo mkdir -p /etc/nginx/ssl
sudo cp certificate.crt /etc/nginx/ssl/jamf-assistant.crt
sudo cp ca-bundle.crt /etc/nginx/ssl/ca-bundle.crt

# Set permissions
sudo chmod 600 /etc/nginx/ssl/jamf-assistant.key
sudo chmod 644 /etc/nginx/ssl/jamf-assistant.crt
```

#### 4. Update Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name jamf-assistant.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/jamf-assistant.crt;
    ssl_certificate_key /etc/nginx/ssl/jamf-assistant.key;
    ssl_trusted_certificate /etc/nginx/ssl/ca-bundle.crt;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;

    # HSTS (optional but recommended)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rest of configuration...
    root /var/www/jamf-assistant;
    index index.html;
    # ... (same as HTTP config)
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name jamf-assistant.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Domain Configuration

### DNS Setup

#### Option A: Direct Domain (A Record)

If hosting on your own server:

```
Type: A
Name: jamf-assistant (or @)
Value: [Your Server IP]
TTL: 300 (or default)
```

**Example:**
```
jamf-assistant.school.edu → 203.0.113.50
```

#### Option B: Subdomain (CNAME)

If using existing server:

```
Type: CNAME
Name: jamf-assistant
Value: webserver.school.edu
TTL: 300
```

**Example:**
```
jamf-assistant.school.edu → webserver.school.edu
```

#### Verify DNS Propagation

```bash
# Check A record
dig jamf-assistant.yourdomain.com A

# Check CNAME
dig jamf-assistant.yourdomain.com CNAME

# Check globally
# Visit: https://www.whatsmydns.net/
```

### Internal Network Configuration

For internal-only deployment:

#### 1. Internal DNS Server

Add entry to internal DNS (Windows Server, BIND, etc.):

```
jamf-assistant.internal → 10.0.1.50
```

#### 2. Hosts File (Testing)

For testing without DNS:

**Windows:** `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux:** `/etc/hosts`

```
10.0.1.50  jamf-assistant.internal
```

---

## Security Hardening

### Content Security Policy (CSP)

Add to Nginx configuration:

```nginx
# Strict CSP for production
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://ai.google.dev;
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com;
    font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://generativelanguage.googleapis.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
" always;
```

### Additional Security Headers

```nginx
# Prevent clickjacking
add_header X-Frame-Options "DENY" always;

# Prevent MIME sniffing
add_header X-Content-Type-Options "nosniff" always;

# Enable XSS filter
add_header X-XSS-Protection "1; mode=block" always;

# Referrer policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions policy
add_header Permissions-Policy "
    geolocation=(),
    microphone=(),
    camera=(),
    payment=()
" always;
```

### Rate Limiting

Prevent abuse:

```nginx
# Define rate limit zone
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

# Apply to server block
location / {
    limit_req zone=general burst=20 nodelay;
    try_files $uri $uri/ /index.html;
}
```

### Disable Unnecessary Features

```nginx
# Disable server tokens
server_tokens off;

# Disable autoindex
autoindex off;

# Disable symlinks
disable_symlinks on;
```

---

## Performance Optimization

### Enable Gzip Compression

```nginx
# Add to http block in /etc/nginx/nginx.conf
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/rss+xml
    font/truetype
    font/opentype
    image/svg+xml;
```

### Browser Caching

```nginx
# Cache static assets
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# Cache HTML for 1 hour
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### HTTP/2 Support

Enable HTTP/2 for better performance:

```nginx
server {
    listen 443 ssl http2;  # Add http2 here
    # ... rest of config
}
```

---

## Monitoring and Logging

### Nginx Logs

**Access Log Format:**

```nginx
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';

access_log /var/log/nginx/jamf-assistant-access.log main;
```

**View Logs:**

```bash
# Real-time access log
sudo tail -f /var/log/nginx/jamf-assistant-access.log

# Real-time error log
sudo tail -f /var/log/nginx/jamf-assistant-error.log

# Search for errors
sudo grep "error" /var/log/nginx/jamf-assistant-error.log
```

### Monitoring Tools

**Basic Monitoring:**

```bash
# Check Nginx status
sudo systemctl status nginx

# Check disk space
df -h /var/www/jamf-assistant

# Check memory usage
free -m

# Check CPU usage
top
```

**Advanced Monitoring (Optional):**

- **Prometheus + Grafana**: Metrics visualization
- **ELK Stack**: Centralized logging
- **Uptime Kuma**: Uptime monitoring
- **Netdata**: Real-time performance monitoring

---

## Backup and Disaster Recovery

### Automated Backups

**Script: `/usr/local/bin/backup-jamf-assistant.sh`**

```bash
#!/bin/bash

# Configuration
APP_DIR="/var/www/jamf-assistant"
BACKUP_DIR="/backup/jamf-assistant"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
tar -czf "$BACKUP_DIR/jamf-assistant-$DATE.tar.gz" -C /var/www jamf-assistant

# Remove old backups
find "$BACKUP_DIR" -name "jamf-assistant-*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Log
echo "[$DATE] Backup completed: jamf-assistant-$DATE.tar.gz" >> /var/log/jamf-assistant-backup.log
```

**Make executable:**

```bash
sudo chmod +x /usr/local/bin/backup-jamf-assistant.sh
```

**Schedule with Cron:**

```bash
# Edit crontab
sudo crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-jamf-assistant.sh
```

### Restore from Backup

```bash
# Stop Nginx
sudo systemctl stop nginx

# Remove current files
sudo rm -rf /var/www/jamf-assistant/*

# Extract backup
sudo tar -xzf /backup/jamf-assistant/jamf-assistant-20241225_020000.tar.gz -C /var/www

# Fix permissions
sudo chown -R www-data:www-data /var/www/jamf-assistant

# Start Nginx
sudo systemctl start nginx
```

---

## Troubleshooting

### Issue: 502 Bad Gateway

**Cause:** Nginx can't reach backend (not applicable for static sites)

**Solution:**
```bash
# Check if Nginx is running
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: SSL Certificate Errors

**Symptoms:** Browser shows "Not Secure" or certificate warnings

**Solutions:**

```bash
# Check certificate validity
sudo openssl x509 -in /etc/nginx/ssl/jamf-assistant.crt -noout -dates

# Test SSL configuration
sudo nginx -t

# Renew Let's Encrypt certificate
sudo certbot renew
sudo systemctl reload nginx
```

### Issue: Files Not Updating

**Cause:** Browser cache or CDN cache

**Solutions:**

```bash
# Clear Nginx cache (if enabled)
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx

# Force browser cache refresh
# Users: Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

**Add cache busting to HTML:**

```html
<!-- Use query parameters for versioning -->
<link rel="stylesheet" href="css/app.css?v=1.2.3">
<script src="js/app.js?v=1.2.3"></script>
```

### Issue: Permission Denied

**Symptoms:** 403 Forbidden or file access errors

**Solutions:**

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/jamf-assistant

# Fix permissions (directories: 755, files: 644)
sudo find /var/www/jamf-assistant -type d -exec chmod 755 {} \;
sudo find /var/www/jamf-assistant -type f -exec chmod 644 {} \;

# Check SELinux (CentOS/RHEL)
sudo setenforce 0  # Temporarily disable to test
```

### Issue: PWA Not Installing on iOS

**Symptoms:** No "Add to Home Screen" option

**Checklist:**

- ✅ Must use **Safari** browser (not Chrome)
- ✅ Must be served over **HTTPS**
- ✅ `manifest.json` must be valid
- ✅ Icons must be accessible
- ✅ Service worker must register

**Verify manifest:**

```bash
# Check manifest is accessible
curl -I https://jamf-assistant.yourdomain.com/manifest.json

# Validate JSON
cat /var/www/jamf-assistant/manifest.json | jq .
```

---

## Cloud Deployment Examples

### Netlify (Easiest)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod --dir=/path/to/jamf-assistant
```

**Netlify Configuration File: `netlify.toml`**

```toml
[build]
  publish = "."
  command = "echo 'No build step required'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
```

### GitHub Pages

```bash
# 1. Create repository
# 2. Push code to main branch
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# 3. Enable GitHub Pages in repository settings
# Settings → Pages → Source: main branch → Save
```

---

## Production Checklist

Before going live:

- [ ] **HTTPS enabled** with valid certificate
- [ ] **Domain configured** and DNS propagated
- [ ] **Security headers** implemented
- [ ] **Backups scheduled** and tested
- [ ] **Monitoring enabled** (logs, uptime)
- [ ] **Performance optimized** (gzip, caching, HTTP/2)
- [ ] **Firewall configured** (only ports 80/443 open)
- [ ] **SSL certificate renewal** automated (Let's Encrypt)
- [ ] **Error pages customized** (404, 500)
- [ ] **Browser compatibility tested** (Safari, Chrome, Firefox)
- [ ] **PWA installation tested** on iOS and Android
- [ ] **Documentation updated** for administrators

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review logs for errors
- Check disk space
- Test backups

**Monthly:**
- Update server packages
- Review SSL certificate expiration
- Analyze performance metrics

**Quarterly:**
- Security audit
- Disaster recovery drill
- Update documentation

### Update Procedure

```bash
# 1. Backup current version
/usr/local/bin/backup-jamf-assistant.sh

# 2. Download new version
cd /tmp
git clone https://github.com/your-org/jamf-assistant.git

# 3. Test locally (optional)
# Open in browser to verify

# 4. Deploy
sudo rsync -avz --exclude '.git' /tmp/jamf-assistant/ /var/www/jamf-assistant/

# 5. Fix permissions
sudo chown -R www-data:www-data /var/www/jamf-assistant

# 6. Test
curl -I https://jamf-assistant.yourdomain.com

# 7. Clear caches if needed
# (browser caches will update automatically due to service worker)
```

---

## Support and Resources

**Documentation:**
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [MDN PWA Guide](https://developer.mozilla.org/docs/Web/Progressive_web_apps)

**Tools:**
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [Security Headers Test](https://securityheaders.com/)
- [Lighthouse PWA Audit](https://developers.google.com/web/tools/lighthouse)

**Contact:**
- IT Department: it@school.edu
- Emergency Hotline: +XX-XXX-XXX-XXXX

---

**Document Version:** 1.0.0
**Last Updated:** 2024-12-25
**Maintained By:** IT Operations Team
