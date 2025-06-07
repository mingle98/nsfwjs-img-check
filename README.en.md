# nsfwjs-img-check

[English](README.en.md) | [简体中文](README.md)

#### Introduction
A Node.js-based image NSFW (Not Safe For Work) detection service implemented using nsfwjs.

Try it online:
[Image NSFW Detection Service](https://luckycola.com.cn/public/dist/#/checkImg)

#### Version Requirements
Node version: v16.11.1

#### Installation Guide

1. Download this repository
2. Install dependencies by running:
   ```js
    yarn
   ```
3. Start the service by running:
   ```js
    yarn start
   ```

#### Usage Instructions

1. When the service starts successfully, you will see the following message in the console:
   ```js
    Image NSFW detection service started successfully! port: 3006
   ```
2. Once the service is running, you can use the API as follows:

```
Request Method: POST
http://localhost:3006/checkImg
```

**API Parameters:**
| No. | Parameter | Required | Description |
|--|--|--|--|
| 1 | file | Yes | Image file to be checked (png, jpg, jpeg formats supported). Note: This API accepts **multipart/form-data** format |

#### Official Website
[http(s)://luckycola.com.cn](http://luckycola.com.cn)

![Screenshot](%E6%88%AA%E5%B1%8F2023-10-11%20%E4%B8%8A%E5%8D%8811.14.47.png) 