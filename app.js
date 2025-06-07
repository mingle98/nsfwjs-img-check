// 导入experss模块
const express=require("express");
let fs = require('fs');
// 创建服务器对象
let app = express();
// 导入body-parser插件
const bodyparser = require("body-parser");;
 // 配置body-parser模块
 app.use(bodyparser.urlencoded({extended:false}));
 app.use(bodyparser.json());
// 导入系统模块path
const path = require("path");
const afs = require('fs-extra');

let multiparty = require('multiparty');
let imgJS = require("image-js");
const nsfw = require('nsfwjs');
const tf = require('@tensorflow/tfjs-node');
const safeContent = ['Drawing', 'Neutral']; // 设置图片内容安全的类型

// https://github.com/alex000kim/nsfw_data_scraper

let imgTypeoObj = {
    Drawing: '艺术性的',
    Neutral: '中性的',
    Sexy: '性感的',
    Porn: '色情的',
    Hentai: '变态的',
};

//转换图片格式
const convert = async file => {
  const image = await imgJS.Image.load(file.path);
  const numChannels = 3;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let c = 0; c < numChannels; ++c) {
      values[i * numChannels + c] = image.data[i * 4 + c];
    }
  }

  return tf.tensor3d(values, [image.height, image.width, numChannels], 'int32');
};

// 初始化模型
let model;
(async function() {
    model = await nsfw.load('file://./web_model/', {
        type: 'graph'
    });
})();


const isSafeContent = predictions => {
  let safeProbability = 0;
  let imgTypeValArr = [];
  for (let index = 0; index < predictions.length; index++) {
    const item = predictions[index];
    const className = item.className;
    const probability = item.probability;
    if (safeContent.includes(className)) {
      safeProbability += probability;
    };
  }
  imgTypeValArr = predictions.sort((a, b) => b.probability - a.probability);
//   console.log('imgTypeValArr:', imgTypeValArr);
  let myimgType = '';
  if (imgTypeValArr.length && imgTypeValArr[0]) {
    myimgType = imgTypeoObj[imgTypeValArr[0].className];
  }
  return {
    isSafe: safeProbability > 0.5,
    imgType: myimgType
  };
};

app.post('/checkImg',async (req, res) => {
	try {
        // 删除指定文件夹下面的所有文件或文件夹
        try {
          await afs.emptyDirSync('./tempImgs');
          console.log('清空tempImgs成功');
        } catch (error) {
          console.log('清空tempImgs失败');
        }
        let form = new multiparty.Form();
        // 设置文件存储路径，以当前编辑的文件为相对路径
        form.uploadDir = './tempImgs';
        form.parse(req, async (err, fields, files) => {
            if (!files || !files.file[0]) {
                return res.send({
                    code: -1,
                    msg: '请上传file图片资源(form-data格式)',
                    data: {}
                })
            }
            // console.log('files.file[0]:', files.file[0]);
            // 图片最大尺寸
            if (files.file[0].size > 1024 * 1024 * 3) {
                return res.send({
                    code: -2,
                    msg: '被检测图片最大3M',
                    data: {}
                })
            };
            // 支持的图片类型
            let imgReg = /\S+\.(png|jpeg|jpg)$/g;
            let originImgName = files.file[0].originalFilename || files.file[0].path;
            if (!imgReg.test(originImgName)) {
                return res.send({
                    code: -3,
                    msg: '仅仅支持（png、jpeg、jpg）类型图片检测',
                    data: {}
                })
            }
            let img = await convert(files.file[0]);
            let predictions = await model.classify(img);
            const {isSafe, imgType} = isSafeContent(predictions);
            // console.log('是否安全：', predictions, isSafe);
            res.send({
                code: 0,
                msg: isSafe ? '图片合规' : '图片可能存在不合规的风险,请核查',
                data: {
                    isSafe,
                    imgType,
                    predictions,
                }
            })
        });
	} catch (error) {
        res.send({
            code: -9,
            msg: '图片核查失败，请重试',
            data: {}
        })
	}
});

// {
// 	"code": 0,
// 	"msg": "图片合规",
// 	"data": {
// 		"isSafe": true,
// 		"imgType": "艺术性的",
// 		"predictions": [
// 			{
// 				"className": "Drawing",
// 				"probability": 0.9533441662788391
// 			},
// 			{
// 				"className": "Neutral",
// 				"probability": 0.015517046675086021
// 			},
// 			{
// 				"className": "Sexy",
// 				"probability": 0.013940851204097271
// 			},
// 			{
// 				"className": "Porn",
// 				"probability": 0.012532410211861134
// 			},
// 			{
// 				"className": "Hentai",
// 				"probability": 0.004665587563067675
// 			}
// 		]
// 	}
// }

// 监听端口
app.listen(3006,()=>{
	console.log("图片鉴黄服务器启动成功！port：3006");
});