配置文件为```bubble-danmaku/config/config.json```  
第一条roomId改为想要监听的房间号即可使用  

以下为该文件中选项的详细解释:  

```js
{
    // 监听的房间号
    "roomId": 336116,

    // 弹幕设置
    // 显示弹幕用户头像
    "showUserHeadImg": true,
    // 显示弹幕用户名
    "showUserName": true,
    // 显示弹幕用户牌子
    "showUserMedal": true,
    // 显示弹幕用户等级
    "showUserLevel": false,
    // 显示弹幕大航海标识
    "showGuardPrefix": true,
    // 弹幕大航海标识文件名, 将对应图片放入bubble-danmaku/config/src/image中即可使用
    // 普通用户对应0, 默认为空白png; 1, 2, 3分别对应总督, 提督, 舰长
    "prefixFileName": {
        "0": "guard0.png",
        "1": "guard1.png",
        "2": "guard2.png",
        "3": "guard3.png",
    },
    // 一般的弹幕用户名颜色, 随机从这几个颜色中取
    "userNameRandColors": ["#a068f1", "#5896de", "#61decb", "#ffc0cb"],
    // 弹幕 收藏的用户用户名颜色, 对用户设置昵称被认为收藏
    "favoriteUserNameColor": "gold",
    // 弹幕 大航海用户 用户名颜色, 最左边的为冗余数据不用管, 之后三个依次对应总督 提督 舰长
    "guardUserNameColor": ["#ff0000", "#ff86b2", "#ff86b2", "#ff86b2"],
    // 弹幕缓存最大条数, 超过这个数值则对旧弹幕进行回收, 以释放内存
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

    // 样式文件文件名, 将css文件放入bubble-danmaku/config/src/style中, 并将该条设置为其文件名, 则可使用该样式
    "styleFileName": "default.css",
    // 弹幕模板文件名, 将html文件放入bubble-danmaku/config/src/template中, 并将该条设置为其文件名, 则可使用该html作为弹幕模板
    "danmakuTemplateFileName": "Danmaku.html",
    // 礼物模板文件名, 将html文件放入bubble-danmaku/config/src/template中, 并将该条设置为其文件名, 则可使用该html作为礼物模板
    "sendGiftTemplateFileName": "SendGift.html",
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

    // 窗口设置
    // 宽
    "width": 370,
    // 高
    "height": 780,
    // 距屏幕左边的距离
    "x": 0,
    // 距屏幕上边的距离
    "y": 0,
    // 窗口置顶
    "top": true,
}
```
