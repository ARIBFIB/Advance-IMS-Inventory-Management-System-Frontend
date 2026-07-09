# Fix-ColorEntry-v9.ps1
# Run from: CRUD_Project/app/client
param()

$ErrorActionPreference = "Stop"
$backupDir = "unused-fix-backup-v9-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir | Out-Null

$product = "src/pages/Products/ProductPage.tsx"
if (Test-Path $product) {
    Copy-Item $product (Join-Path $backupDir "ProductPage.tsx") -Force
    $content = Get-Content $product -Raw

    $pattern = '(?m)^\s*// color entry for swatch row\r?\n\s*const colorEntry = pairs\.find\(\(\{ key \}\) =>\r?\n\s*\["color", "colour"\]\.includes\(key\.toLowerCase\(\)\),\r?\n\s*\);\r?\n\r?\n'
    if ($content -match $pattern) {
        $content = [regex]::Replace($content, $pattern, "")
        Set-Content $product $content -NoNewline
        Write-Host "OK: ProductPage.tsx colorEntry (line ~969) removed"
    } else {
        Write-Host "FAIL: pattern not matched - trying looser fallback"
        $pattern2 = '(?s)// color entry for swatch row.*?\);\r?\n\r?\n'
        if ($content -match $pattern2) {
            $content = [regex]::Replace($content, $pattern2, "", 1)
            Set-Content $product $content -NoNewline
            Write-Host "OK: ProductPage.tsx colorEntry removed (fallback regex)"
        } else {
            Write-Host "MANUAL: could not auto-match, remove these 4 lines by hand near line 966-969:"
            Write-Host '  // color entry for swatch row'
            Write-Host '  const colorEntry = pairs.find(({ key }) =>'
            Write-Host '    ["color", "colour"].includes(key.toLowerCase()),'
            Write-Host '  );'
        }
    }
} else {
    Write-Host "MISSING: $product"
}

Write-Host ""
Write-Host "Backup saved to $backupDir"
Write-Host "Now run: npx tsc --noEmit"
Write-Host ""
Write-Host "PENDING: mockRiders.ts StaffMember shape - send src/pages/Staff/staff.types.ts to finish"