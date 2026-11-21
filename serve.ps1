# سيرفر معاينة محلي فائق السرعة والاستقرار لـ market.com
$root = "c:\Users\amoha\OneDrive\Desktop\website"
if (-not (Test-Path $root)) {
    $root = Get-Location
}

$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:${port}/")
$listener.Prefixes.Add("http://127.0.0.1:${port}/")

try {
    $listener.Start()
} catch {
    Write-Host "Port $port might be in use, trying port 8081..." -ForegroundColor Yellow
    $port = 8081
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:${port}/")
    $listener.Prefixes.Add("http://127.0.0.1:${port}/")
    $listener.Start()
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  market.com - السيرفر يعمل بنجاح!" -ForegroundColor Green
Write-Host "  الرابط المباشر للمعاينة:" -ForegroundColor Green
Write-Host "  http://localhost:${port}" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".webp" = "image/webp"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".md"   = "text/markdown; charset=utf-8"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/" -or [string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "/index.html"
        }

        # sanitize path
        $cleanPath = $localPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $root $cleanPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType
            $response.StatusCode = 200

            # Headers
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("X-Content-Type-Options", "nosniff")

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Not Found")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # ignore client disconnects
    }
}
