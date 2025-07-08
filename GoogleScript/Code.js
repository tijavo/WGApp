function myFunction() {
  
}

function doPost(e){
    var response = {
        status: "success",
        message: "POST request received"
    };


    try {
        var json_postData = JSON.parse(e.postData.contents);

        if (!json_postData.path) {
            response.status = "error";
            response.message = "No path specified";
            return ContentService.createTextOutput(JSON.stringify(response))
                                .setMimeType(ContentService.MimeType.JSON);
        }
    
        switch (json_postData.path) {
            case 'putzplanItems':
                response = postPutzplanItems(json_postData);
                break;
            case 'goodbye':
                response.message = "Goodbye, world!";
                break;
            default:
                response.status = "error";
                response.message = "Unknown path: " + json_postData.path;
        }
        
        return ContentService.createTextOutput(JSON.stringify(response))
                            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        response.status = "error";
        response.message = "Error processing request: " + error.message;
        return ContentService.createTextOutput(JSON.stringify(response))
                            .setMimeType(ContentService.MimeType.JSON);
    }
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