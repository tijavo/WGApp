function postPutzplanData(e) {
  try {
    // Prüfen ob Daten im Request vorhanden sind
    if (!e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'No data received'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // JSON Daten aus dem Request parsen
    const requestData = JSON.parse(e.postData.contents);
    
    // Spreadsheet öffnen
    var spreadsheetId = "1k-YJwrEhvEnsMe0sXOa8ZTksunOrZXAvAYbW6Yfsdz8";
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName("Tabellenblatt1");

    console.log(requestData);
    var user = requestData.user;
    if(!user in ['Till','Max','Simon']){
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'User not exists'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    var cleaned = requestData.cleaned;

    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var headers = values[2];

    var column = 0;
    for(column = 0; column < headers.length;column++){
      if(headers[column] == cleaned){
        break;
      }
    }
    if(column >= headers.length){
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'Cleaning task not exists'
      })).setMimeType(ContentService.MimeType.JSON);
    }



    var NextRow = sheet.getLastRow() + 1; // Nächste freie Zeile finden

    sheet.getRange(NextRow, 1).setValue(user); // Benutzername in die erste Spalte schreiben
    sheet.getRange(NextRow, column + 1).setValue(Utilities.formatDate(new Date(), "GMT", "dd/MM/yyyy")); // Datum in die Zelle schreiben

    
    // Hier können Sie die Daten in Ihr Sheet schreiben
    // Beispiel:
    // sheet.getRange(row, column).setValue(requestData.someValue);

    // Erfolgreiche Antwort zurückgeben
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Try to add ' + user + ' cleaned: ' + cleaned + ' at row: ' + NextRow + ' column: ' + column,
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Fehlerbehandlung
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
