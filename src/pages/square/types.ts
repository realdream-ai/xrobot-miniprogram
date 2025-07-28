import { AgentTemplate } from '@/pages/agent/manage-agent/types'

export interface Template extends AgentTemplate {
  //   图标 url
  icon: string;
  //   累计使用
  stat_count: number;
  //   推荐
  isRecommend: boolean;
  //   精选
  isPicked: boolean;
  //   官方
  isOffical:boolean;
  //   标签
  tags: string[];
}
