# PowerShell script to add sample events to the database
# Run with: .\add-sample-events.ps1

$baseUrl = "https://quicktouch02.vercel.app/api"

Write-Host "🚀 Adding sample events to the database..." -ForegroundColor Green
Write-Host "Using API: $baseUrl/admin/events-simple" -ForegroundColor Cyan
Write-Host ""

# Sample events data
$sampleEvents = @(
    @{
        title = "U-16 Training Session"
        type = "training"
        event_date = "2024-03-01T17:00:00.000Z"
        location = "Training Field 1"
        description = "Regular training session for U-16 players. Focus on passing and shooting drills."
        created_by = 1
    },
    @{
        title = "U-18 Trial Session"
        type = "trial"
        event_date = "2024-03-05T14:00:00.000Z"
        location = "Main Stadium"
        description = "Trial session for U-18 players. Full kit required. Bring water bottles."
        created_by = 1
    },
    @{
        title = "Academy vs City Academy"
        type = "match"
        event_date = "2024-03-10T15:00:00.000Z"
        location = "Main Stadium"
        description = "Friendly match against City Academy. All academy players welcome to watch."
        created_by = 1
    },
    @{
        title = "Player Showcase Event"
        type = "showcase"
        event_date = "2024-03-15T16:00:00.000Z"
        location = "Academy Hall"
        description = "Annual showcase event to display academy talent to scouts and parents."
        created_by = 1
    },
    @{
        title = "U-14 Training Session"
        type = "training"
        event_date = "2024-03-08T16:30:00.000Z"
        location = "Training Field 2"
        description = "Training session for U-14 players. Focus on basic skills and teamwork."
        created_by = 1
    },
    @{
        title = "Goalkeeper Training"
        type = "training"
        event_date = "2024-03-12T18:00:00.000Z"
        location = "Training Field 1"
        description = "Specialized goalkeeper training session. Open to all academy goalkeepers."
        created_by = 1
    },
    @{
        title = "U-16 Trial Session - Round 2"
        type = "trial"
        event_date = "2024-03-20T14:30:00.000Z"
        location = "Main Stadium"
        description = "Second round of U-16 trials. Selected players from first round."
        created_by = 1
    },
    @{
        title = "Academy Awards Night"
        type = "showcase"
        event_date = "2024-03-25T19:00:00.000Z"
        location = "Academy Hall"
        description = "Annual awards ceremony recognizing outstanding players and achievements."
        created_by = 1
    },
    @{
        title = "Fitness Testing Day"
        type = "training"
        event_date = "2024-03-18T10:00:00.000Z"
        location = "Training Field 1"
        description = "Comprehensive fitness testing for all academy players."
        created_by = 1
    },
    @{
        title = "Parents Meeting"
        type = "showcase"
        event_date = "2024-03-22T18:30:00.000Z"
        location = "Academy Hall"
        description = "Monthly parents meeting to discuss academy updates and player progress."
        created_by = 1
    }
)

# Test API first
Write-Host "🧪 Testing API connection first..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/events-simple" -Method GET
    $result = $response.Content | ConvertFrom-Json
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API is working correctly!" -ForegroundColor Green
        Write-Host "Current events in database: $($result.events.Count)" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "❌ API is not working properly" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Failed to connect to API: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$successCount = 0
$errorCount = 0

# Add each event
for ($i = 0; $i -lt $sampleEvents.Count; $i++) {
    $event = $sampleEvents[$i]
    $eventNumber = $i + 1
    
    Write-Host "$eventNumber. Adding event: `"$($event.title)`"" -ForegroundColor White
    
    try {
        $jsonBody = $event | ConvertTo-Json -Depth 3
        $response = Invoke-WebRequest -Uri "$baseUrl/admin/events-simple" -Method POST -Body $jsonBody -ContentType "application/json"
        $result = $response.Content | ConvertFrom-Json
        
        if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 200) {
            $eventId = if ($result.event -and $result.event.event_id) { $result.event.event_id } else { "N/A" }
            Write-Host "   ✅ Success - Event ID: $eventId" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "   ❌ Failed - $($result.error)" -ForegroundColor Red
            $errorCount++
        }
    } catch {
        Write-Host "   ❌ Error - $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
    
    # Add delay between requests
    Start-Sleep -Seconds 1
    Write-Host ""
}

# Summary
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "✅ Successful: $successCount" -ForegroundColor Green
Write-Host "❌ Failed: $errorCount" -ForegroundColor Red
Write-Host "📝 Total: $($sampleEvents.Count)" -ForegroundColor White

if ($successCount -gt 0) {
    Write-Host ""
    Write-Host "🎉 Sample events added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now test the API:" -ForegroundColor Cyan
    Write-Host "GET $baseUrl/admin/events-simple" -ForegroundColor Yellow
}
