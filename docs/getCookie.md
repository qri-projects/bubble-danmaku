# 配置Cookie
> 注意, cookie相当于你的账号密码, 不要分享/泄露给他人. 本工具不会将你的cookie用于和B站通信之外的一切用途.  

## cookie配置文件位置
- Windows  
    ```bubble-danmaku/config/cookie.txt```  
- Mac  
    右键```Bubble弹幕使.app```, 点击```显示包内容```, 配置文件在其中的```Contents/config/cookie.txt```  

## 设置cookie
1. 在登录了b站的浏览器访问[https://api.bilibili.com/x/web-interface/nav](https://api.bilibili.com/x/web-interface/nav)  
2. 按照下图操作:  
    ![](https://pic.ggemo.com/picgo/bubble-danmaku-get-cookie.png)  
3. 将复制的cookie的内容粘贴至cookie配置文件  
4. 重启本工具

## 注意事项
cookie相当于你的账号密码, 不要分享/泄露给他人! 本工具不会分享/传输你的cookie, 但你需要在本地存一份cookie来供本工具使用, 请注意文件安全!  

配置了cookie之后, 要在[配置文件](https://github.com/HHHHhgqcdxhg/bubble-danmaku/blob/master/docs/configDoc.md) 中将```enableSendDanmaku```设为true, 才会启用发送弹幕功能  

cookie是会过期的, 哪天上b站发现账号掉线了, 要重新登录, 就意味着cookie过期, 需要重新设置cookie.  