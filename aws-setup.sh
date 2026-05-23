#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
#  AWS Infrastructure Setup Script
#  Run this ONCE locally to provision all required AWS resources.
#
#  Prerequisites:
#    1. AWS CLI installed and configured (aws configure)
#    2. A registered domain in Route 53 (or your registrar pointing to Route 53)
#    3. Edit the variables below before running
#
#  Usage: bash aws-setup.sh
# ─────────────────────────────────────────────────────────────────────────

set -e

# ── EDIT THESE ────────────────────────────────────────────────────────
REGION="us-east-1"
DOMAIN="yourdomain.com"
BUCKET_NAME="yourdomain-portfolio"
YOUR_NAME="Your Name"
SES_EMAIL="newsletter@yourdomain.com"
# ─────────────────────────────────────────────────────────────────────

echo "▶ Setting up portfolio infrastructure in $REGION..."

# ── S3 Bucket ─────────────────────────────────────────────────────────
echo ""
echo "1/6  Creating S3 bucket: $BUCKET_NAME"
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION" \
  --create-bucket-configuration LocationConstraint="$REGION" 2>/dev/null || true

aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Effect\": \"Allow\",
    \"Principal\": \"*\",
    \"Action\": \"s3:GetObject\",
    \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
  }]
}"

aws s3 website "s3://$BUCKET_NAME" \
  --index-document index.html \
  --error-document index.html

echo "   ✓ S3 bucket ready"

# ── ACM Certificate (must be in us-east-1 for CloudFront) ─────────────
echo ""
echo "2/6  Requesting SSL certificate for $DOMAIN"
CERT_ARN=$(aws acm request-certificate \
  --domain-name "$DOMAIN" \
  --validation-method DNS \
  --subject-alternative-names "www.$DOMAIN" \
  --region us-east-1 \
  --query 'CertificateArn' --output text)

echo "   ✓ Certificate requested: $CERT_ARN"
echo "   ⚠  Complete DNS validation in the AWS Console (Certificate Manager)"
echo "      before CloudFront can use it. Add the CNAME records shown."

# ── DynamoDB Tables ───────────────────────────────────────────────────
echo ""
echo "3/6  Creating DynamoDB tables"

aws dynamodb create-table \
  --table-name portfolio-subscribers \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$REGION" 2>/dev/null && echo "   ✓ portfolio-subscribers created" || echo "   — portfolio-subscribers already exists"

aws dynamodb create-table \
  --table-name portfolio-posts \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$REGION" 2>/dev/null && echo "   ✓ portfolio-posts created" || echo "   — portfolio-posts already exists"

# ── SES Email Verification ────────────────────────────────────────────
echo ""
echo "4/6  Verifying SES sender: $SES_EMAIL"
aws ses verify-email-identity --email-address "$SES_EMAIL" --region "$REGION"
echo "   ✓ Verification email sent — check $SES_EMAIL inbox and confirm"
echo "   ⚠  Request SES production access in the console to send to unverified addresses"

# ── IAM User for GitHub Actions ───────────────────────────────────────
echo ""
echo "5/6  Creating IAM user for GitHub Actions CI/CD"
aws iam create-user --user-name portfolio-deployer 2>/dev/null || true

aws iam put-user-policy --user-name portfolio-deployer \
  --policy-name portfolio-deploy-policy \
  --policy-document "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [
    {
      \"Effect\": \"Allow\",
      \"Action\": [\"s3:PutObject\",\"s3:GetObject\",\"s3:DeleteObject\",\"s3:ListBucket\"],
      \"Resource\": [\"arn:aws:s3:::$BUCKET_NAME\",\"arn:aws:s3:::$BUCKET_NAME/*\"]
    },
    {
      \"Effect\": \"Allow\",
      \"Action\": \"cloudfront:CreateInvalidation\",
      \"Resource\": \"*\"
    }
  ]
}"

KEYS=$(aws iam create-access-key --user-name portfolio-deployer --query 'AccessKey.[AccessKeyId,SecretAccessKey]' --output text)
KEY_ID=$(echo $KEYS | awk '{print $1}')
KEY_SECRET=$(echo $KEYS | awk '{print $2}')

echo ""
echo "   ✓ IAM user created"
echo ""
echo "   ════════════════════════════════════════"
echo "   Add these as GitHub Actions secrets:"
echo "   AWS_ACCESS_KEY_ID     = $KEY_ID"
echo "   AWS_SECRET_ACCESS_KEY = $KEY_SECRET"
echo "   AWS_REGION            = $REGION"
echo "   S3_BUCKET_NAME        = $BUCKET_NAME"
echo "   ════════════════════════════════════════"

# ── Summary ───────────────────────────────────────────────────────────
echo ""
echo "6/6  Manual steps remaining:"
echo ""
echo "   A) EC2: Launch a t3.micro (Amazon Linux 2023), note its public IP."
echo "      SSH in and run:  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -"
echo "      sudo yum install -y nodejs git && sudo npm i -g pm2"
echo "      Clone your repo: git clone https://github.com/YOU/my-portfolio ~/portfolio"
echo "      cd ~/portfolio/backend && cp .env.example .env && nano .env  (fill in values)"
echo "      npm ci && pm2 start src/index.js --name portfolio-api && pm2 save"
echo "      sudo pm2 startup  (follow the printed command to auto-start on reboot)"
echo ""
echo "   B) CloudFront: Create distribution in AWS Console."
echo "      Origin: $BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "      Attach the ACM cert from step 2 (after DNS validation)."
echo "      Add CNAME record in Route 53: $DOMAIN → your CF distribution domain."
echo ""
echo "   C) GitHub Actions secrets to add:"
echo "      EC2_HOST            = your EC2 public IP or domain"
echo "      EC2_SSH_KEY         = contents of your .pem key file"
echo "      CLOUDFRONT_DISTRIBUTION_ID = from the CloudFront console"
echo "      API_URL             = https://api.$DOMAIN  (or EC2 IP during testing)"
echo ""
echo "✅  Infrastructure setup complete!"
