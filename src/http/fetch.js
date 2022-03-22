import axios from "axios";
import $ from "jquery"



axios.defaults.withCredentials = true

const instance = axios.create({
    baseURL: '',
    timeout: 30000,
    withCredentials: true
});

instance.interceptors.response.use(function (config) {
    /* do something */
    return config
})

instance.interceptors.request.use(
    config => {
        return config
    },
    err => {
        return Promise.reject(err)
    })

const convertTostring = function (obj) {
    var str = '';
    for (var key in obj) {
        str += key + '=' + obj[key] + '&';
        console.log(str);
    }
    console.log(str.slice(0, -1));
    return str.slice(0, -1);
}


export default async function (url, data = {}, method = "", type = "axios", headersData, login_token, cookie) {
    if (type == "axios") {
        const defaultMethod = {
            OPTIONS: "OPTIONS",
            GET: "GET",
            HEAD: "HEAD",
            POST: "POST",
            PUT: "PUT",
            DELETE: "DELETE",
            TRACE: "TRACE",
            CONNECT: "CONNECT",
        };

        method = defaultMethod[method.toUpperCase()] ? defaultMethod[method.toUpperCase()] : "GET";
        const responseType = data["responseType"] ? data["responseType"] : "json";
        const headers = data["headers"] ? data["headers"] : {
            'content-type': 'application/json'
        };

        data = data["params"] ? data["params"] : data;

        const requestObj = {
            url,
            headers,
            method,
            responseType
        };

        if (method == 'PUT' || method == 'POST' || method == 'PATCH') {
            requestObj.data = data;
        } else {
            requestObj.params = data;
        }

        return instance.request(requestObj).then((respone) => {
            const res = respone.data
            res.status = respone.status
            return res;
        });
    } else {
        return new Promise((r, rj) => {
            $.ajax({
                type: method,
                url,
                headers: {
                    "devId": headersData,
                    [login_token]: cookie
                },
                contentType: "application/json; charset=utf-8",
                data,
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (res) {
                    r(res)
                },
                error: function (errorRes) {
                    rj(errorRes)
                }
            })
        })
    }

}