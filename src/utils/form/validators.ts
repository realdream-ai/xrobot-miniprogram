/**
 * @file 常用校验函数
 */

export const textNotEmpty = (msg = '不可为空') => (input: string) => (
  !input.trim() && msg
)

export const textArrNotEmpty = (msg = '不可为空') => (input: string[]) => (
  (!input || !input.length || !input.filter((item: string) => !!item).length) && msg
)

export const textOfPattern = (pattern: RegExp, msg = '输入格式错误') => (input: string) => (
  !pattern.test(input) && msg
)

export const needChecked = (msg = '必选') => (checked: boolean) => (
  !checked && msg
)
