# Create fonts directory
New-Item -ItemType Directory -Force -Path "public/fonts"

# Download Poppins fonts
$poppinsUrls = @{
    "Poppins-Regular.ttf" = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf"
    "Poppins-Medium.ttf" = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Medium.ttf"
    "Poppins-SemiBold.ttf" = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf"
    "Poppins-Bold.ttf" = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf"
    "Poppins-ExtraBold.ttf" = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-ExtraBold.ttf"
}

# Download Manrope fonts
$manropeUrls = @{
    "Manrope-Regular.ttf" = "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope-Regular.ttf"
    "Manrope-Medium.ttf" = "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope-Medium.ttf"
    "Manrope-SemiBold.ttf" = "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope-SemiBold.ttf"
    "Manrope-Bold.ttf" = "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope-Bold.ttf"
    "Manrope-ExtraBold.ttf" = "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope-ExtraBold.ttf"
}

# Download all fonts
Write-Host "Downloading Poppins fonts..." -ForegroundColor Green
foreach ($font in $poppinsUrls.GetEnumerator()) {
    $outputPath = "public/fonts\$($font.Key)"
    Write-Host "Downloading $($font.Key)..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $font.Value -OutFile $outputPath
}

Write-Host "Downloading Manrope fonts..." -ForegroundColor Green
foreach ($font in $manropeUrls.GetEnumerator()) {
    $outputPath = "public/fonts\$($font.Key)"
    Write-Host "Downloading $($font.Key)..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $font.Value -OutFile $outputPath
}

Write-Host "All fonts downloaded to public/fonts/" -ForegroundColor Green
Write-Host "Convert TTF to WOFF2 using: https://cloudconvert.com/ttf-to-woff2" -ForegroundColor Yellow