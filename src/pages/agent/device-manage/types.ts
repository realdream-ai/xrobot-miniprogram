export interface Device {
  device_id: string;
  model: string;
  macAddress: string;
  firmwareVersion?: string;
  bindTime?: string;
  lastConversation?: string;
  remark?: string;
  otaSwitch?: boolean;
  selected?: boolean;
  isEdit?: boolean;
  rawBindTime: number;
  _submitting: boolean;
}

export interface FirmwareType {
  key: string;
  name: string;
}
