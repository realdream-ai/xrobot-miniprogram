
// 通用响应结构
export interface ApiResponse<T> {
  code: number;
  msg?: string;
  data: T;
}
export interface User {
  id: string;
  mobile: string;
  username?: string;
  status?: string; // 用户状态
  createdAt?: string;
  updatedAt?: string;
}

export interface Param {
  id?: string;
  paramCode: string;
  paramName?: string;
  paramValue?: string;
  remark?: string;
  sort?: number;
}

export interface WsServer {
  id: string;
  serverId: string;
  name: string;
  status: string; // 服务器状态
  address: string; // 服务器地址
}

export interface Model {
  id?: string;
  modelCode: string;
  modelName: string;
  modelType: string; // 模型类型
  provideCode: string; // 提供者代码
  isDefault: number; // 0 或 1
  isEnabled: number; // 0 或 1
  configJson?: string; // JSON 字符串化的配置
  docLink?: string;
  remark?: string;
  sort?: number;
}

export interface ModelProvider {
  id?: string;
  modelType: string;
  providerCode: string;
  name: string;
  fields: string; // JSON 字符串化的字段配置
  sort?: number;
}

// 请求api获取 model 得到的data item的结构
export interface ModelItem {
  id: string;
  modelName: string;
}

// 请求api获取 tts音色voice 得到的data item的结构
export interface VoiceItem {
  id: string;
  name: string;
}

export type PluginId = string;

// agent config 中的function字段元素
export interface ConfigFunction {
  agentId: string;
  id: string;
  pluginId: PluginId;
  paramInfo: ParamInfo;
}

export interface PorviderPluginFunction {
  id: string;
  fields: string;
  fieldsMeta?: any;
  params: any;
  modelType: string;
  name: string;
  providerCode: string;
  sort: number;
  updateDate: string;
  updater: string;
  creator: string;
  createDate:string;
}

export interface PorviderPluginFunctionFormData {
  pluginId: string;
  paramInfo: ParamInfo;
}

export interface ParamInfo {
  api_host?: string;
  api_key?: string;
  url?: string;
  default_location?: string;
  [key:string]: any;
}

export interface Session {
  id: string;
  agentId: string;
  title?: string;
  createdAt?: string;
}

export interface ChatHistory {
  sessionId: string;
  messages: Array<{
    role: string; // 'user' 或 'agent'
    content: string;
    timestamp: string;
  }>;
}

export interface McpAccessAddress {
  agentId: string;
  address: string;
}

export interface McpTool {
  id: string;
  name: string;
  description?: string;
}

export interface LoginForm {
  mobile: string;
  password: string;
  captcha?: string;
  uuid?: string;
}

// 注册表单
export interface RegisterForm {
  mobile: string;
  password: string;
  code: string; // 短信验证码
}
