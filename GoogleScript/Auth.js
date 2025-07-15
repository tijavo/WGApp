function isAuthenticated(encoded_pw) {
    let secret = PropertiesService.getScriptProperties().getProperty('authentificationSecret');
    if (!secret) {
        throw new Error("Authentication secret is not set in script properties.");
        return false;
    }
    if (encoded_pw === secret) {
        return true;
    } else {
        return false;
    }
}

function postAuthRequest(json_data) {
    if (!json_data || !json_data.password) {
        return {
            'message': "Password parameter is missing.",
            'status': 'error'
        };
    }

    let password = json_data.password;
    if (!password) {
        return {
            'message': "Password cannot be empty.",
            'status': 'error'
        };
    }

    if(isAuthenticated(password)) {
        return {
            'message': "Authentication successful.",
            'status': 'success'
        };
    }

    return {
        'message': "Authentication failed. Invalid password.",
        'status': 'failed'
    };
}