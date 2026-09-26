function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var headers = ['التاريخ', 'رقم الطلب', 'الاسم', 'الجوال', 'المدينة', 'العنوان', 'العرض', 'الثمن', 'العملة', 'المنتج', 'الدفع', 'الحالة'];
  var current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var headersMatch = headers.every(function (header, index) {
    return String(current[index] || '') === header;
  });
  if (!headersMatch) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setBackground('#188038').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  var orderId = String(data.orderId || '');
  if (orderId && sheet.getLastRow() > 1) {
    var ids = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === orderId) {
        return ContentService.createTextOutput(JSON.stringify({ ok: true, duplicate: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  sheet.appendRow([
    data.date || new Date(),
    orderId,
    data.name || '',
    data.phone || '',
    data.city || '',
    data.address || '',
    data.offerName || '',
    data.price || '',
    data.currency || 'SAR',
    data.product || '',
    data.payment || '',
    data.status || 'جديد'
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
