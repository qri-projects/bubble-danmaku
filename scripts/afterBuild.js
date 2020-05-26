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
    dirs.forEach(function(item){
        var item_path = path.join(src, item);
        var temp = fs.statSync(item_path);
        if (temp.isFile()) { // 是文件
            // console.log("Item Is File:" + item);
            fs.copyFileSync(item_path, path.join(dest, item));
        } else if (temp.isDirectory()){ // 是目录
            // console.log("Item Is Directory:" + item);
            copyDirectory(item_path, path.join(dest, item));
        }
    });
}

copyDirectory("./config", path.join(generatedPath, "config"))
copyDirectory("./static", path.join(generatedPath, "static"))
fs.copyFileSync("./LICENSE", path.join(generatedPath, "LICENSE"));
let d = new Date();
let targetDirectory = `./build/bubble弹幕使/bubble弹幕使-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}/`

fs.renameSync(generatedPath, targetDirectory)
