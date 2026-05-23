# My Portfolio

Personal website with resume, GitHub projects, blog, and newsletter — built with React + Node.js/Express, deployed on AWS.

Live site: http://desheng-9203-portfolio.s3-website-us-east-1.amazonaws.com

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router, React Markdown |
| Backend | Node.js, Express |
| Database | AWS DynamoDB |
| Email | AWS SES |
| Hosting | S3 + CloudFront (frontend), EC2 (backend) |
| CI/CD | GitHub Actions |
| Domain | Route 53 + ACM (free SSL) |

## Project Structure

```
my-portfolio/
├── frontend/          React app
│   └── src/
│       ├── pages/     Home, Resume, Projects, Blog, BlogPost
│       ├── styles/    global.css
│       └── App.jsx    Router + Nav
├── backend/           Express API
│   └── src/
│       ├── routes/    subscribers.js, posts.js, newsletter.js
│       ├── dynamo.js  DynamoDB client
│       └── index.js   Server entry point
├── .github/workflows/
│   └── deploy.yml     Auto-deploy on push to main
├── aws-setup.sh       One-time AWS provisioning script
└── README.md
```

## Quickstart (local development)

### 1. Clone and install

```bash
git clone https://github.com/yourusername/my-portfolio
cd my-portfolio

# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
cp .env.example .env   # fill in your AWS values
```

### 2. Run locally

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm start
```

Frontend: http://localhost:3000  
Backend: http://localhost:4000/health

## Customisation checklist

- [ ] `frontend/src/App.jsx` — update your name in the nav logo
- [ ] `frontend/src/pages/Home.jsx` — update bio, tagline, skills
- [ ] `frontend/src/pages/Resume.jsx` — update the `RESUME` object with your data
- [ ] `frontend/src/pages/Projects.jsx` — set `GITHUB_USERNAME` and `PINNED` repos
- [ ] `backend/.env` — fill in AWS credentials, table names, SES email
- [ ] `aws-setup.sh` — set `DOMAIN`, `BUCKET_NAME`, `YOUR_NAME`, `SES_EMAIL`

## Deploy to AWS

### Step 1 — Provision AWS resources

```bash
# Install AWS CLI first: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
aws configure   # enter your AWS credentials

chmod +x aws-setup.sh
bash aws-setup.sh
```

Follow the printed instructions to:
- Complete ACM DNS validation
- Launch your EC2 instance and set up Node.js + PM2
- Create the CloudFront distribution

### Step 2 — GitHub repository secrets

Go to your repo → Settings → Secrets and variables → Actions, and add:

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | From aws-setup.sh output |
| `AWS_SECRET_ACCESS_KEY` | From aws-setup.sh output |
| `AWS_REGION` | `us-east-1` |
| `S3_BUCKET_NAME` | Your bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | From CloudFront console |
| `EC2_HOST` | Your EC2 public IP |
| `EC2_SSH_KEY` | Your .pem key file contents |
| `API_URL` | `https://api.yourdomain.com` |

### Step 3 — Push to deploy

```bash
git add . && git commit -m "initial commit" && git push origin main
```

GitHub Actions will automatically:
1. Build the React app
2. Sync it to S3
3. Invalidate the CloudFront cache
4. SSH into EC2 and restart the backend with PM2

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/subscribe` | Subscribe to newsletter |
| DELETE | `/subscribe` | Unsubscribe |
| GET | `/posts` | List published blog posts |
| GET | `/posts/:slug` | Get single post |
| POST | `/posts` | Create post (admin) |
| PUT | `/posts/:id` | Update post (admin) |
| DELETE | `/posts/:id` | Delete post (admin) |
| POST | `/newsletter/send` | Send newsletter blast (admin) |

Admin endpoints require `x-api-key: YOUR_ADMIN_KEY` header.

## Creating a blog post

```bash
curl -X POST https://api.yourdomain.com/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_ADMIN_KEY" \
  -d '{
    "title": "My First Post",
    "content": "# Hello\n\nMarkdown content here...",
    "excerpt": "A short summary",
    "tags": ["web", "aws"],
    "published": true
  }'
```

## Sending a newsletter

```bash
curl -X POST https://api.yourdomain.com/newsletter/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_ADMIN_KEY" \
  -d '{
    "subject": "New post: My First Post",
    "bodyHtml": "<h1>Check out my new post!</h1><a href=\"https://yourdomain.com/blog/my-first-post\">Read it here</a>",
    "bodyText": "Check out my new post: https://yourdomain.com/blog/my-first-post"
  }'
```
