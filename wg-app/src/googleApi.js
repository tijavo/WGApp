import axios from "axios";

export const getGoogleApi = (payload) => {
    let link = import.meta.env.VITE_GOOGLE_BACKEND_URL;
    
    if (payload){
        link += `?`;
    }
    Object.keys(payload || {}).forEach((key, index) => {
        link += `${key}=${encodeURIComponent(payload[key])}`;
        if (index < Object.keys(payload).length - 1) {
            link += '&';
        }
    });
    
    console.log("Google API link:", link);
    return axios.get(link);
};

export const postGoogleApi = (payload) => {
    let link = import.meta.env.VITE_GOOGLE_BACKEND_URL;
    return axios.post(link, payload);
}