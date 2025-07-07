function myFunction() {
  
}

function doPost(e){
    var response = {
        status: "success",
        message: "POST request received"
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
                         .setMimeType(ContentService.MimeType.JSON);
}



function doGet(e) {
    var response = {
        status: "success",
        message: "GET request received"
    };

    switch (e.parameter.path) {
        case 'putzplanItems':
            response.message = "Hier sind die Putzplan Items";
            response.data = getPutzplanItems(); 
            break;
        case 'goodbye':
            response.message = "Goodbye, world!";
            break;
        default:
            response.status = "error";
            response.message = "Unknown path: " + e.parameter.path;
    }
    return ContentService
        .createTextOutput(JSON.stringify(response));
        
}