# Zyro Visuals AWS Deployment Documentation

## AWS Account Details
- **User**: deployment21
- **Region**: ap-south-1 (Mumbai)
- **Account ID**: 510279477950

## Initial Setup

### 1. AWS CLI Configuration
```bash
aws configure
AWS Access Key ID: [Your Access Key]
AWS Secret Access Key: [Your Secret Key]
Default region name: ap-south-1
Default output format: json
```

### 2. Infrastructure Components
Our infrastructure will be created using CloudFormation with the following components:

1. **Frontend Stack**
   - S3 Bucket for static files
   - CloudFront Distribution
   - SSL Certificate (ACM)

2. **Backend Stack**
   - EC2 Instance (t2.micro)
   - RDS MySQL Instance (t3.micro)
   - Security Groups
   - IAM Roles

3. **Notification Stack**
   - Lambda Function
   - SNS Topic
   - API Gateway

## CloudFormation Templates

### 1. Network Stack (network.yaml)
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Zyro Visuals Network Stack'

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: zyro-vpc

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      Tags:
        - Key: Name
          Value: zyro-public-1

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      Tags:
        - Key: Name
          Value: zyro-public-2

  InternetGateway:
    Type: AWS::EC2::InternetGateway

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

Outputs:
  VpcId:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub "${AWS::StackName}-VpcId"

  PublicSubnet1Id:
    Description: Public Subnet 1 ID
    Value: !Ref PublicSubnet1
    Export:
      Name: !Sub "${AWS::StackName}-PublicSubnet1Id"

  PublicSubnet2Id:
    Description: Public Subnet 2 ID
    Value: !Ref PublicSubnet2
    Export:
      Name: !Sub "${AWS::StackName}-PublicSubnet2Id"
```

### 2. Database Stack (database.yaml)
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Zyro Visuals Database Stack'

Parameters:
  VpcId:
    Type: String
    Description: VPC ID
  
  DBPassword:
    Type: String
    NoEcho: true
    Description: Database admin password

Resources:
  DBSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for RDS
      VpcId: !Ref VpcId
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 3306
          ToPort: 3306
          SourceSecurityGroupId: !Ref WebServerSecurityGroup

  RDSInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: zyro-db
      Engine: mysql
      DBInstanceClass: db.t3.micro
      AllocatedStorage: 20
      MasterUsername: admin
      MasterUserPassword: !Ref DBPassword
      VPCSecurityGroups:
        - !Ref DBSecurityGroup
      PubliclyAccessible: false
      BackupRetentionPeriod: 7
      MultiAZ: false

Outputs:
  RDSEndpoint:
    Description: RDS Endpoint
    Value: !GetAtt RDSInstance.Endpoint.Address
```

### 3. Backend Stack (backend.yaml)
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Zyro Visuals Backend Stack'

Parameters:
  KeyName:
    Type: AWS::EC2::KeyPair::KeyName
    Description: Name of an existing EC2 KeyPair

Resources:
  WebServerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Enable HTTP/HTTPS access
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0

  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t2.micro
      ImageId: ami-0c7217cdde317cfec  # Amazon Linux 2023
      KeyName: !Ref KeyName
      SecurityGroups:
        - !Ref WebServerSecurityGroup
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash
          yum update -y
          yum install -y nodejs npm git nginx
          npm install -g pm2
```

### 4. Frontend Stack (frontend.yaml)
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Zyro Visuals Frontend Stack'

Resources:
  WebsiteBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: zyrovisual-frontend
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt WebsiteBucket.DomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: !Sub "origin-access-identity/cloudfront/${CloudFrontOriginAccessIdentity}"
        Enabled: true
        DefaultRootObject: index.html
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods:
            - GET
            - HEAD
            - OPTIONS
          CachedMethods:
            - GET
            - HEAD
            - OPTIONS
          ForwardedValues:
            QueryString: false
            Cookies:
              Forward: none

Outputs:
  CloudFrontDomainName:
    Description: CloudFront Domain Name
    Value: !GetAtt CloudFrontDistribution.DomainName
```

## Deployment Steps

1. Create Network Stack:
```bash
aws cloudformation create-stack \
  --stack-name zyro-network \
  --template-body file://network.yaml
```

2. Create Database Stack:
```bash
aws cloudformation create-stack \
  --stack-name zyro-database \
  --template-body file://database.yaml \
  --parameters \
    ParameterKey=DBPassword,ParameterValue=@shivit721 \
    ParameterKey=VpcId,ParameterValue=$(aws cloudformation describe-stacks --stack-name zyro-network --query 'Stacks[0].Outputs[?ExportName==`zyro-network-VpcId`].OutputValue' --output text)
```

3. Create Backend Stack:
```bash
aws cloudformation create-stack \
  --stack-name zyro-backend \
  --template-body file://backend.yaml \
  --parameters \
    ParameterKey=KeyName,ParameterValue=zyro-key
```

4. Create Frontend Stack:
```bash
aws cloudformation create-stack \
  --stack-name zyro-frontend \
  --template-body file://frontend.yaml
```

## Post-Deployment Steps

1. **Database Setup**:
   ```sql
   CREATE DATABASE zyro;
   USE zyro;
   
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) UNIQUE,
     password VARCHAR(255),
     isAdmin BOOLEAN DEFAULT false
   );
   
   INSERT INTO users (username, password, isAdmin) 
   VALUES ('shakti', 'shivit721', true);
   ```

2. **Backend Configuration**:
   - Update environment variables on EC2
   - Configure Nginx
   - Setup SSL with Certbot

3. **Frontend Deployment**:
   ```bash
   npm run build
   aws s3 sync dist/public/ s3://zyrovisual-frontend
   ```

4. **DNS Configuration** (GoDaddy):
   - CNAME record for www.zyrovisual.com → CloudFront URL
   - A record for zyrovisual.com → EC2 IP

## Monitoring Setup

1. **CloudWatch Alarms**:
   - CPU Utilization
   - Database Connections
   - Error Rates

2. **Logging**:
   - EC2 logs via CloudWatch
   - RDS logs
   - Application logs

## Backup Strategy

1. **Database**:
   - Automated RDS backups (7 days retention)
   - Manual snapshots before major changes

2. **EC2**:
   - AMI backups weekly
   - Code repository backups

## Cost Estimation (Monthly)
- EC2 t2.micro: Free tier, then ~$8.50
- RDS t3.micro: Free tier, then ~$12.50
- S3: ~$0.50
- CloudFront: ~$1.00
Total: ~$22.50/month after free tier

## Security Notes
1. Keep AWS credentials secure
2. Regularly rotate access keys
3. Monitor CloudTrail for suspicious activity
4. Keep all systems updated
5. Use strong passwords
6. Enable WAF if needed 