function getQuittungenSheetData(sheet, json_data){
    if (!sheet) {
        return {
            'message': "Sheet not found.",
            'status': 'error'
        };
    }
    if(!json_data.page){
        json_data.page = 1; // Default to page 1 if not provided
    }
    if(!json_data.pageSize){
        json_data.pageSize = 10; // Default to pageSize 10 if not provided
    }
    var LastRow = sheet.getLastRow();
    if (LastRow < 2) {
        return {
            'message': "No data found in the sheet.",
            'status': 'error'
        };
    }
    var data = sheet.getRange(2, 1, LastRow - 1, sheet.getLastColumn()).getValues(); // Get all data except the header row
    if (data.length === 0) {
        return {
            'message': "No data found in the sheet.",
            'status': 'error'
        };
    }
    //reverse data
    data.reverse();
    // Check if the requested page is valid
    if (json_data.page < 1 || json_data.page > Math.ceil(data.length / json_data.pageSize)) {
        return {
            'message': "Invalid page number.",
            'status': 'error'
        };
    }
    // Ensure pageSize is a positive integer
    json_data.pageSize = parseInt(json_data.pageSize, 10);
    if (isNaN(json_data.pageSize) || json_data.pageSize <= 0) {
        return {
            'message': "Invalid page size.",
            'status': 'error'
        };
    }
    // Pagination logic
    var start = (json_data.page - 1) * json_data.pageSize;
    var end = start + json_data.pageSize;
    var paginatedData = data.slice(start, end);
    if (paginatedData.length === 0) {
        return {
            'message': "No data found for the requested page.",
            'status': 'error'
        };
    }
    // Prepare the data for response
    var responseData = paginatedData.map(row => {
        return {
            date: row[0],
            name: row[1],
            amount: row[2],
            itemCount: row[3],
            formula: row[4]
        };
    });
    return {
        'data': responseData,
        'status': 'success',
        'message': "Quittungen data retrieved successfully.",
        'start': start,
        'end': end,
        'totalItems': data.length,
        'page': json_data.page,
        'pageSize': json_data.pageSize
    };
}

function getQuittungSheetData(sheet,json_data){
    if (!sheet) {
        return {
            'message': "Sheet not found: " + json_data.sheetName,
            'status': 'error'
        };
    }
    var LastRow = sheet.getRange("A:A").getValues().filter(String).length; // +1 to get the next empty row
    if (LastRow < 2) {
        return {
            'message': "No data found in the sheet: " + json_data.sheetName,
            'status': 'error'
        };
    }
    var data = sheet.getRange(2, 1, LastRow - 1, 4).getValues(); // Get all data except the header row
    if (data.length === 0) {
        return {
            'message': "No data found in the sheet: " + json_data.sheetName,
            'status': 'error'
        };
    }
    // Prepare the data for response
    var responseData = data.map(row => {
        return {
            name: row[0],
            price: row[1],
            type: row[2],
            count: row[3]
        };
    });
    return {
        'data': responseData,
        'status': 'success',
        'message': "Quittung data retrieved successfully."
    };
}

function getQuittungen(json_data){

    if (!json_data || !json_data.authToken) {
        return {
            'message': "Authentication token is missing.",
            'status': 'error'
        }
    }
    // Check if the user is authenticated
    if (!isAuthenticated(json_data.authToken)) {
        return {
            'message': "Authentication failed. Invalid token.",
            'status': 'error'
        };
    }

    var spreadsheetId = PropertiesService.getScriptProperties().getProperty('quittungSpreadsheetId');
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Daten aus dem Sheet holen
    if (json_data.path === 'quittungen') {
        var sheet = spreadsheet.getSheetByName("Main"); 
        var data = getQuittungenSheetData(sheet,json_data);
    }else if(json_data.path === 'quittung') {
        if(!json_data.sheetName){
            return {
                'message': "Sheet name is required for getting a single quittung.",
                'status': 'error'
            };
        }
        var sheet = spreadsheet.getSheetByName(json_data.sheetName);
        var data = getQuittungSheetData(sheet,json_data);
    }

    var link = "https://docs.google.com/spreadsheets/d/" + spreadsheetId;
    data.link = link;
    return data;
}

function testGetQuittungen() {
    var e = {
        parameter: {
            auth: 'testAuthToken',
            path: 'quittungen'
        }
    }
    console.log(getQuittungen(e.parameter));
}