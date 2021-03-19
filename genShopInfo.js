
var path = require("path");
var fs = require("fs");
const { resolve } = require("path");
var xlsx = require('node-xlsx');
var dirName = path.join(__dirname, "huanXiongShopsJsons")

async function getFiles() { 
  var dirs = [];

  return new Promise((resolve, reject) => { 
    fs.readdir(dirName, function (err, files) {
      resolve(files)
    });
  })
}

async function handle() { 
  // let titleKey = ["fileName","name","address","mobile","mobileNum","support"];
  let title = ["商户id","商户名称","地址","手机1","手机2"];
  let datas = []
  datas.push(title)
  let files = await getFiles();

  console.log(files.length)


  for (let i = 0; i < files.length; i++) { 
    let shopInfo = fs.readFileSync(path.join(dirName, files[i]), "utf-8");
    shopInfo = JSON.parse(shopInfo)
    datas.push([files[i].slice(0,files[i].indexOf("-")), shopInfo.sname, shopInfo.address, shopInfo.m, shopInfo.mobilenum])
  }

  // fs.writeFileSync("./test.json",JSON.stringify(datas))

  let buffer = xlsx.build([
    {
        name:'sheet1',
        data:datas
    }
  ]);
  fs.writeFileSync('./浣熊存活商户信息.xlsx',buffer,{'flag':'w'});
}


handle();