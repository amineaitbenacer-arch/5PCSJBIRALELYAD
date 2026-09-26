function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var headers = ['التاريخ', 'رقم الطلب', 'الاسم', 'الجوال', 'المدينة', 'العنوان', 'العرض', 'الثمن', 'العملة', 'المنتج', 'الدفع', 'الحالة'];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
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
