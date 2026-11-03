/**
 * Anonymous feedback receiver — Google Apps Script
 * Paste this into Extensions → Apps Script of your Google Sheet.
 *
 * Privacy by design:
 *  - Stores ONLY: date (no time), topics, mood, language, message.
 *  - Apps Script never gives the script the visitor's IP or identity
 *    when deployed as "Execute as: Me" + "Who has access: Anyone".
 */

const SHEET_NAME = 'Feedback';
const MOODS = { '1': '😤 Frustrated', '2': '😕 Unhappy', '3': '😐 Neutral', '4': '🙂 Good', '5': '🤩 Great' };

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const message = String(data.message || '').trim().slice(0, 5000);
    if (!message) return out({ ok: false });

    const sheet = getSheet_();
    const date = Utilities.formatDate(new Date(), 'Europe/Zurich', 'yyyy-MM-dd'); // date only, on purpose

    sheet.appendRow([
      date,
      clean_(data.topics).slice(0, 200),
      MOODS[String(data.mood)] || '',
      data.lang === 'de' ? 'DE' : 'EN',
      clean_(message)
    ]);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

// Stops spreadsheet formula injection (e.g. a message starting with "=")
function clean_(v) {
  const s = String(v || '');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Date', 'Topics', 'Mood', 'Language', 'Message']);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:E1').setFontWeight('bold');
    sheet.setColumnWidth(5, 600);
    sheet.getRange('E:E').setWrap(true);
  }
  return sheet;
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Lets you open the Web App URL in a browser to check it is live.
function doGet() {
  return out({ status: 'Feedback endpoint is running' });
}
