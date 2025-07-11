function insertAusgabenIntoSheet(json_postData){

    if(!json_postData.amount || !json_postData.description || !json_postData.user || !json_postData.date) {
        return {
            'message': "All fields (amount, description, user, date) are required.",
            'status': 'error',
            'inputDebug': json_postData
        };
    }

    var spreadsheetId = PropertiesService.getScriptProperties().getProperty('moneySpreadsheetId');
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    var name_data = getMoneySheetNameByDate(json_postData.date);
    if (name_data.status === 'error') {
        return name_data; // Return error message if date is invalid
    }
    var sheetName = name_data.name; // Use the name from the date
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
        return {
            'message': "Sheet with name '" + sheetName + "' not found in the spreadsheet.",
            'status': 'error'
        };
    }

    //LastRow of column A
    var LastRow = sheet.getRange("A:A").getValues().filter(String).length + 1; // +1 to get the next empty row

    // Prepare the data to be inserted
    var data = [
        [json_postData.amount, json_postData.description, json_postData.user, json_postData.date]
    ];
    // Insert the data into the sheet
    sheet.getRange(LastRow, 1, data.length, data[0].length).setValues(data);


    return {
        'message': "Data inserted successfully into sheet: " + sheetName + " in row: " + LastRow,
        'status': 'success',
        'sheetId': sheet.getSheetId(),
        'spreadsheetId': spreadsheetId 
    }
    

}