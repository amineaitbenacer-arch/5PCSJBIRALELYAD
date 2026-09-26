var HEADERS = ['OrderDate', 'country', 'name', 'phone', 'address', 'url', 'sku', 'Product', 'quantity', 'price', 'currency', 'notes', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
var SKU = 'MP-PSC1OMN0ANSM';
var PRODUCT = 'كريم لانثوم ريتينول';
var SITE = 'https://lanthome.vercel.app/';

function doGet() {
  var sheet = ordersSheet_();
  return json_({ ok: true, ready: true, rows: Math.max(sheet.getLastRow() - 1, 0) });
}

function doPost(e) {
  var sheet = ordersSheet_();
  var data = JSON.parse(e.postData.contents);
  ensureHeaders_(sheet);

  if (data.action === 'updatePhone') {
    var row = findRowByOrderId_(sheet, data.orderId);
    if (!row) return json_({ ok: false, updated: false });
    sheet.getRange(row, 4).setValue("'" + String(data.phone || '').replace(/\D/g, ''));
    return json_({ ok: true, updated: true, row: row });
  }

  var orderId = String(data.orderId || '');
  if (orderId && findRowByOrderId_(sheet, orderId)) {
    return json_({ ok: true, duplicate: true });
  }

  var phone = String(data.phone || '').replace(/\D/g, '');
  sheet.appendRow([
    formatOrderDate_(data.orderDate || data.date),
    'ksa',
    data.name || '',
    phone ? "'" + phone : '',
    data.address || data.city || '',
    data.url || SITE,
    data.sku || SKU,
    productName_(data),
    quantity_(data),
    Number(data.price || 0),
    'sar',
    data.notes || '',
    data.utm_source || '',
    data.utm_medium || '',
    data.utm_campaign || '',
    data.utm_term || '',
    data.utm_content || ''
  ]);

  var written = sheet.getLastRow();
  if (orderId) sheet.getRange(written, 1).setNote(orderId);
  return json_({ ok: true, row: written });
}

function ordersSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function ensureHeaders_(sheet) {
  var width = HEADERS.length;
  var current = sheet.getRange(1, 1, 1, width).getValues()[0];
  var same = HEADERS.every(function (header, index) {
    return String(current[index] || '') === header;
  });
  if (same) return;
  var range = sheet.getRange(1, 1, 1, width);
  range.setValues([HEADERS]);
  range.setBackground('#FF0000').setFontColor('#FFFFFF').setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function quantity_(data) {
  var q = parseInt(data.quantity, 10);
  if (q === 1 || q === 2 || q === 3) return q;
  var offer = String(data.offerName || '');
  if (offer.indexOf('3') !== -1) return 3;
  if (offer.indexOf('عبوتان') !== -1) return 2;
  return 1;
}

function productName_(data) {
  var name = String(data.product || '');
  if (!name || name === 'LANTHOME Retinol Cream') return PRODUCT;
  return name;
}

function formatOrderDate_(value) {
  var text = String(value || '');
  if (text.indexOf(' at ') !== -1) return text;
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var stamp = Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyyy-MM-dd HH:mm');
  var year = Number(stamp.substring(0, 4));
  var month = Number(stamp.substring(5, 7));
  var day = Number(stamp.substring(8, 10));
  var time = stamp.substring(11, 16);
  return months[month - 1] + ' ' + day + ', ' + year + ' at ' + time;
}

function findRowByOrderId_(sheet, orderId) {
  var last = sheet.getLastRow();
  if (!orderId || last < 2) return 0;
  var notes = sheet.getRange(2, 1, last - 1, 1).getNotes();
  var wanted = String(orderId);
  for (var i = 0; i < notes.length; i++) {
    if (String(notes[i][0]) === wanted) return i + 2;
  }
  return 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
