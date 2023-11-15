const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const exec = child_process.exec;

async function execCmd(cmd, cwd) {
    return new Promise((resolve, reject) => {
        exec(cmd, {
            cwd: cwd,
            maxBuffer: 1024 * 1024 * 3000
        }, function (error, stdout, stderr) {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log(stdout);
                resolve(stdout);
            }
        });
    });
}

// 定义一个用于保存文件名的 Map
const fileNamesMap = new Map();

function traverseFolder(folderPath) {
    // 读取文件夹内容
    const files = fs.readdirSync(folderPath);

    // 遍历文件夹中的每一个文件/文件夹
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        // 检查当前路径的状态
        const stats = fs.statSync(filePath);

        // 如果是文件夹，则递归遍历子文件夹
        if (stats.isDirectory()) {
            traverseFolder(filePath);
        } else {
            // 如果是文件，则记录文件名到 Map 中
            fileNamesMap.set(filePath, file);
        }
    });
}

// 指定要遍历的文件夹路径
const folderPath = path.join(__dirname, 'src');

// 开始遍历文件夹
traverseFolder(folderPath);

const fileNamesMap2 = new Map();

// 输出所有文件名
fileNamesMap.forEach((value, key) => {
    console.log(`${key} : ${value}`);
    if (value.indexOf(".png") != -1) {
        return;
    }
    fileNamesMap2.set(key, value);
});
console.log("======================================");
fileNamesMap2.forEach(async (value, key) => {
    console.log(`${key} : ${value}`);
    await execCmd(`npm run split_app -- ${key}`);
});