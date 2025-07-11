function postPutzplanItems(json_postData) {
  try {
    // Prüfen ob Daten im Request vorhanden sind
    if (!json_postData) {
      return {
        'status': 'error',
        'message': 'No data received'
      };
    }

    
    // Spreadsheet öffnen
    var spreadsheetId = PropertiesService.getScriptProperties().getProperty('putzplanSpreadsheetId');
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName("Tabellenblatt1");

    console.log(json_postData);
    var user = json_postData.user;
    if(!user in ['Till','Max','Simon']){
      return {
        'status': 'error',
        'message': 'User not exists'
      };
    }
    var cleanedItems = json_postData.cleanedItems;

    if(!cleanedItems || cleanedItems.length == 0){
      return {
        'status': 'error',
        'message': 'No cleaned items provided'
      };
    }

    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var headers = values[2];

    for(item of cleanedItems){
      if(!headers.includes(item)){
        return {
          'status': 'error',
          'message': 'Cleaning task not exists: ' + item
        };
      }
    }

    var columnsToFill = [];

    var column = 0;
    for(column = 0; column < headers.length;column++){
      if(cleanedItems.includes(headers[column])){
        columnsToFill.push(column);
      }
    }


    if(columnsToFill.length == 0){
      return {
        'status': 'error',
        'message': 'No columns to fill found for cleaned items: ' + cleanedItems.join('; ')
      };
    }

    console.log('Columns to fill: ' + columnsToFill.join(', '));
      

    var NextRow = sheet.getLastRow() + 1; // Nächste freie Zeile finden
    var date = json_postData.date

    if(!json_postData.debug){
      sheet.getRange(NextRow, 1).setValue(user); // Benutzername in die erste Spalte schreiben
    
      for (var i = 0; i < columnsToFill.length; i++) {
        var col = columnsToFill[i] +1; // Spaltenindex anpassen
        sheet.getRange(NextRow, col).setValue(date); // 'x' in die entsprechenden Spalten schreiben
      }
      sheet.getRange(NextRow, column).setValue('website'); // Aktuelles Datum in die letzte Spalte schreiben
    }


    return {
      'status': 'success',
      'message': 'Next row to fill: ' + NextRow + ', columns: ' + columnsToFill.join(', ') + 'date: ' + date
    };
    

  } catch (error) {
    // Fehlerbehandlung
    return {
      'status': 'error',
      'message': error.toString()
    };
  }
}
