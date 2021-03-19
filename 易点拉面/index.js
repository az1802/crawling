
const fs = require("fs");
const path = require("path");


const { requestUrl,genImgs,genExcel,genWord,formatFileName,delDirSync,mkdirSync} = require("../utils/index")




const shopId = 1000175
// const shopId = 1001500
// const exportMode = "keruyun"
const exportMode = "feie"
const shopRequestUrl = `https://m.huanxiongdd.com/dd_wx_applet/sitdownrts/getShopInfo?shop_id=${shopId}`
const menuRequestUrl = `https://m.huanxiongdd.com/dd_wx_applet/sitdownrts/ajax_getProductDetail.action?shop_id=${shopId}`
const attrsSort = ["打包","另类小吃","饮料自取"]



const outputDir = path.join(__dirname, "merchantInfos")


// 打印日志到test.json 文件夹
async function logInfo(info) { 
  fs.writeFileSync("./test.json",JSON.stringify(info,null,'\t'))
}

// 获取原始数据
async function getMerchantInfo() { 
  let requestShopData = await requestUrl(shopRequestUrl);
  let requestMenuData = await requestUrl(menuRequestUrl);
  let merchantInfo = await handleRequestData(requestShopData,requestMenuData)
  return merchantInfo;
}

function formatFoodProps(foodItem) { 
  let propsPrice = foodItem.prop_prices,propsPriceObj = {};
  for (let j = 0; j < propsPrice.length; j++){ 
    propsPriceObj[propsPrice[j].keys] = propsPrice[j].price
  }
  
  let propsRes = [],props = foodItem.props;
  for (let k = 0; k < props.length;k++) { 
    propsRes.push({
      name: props[k].p_name,
      values: props[k].values.map(propValItem => { 
        return {
          value: propValItem.p_value,
          price: propsPriceObj[`#${props[k].p_name_id}_${propValItem.p_value_id}#`],
          propName: props[k].p_name,
          isMul:props[k].is_multiple
        }
      })
    })
  }

  let res = new Array(100)
  // 针对属性组的顺序进行排序
  for (let i = 0; i < propsRes.length; i++) { 
    let sortIndex = attrsSort.indexOf(propsRes[i].name)
    if (sortIndex!=-1) {
      res[sortIndex] = propsRes[i];
    } else { 
      res.push(propsRes[i])
    }
  }

  return res.filter(item => !!item)
}
// 爬取的数据中进行信息提取
async function  handleRequestData(requestShopData,requestMenuData) {

  
  try {
    // 商户信息
    let merchantInfo = {
      shopName: requestShopData.sname,
      shop_pic: requestShopData.pic_url,
      categories:[]
    }

    // 菜品目录
    let categories = []

    categories = requestMenuData.detail.items.map(categoryItem => { 
      let categoryData = {
        name: "",
        foods:[]
      };
      categoryData.name = categoryItem.itemname;
      categoryData.foods = categoryItem.products.reduce((res,foodItem) => { 
        if (foodItem) { 
          let foodData = {
            name:foodItem.name || "",
            picUrl: foodItem.big_pic || foodItem.small_pic || "",
            price:foodItem.curr_price || "",
            unit: foodItem.unit || "份",
            categoryName: categoryItem.itemname,
            props:[],
          };
          foodData.props = formatFoodProps(foodItem)
          res.push(foodData)
        }
        return res;
      },[])
      
      return categoryData
    })

    merchantInfo.categories = categories
    await logInfo(merchantInfo)
    return merchantInfo;
  } catch (err) { 
    console.log(err, `格式化转换菜品发生错误${menuRequestUrl}`)
  }
}

// 数据转换提取,写入相关文件

async function mkShopDir(shopDir) { 
  delDirSync(shopDir);
  mkdirSync(shopDir)
}

// 生成图片文件夹以及excel文件
async function genImgsAndExcel() { 
  let merchantInfo = await getMerchantInfo();
  // await logInfo(merchantInfo)
  let { shopName} = merchantInfo
  let shopDir = path.join(outputDir, formatFileName(shopName));
  // // 重建创建商铺目录
  await mkShopDir(shopDir)

  // // mkShopDir(merchantInfo)
  if (exportMode == "keruyun") {
    genImgs(merchantInfo,outputDir);
    genExcel(merchantInfo, outputDir);
  } else {
    genWord(merchantInfo, outputDir)
  }
}



genImgsAndExcel();
