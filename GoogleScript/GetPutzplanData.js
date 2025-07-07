function getPutzplanSheetData(sheet) {
    // Daten aus dem Sheet holen (alle Zeilen und Spalten mit Inhalten)
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    // Header (erste Zeile) als Schlüssel verwenden
    var headers = values[2];
    var lastTimes = values[3]
    var frequency = values[4]
    var result = [];
  
    for(var i = 0; i < headers.length;i++){
      if(headers[i] != ''){
        const objToAdd = {};
        objToAdd["name"] = headers[i];
        objToAdd["lastTime"] = lastTimes[i];
        objToAdd["frequency"] = frequency[i];
        result.push(objToAdd);
      }
    }
    return result;
}

function getPutzplanItems(){
    var spreadsheetId = PropertiesService.getScriptProperties().getProperty('putzplanSpreadsheetId');
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName("Tabellenblatt1"); // Ersetzen Sie "Tabelle1" mit Ihrem Tabellennamen
    
    // Daten aus dem Sheet holen
    var data = getPutzplanSheetData(sheet);
    return data;
}