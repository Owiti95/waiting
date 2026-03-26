/**
 * Google Apps Script - Web App for VA Waiting List
 *
 * This script creates a Web App that receives form submissions from your
 * landing page and saves them to a Google Sheet.
 *
 * INSTRUCTIONS:
 * 1. Open Google Sheets and create a new sheet named "VA Waiting List"
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this code
 * 4. Click Deploy > New Deployment
 * 5. Select "Web App" as the deployment type
 * 6. Configure:
 *    - Description: VA Waiting List Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Click Deploy and copy the Web App URL
 * 8. Paste the URL in your index.html file where indicated
 */

// ============================================
// CONFIGURATION
// ============================================

// The name of the sheet tab where responses will be saved
const SHEET_NAME = 'Responses'

/**
 * Main function that handles POST requests from the form
 */
function doPost(e) {
  try {
    // Get the active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()

    // Get or create the Responses sheet
    var sheet = spreadsheet.getSheetByName(SHEET_NAME)
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME)
      // Add headers if this is a new sheet
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Business',
        'Goal',
        'Tasks to Offload',
        'Success Definition',
        'Failure Definition',
        'Concerns',
        'Current Alternatives',
        'Budget',
      ])
    }

    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents)

    // Append the data to the sheet
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.business || '',
      data.goal || '',
      data.tasks || '',
      data.success || '',
      data.failure || '',
      data.concerns || '',
      data.alternatives || '',
      data.price || '',
    ])

    // Return success response with CORS headers
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Application submitted successfully',
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type')
  } catch (err) {
    // Return error response with CORS headers
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: err.toString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
}

/**
 * Handle OPTIONS preflight requests for CORS
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type')
}

/**
 * Optional: Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'ok',
      message: 'VA Waiting List Web App is running. Use POST to submit data.',
      timestamp: new Date().toISOString(),
    })
  )
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
}

/**
 * Optional: Utility function to set up the sheet with proper formatting
 * Run this from the Apps Script editor to format your sheet
 */
function setupSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = spreadsheet.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME)
  }

  // Add headers
  var headers = [
    'Timestamp',
    'Name',
    'Email',
    'Business',
    'Goal',
    'Tasks to Offload',
    'Success Definition',
    'Failure Definition',
    'Concerns',
    'Current Alternatives',
    'Budget',
  ]

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])

  // Format headers
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
  sheet.getRange(1, 1, 1, headers.length).setBackground('#1f1f1f')
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff')

  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length)

  // Freeze the header row
  sheet.setFrozenRows(1)

  Logger.log('Sheet setup complete!')
}

/**
 * New function to handle form submissions from the HTML client
 * This is called via google.script.run from the client side
 */
function submitApplication(formData) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName(SHEET_NAME)

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME)
      // Add headers if this is a new sheet
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Business',
        'Goal',
        'Tasks to Offload',
        'Success Definition',
        'Failure Definition',
        'Concerns',
        'Current Alternatives',
        'Budget',
      ])
    }

    // Append the data to the sheet
    sheet.appendRow([
      new Date(),
      formData.name || '',
      formData.email || '',
      formData.business || '',
      formData.goal || '',
      formData.tasks || '',
      formData.success || '',
      formData.failure || '',
      formData.concerns || '',
      formData.alternatives || '',
      formData.price || '',
    ])

    return {
      status: 'success',
      message: 'Application submitted successfully',
    }
  } catch (err) {
    return {
      status: 'error',
      message: err.toString(),
    }
  }
}

/**
 * Optional: Create a trigger to auto-sort new submissions
 * This keeps the most recent submissions at the top
 */
function createTimeDrivenTrigger() {
  // This creates a trigger that runs every minute to sort new entries
  ScriptApp.newTrigger('sortResponses').timeBased().everyMinutes(1).create()
}

/**
 * Optional: Sort responses by timestamp (newest first)
 */
function sortResponses() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = spreadsheet.getSheetByName(SHEET_NAME)

  if (sheet && sheet.getLastRow() > 1) {
    var range = sheet.getRange(
      2,
      1,
      sheet.getLastRow() - 1,
      sheet.getLastColumn()
    )
    range.sort({ column: 1, ascending: false })
  }
}
