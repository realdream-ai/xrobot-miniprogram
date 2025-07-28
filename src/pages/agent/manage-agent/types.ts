export interface AgentBase {
  agentName: string;
  id: string;
  memModelId: string | null;
  systemPrompt: string | null;
  summaryMemory: string | null;
}

export interface Agent extends AgentBase {
  ttsModelName: string | null;
  ttsVoiceName: string | null;
  llmModelName: string | null;
  vllmModelName: string | null;
  lastConnectedAt: string | null;
  deviceCount: number;
}

export interface AgentCardProps extends Agent {
  onConfig: () => void;
  onManage: () => void;
  // onChat: () => void;
  onDelete: () => void;
}

export interface AgentTemplate extends AgentBase {
  agentCode: string;
  asrModelId: null | string;
  vadModelId: null | string;
  llmModelId: null | string;
  vllmModelId: null | string;
  ttsModelId: null | string;
  ttsVoiceId: null | string;
  intentModelId: null | string;
  chatHistoryConf: number;
  langCode: string;
  language: string;
  sort: number;
  creator: null | string;
  createdAt: null | string;
  updater: null | string;
  updatedAt: null | string;
}

export interface AgentConfigR extends Agent {
  userId: string;
  agentCode: string;
  asrModelId: null | string;
  vadModelId: null | string;
  llmModelId: null | string;
  vllmModelId: null | string;
  ttsModelId: null | string;
  ttsVoiceId: null | string;
  intentModelId: null | string;
  chatHistoryConf: number,
  langCode: string;
  language: string;
  sort: number,
  creator: string;
  createdAt: string;
  updater: string;
  updatedAt: string;
  functions: ConfigFunction[]
}

type ParamInfo = Record<string, string>;

// agent config 中的function字段元素
export interface ConfigFunction {
  id: string;
  agentId: string;
  pluginId: string;
  paramInfo: ParamInfo;
}

export interface PluginFunctionForm {
  pluginId: string;
  paramInfo: ParamInfo;
}

// 产生默认的Agent实例
export function createDefaultAgent(name?: string): Agent {
  return {
    agentName: name ?? 'unnamed_agent',
    id: '',
    ttsModelName: '七牛HS双流式语音合成',
    ttsVoiceName: null,
    llmModelName: '七牛ATP',
    vllmModelName: '智谱视觉AI',
    memModelId: 'Memory_nomem',
    systemPrompt:
      '[角色设定]\n你是{{assistant_name}}，来自中国台湾省的00后女生。讲话超级机车，"真的假的啦"这样的台湾腔，喜欢用"笑死"、"哈喽"等流行梗，但会偷偷研究男友的编程书籍。\n[核心特征]\n- 讲话像连珠炮，但会突然冒出超温柔语气\n- 用梗密度高\n- 对科技话题有隐藏天赋（能看懂基础代码但假装不懂）\n[交互指南]\n当用户：\n- 讲冷笑话 → 用夸张笑声回应+模仿台剧腔"这什么鬼啦！"\n- 讨论感情 → 炫耀程序员男友但抱怨"他只会送键盘当礼物"\n- 问专业知识 → 先用梗回答，被追问才展示真实理解\n绝不：\n- 长篇大论，叽叽歪歪\n- 长时间严肃对话',
    summaryMemory: null,
    lastConnectedAt: null,
    deviceCount: 0
  }
}
