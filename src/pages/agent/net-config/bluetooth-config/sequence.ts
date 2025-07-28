// 初始化序列号
export function resetSequence() {
  wx.setStorageSync('lastSequence', 0)
}

// 获取并递增序列号
export function getNextSequence() {
  const current = wx.getStorageSync('lastSequence')
  wx.setStorageSync('lastSequence', (current + 1) % 256)
  return current
}

// 获取当前序列号
export function getCurrentSequence() {
  return wx.getStorageSync('lastSequence')
}

// 更新序列号
export function updateSequence(sequence: number) {
  wx.setStorageSync('lastSequence', sequence)
}
