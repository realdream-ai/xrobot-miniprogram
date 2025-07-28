/**
 * @file 配置的环境变量，具体值见 .env & .env.<enviroment> 文件
 * @description 相关文档 https://remaxjs.org/guide/config/environment-variables
 */

function must(name: string, variable?: string): string {
  if (variable == null) {
    throw new Error(`Invalid value for environment variable ${name}, you need to configure it in env file`)
  }
  return variable
}

export const host = must('host', process.env.REMAX_APP_HOST)

// API Host
export const apiHost = must('apiHost', process.env.REMAX_APP_API_HOST)

// 运行平台相关常量
export const platform = must('platform', process.env.REMAX_PLATFORM)

export const isWechat = platform === 'wechat'
