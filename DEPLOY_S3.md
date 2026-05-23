# S3 Static Deploy (No Custom Domain)

This guide documents the cheapest deployment path for the frontend only.

## Prereqs

- AWS CLI installed
- AWS credentials configured
- Node.js + npm installed

## One-time setup (already done)

You already created the bucket in us-east-1:

- Bucket: desheng-9203-portfolio
- Region: us-east-1

If you ever need to recreate from scratch, use this once:

1) Disable public access block
2) Enable static website hosting
3) Add public bucket policy

## Deploy updates (run whenever you change the frontend)

Run these from the repo root:

```bash
cd frontend
npm install
npm run build

# Upload build to S3
aws s3 sync build s3://desheng-9203-portfolio --delete
```

## Your live site URL

http://desheng-9203-portfolio.s3-website-us-east-1.amazonaws.com

## Troubleshooting

- If the site still shows old content, make sure `aws s3 sync` ran successfully.
- If the page shows a 404 after refresh, confirm S3 website hosting has:
  - Index document: index.html
  - Error document: index.html

## Optional: shortcut script

Create a shell alias or script if you want one-command deploys.
Example (Git Bash):

```bash
alias deploy-frontend='cd /c/Users/Desheng/Desktop/my-portfolio/frontend && npm run build && aws s3 sync build s3://desheng-9203-portfolio --delete'
```
