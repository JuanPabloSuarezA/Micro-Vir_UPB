
export function getAccessToken() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken || authToken === "null"){
        return false;
    }
    return true;
}

export function logOutApi() {
    localStorage.removeItem("authToken");
}