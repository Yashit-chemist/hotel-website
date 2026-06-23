# Google Drive setup for hotel website data

1. Create a folder in your Google Drive.
2. Open the folder and copy its folder ID from the URL.
   - Example URL: https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
   - Folder ID: 1AbCdEfGhIjKlMnOpQrStUvWxYz
3. Open [google-drive-backend.gs](google-drive-backend.gs).
4. Replace `PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE` with your folder ID.
5. In Google Apps Script, deploy the project as a web app.
6. Use the web app URL in the form field.

## Permissions you need to provide
- Google Drive access for the Apps Script project
- Permission to create and update files in the target Drive folder
- Permission to allow the web app to run as you (the owner)

When you deploy the web app, Google will prompt you to authorize the script. Approve the permissions so it can read/write the target Drive file.
