import AppBar from "@/components/AppBar";
import Scaffold from "@/components/Scaffold";
import React, { useCallback, useEffect, useState } from "react";
import { fetch } from "@/utils/fetchs";
import { View } from "remax/one";
import { Button } from "remax/wechat";
import { useToast } from "@/utils/toast";
import { useQuery } from "remax";

import {
  loginRedirect,
  setLoginInfo,
  SourceType,
  LoginRedirectType,
} from "@/components/LoginRequired/util";
import { nameMap, Pages } from "@/constants/route";
import { useSystemInfo } from "@/utils/hooks/system-info";
import store from "@/stores";
import BackLeading from "@/components/AppBar/BackLeading";
import api from "@/apis/api";
import { loginMpAppId } from "@/constants/env";
import style from "./style.less";

export default function LoginEntry() {
  const { source = SourceType.Self, sourceUrl } = useQuery();
  const showToast = useToast();
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);

  useEffect(() => {
    setLoginInfo({ source: source as SourceType, sourceUrl });
  }, [source, sourceUrl]);

  const loginCheck = useCallback(() => {
    if (store.getCookie() !== "") {
      showToast({ tip: "登录成功", icon: "success" });
      loginRedirect(LoginRedirectType.Redirect);
    }
  }, [showToast]);

  // 处理SSO登录
  const handleSSOLogin = useCallback(
    async (token: string) => {
      try {
        showToast({ tip: "登录中", icon: "loading", duration: -1 });

        const response = await fetch(
          "http://web-api.dev.qiniu.io/api/proxy/sso/signin/wx",
          {
            method: "POST",
            header: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({ token }),
            // credentials: "include",
          }
        );

        if (response.ok) {
          // 从响应头中获取cookie
          const setCookieHeader = response.headers.get("set-cookie");
          if (setCookieHeader) {
            store.updateCookie(setCookieHeader);
          }

          showToast({ tip: "登录成功", icon: "success" });
          loginRedirect(LoginRedirectType.Redirect);
        } else {
          throw new Error("SSO登录失败");
        }
      } catch (error) {
        console.error("SSO登录错误:", error);
        showToast({ tip: "SSO登录失败，请重试", icon: "fail" });
      } finally {
        setIsProcessingLogin(false);
      }
    },
    [showToast]
  );

  // 处理从七牛云小程序返回的参数
  const handleReturnFromQiniu = useCallback(
    async (options: any) => {
      console.log("从七牛云小程序返回，参数:", options);

      if (options?.referrerInfo?.extraData) {
        const { token, cookie } = options.referrerInfo.extraData;

        if (isProcessingLogin) {
          console.log("正在处理登录，跳过重复处理");
          return;
        }

        setIsProcessingLogin(true);

        if (cookie) {
          // if (!cookie.endsWith(";")) {
          //   cookie += ";";
          // }
          // 直接使用cookie登录
          console.log("使用cookie登录, get cookie:", cookie);
          store.updateCookie(cookie, false);
          api.qApi.fetchQInfo(
            (res: any) => {
              if (res.code === 0) {
                showToast({ tip: "登录成功", icon: "success" });
                loginRedirect(LoginRedirectType.Redirect);
              } else {
                // todo sso登录失效，获取token失败
                showToast({ tip: "登录失败", icon: "fail" });
              }
            },
            () => {
              // setIsLoading(false);
              // hideLoading();
              setIsProcessingLogin(false);
            }
          );
        } else if (token) {
          // 使用token进行SSO登录
          console.log("使用token进行SSO登录");
          handleSSOLogin(token);
        } else {
          console.log("未收到有效的登录凭证");
          setIsProcessingLogin(false);
        }
      }
    },
    [handleSSOLogin, isProcessingLogin, showToast]
  );

  wx.onAppShow((options: WechatMiniprogram.LaunchOptionsApp) => {
    // 确保在 loginRedirect 前把页面参数存下来
    console.log("minimal-login onShow options:", options);
    setLoginInfo({ source: source as SourceType, sourceUrl });

    // 处理从七牛云小程序返回的情况
    handleReturnFromQiniu(options);

    // 检查是否已经登录
    loginCheck();
  });
  const { statusBarHeight, appBarHeight } = useSystemInfo();

  const handleLogin = () => {
    wx.navigateToMiniProgram({
      appId: loginMpAppId, // 七牛云小程序的 appid
      path: "pages/common/login-entry/index?source=miniProgram", // 登录页面路径
      target: "miniProgram",
      extraData: {
        source: "miniProgram",
      },
    });
  };

  return (
    <Scaffold
      appBar={
        <AppBar
          title={nameMap[Pages.XrobotAccountLogin]}
          leading={<BackLeading />}
        />
      }
    >
      <View
        style={{ height: `calc(100vh - ${appBarHeight + statusBarHeight}px)` }}
      >
        <View className={style.entry}>
          <Button className={style.phoneLoginBtn} onTap={handleLogin}>
            七牛云登录
          </Button>
        </View>
      </View>
    </Scaffold>
  );
}
