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
            'status': 'error',
            'sheetId': existingSheet.getSheetId(),
            'spreadsheetId': spreadsheetId 
        };
    }

    // Copy the template sheet to create a new sheet
    var newSheet = sheet.copyTo(spreadsheet);
    newSheet.showSheet();
    newSheet.setName(name);

    return {
        'message': "Sheet created successfully with name: " + name,
        'status': 'success',
        'sheetId': newSheet.getSheetId(),
        'spreadsheetId': spreadsheetId 
    };
}

function getMoneySheetNameByDate(date) {
    if (!date || !/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(date)) {
        return {
            'message': "Invalid date format. Please use dd.mm.yyyy.",
            'status': 'error'
        };
    }
    // Parse the date string to get month and year
    var parts = date.split('.');
    if (parts.length !== 3) {
        return {
            'message': "Invalid date format. Please use dd.mm.yyyy.",
            'status': 'error'
        };
    }
    var month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
    var year = parseInt(parts[2], 10);
    console.log("Month: " + month);
    console.log("Date: " + date);

    // Get Month Name
    var monthName = Utilities.formatDate(new Date(year, month, 1), Session.getScriptTimeZone(), "MMMM");
    var name = monthName + " " + year;
    return {
        'name': name,
        'status': 'success'
    }
}

function postCreateMoneySheet(json_postData) {
    var date = json_postData.date;
    //get Month and Year from date date is dd.mm.yyyy
    var name_data = getMoneySheetNameByDate(date);
    if (name_data.status === 'error') {
        return name_data; // Return error message if date is invalid
    }
    var response = createMoneySheet(name_data.name);
    return response;
}

function testCreateMoneySheet() {
    var json_postData = {
        date: "11.8.2025"
    };
    var response = postCreateMoneySheet(json_postData);
    console.log(response);
}