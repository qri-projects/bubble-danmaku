## 配置文件位置
- Windows  
    ```bubble-danmaku/config/config.json```  
- Mac  
    右键```Bubble弹幕使.app```, 点击```显示包内容```, 配置文件在其中的```Contents/config/config.json```  

## 简单实用
第一条 roomId 改为想要监听的房间号即可使用  

## 配置详细解释
```js
let x = {
    // 监听的房间号, 简单的使用的话, 更改此项即可
    "roomId": 336116,

    // 弹幕设置
    // 是否显示弹幕用户头像
    "showUserHeadImg": true,
    // 是否显示弹幕用户名
    "showUserName": true,
    // 是否显示弹幕用户牌子
    "showUserMedal": true,
    // 是否显示弹幕用户等级
    "showUserLevel": false,
    // 是否显示弹幕大航海标识
    "showGuardPrefix": true,

    // 弹幕大航海标识文件名, 将对应图片放入bubble-danmaku/config/src/image中即可使用
    // 普通用户对应0, 默认为空白png; 1, 2, 3分别对应总督, 提督, 舰长
    "prefixFileName": ["guard0.png", "guard1.png", "guard2.png", "guard3.png"],
    // 一般的弹幕用户名颜色, 随机从这几个颜色中取
    "userNameRandColors": ["#a068f1", "#5896de", "#61decb", "rgb(255, 69, 137)"],
    // 弹幕 收藏的用户用户名颜色, 对用户设置昵称被认为收藏
    "favoriteUserNameColor": "#ff9728",
    // 弹幕 大航海用户 用户名颜色, 最左边的为冗余数据不用管, 之后三个依次对应总督 提督 舰长
    "guardUserNameColor": ["#ff0000", "#ff86b2", "#ff86b2", "#ff86b2"],
    // 弹幕缓存最大条数, 超过这个数值则对旧弹幕进行回收, 回收至这个数值的一半, 以释放内存
    "danmakuCacheLength": 200,

    // 礼物设置
    // 是否显示礼物
    "showGift": true,
    // 是否显示银瓜子礼物
    "showSilverGift": true,
    // 按礼物价值设置是否显示, 低于设定值的不予显示
    "giftCoinUpperThan": {
        "gold": 0,
        "silver": 9900,
    },
    // 收到上舰提示时, 显示的礼物图片
    "guardBuyGiftImgFileName": ["guard0.png", "guard1.png", "guard2.png", "guard3.png"],
    // 样式文件文件名, 将css文件放入bubble-danmaku/config/src/style中, 并将该条设置为其文件名, 则可使用该样式
    "styleFileName": "default.css",
    // 弹幕模板文件名, 将html文件放入bubble-danmaku/config/src/template中, 并将该条设置为其文件名, 则可使用该html作为弹幕模板
    "danmakuTemplateFileName": "Danmaku.html",
    // 礼物模板文件名, 将html文件放入bubble-danmaku/config/src/template中, 并将该条设置为其文件名, 则可使用该html作为礼物模板
    "sendGiftTemplateFileName": "SendGift.html",
    // Sc模板文件名, 将html文件放入bubble-danmaku/config/src/template中, 并将该条设置为其文件名, 则可使用该html作为礼物模板
    "superChatTemplateFileName": "SuperChat.html",
    // Sc队列模板文件名, 将html文件放入bubble-danmaku/config/src/template中, 并将该条设置为其文件名, 则可使用该html作为礼物模板
    "superChatQueueItemTemplateFileName": "SuperChatQueueItem.html",
    // Sc进入弹幕框中的模板文件名, 将html文件放入bubble-danmaku/config/src/template中, 并将该条设置为其文件名, 则可使用该html作为礼物模板
    "innerSuperChatTemplateFileName": "InnerSuperChat.html",

    // 模板名, 暂时只有default
    "danmakuPanelComponentName": "default",
    "superChatPanelComponentName": "default",
    "extendPanelComponentName": "default",
    "sendDanmakuPanelComponentName": "default",

    // 时间显示格式
    "timerTemplate": "year-month-day hour:minute:second",

    // 弹幕屏蔽选项. 这些选项只影响该软件是否显示, 不影响弹幕本身是否发的出去
    // 按用户等级(UL)屏蔽, 低于该项的不予显示
    "userLevelUpperThan": -1,
    // 按牌子等级屏蔽, 不戴该直播间的牌子则不予显示
    "medalLevelUpperThan": -1,
    // 按内容屏蔽, 是个正则字符串的数组, 内容匹配的弹幕不予显示
    "filterRe": ["^[!|！]\\w+", "[主播|up]去死"],
    // 是否显示抽奖弹幕(小电视, 节奏风暴, 天选时刻等)
    "showDrawDanmaku": true,

    // 窗口置顶
    "top": true,

    // 用户信息缓存持续时间(单位: 毫秒)
    "userExpireTime": 86400000,
    // 启用发送弹幕功能, 必须同时在bubble-danmaku/config/cookie.txt中设置cookie才能发送弹幕
    "enableSendDanmaku": true,
};
```
