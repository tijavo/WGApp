function createMoneySheet(name){
    var spreadsheetId = PropertiesService.getScriptProperties().getProperty('moneySpreadsheetId');
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName("Template"); // Ersetzen Sie "Tabelle1" mit Ihrem Tabellennamen
    
    if(!sheet) {
        return {
            'message': "Template sheet not found in the spreadsheet.",
            'status': 'error'
        }
    }
    // Check if the name is provided
    if (!name || name.trim() === "") {
        return {
            'message': "Name is required to create a new sheet.",
            'status': 'error'
        };
    }

    // Does the name already exist?
    var existingSheet = spreadsheet.getSheetByName(name);
    if (existingSheet) {
        return {
            'message': "A sheet with this name already exists.",
            'status': 'error'
        };
    }

    // Copy the template sheet to create a new sheet
    var newSheet = sheet.copyTo(spreadsheet);
    newSheet.setName(name);

    return {
        'message': "Sheet created successfully with name: " + name,
        'status': 'success',
        'sheetId': newSheet.getSheetId(),
    };
}

function postCreateMoneySheet(json_postData) {
    var date = json_postData.date;
    //get Month and Year from date
    var month = new Date(date).getMonth() + 1; // Months are 0-indexed in JavaScript
    var year = new Date(date).getFullYear();

    // Get Month Name
    var monthName = Utilities.formatDate(new Date(year, month - 1, 1), Session.getScriptTimeZone(), "MMMM");
    var name = monthName + " " + year;
    var response = createMoneySheet(name);
    return response;
}