declare module '*.icon.svg' {
  const exports: string
  export default exports
}

declare module '*.svg' {
  const exports: string
  export default exports
}

declare module '*.png' {
  const exports: string
  export default exports
}

declare module '*.jpg' {
  const exports: string
  export default exports
}

declare module '*.jpeg' {
  const exports: string
  export default exports
}

declare module '*.gif' {
  const exports: string
  export default exports
}

declare module '*.less' {
  const cssModuleExport: {
    [className: string]: string
  }

  export = cssModuleExport
}

// 获取当前页面栈的实例，返回页面数组栈
// 数组中第一个元素为首页，最后一个元素为当前页面
// 参考
// https://developers.weixin.qq.com/miniprogram/dev/reference/api/getCurrentPages.html
// TODO
// 类型补全
type PagesType = {
  route: string
  sensors_mp_encode_url_query: string
}

declare function getCurrentPages(): PagesType[]

declare module 'wxmp-rsa' {
  const classes: any
  export default classes
}
