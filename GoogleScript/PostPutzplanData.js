function postPutzplanItems(e) {
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
    var spreadsheetId = PropertiesService.getScriptProperties().getProperty('putzplanSpreadsheetId');
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
    var cleanedItems = requestData.cleanedItems;

    if(!cleanedItems || cleanedItems.length == 0){
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'No cleaned items provided'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var headers = values[2];

    for(item of cleanedItems){
      if(!item in headers){
        return ContentService.createTextOutput(JSON.stringify({
          'status': 'error',
          'message': 'Cleaning task not exists: ' + item
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    var columnsToFill = [];

    var column = 0;
    for(column = 0; column < headers.length;column++){
      if(headers[column] in cleanedItems){
        columnsToFill.push(headers[column]);
      }
    }

    if(columnsToFill.length == 0){
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'No columns to fill found for cleaned items: ' + cleanedItems.join('; ')
      })).setMimeType(ContentService.MimeType.JSON);
    }

    console.log('Columns to fill: ' + columnsToFill.join(', '));
      

    var NextRow = sheet.getLastRow() + 1; // Nächste freie Zeile finden

    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Next row to fill: ' + NextRow + ', columns: ' + columnsToFill.join(', ')
    })).setMimeType(ContentService.MimeType.JSON);

    sheet.getRange(NextRow, 1).setValue(user); // Benutzername in die erste Spalte schreiben
    sheet.getRange(NextRow, column + 1).setValue(Utilities.formatDate(new Date(), "GMT", "dd/MM/yyyy")); // Datum in die Zelle schreiben


  } catch (error) {
    // Fehlerbehandlung
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
