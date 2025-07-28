/**
 * @file input-related utils
 */

import { ChangeEvent } from 'react'
import { FieldState, bindInput } from 'formstate-x'

export interface ITarget<T> {
  value?: T
}

export interface IHasTarget<T> {
  target: ITarget<T>
}

export function bindInputWithTarget<T, E extends IHasTarget<T> = IHasTarget<T>>(state: FieldState<T>) {
  return bindInput<T, E>(state, e => e.target.value!)
}

export interface IHasCurrentTarget<T> {
  target: ITarget<T>
  currentTarget: ITarget<T>
}

export function bindInputWithCurrentTarget<
  T, E extends IHasCurrentTarget<T> = IHasCurrentTarget<T>
>(state: FieldState<T>) {
  return bindInput<T, E>(state, event => event.target.value!)
}

export function bindTextInput(state: FieldState<string>) {
  return bindInputWithCurrentTarget<string, ChangeEvent<HTMLInputElement>>(state)
}

export function bindTextArea(state: FieldState<string>) {
  return bindInputWithCurrentTarget<string, ChangeEvent<HTMLTextAreaElement>>(state)
}

export type InputNumberValue = number | string | void
export function bindInputNumber(state: FieldState<InputNumberValue>) {
  return bindInput<number>(state as any)
}

export function bindSwitch(state: FieldState<boolean>) {
  const { value, onChange } = bindInput<boolean>(state)
  return { checked: value, onChange }
}

export function bindTansfer(state: FieldState<string[]>) {
  const { value, onChange } = bindInput<string[]>(state)
  return { targetKeys: value, onChange }
}

export function bindCheckbox(state: FieldState<boolean>) {
  const { value, onChange } = bindInput<boolean>(state)
  return { checked: value, onChange }
}

export type RadioGroupValue = string | number | undefined
export function bindRadioGroup(state: FieldState<RadioGroupValue>) {
  return bindInput<RadioGroupValue>(state)
}

export function bindRegionPicker(state: FieldState<string[]>) {
  return bindInput<string[]>(state)
}

export function bindDatePicker(state: FieldState<string>) {
  return bindInput<string>(state)
}
