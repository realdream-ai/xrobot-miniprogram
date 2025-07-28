
export interface RoleFormData {
  agentCode: string;
  agentName: string;
  ttsVoiceId: string;
  chatHistoryConf: number;
  systemPrompt: string;
  summaryMemory: string;
  langCode: string;
  language: string;
  sort: number;
  model: {
    ttsModelId: string | null;
    vadModelId: string | null;
    asrModelId: string | null;
    llmModelId: string | null;
    vllmModelId: string | null;
    memModelId: string | null;
    intentModelId: string | null;
  };
}

export type ModelType =
  | 'VAD'
  | 'ASR'
  | 'LLM'
  | 'VLLM'
  | 'Intent'
  | 'Memory'
  | 'TTS';

export type ModelID =
  | 'ttsModelId'
  | 'vadModelId'
  | 'asrModelId'
  | 'llmModelId'
  | 'vllmModelId'
  | 'memModelId'
  | 'intentModelId';

export interface PickerOption {
  label: string;
  value: string;
}

export type VoiceOption = ModelOption
export type ModelOption = PickerOption

// 定义 modelOptions 的类型
export interface ModelOptions {
  LLM: ModelOption[];
  Intent: ModelOption[];
  Memory: ModelOption[];
  TTS: ModelOption[];
  VAD?: ModelOption[];
  ASR?: ModelOption[];
  VLLM?: ModelOption[];
}

export const DefaultModelOptions = {
  VAD: [],
  ASR: [],
  LLM: [],
  VLLM: [],
  Intent: [],
  Memory: [],
  TTS: []
}

export interface ConfigPageProps {
  agentId?: string;
}
