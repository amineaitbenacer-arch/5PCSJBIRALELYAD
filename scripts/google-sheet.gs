var HEADERS = ['OrderDate', 'country', 'name', 'phone', 'address', 'url', 'sku', 'Product', 'quantity', 'price', 'currency', 'notes', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
var SKU = 'MP-PSC1OMN0ANSM';
var PRODUCT = 'كريم لانثوم ريتينول';
var SITE = 'https://lanthome.vercel.app/';

function doGet() {
  var sheet = ordersSheet_();
  ensureHeaders_(sheet);
  var repaired = repairShiftedRows_(sheet);
  return json_({ ok: true, ready: true, repaired: repaired, rows: Math.max(sheet.getLastRow() - 1, 0) });
}

function doPost(e) {
  var sheet = ordersSheet_();
  var data = JSON.parse(e.postData.contents);
  ensureHeaders_(sheet);
  repairShiftedRows_(sheet);

  if (data.action === 'updatePhone') {
    var row = findRowByOrderId_(sheet, data.orderId);
    if (!row) row = findRowByPhone_(sheet, data.previousPhone);
    if (!row) return json_({ ok: false, updated: false, reason: 'row' });
    var phoneCol = phoneColumn_(sheet);
    sheet.getRange(row, phoneCol).setValue("'" + String(data.phone || '').replace(/\D/g, ''));
    return json_({ ok: true, updated: true, row: row });
  }

  var orderId = String(data.orderId || '');
  if (orderId && findRowByOrderId_(sheet, orderId)) {
    return json_({ ok: true, duplicate: true });
  }

  var phone = String(data.phone || '').replace(/\D/g, '');
  var address = data.address || data.city || '';
  if (/^https?:\/\//i.test(String(address))) address = data.city || '';
  sheet.appendRow([
    formatOrderDate_(data.orderDate || data.date),
    'ksa',
    data.name || '',
    phone ? "'" + phone : '',
    address,
    SITE,
    SKU,
    PRODUCT,
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
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var s = 0; s < sheets.length; s++) {
    var headers = sheets[s].getRange(1, 1, 1, 12).getValues()[0];
    for (var c = 0; c < headers.length; c++) {
      var name = String(headers[c] || '').trim();
      if (name === 'phone' || name === 'الهاتف' || name === 'الجوال') return sheets[s];
    }
  }
  return sheets[0];
}

function phoneColumn_(sheet) {
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  for (var c = 0; c < headers.length; c++) {
    var name = String(headers[c] || '').trim();
    if (name === 'phone' || name === 'الهاتف' || name === 'الجوال') return c + 1;
  }
  return 4;
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

function repairShiftedRows_(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var values = sheet.getRange(2, 1, last - 1, 13).getValues();
  var fixed = 0;
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (String(row[1]) === 'ksa') continue;
    if (!/^\d+$/.test(String(row[1]).trim())) continue;
    var offer = String(row[6] || '');
    var qty = 1;
    if (offer.indexOf('3') !== -1) qty = 3;
    else if (offer.indexOf('عبوتان') !== -1 || offer.indexOf('2') !== -1) qty = 2;
    var address = String(row[5] || '');
    if (!address || /^https?:\/\//i.test(address)) address = String(row[4] || '');
    var price = Number(String(row[7] || '').replace(/[^\d.]/g, '')) || 0;
    var phone = String(row[3] || '').replace(/\D/g, '');
    var line = i + 2;
    sheet.getRange(line, 1, 1, 17).setValues([[
      formatStoredDate_(row[0]),
      'ksa',
      row[2] || '',
      phone ? "'" + phone : '',
      address,
      SITE,
      SKU,
      PRODUCT,
      qty,
      price,
      'sar',
      '',
      '',
      '',
      '',
      '',
      ''
    ]]);
    sheet.getRange(line, 1).setNote(String(row[1]));
    fixed++;
  }
  return fixed;
}

function formatStoredDate_(value) {
  var text = String(value || '');
  var match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})/);
  if (!match) return formatOrderDate_(text);
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var hour = ('0' + match[4]).slice(-2);
  return months[Number(match[2]) - 1] + ' ' + Number(match[1]) + ', ' + match[3] + ' at ' + hour + ':' + match[5];
}

function findRowByOrderId_(sheet, orderId) {
  var last = sheet.getLastRow();
  if (!orderId || last < 2) return 0;
  var wanted = String(orderId);
  var notes = sheet.getRange(2, 1, last - 1, 1).getNotes();
  for (var i = 0; i < notes.length; i++) {
    if (String(notes[i][0]) === wanted) return i + 2;
  }
  var width = Math.max(sheet.getLastColumn(), 1);
  var values = sheet.getRange(2, 1, last - 1, width).getValues();
  for (var r = 0; r < values.length; r++) {
    for (var c = 0; c < values[r].length; c++) {
      if (String(values[r][c]).replace(/^'/, '') === wanted) return r + 2;
    }
  }
  return 0;
}

function findRowByPhone_(sheet, phone) {
  var digits = String(phone || '').replace(/\D/g, '');
  var last = sheet.getLastRow();
  if (!digits || last < 2) return 0;
  var col = phoneColumn_(sheet);
  var values = sheet.getRange(2, col, last - 1, 1).getValues();
  var found = 0;
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).replace(/\D/g, '') === digits) found = i + 2;
  }
  return found;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
