# VA Waiting List Landing Page - Setup Instructions

This document provides step-by-step instructions to get your VA waiting list landing page working with Google Sheets.

---

## IMPORTANT: Choose Your Integration Method

**There are two ways to connect the form to Google Sheets:**

### Option 1: Google Forms (Recommended for Simple Setup)

- Easiest to set up
- No CORS issues
- Form submissions go directly to Google Sheets
- See Option 1 guide below

### Option 2: Google Apps Script with HTML Service

- More control over the form UI
- Custom styling
- Requires hosting the HTML inside Apps Script
- See Option 2 guide below

---

## Option 1: Google Forms (Recommended)

The simplest approach - use a Google Form for submissions, which automatically saves to Google Sheets.

### Step 1: Create a Google Form

1. Go to [Google Forms](https://forms.google.com) and sign in
2. Click **+ New Form** or **Blank form**
3. Add these questions (matching your landing page):

   - **Name** (Short answer, required)
   - **Email** (Short answer, required)
   - **Business** (Short answer)
   - **What are you trying to achieve in your business right now?** (Paragraph, required)
   - **What tasks would you want off your plate immediately?** (Paragraph, required)
   - **What would success look like if a VA handled your work perfectly?** (Paragraph, required)
   - **What would failure look like?** (Paragraph)
   - **What is your biggest concern about hiring a VA?** (Paragraph)
   - **What are you currently doing instead of using a VA?** (Paragraph)
   - **How much would you realistically pay per month for this?** (Short answer, required)

4. Go to the **Settings** tab and:
   - Turn off "Collect email addresses" (you're already collecting it in a question)
   - Turn on "Show progress bar"
   - Turn on "Shuffle questions" (optional)

### Step 2: Connect Form to Google Sheets

1. In your Google Form, go to the **Responses** tab
2. Click the **Sheets icon** ("Link to Sheets")
3. Click **Select response destination** → **Create a new spreadsheet**
4. Name it "VA Waiting List Responses"

### Step 3: Get the Form Link

1. Click the **Send** button in the Google Form
2. Copy the form URL (it looks like `https://forms.google.com/d/...`)

### Step 4: Update the Landing Page

Instead of using a custom form with API calls, update the "Join the Waiting List" button to open the Google Form in a new tab:

```html
<a href="YOUR_GOOGLE_FORM_URL" target="_blank" class="cta-button">
  Join the Waiting List
</a>
```

Or embed the form directly on the page:

```html
<iframe
  src="YOUR_GOOGLE_FORM_URL?embedded=true"
  width="100%"
  height="600"
  frameborder="0"
  marginheight="0"
  marginwidth="0"
  >Loading...</iframe
>
```

---

## Option 2: Google Apps Script with HTML Service

This method gives you full control but requires hosting the HTML inside Google Apps Script.

### Step 1: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com) and sign in
2. Click **+ New Project**
3. Name it "VA Waiting List"

### Step 2: Add the Server-Side Code

1. In the Apps Script editor, create a new file: **File** → **New** → **Script file**
2. Name it `Code.gs`
3. Paste the code from `google-apps-script.js`

### Step 3: Create the HTML File

1. **File** → **New** → **HTML file**
2. Name it `Index` (this becomes `Index.html`)
3. Copy the body content from `index.html` - remove the `<script src="https://apis.google.com/js/google.script.js">` and the script block with form handling
4. Add this simplified script at the bottom instead:

```html
<script>
  function onSuccess() {
    document.getElementById('form-message').textContent =
      "Application submitted successfully! We'll be in touch."
    document.getElementById('form-message').className = 'form-message success'
    document.getElementById('waiting-list-form').reset()
  }

  function onFailure(error) {
    document.getElementById('form-message').textContent =
      'Error: ' + error.message
    document.getElementById('form-message').className = 'form-message error'
  }

  document
    .getElementById('waiting-list-form')
    .addEventListener('submit', function (e) {
      e.preventDefault()
      const formData = {
        name: this.name.value,
        email: this.email.value,
        business: this.business.value,
        goal: this.goal.value,
        tasks: this.tasks.value,
        success: this.success.value,
        failure: this.failure.value,
        concerns: this.concerns.value,
        alternatives: this.alternatives.value,
        price: this.price.value,
      }
      google.script.run
        .withSuccessHandler(onSuccess)
        .withFailureHandler(onFailure)
        .submitApplication(formData)
    })
</script>
```

### Step 4: Update the Apps Script to Serve HTML

Add this function to `Code.gs`:

```javascript
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('VA Waiting List')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}
```

### Step 5: Deploy

1. Click **Deploy** → **New deployment**
2. Select **Web app**
3. Configure:
   - Description: VA Waiting List
   - Execute as: Me
   - Who has access: Anyone
4. Click **Deploy**
5. Copy the Web App URL and share it!

---

## Why This Fixes the CORS Error

The original CORS error occurred because:

- Browsers block cross-origin `fetch()` requests to Google Apps Script Web Apps
- This is a security feature called CORS (Cross-Origin Resource Sharing)

**Solution 1 (Google Forms)** bypasses this by using Google's own form submission.

**Solution 2 (HTML Service)** works because `google.script.run` is a special API that only works when the page is served from within Google Apps Script - not as a standalone file.

---

## Files Included

| File                    | Description                                 |
| ----------------------- | ------------------------------------------- |
| `index.html`            | Landing page template (works with Option 2) |
| `google-apps-script.js` | Server-side code for Option 2               |
| `SETUP.md`              | This guide                                  |

---

## Support

If you run into issues:

1. **Check the browser console** for JavaScript errors
2. **View Apps Script executions** in the Apps Script dashboard
3. **Try Option 1 (Google Forms)** - it's the simplest solution

Need help? The Google Apps Script documentation is available at [developers.google.com/apps-script](https://developers.google.com/apps-script).
