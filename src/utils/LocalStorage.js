export class LocalStorage {
    static get token() {
        return localStorage.getItem("token");
    }

    static set token(valor) {
        if (!valor) {
            localStorage.removeItem("token");
        } else {
            localStorage.setItem("token", valor);
        }
    }

    static get refresh_token() {
        return localStorage.getItem("refresh_token");
    }

    static set refresh_token(valor) {
        if (!valor) {
            localStorage.removeItem("refresh_token");
        } else {
            localStorage.setItem("refresh_token", valor);
        }
    }
}