function doGet() {
  var sheet = ordersSheet_();
  return json_({ ok: true, ready: true, rows: Math.max(sheet.getLastRow() - 1, 0) });
}

function doPost(e) {
  var sheet = ordersSheet_();
  var data = JSON.parse(e.postData.contents);
  var headers = ['التاريخ', 'الاسم', 'الهاتف', 'المدينة', 'العرض المختار', 'الثمن', 'SKU', 'رقم الطلب', 'العنوان', 'المنتج', 'الدفع', 'الحالة'];
  ensureHeaders_(sheet, headers);

  var orderId = String(data.orderId || '');
  if (orderId && alreadySaved_(sheet, orderId)) {
    return json_({ ok: true, duplicate: true });
  }

  var phone = String(data.phone || '');
  sheet.appendRow([
    data.date || new Date(),
    data.name || '',
    phone ? "'" + phone : '',
    data.city || '',
    data.offerName || '',
    data.price || '',
    data.sku || 'MP-PSC1OMN0ANSM',
    orderId,
    data.address || '',
    data.product || '',
    data.payment || '',
    data.status || 'جديد'
  ]);

  return json_({ ok: true, row: sheet.getLastRow() });
}

function ordersSheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  return book.getSheets()[0];
}

function ensureHeaders_(sheet, headers) {
  var current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var same = headers.every(function (header, index) {
    return String(current[index] || '') === header;
  });
  if (same) return;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setBackground('#188038').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function alreadySaved_(sheet, orderId) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var ids = sheet.getRange(2, 8, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === orderId) return true;
  }
  return false;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
