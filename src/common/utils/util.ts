import fs from "fs";
import request, { ResponseAsJSON } from "request";
import http from "http";
import querystring from "querystring";

function readfileAsync(path): Promise<String> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function fetchAsync(url: string, payload?: RequestInit) {
    let res = await fetch(url, payload);
    return await res.json();
}

function requestGetAsync(option): Promise<any> {
    return new Promise((resolve, reject) => {
        request.get(option, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                let j = JSON.parse(response.body);
                resolve(j);
            }
        });
    });
}

export { readfileAsync, fetchAsync, requestGetAsync };
