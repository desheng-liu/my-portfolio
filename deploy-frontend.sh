#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="/c/Users/Desheng/Desktop/my-portfolio"
BUCKET_NAME="desheng-9203-portfolio"

cd "$REPO_ROOT/frontend"

npm install
npm run build

aws s3 sync build "s3://$BUCKET_NAME" --delete

echo "Deployed to: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
