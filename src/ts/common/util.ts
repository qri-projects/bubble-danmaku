import fs from "fs";

function readfileAsync(path):Promise<String> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

async function fetchAsync(url:string, payload?:RequestInit){
    let res = await fetch(url, payload);
    return await res.json();
}



export {readfileAsync, fetchAsync}
