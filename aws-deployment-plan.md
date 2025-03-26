# AWS Deployment Plan for Zyro Visuals

## Prerequisites
- AWS Account
- AWS CLI installed and configured
- Node.js and npm installed
- Terraform (optional, for infrastructure as code)

## 1. Database Setup
1. Create an RDS PostgreSQL instance
   - Use t2.micro for development/testing
   - Set up appropriate security groups
   - Create a database named 'zyro'
2. Run Drizzle migrations to set up the schema
   - Configure DATABASE_URL environment variable
   - Run `npm run db:push`

## 2. Backend Deployment Options

### Option A: EC2 Deployment
1. Launch an EC2 instance (t2.micro for testing)
2. Configure security groups to allow HTTP/HTTPS traffic
3. Install Node.js, Git, and other dependencies
4. Clone the repository
5. Install dependencies with `npm install --production`
6. Build the application with `npm run build`
7. Set up environment variables
8. Use PM2 to run the application as a service
9. Configure Nginx as a reverse proxy

### Option B: Elastic Beanstalk Deployment
1. Create a new Elastic Beanstalk application
2. Configure environment variables
3. Deploy the application code
4. Set up proper health checks

### Option C: AWS App Runner
1. Create a new App Runner service
2. Connect to the source code repository
3. Configure build settings
4. Set environment variables
5. Deploy the application

## 3. Frontend Assets
- Store static assets in S3 bucket
- Set up CloudFront distribution for caching

## 4. Domain and SSL
1. Register domain in Route 53 (or use existing domain)
2. Get SSL certificate from AWS Certificate Manager
3. Configure DNS to point to the deployed application
4. Set up proper redirects (HTTP to HTTPS)

## 5. CI/CD Pipeline
1. Set up GitHub Actions or AWS CodePipeline
2. Configure automatic deployment on push to main branch
3. Set up environment-specific deployments (dev, staging, production)

## 6. Monitoring and Logging
1. Set up CloudWatch for logs and metrics
2. Configure alarms for critical issues
3. Implement health checks

## 7. Security
1. Implement proper IAM roles and policies
2. Configure security groups
3. Use AWS Secrets Manager for sensitive information
4. Implement AWS WAF for added security

## 8. Backup Strategy
1. Configure automated database backups
2. Set up regular snapshots
3. Implement a disaster recovery plan

## 9. Cost Optimization
1. Use the right instance sizes
2. Implement auto-scaling based on demand
3. Set up budget alerts

## 10. Post-Deployment
1. Test application functionality
2. Monitor performance
3. Set up regular maintenance schedule 