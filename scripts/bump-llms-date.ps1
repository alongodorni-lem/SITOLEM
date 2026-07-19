# Aggiorna le date di freshness in llms.txt, ai.txt, robots.txt e servizi.html
# Uso: .\scripts\bump-llms-date.ps1
#      .\scripts\bump-llms-date.ps1 -Date 2026-07-20
#      .\scripts\bump-llms-date.ps1 -SiteRoot "C:\path\to\frontend"

param(
    [string]$Date = "",
    [string]$SiteRoot = ""
)

$ErrorActionPreference = "Stop"

if (-not $SiteRoot) {
    $SiteRoot = Split-Path $PSScriptRoot -Parent
}

if (-not (Test-Path (Join-Path $SiteRoot "llms.txt"))) {
    Write-Error "llms.txt non trovato in: $SiteRoot"
    exit 1
}

if ($Date) {
    $isoDate = $Date
} else {
    $isoDate = (Get-Date).ToString("yyyy-MM-dd")
}

$parsed = [datetime]::ParseExact($isoDate, "yyyy-MM-dd", $null)
$months = @{
    1 = "gennaio"; 2 = "febbraio"; 3 = "marzo"; 4 = "aprile"
    5 = "maggio"; 6 = "giugno"; 7 = "luglio"; 8 = "agosto"
    9 = "settembre"; 10 = "ottobre"; 11 = "novembre"; 12 = "dicembre"
}
$italianDate = "{0} {1} {2}" -f $parsed.Day, $months[$parsed.Month], $parsed.Year

function Update-TextFile {
    param(
        [string]$Path,
        [scriptblock[]]$Replacements
    )
    if (-not (Test-Path $Path)) { return $false }
    $content = Get-Content -Path $Path -Raw -Encoding UTF8
    $original = $content
    foreach ($r in $Replacements) {
        $content = $r.Invoke($content)
    }
    if ($content -ne $original) {
        Set-Content -Path $Path -Value $content -Encoding UTF8 -NoNewline
        return $true
    }
    return $false
}

$updated = @()

if (Update-TextFile (Join-Path $SiteRoot "llms.txt") @(
        { param($c) $c -replace '(?m)^# Updated: \d{4}-\d{2}-\d{2}', "# Updated: $isoDate" }
        { param($c) $c -replace '(?m)^Ultimo aggiornamento: \d{4}-\d{2}-\d{2}', "Ultimo aggiornamento: $isoDate" }
    )) { $updated += "llms.txt" }

if (Update-TextFile (Join-Path $SiteRoot "ai.txt") @(
        { param($c) $c -replace '(?m)^# Updated: \d{4}-\d{2}-\d{2}', "# Updated: $isoDate" }
        { param($c) $c -replace '(?m)^Ultimo aggiornamento: \d{4}-\d{2}-\d{2}', "Ultimo aggiornamento: $isoDate" }
    )) { $updated += "ai.txt" }

if (Update-TextFile (Join-Path $SiteRoot "robots.txt") @(
        { param($c) $c -replace '(?m)^# Last-Modified: \d{4}-\d{2}-\d{2}', "# Last-Modified: $isoDate" }
    )) { $updated += "robots.txt" }

$serviziPath = Join-Path $SiteRoot "servizi.html"
if (Test-Path $serviziPath) {
    $content = Get-Content -Path $serviziPath -Raw -Encoding UTF8
    $pattern = '<time datetime="\d{4}-\d{2}-\d{2}">\d{1,2} [a-z]+ \d{4}</time>'
    $replacement = "<time datetime=`"$isoDate`">$italianDate</time>"
    if ($content -match $pattern) {
        $newContent = [regex]::Replace($content, $pattern, $replacement)
        if ($newContent -ne $content) {
            Set-Content -Path $serviziPath -Value $newContent -Encoding UTF8 -NoNewline
            $updated += "servizi.html"
        }
    }
}

if ($updated.Count -gt 0) {
    Write-Host "Date aggiornate a $isoDate ($italianDate): $($updated -join ', ')"
} else {
    Write-Host "Nessun campo data trovato da aggiornare."
}
