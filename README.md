# nsfwjs-img-check

#### 介绍
一款基于nsfwjs实现的node版本的图片鉴黄服务

在线体验案例：
[图片鉴黄服务](https://luckycola.com.cn/public/dist/#/checkImg)

#### 版本说明
node 版本：v16.11.1


#### 安装教程

1. 下载该程序库
2.  执行下面命令，下载依赖
   ```js
    yarn
   ```
3. 执行下面命令，启动服务
 ```js
    yarn start
   ```

#### 使用说明

1.  服务启动成功后，控制台会输出以下提示
   ```js
    图片鉴黄服务器启动成功！port：3006
   ```
2.  服务启动成功后，就可以通过api使用服务啦


```
请求方式: POST
http://localhost:3006/checkImg

```

**api参数说明：**
| 序号 | 参数 | 是否必须|说明 |
|--|--|--|--|
| 1 |file  |是 | 需要鉴别的图片资源(png、jpg、jpeg、png格式),注意:该接口请求参数是**multipart/form-data**格式|



#### 在线官网
[http(s): //luckycola.com.cn](http://luckycola.com.cn)

![输入图片说明](%E6%88%AA%E5%B1%8F2023-10-11%20%E4%B8%8A%E5%8D%8811.14.47.png)
