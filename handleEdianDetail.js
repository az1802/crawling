const request = require('request')
const fs = require('fs')
const path = require('path')
var zipper = require("zip-local");


function formatItem(item) { 
  let menuItem = {};
  menuItem.menuName = item.itemname;
  menuItem.foods = [];

  item.products.forEach(productItem => { 
    menuItem.foods.push({
      name: productItem.name,
      small_pic: productItem.small_pic,
      big_pic:productItem.big_pic,
    })
  })


  return menuItem;
}

function formatFoods(merchantFoods) { 
  let menus = [];
  let salesItem = {};
  salesItem.menuName = "销量排行"
  salesItem.foods = merchantFoods.sales.map(salesItem => { 
    return {
      name: salesItem.name,
      small_pic: salesItem.small_pic,
      big_pic:salesItem.big_pic,
    }
  })

  menus.push(salesItem);

  merchantFoods.items.forEach(item => {
    menus.push(formatItem(item))
  });

  return menus;
}



module.exports = function (merchantFoods,dirname) { 
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  let menus = formatFoods(merchantFoods)

  // 生成菜品图片文件夹
  menus.forEach((menuItem) => { 
    let menuDir = path.join(dirname,menuItem.menuName)
    if (!fs.existsSync(menuDir)) { 
      fs.mkdirSync(menuDir);
    }
    let foods = menuItem.foods
    foods.forEach(foodItem => {
      let imgUrl = foodItem.big_pic;
      let imgName = foodItem.name + imgUrl.slice(imgUrl.lastIndexOf("."))
      if (foodItem.big_pic || foodItem.small_pic ) { 
        request(foodItem.big_pic || foodItem.small_pic).pipe(fs.createWriteStream(path.join(menuDir,imgName)))
      }
    })
  })

  
}
