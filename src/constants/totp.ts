/**
 * @file totp（两步验证）相关常量
 */

export enum SSOTotpType {
  Authenticator = 'authenticator',
  Mobile = 'mobile',
  Email = 'email'
}

export const SSOTotpErrCodeMap = {
  7015: SSOTotpType.Authenticator,
  7016: SSOTotpType.Mobile,
  7010: SSOTotpType.Email
}

export enum GaeaTotpType {
  ChangeMobile = 0, // 换绑手机
  BindMobile = 1, // 绑手机
  ChangeEmail = 2, // 更换邮箱
  Totpvaildation = 3 // 验证权限
}

export enum SmsType {
  Sms = 'sms',
  Voice = 'voice'
}
