/**
 * Zitrone · Leads → Google Sheet
 * Paste this into Extensions → Apps Script of the target spreadsheet.
 * Deploy → New deployment → Web app → Execute as: Me · Who has access: Anyone.
 * Then set LEADS_SHEET_WEBHOOK_URL (the /exec URL) and LEADS_SHEET_WEBHOOK_SECRET
 * (the same value as SECRET below) on the website.
 */
var SECRET = "CHANGE-ME-long-random-text";   // must match LEADS_SHEET_WEBHOOK_SECRET
var SHEET_NAME = "Leads";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var body = JSON.parse(e.postData.contents || "{}");
    if (!body || body.secret !== SECRET) return reply({ ok: false, error: "forbidden" });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    var columns = body.columns || Object.keys(body.row);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(columns);
      sheet.getRange(1, 1, 1, columns.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    } else if (sheet.getLastColumn() < columns.length) {
      // The site only ever appends columns; label the new ones in place.
      sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight("bold");
    }

    // Idempotent on Folio: a retry never creates a second row.
    var folioCol = columns.indexOf("Folio") + 1;
    if (folioCol > 0 && sheet.getLastRow() > 1) {
      var folios = sheet.getRange(2, folioCol, sheet.getLastRow() - 1, 1).getValues().map(function (r) { return r[0]; });
      if (folios.indexOf(body.row.Folio) !== -1) return reply({ ok: true, duplicate: true });
    }

    sheet.appendRow(columns.map(function (c) { return body.row[c] == null ? "" : String(body.row[c]); }));
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
