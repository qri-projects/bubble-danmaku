const path = require("path");
const fs = require("fs");
let generatedPath = "./build/win-unpacked";

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    if (!fs.existsSync(src)) {
        return false;
    }
    var dirs = fs.readdirSync(src);
    dirs.forEach(function (item) {
        var item_path = path.join(src, item);
        var temp = fs.statSync(item_path);
        if (temp.isFile()) { // 是文件
            // console.log("Item Is File:" + item);
            fs.copyFileSync(item_path, path.join(dest, item));
        } else if (temp.isDirectory()) { // 是目录
            // console.log("Item Is Directory:" + item);
            copyDirectory(item_path, path.join(dest, item));
        }
    });
}

copyDirectory(path.join(__dirname, "../config"), path.join(generatedPath, "config"))
copyDirectory(path.join(__dirname, "../static"), path.join(generatedPath, "static"))
fs.copyFileSync(path.join(__dirname, "../LICENSE"), path.join(generatedPath, "LICENSE"));

// copy
let copyFromPath = path.join(__dirname, "../copy")
fs.copyFileSync(path.join(copyFromPath, "LICENSE.blive.txt"), path.join(generatedPath, "LICENSE.blive.txt"))
let copyConfigPath = path.join(copyFromPath, "config")
for (let fileName of ["cookie.txt", "windowLocation.json"]) {
    fs.copyFileSync(path.join(copyConfigPath, fileName), path.join(generatedPath, "config", fileName))
}


let d = new Date();
let targetDirectory = `./build/bubble弹幕使/bubble弹幕使-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}/`

fs.renameSync(generatedPath, targetDirectory)
