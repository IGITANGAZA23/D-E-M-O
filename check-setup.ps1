# Setup Verification Script
# Run this script to check if your environment is ready

Write-Host "=== Library Management System - Setup Check ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL installed: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ PostgreSQL not found. Please install PostgreSQL from https://www.postgresql.org/download/" -ForegroundColor Red
    Write-Host "  Or verify that PostgreSQL bin directory is in your PATH" -ForegroundColor Yellow
}

# Check .env file
Write-Host "Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
    
    # Check if required variables are set
    $envContent = Get-Content .env
    $requiredVars = @("DB_HOST", "DB_PORT", "DB_USERNAME", "DB_PASSWORD", "DB_DATABASE", "JWT_SECRET")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        $found = $false
        foreach ($line in $envContent) {
            if ($line -match "^$var=") {
                $found = $true
                break
            }
        }
        if (-not $found) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -eq 0) {
        Write-Host "✓ All required environment variables are set" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing environment variables: $($missingVars -join ', ')" -ForegroundColor Red
    }
} else {
    Write-Host "✗ .env file not found. Please create it with database credentials." -ForegroundColor Red
    Write-Host "  See SETUP.md for details" -ForegroundColor Yellow
}

# Check node_modules
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Dependencies not installed. Run: npm install" -ForegroundColor Red
}

# Check database connection (optional)
Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Make sure PostgreSQL service is running" -ForegroundColor White
Write-Host "2. Create database: createdb -U postgres library_management" -ForegroundColor White
Write-Host "3. Run the application: npm run start:dev" -ForegroundColor White
Write-Host "4. Create first librarian: POST http://localhost:3000/librarians/setup" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see SETUP.md" -ForegroundColor Cyan

