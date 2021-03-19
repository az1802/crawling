


const request = require('request')
const fs = require('fs')
const path = require('path')
const handleEdianDetail = require("./handleEdianDetail");
const { dirname } = require('path');


// const edianShopInfo = "https://m.huanxiongdd.com/dd_wx_applet/sitdownrts/getShopInfo?shop_id=1000027";



async function getDetail(edianMerchantInfo) { 
  return new Promise((resolve, reject) => {
    request.get({
      url:edianMerchantInfo
    }, (err,res,body) => { 
        // console.log(res)
      resolve(JSON.parse(body))
    })
  })
}
// request(edianMerchantInfo).pipe(fs.createWriteStream("./test.json"))

async function handle(shopId) { 
  const edianMerchantInfo = `https://m.diandianwaimai.com/dd_wx_applet/sitdownrts/ajax_getProductDetail.action?shop_id=${shopId}` //浣熊
  let res = await getDetail(edianMerchantInfo);
  let detail = res.detail;
  if (detail && detail.shopname) { 
    let shopname = detail.shopname.replace(/\//ig, "-")
    let jsonName = path.join(__dirname, "huanXiongMenusJsons", shopId + "-" + shopname + ".json")
    fs.writeFileSync(jsonName,JSON.stringify(detail))

    // handleEdianDetail(detail,path.join(__dirname,"uploadImages",shopId+"-"+shopname))
  }
  
  // if (detail && detail.shopname) { 
  //   // console.log(path.join(__dirname,"uploadImages",detail.shopname))
  //   let shopname = detail.shopname.replace(/\//ig, "-")
  //   let jsonName = path.join(__dirname, "edianShopsJsons", shopId + "-" + shopname + ".json")
  //   fs.writeFileSync(jsonName,JSON.stringify(detail))

  //   // handleEdianDetail(detail,path.join(__dirname,"uploadImages",shopId+"-"+shopname))
  // }
}

// let shopId = 1000027; //商户id
const shopIdMax = 41466;
async function handleMore(shopIds) { 
  for (let i = 1; i < shopIdMax;i++) { 
    await handle(i)
  }
}


handleMore();