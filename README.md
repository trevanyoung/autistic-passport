# 🧭 The Autistic Passport

**The Autistic Passport** is a modern Single Page Application (SPA) designed to help autistic individuals better navigate social, romantic, and professional life through real world advice.

---

## 🛠 Stack

- **React** (with TypeScript)
- **AWS S3** (for static site hosting)
- **AWS CloudFront** (for CDN and SSL)

---

## 🚀 Features

- Fully responsive (works on desktop, tablet, and mobile)
- Fast loading via static asset CDN (CloudFront)
- Deployable via CI/CD or manual upload to S3

---

## Deployment Method 
npm run build
aws s3 sync build/ s3://autistic-passport-site --delete
aws cloudfront create-invalidation --distribution-id E383W7YGYSQ0X --paths "/*"


