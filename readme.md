# Bubble Danmaku
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/HHHHhgqcdxhg/bubble-danmaku/) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/HHHHhgqcdxhg/bubble-danmaku/graphs/commit-activity) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/HHHHhgqcdxhg/bubble-danmaku/pulls)  


Bubble弹幕使, 第三方bilibili直播弹幕客户端桌面端  

## 特性
- 开源, 维护支持  
    有问题就修, 有改进建议就选择接受进行改进: [Issue页面](https://github.com/qri-projects/bubble-danmaku/issues)  
- 高扩展性  
    具备web前端基础即可轻易自定义样式, 布局及功能  
- 更加美观实用  
    支持透明窗口, 窗口置顶与点击穿透  
- 更多数据  
    - 自动获取弹幕发送者信息, 额外增加了用户头像, 头图, 简介等内容  
    - 备注观众功能, 可为其设定备注名  
- 多操作系统支持  
    支持Windows和MacOS  
- 方便观察直播延迟  
    显示以秒为单位的当前时间  

## LICENSE
本项目使用的开源协议基于MIT协议, 在MIT协议的基础上给予了被授权人关注并推广[我的频道](https://space.bilibili.com/13578650)(https://space.bilibili.com/13578650)的义务  

参考:  
- [本项目LICENSE](https://github.com/qri-projects/bubble-danmaku/blob/master/LICENSE)  
- MIT协议[[百度百科](https://baike.baidu.com/item/MIT%E8%AE%B8%E5%8F%AF%E8%AF%81/6671281?fr=aladdin)|[MIT协议原文](https://opensource.org/licenses/mit-license.php)]

## 使用
1. 前往[本项目Release页](https://github.com/HHHHhgqcdxhg/bubble-danmaku/releases) (或者[百度网盘](https://pan.baidu.com/s/1fndzxV7Y3t-iy-zLAsFSMQ) 提取码: sbgr)  
2. 下载最新版本的```bubble-danmaku.zip```(Windows) 或```bubble-danmaku-mac.zip```(MacOS)  
3. 解压  
4. 配置```config/config.json```([配置说明](https://github.com/HHHHhgqcdxhg/bubble-danmaku/blob/master/docs/configDoc.md))  
5. 如果需要使用发送弹幕的功能, 还要[配置cookie](https://github.com/HHHHhgqcdxhg/bubble-danmaku/blob/master/docs/getCookie.md)  
6. 配置之后就可以打开```Bubble弹幕使.exe```(Windows) 或```Bubble弹幕使.app```(MacOS)开始使用啦  

## 介绍
### 基本功能

总体截图|发送弹幕<br>(需要[配置cookie](https://github.com/HHHHhgqcdxhg/bubble-danmaku/blob/master/docs/getCookie.md))  
---|---
![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-0.png)|![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-1.png)  

### 用户详情  

用户详情|点击昵称编辑用户备注名|备注过的用户名颜色会变成金色<br>(这个颜色可以通过配置更改)
---|---|---
![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-2.png)|![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-3.png)|![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-4.png)  

### 醒目留言

醒目留言会在顶部停留5秒|5秒结束后会插入到弹幕栏|鼠标指向重新查看醒目留言  
---|---|---
![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-5.png)|![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-6.png)|![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-7.png)  

### 窗口位置&大小

拖动底部蓝色的区域来调整窗口位置|左右两侧的边框会靠外一点<br>鼠标放在大概红线位置可调整大小<br>下侧不可调整大小
---|---
![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-8.png)|![](https://pic.ggemo.com/picgo/bubble-danmaku-doc-img-9.png)

## Todo
- [x] 完善醒目留言的响应  
- [x] 完善观众NickName功能  
- [x] 完善上舰的响应  
- [x] 通过cookie设置B站账号来使用本工具发送弹幕  
- [x] MacOS支持  
- [ ] 完善布局及样式切换系统  
- [ ] 热更新  
- [ ] 热重载配置
- [ ] 20级之后牌子样式适配

## 开发环境
- Node: v14.3.0

## 支持
软件好用的话可以点击[项目页面](https://github.com/qri-projects/bubble-danmaku) 右上角的Star按钮, 给予作者支持哦~  