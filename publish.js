//引入七牛
const qn = require('qn');
const fs = require('fs');
const join = require('path').join;

var isExists = fs.existsSync('.qiniu.js')
if (!isExists) {
    console.log('请配置.qiniu.js文件以发布到七牛')
    return;
}

const qiniuConfig = require('./.qiniu.js')

//七牛上传对象
let client = qn.create(qiniuConfig);

//文件路径查询
function findSync(startPath) {
    let result = [];

    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val) => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile()) result.push(fPath);
        });

    }
    finder(startPath);
    return result;
}

//上传文件
let fileNames = findSync('dist/');

let files = [];

fileNames.forEach(item => {
    files.push({
        path: item,
        name: item.replace(/\\/g, '/').substr(5, item.length)
    })
})

console.log('开始发布到七牛')

files.forEach(item => {
    client.uploadFile(item.path, {
        key: 'nanqi/chain/' + item.name
    }, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(result.url + '--->OK')
        }
    });
})
