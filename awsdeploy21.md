# Zyro Visuals - Hybrid AWS Deployment Guide

## Architecture Overview

### Components
1. **Frontend**: S3 + CloudFront
2. **Main Backend**: EC2 t2.micro instance
3. **Database**: RDS MySQL (t3.micro - free tier)
4. **Booking Notifications**: Lambda + SNS
5. **SSL**: AWS Certificate Manager
6. **Domain**: GoDaddy DNS integration

### Workflow Diagram
```
[Client] → CloudFront → S3 (Static Frontend)
                     ↘ EC2 (Main API) → RDS MySQL
                     ↘ Lambda (Booking Handler) → SNS → Email Notifications
```

## Step-by-Step Implementation

### 1. Database Setup (RDS MySQL)

1. Create RDS instance:
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier zyro-db \
     --db-instance-class db.t3.micro \
     --engine mysql \
     --master-username admin \
     --master-user-password <secure-password> \
     --allocated-storage 20 \
     --backup-retention-period 7
   ```

2. Create database schema:
   ```sql
   CREATE DATABASE zyro;
   
   -- Users table
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) UNIQUE,
     password VARCHAR(255),
     isAdmin BOOLEAN DEFAULT false
   );
   
   -- Bookings table
   CREATE TABLE bookings (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255),
     message TEXT,
     status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Portfolio table
   CREATE TABLE portfolio (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255),
     description TEXT,
     imageUrl VARCHAR(255),
     videoUrl VARCHAR(255)
   );
   ```

### 2. EC2 Backend Setup

1. Launch EC2 instance:
   ```bash
   aws ec2 run-instances \
     --image-id ami-0c7217cdde317cfec \
     --instance-type t2.micro \
     --key-name zyro-key \
     --security-groups zyro-sg
   ```

2. Configure security group:
   ```bash
   aws ec2 create-security-group \
     --group-name zyro-sg \
     --description "Zyro backend security group"
   
   aws ec2 authorize-security-group-ingress \
     --group-name zyro-sg \
     --protocol tcp \
     --port 80 \
     --cidr 0.0.0.0/0
   
   aws ec2 authorize-security-group-ingress \
     --group-name zyro-sg \
     --protocol tcp \
     --port 443 \
     --cidr 0.0.0.0/0
   ```

3. Install dependencies on EC2:
   ```bash
   sudo yum update -y
   sudo yum install -y nodejs npm git nginx
   sudo npm install -g pm2
   ```

4. Clone and setup application:
   ```bash
   git clone your-repo
   cd your-repo
   npm install
   npm run build
   ```

5. Configure environment variables:
   ```bash
   # /etc/environment
   NODE_ENV=production
   DB_HOST=your-rds-endpoint
   DB_USER=admin
   DB_PASSWORD=your-password
   DB_NAME=zyro
   ```

### 3. Lambda Function for Bookings

1. Create Lambda function:
   ```bash
   # Create handler.js
   exports.handler = async (event) => {
     const booking = JSON.parse(event.body);
     
     // Send to SNS
     await sns.publish({
       TopicArn: process.env.SNS_TOPIC_ARN,
       Message: JSON.stringify({
         type: 'NEW_BOOKING',
         data: booking
       })
     }).promise();
     
     return {
       statusCode: 200,
       body: JSON.stringify({ message: 'Booking notification sent' })
     };
   };
   ```

2. Create SNS topic:
   ```bash
   aws sns create-topic --name zyro-bookings
   aws sns subscribe \
     --topic-arn arn:aws:sns:region:account-id:zyro-bookings \
     --protocol email \
     --notification-endpoint your@email.com
   ```

3. Create API Gateway trigger:
   ```bash
   aws apigateway create-rest-api --name zyro-bookings-api
   # Configure routes and integration
   ```

### 4. Frontend Deployment

1. Build frontend:
   ```bash
   npm run build
   ```

2. Create and configure S3:
   ```bash
   aws s3 mb s3://zyrovisual-frontend
   aws s3 website s3://zyrovisual-frontend --index-document index.html
   ```

3. Upload frontend:
   ```bash
   aws s3 sync dist/public/ s3://zyrovisual-frontend
   ```

### 5. CloudFront Setup

1. Create distribution:
   ```bash
   aws cloudfront create-distribution \
     --origin-domain-name zyrovisual-frontend.s3.amazonaws.com \
     --default-root-object index.html
   ```

### 6. Domain Configuration (GoDaddy)

1. In GoDaddy DNS settings:
   ```
   www.zyrovisual.com  CNAME  [CloudFront URL]
   zyrovisual.com      A      [EC2 IP]
   ```

2. Configure SSL:
   ```bash
   sudo certbot --nginx -d zyrovisual.com
   ```

## Workflow Description

1. **Normal Website Flow**:
   - User visits zyrovisual.com
   - CloudFront serves static content from S3
   - API requests go to EC2 backend
   - EC2 communicates with RDS for data

2. **Booking Flow**:
   - User submits booking form
   - Request goes to EC2
   - EC2 saves to RDS
   - EC2 triggers Lambda function
   - Lambda sends notification via SNS
   - Admin receives email notification
   - Admin can approve/reject via dashboard

3. **Admin Flow**:
   - Admin logs in at /admin
   - Session stored in RDS
   - Can manage bookings, portfolio, etc.
   - Changes stored in RDS

## Cost Estimation (Monthly)
- EC2 t2.micro: Free tier, then ~$8.50
- RDS t3.micro: Free tier, then ~$12.50
- S3: ~$0.50
- CloudFront: ~$1.00
- Lambda: Free tier (includes 1M requests)
- SNS: Free tier (includes 1M notifications)
Total: ~$22.50/month after free tier

## Monitoring Setup

1. CloudWatch Alarms:
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name zyro-cpu-alarm \
     --metric-name CPUUtilization \
     --namespace AWS/EC2 \
     --statistic Average \
     --period 300 \
     --threshold 80 \
     --comparison-operator GreaterThanThreshold \
     --evaluation-periods 2
   ```

2. Logging:
   ```bash
   # EC2 logs
   pm2 logs
   sudo tail -f /var/log/nginx/error.log
   
   # RDS logs
   aws rds download-db-log-file-portion \
     --db-instance-identifier zyro-db \
     --log-file-name error/mysql-error.log
   ```

## Backup Strategy

1. Database:
   - Automated RDS backups (daily)
   - Retention period: 7 days

2. EC2:
   - AMI backup weekly
   ```bash
   aws ec2 create-image \
     --instance-id i-1234567890abcdef0 \
     --name "zyro-backup-$(date +%Y%m%d)"
   ```

## Security Best Practices

1. RDS:
   - Use strong passwords
   - Enable encryption at rest
   - Restrict security group to EC2 IP

2. EC2:
   - Keep security patches up to date
   - Use SSH key authentication
   - Regular security audits

3. Lambda:
   - Use IAM roles with minimal permissions
   - Enable CloudWatch logs
   - Set appropriate timeouts

Remember to:
1. Replace placeholder values
2. Keep credentials secure
3. Test thoroughly in staging
4. Monitor costs regularly
5. Set up alerts for critical events 