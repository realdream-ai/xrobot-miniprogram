import React, { useEffect, useState } from 'react'
import { View, Text, Input, Button } from 'remax/wechat'
import { usePageEvent } from 'remax/macro'
import api from '@/apis/api'
import { nameMap, Pages } from '@/constants/route'
import AppBar from '@/components/AppBar'
import BackLeading from '@/components/AppBar/BackLeading'
import Scaffold from '@/components/Scaffold'
import { useQuery } from 'remax'
import LoginRequired from '@/components/LoginRequired'
import DeviceCard from './components/DeviceCard'
import DeviceDetail from './components/DeviceDetail'
import AddDeviceDialog from './components/AddDeviceDialog'
import { Device, FirmwareType } from './types'
import './index.less'

const DeviceManagement: React.FC = () => {
  const query = useQuery()
  const [agentId, setAgentId] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [devices, setDevices] = useState<Device[]>([])
  const [firmwareTypes, setFirmwareTypes] = useState<FirmwareType[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  // const [showManualAddDialog, setShowManualAddDialog] = useState(false);

  const filteredDevices = devices.filter(
    device => (device.model
      && device.model.toLowerCase().includes(searchKeyword.toLowerCase()))
      || (device.macAddress
        && device.macAddress.toLowerCase().includes(searchKeyword.toLowerCase()))
  )

  const paginatedDevices = filteredDevices.slice(0, currentPage * pageSize)
  const pageCount = Math.ceil(filteredDevices.length / pageSize)

  // 获取固件类型
  const getFirmwareTypes = async () => {
    try {
      const res = await api.dict.getDictDataByType('FIRMWARE_TYPE')
      if (res?.data) {
        setFirmwareTypes(res.data)
      }
    } catch (error) {
      console.error('获取固件类型失败:', error)
    }
  }

  // 获取固件类型名称
  const getFirmwareTypeName = (model: string) => {
    const firmware = firmwareTypes.find(type => type.key === model)
    return firmware ? firmware.name : model
  }

  // 获取设备列表
  const fetchBindDevices = (_agentId: string) => {
    setLoading(true)
    api.device.getAgentBindDevices(_agentId, res => {
      if (res.code === 0) {
        const deviceList = res.data
          .map((device: any) => ({
            device_id: device.id,
            model: device.board,
            firmwareVersion: device.appVersion,
            macAddress: device.macAddress,
            bindTime: device.createDate,
            lastConversation: device.lastConnectedAt,
            remark: device.alias,
            otaSwitch: device.autoUpdate === 1,
            selected: false,
            isEdit: false,
            rawBindTime: new Date(device.createDate).getTime(),
            _submitting: false
          }))
          .sort((a: Device, b: Device) => a.rawBindTime - b.rawBindTime)
        setDevices(deviceList)
      } else {
        console.error('获取设备列表失败:', res.msg || '未知错误')
      }
    })
    setLoading(false)
  }

  // 搜索设备
  const handleSearch = () => {
    setCurrentPage(1) // 重置为第一页
  }

  // 选中单个设备
  const handleSelect = (deviceId: string) => {
    setDevices(prevDevices => prevDevices.map(device => (device.device_id === deviceId
      ? { ...device, selected: !device.selected }
      : device)))
  }

  // 全选/取消全选
  const handleSelectAll = () => {
    const allSelected = paginatedDevices.every(device => device.selected)
    setDevices(prevDevices => prevDevices.map(device => ({
      ...device,
      selected: !allSelected
    })))
  }

  // 显示设备详情
  const handleDetail = (deviceId: string) => {
    setSelectedDeviceId(deviceId)
  }

  // 关闭设备详情
  const handleCloseDetail = () => {
    setSelectedDeviceId(null)
  }

  // 更新设备信息
  const handleDeviceUpdate = (updatedDevice: Device) => {
    setDevices(prev => prev.map(d => (d.device_id === updatedDevice.device_id ? updatedDevice : d)))
  }

  // 解绑选中设备
  const handleDeleteSelected = () => {
    const selectedDevices = devices.filter(device => device.selected)
    if (selectedDevices.length === 0) {
      console.error('请至少选择一台设备')
      return
    }

    wx.showModal({
      title: '提示',
      content: '此操作将解绑选中设备，是否继续？',
      confirmText: '确定',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {
          const deviceIds = selectedDevices.map(device => device.device_id)
          const promises = deviceIds.map(
            id => new Promise<void>((resolve, reject) => {
              api.device.unbindDevice(id, res_unbind => {
                if (res_unbind.code === 0) {
                  resolve()
                } else {
                  reject(res_unbind.msg || '解绑失败')
                }
              })
            })
          )

          Promise.all(promises)
            .then(() => {
              console.log(`成功解绑 ${deviceIds.length} 台设备`)
              fetchBindDevices(agentId)
            })
            .catch(error => {
              console.error('批量解绑失败:', error)
            })
        }
      }
    })
  }

  // 添加设备
  const handleAddDevice = () => {
    setShowAddDialog(true)
  }

  // 关闭添加设备对话框
  const handleCloseAddDialog = () => {
    setShowAddDialog(false)
  }

  // 确认添加设备
  const handleConfirmAddDevice = (deviceCode: string) => {
    if (!agentId) {
      console.error('添加设备失败: agentId 为空')
      return
    }
    if (!/^\d{6}$/.test(deviceCode)) {
      console.error('请输入6位数字验证码')
      return
    }

    api.device.bindDevice(agentId, deviceCode, res => {
      if (res.code === 0) {
        console.log(`设备 ${deviceCode} 绑定成功`)
        fetchBindDevices(agentId)
        setShowAddDialog(false)
      } else {
        console.error('设备绑定失败:', res.msg || '未知错误')
      }
    })
  }

  // // 显示批量手动添加设备对话框
  // const handleManualAddDevice = () => {
  //   setShowManualAddDialog(true);
  // };

  // // 关闭手动添加设备对话框
  // const handleCloseManualAddDialog = () => {
  //   setShowManualAddDialog(false);
  // };

  // // 确认批量添加设备
  // const handleConfirmManualAddDevice = (
  //   codes: string[],
  //   type: 'MAC' | 'SN'
  // ) => {
  //   if (!agentId) {
  //     console.error('添加设备失败: agentId 为空');
  //     return;
  //   }

  //   const promises = codes.map(
  //     (code) =>
  //       new Promise((resolve, reject) => {
  //         if (type === 'MAC') {
  //           api.device.manualAddDevice({ agentId, macAddress: code }, (res) => {
  //             if (res.code === 0) {
  //               console.log(`设备 ${code} 添加成功`);
  //               resolve();
  //             } else {
  //               console.error(`设备 ${code} 添加失败:`, res.msg || '添加失败');
  //               reject(res.msg || '添加失败');
  //             }
  //           });
  //         } else {
  //           // SN 码占位符函数
  //           api.device.addDeviceBySnCode({ agentId, snCode: code }, (res) => {
  //             if (res.code === 0) {
  //               console.log(`设备 ${code} 添加成功`);
  //               resolve();
  //             } else {
  //               console.error(`设备 ${code} 添加失败:`, res.msg || '添加失败');
  //               reject(res.msg || '添加失败');
  //             }
  //           });
  //         }
  //       })
  //   );

  //   Promise.allSettled(promises).then(() => {
  //     fetchBindDevices(agentId);
  //     setShowManualAddDialog(false);
  //   });
  // };

  // 加载更多
  const handleLoadMore = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1)
    }
  }

  usePageEvent('onLoad', () => {
    console.log('onLoad device-manage')
    getFirmwareTypes()
  })

  useEffect(() => {
    const currentAgentId = query.agentId || ''
    setAgentId(currentAgentId)
    fetchBindDevices(currentAgentId)
  }, [query])

  return (
    <Scaffold appBar={<AppBar title={nameMap[Pages.XrobotDeviceManage]} leading={<BackLeading />} />}>
      <LoginRequired>
        <View className="device-management">
          <View className="search-bar">
            <Input
              className="search-input"
              placeholder="请输入设备型号或Mac地址查询"
              value={searchKeyword}
              onInput={e => setSearchKeyword(e.detail.value)}
              confirmType="search"
              onConfirm={handleSearch}
            />
            <Button className="search-button" onClick={handleSearch}>
              搜索
            </Button>
          </View>

          <View className="device-list">
            {loading ? (
              <View className="loading">加载中...</View>
            ) : <>{paginatedDevices.length === 0 ? (
              <View className="empty">无绑定设备，下方添加</View>
            ) : null}</>}
            {paginatedDevices.length > 0 && paginatedDevices.map(device => (
              <DeviceCard
                key={device.device_id}
                device={device}
                onSelect={handleSelect}
                onDetail={handleDetail}
                onUnbind={deviceId => {
                  wx.showModal({
                    title: '提示',
                    content: '此操作将解绑该设备，是否继续？',
                    confirmText: '确定',
                    cancelText: '取消',
                    success: res => {
                      if (res.confirm) {
                        api.device.unbindDevice(deviceId, res_unbind => {
                          if (res_unbind.code === 0) {
                            console.log(`设备 ${deviceId} 解绑成功`)
                            fetchBindDevices(agentId)
                          }
                        })
                      }
                    }
                  })
                }}
                getFirmwareTypeName={getFirmwareTypeName}
              />
            ))}
          </View>

          {paginatedDevices.length > 0 && (
            <View className="pagination">
              <Text className="page-info">
                第 {currentPage} 页 / 共 {pageCount} 页
              </Text>
              <Button
                className="load-more-button"
                disabled={currentPage >= pageCount}
                onClick={handleLoadMore}
              >
                加载更多
              </Button>
            </View>
          )}

          <View className="bottom-bar">
            <Button className="bottom-button" onClick={handleAddDevice}>
              绑定设备
            </Button>
            <Button className="bottom-button danger" onClick={handleDeleteSelected}>
              解绑
            </Button>
            <Button className="bottom-button" onClick={handleSelectAll}>
              {paginatedDevices.length !== 0
                && paginatedDevices.every(device => device.selected)
                ? '取消全选'
                : '全选'}
            </Button>
            {/* <Button className="bottom-button" onClick={handleManualAddDevice}>
          批量预先导入
        </Button> */}
          </View>

          {selectedDeviceId && (
            <DeviceDetail
              device={devices.find(d => d.device_id === selectedDeviceId)!}
              onClose={handleCloseDetail}
              onUpdate={handleDeviceUpdate}
              onUnbind={() => {
                wx.showModal({
                  title: '提示',
                  content: '此操作将解绑该设备，是否继续？',
                  confirmText: '确定',
                  cancelText: '取消',
                  success: res => {
                    if (res.confirm) {
                      api.device.unbindDevice(selectedDeviceId, res_unbind => {
                        if (res_unbind.code === 0) {
                          console.log('设备解绑成功')
                          fetchBindDevices(agentId)
                          handleCloseDetail()
                        }
                      })
                    }
                  }
                })
              }}
              getFirmwareTypeName={getFirmwareTypeName}
            />
          )}

          {showAddDialog && (
            <AddDeviceDialog
              agentId={agentId}
              onClose={handleCloseAddDialog}
              onConfirm={handleConfirmAddDevice}
            />
          )}

          {/* {showManualAddDialog && (
        <ManualAddDeviceDialog
          agentId={agentId}
          onClose={handleCloseManualAddDialog}
          onConfirm={handleConfirmManualAddDevice}
        />
      )} */}
        </View>
      </LoginRequired>
    </Scaffold>
  )
}

export default DeviceManagement
