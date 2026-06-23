const DRIVE_FILE_NAME = 'hotel-website-data.json';
const DRIVE_FOLDER_ID = '1qHYl-5bnThi9pxkN8Dz8TJ3Vrn7SWdab';

function doGet(e) {
  const file = findOrCreateFile(DRIVE_FILE_NAME, DRIVE_FOLDER_ID);
  const jsonText = file.getBlob().getDataAsString();

  return ContentService
    .createTextOutput(jsonText)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.getDataAsString());
  const hotels = Array.isArray(payload.hotels) ? payload.hotels : [];

  const file = findOrCreateFile(DRIVE_FILE_NAME, DRIVE_FOLDER_ID);
  const jsonText = JSON.stringify(hotels, null, 2);
  file.setContent(jsonText);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, fileId: file.getId(), fileName: file.getName() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function findOrCreateFile(fileName, folderId) {
  const parent = folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
  const files = parent.getFilesByName(fileName);
  const matches = [];

  while (files.hasNext()) {
    matches.push(files.next());
  }

  if (matches.length > 0) {
    if (matches.length > 1) {
      matches.slice(1).forEach((file) => file.setTrashed(true));
    }
    return matches[0];
  }

  return parent.createFile(fileName, '[]', MimeType.PLAIN_TEXT);
}
