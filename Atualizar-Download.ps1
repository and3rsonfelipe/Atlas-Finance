$ErrorActionPreference = "Stop"

$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$downloadsDir = Join-Path $siteRoot "downloads"
$configPath = Join-Path $siteRoot "download-config.js"

if (-not (Test-Path -LiteralPath $downloadsDir -PathType Container)) {
    throw "A pasta downloads nao foi encontrada em: $downloadsDir"
}

$files = Get-ChildItem -LiteralPath $downloadsDir -File |
    Where-Object { -not $_.Attributes.HasFlag([System.IO.FileAttributes]::Hidden) } |
    Sort-Object LastWriteTime -Descending

if (-not $files) {
    throw "Nenhum arquivo foi encontrado dentro da pasta downloads."
}

$downloadFile = $files[0]
$sizeMb = $downloadFile.Length / 1MB
$sizeLabel = ("{0:N1} MB" -f $sizeMb).Replace(".", ",")
$updatedLabel = $downloadFile.LastWriteTime.ToString("dd/MM/yyyy")
$encodedName = [System.Uri]::EscapeDataString($downloadFile.Name)

$config = [ordered]@{
    fileName = $downloadFile.Name
    href = "downloads/$encodedName"
    sizeLabel = $sizeLabel
    updatedLabel = $updatedLabel
}

$json = $config | ConvertTo-Json -Depth 2
$content = "window.ATLAS_DOWNLOAD = $json;`r`n"
Set-Content -LiteralPath $configPath -Value $content -Encoding UTF8

Write-Host "Download atualizado para: $($downloadFile.Name)"
Write-Host "Arquivo de configuracao: $configPath"
