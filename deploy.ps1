# Deployment script for Zyro Visuals AWS Infrastructure

# Parameters
param(
    [Parameter(Mandatory=$true)]
    [string]$DomainName,
    
    [Parameter(Mandatory=$true)]
    [string]$DBPassword,
    
    [Parameter(Mandatory=$true)]
    [string]$KeyPairName,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "ap-south-1",
    
    [Parameter(Mandatory=$false)]
    [string]$StackPrefix = "zyro"
)

# Set AWS region
$env:AWS_DEFAULT_REGION = $Region

# Function to wait for stack completion
function Wait-StackCompletion {
    param($StackName)
    Write-Host "Waiting for stack $StackName to complete..."
    aws cloudformation wait stack-create-complete --stack-name $StackName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Stack $StackName created successfully"
    } else {
        Write-Host "Stack $StackName creation failed"
        exit 1
    }
}

# Deploy Network Stack
Write-Host "Deploying Network Stack..."
aws cloudformation create-stack `
    --stack-name "$StackPrefix-network" `
    --template-body "file://network.yaml" `
    --capabilities CAPABILITY_IAM

Wait-StackCompletion "$StackPrefix-network"

# Get Network Stack Outputs
$VpcId = aws cloudformation describe-stacks --stack-name "$StackPrefix-network" --query "Stacks[0].Outputs[?OutputKey=='VpcId'].OutputValue" --output text
$PublicSubnet1Id = aws cloudformation describe-stacks --stack-name "$StackPrefix-network" --query "Stacks[0].Outputs[?OutputKey=='PublicSubnet1Id'].OutputValue" --output text
$PublicSubnet2Id = aws cloudformation describe-stacks --stack-name "$StackPrefix-network" --query "Stacks[0].Outputs[?OutputKey=='PublicSubnet2Id'].OutputValue" --output text

# Deploy Database Stack
Write-Host "Deploying Database Stack..."
aws cloudformation create-stack `
    --stack-name "$StackPrefix-database" `
    --template-body "file://database.yaml" `
    --parameters `
        ParameterKey=VpcId,ParameterValue=$VpcId `
        ParameterKey=PublicSubnet1Id,ParameterValue=$PublicSubnet1Id `
        ParameterKey=PublicSubnet2Id,ParameterValue=$PublicSubnet2Id `
        ParameterKey=DBPassword,ParameterValue=$DBPassword

Wait-StackCompletion "$StackPrefix-database"

# Get Database Stack Outputs
$DBSecurityGroupId = aws cloudformation describe-stacks --stack-name "$StackPrefix-database" --query "Stacks[0].Outputs[?OutputKey=='DBSecurityGroupId'].OutputValue" --output text

# Deploy Backend Stack
Write-Host "Deploying Backend Stack..."
aws cloudformation create-stack `
    --stack-name "$StackPrefix-backend" `
    --template-body "file://backend.yaml" `
    --parameters `
        ParameterKey=VpcId,ParameterValue=$VpcId `
        ParameterKey=PublicSubnet1Id,ParameterValue=$PublicSubnet1Id `
        ParameterKey=DBSecurityGroupId,ParameterValue=$DBSecurityGroupId `
        ParameterKey=KeyPairName,ParameterValue=$KeyPairName

Wait-StackCompletion "$StackPrefix-backend"

# Deploy Frontend Stack
Write-Host "Deploying Frontend Stack..."
aws cloudformation create-stack `
    --stack-name "$StackPrefix-frontend" `
    --template-body "file://frontend.yaml" `
    --parameters `
        ParameterKey=DomainName,ParameterValue=$DomainName

Wait-StackCompletion "$StackPrefix-frontend"

# Get Frontend Stack Outputs
$CloudFrontDomain = aws cloudformation describe-stacks --stack-name "$StackPrefix-frontend" --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" --output text
$S3BucketName = aws cloudformation describe-stacks --stack-name "$StackPrefix-frontend" --query "Stacks[0].Outputs[?OutputKey=='WebsiteBucketName'].OutputValue" --output text

Write-Host "`nDeployment Complete!"
Write-Host "CloudFront Domain: $CloudFrontDomain"
Write-Host "S3 Bucket: $S3BucketName" 