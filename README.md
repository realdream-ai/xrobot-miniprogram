# Xrobot 设备管理微信小程序

基于 [Remax](https://github.com/remaxjs/remax) 开发的 Xrobot 微信小程序

## 文档

[Remax 开发文档](https://remaxjs.org/guide/quick-start)

[Remax One 文档](https://remaxjs.org/api/remax-one/components)

[微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework)

[小程序使用说明文档](https://ucnno9lo9da5.feishu.cn/wiki/Bbn4wfbvtiPRFWk8shyc4hqjnaf)

## Getting Start

安装依赖

**注意：Remax 要求 Node.js 版本大于等于 12**

```bash
npm install
# or
yarn
```

调试项目

```bash
# 选定要进行开发的平台，如 wechat，并调试
npm run dev wechat
# or
yarn dev wechat
```

使用小程序开发者工具打开项目下的 `dist/[target]` 目录。例如微信小程序，目录为 `dist/wechat`

**注意：微信小程序需要在 IDE 中打开「不校验合法域名」**，[参考文档](https://remaxjs.org/guide/basic/devtools)

本地跑 `lint`

```bash
yarn lint
```

## 开发

### 目录结构

`./public` 目录存放一些静态资源，该目录下的所有文件会被自动复制到 `dist` 目录下

可以将 `原生页面, tabBar 中配置的图片` 等等全局资源放在这个目录下

项目的主体代码都放在 `./src` 中，相当于一般 `React` 项目中的根目录。其文件具体划分如下：

```shell
./src
  ├── apis # 接口相关
  ├── components # 自定义业务相关组件
  ├── ui # 自定义 UI 相关组件
  ├── constants # 常量相关
  ├── pages # 小程序页面
  ├── stores
  ├── utils # 各种 tools
  └── ... # 后续有需要再添加新的目录
```

## 构建

```bash
# 选定要构建的平台，如 wechat，并执行构建
npm run build wechat
# or
yarn build wechat

使用小程序开发者工具打开项目下的 `dist/[target]` 目录（例如微信小程序，目录为 `dist/wechat`），上传代码即可
