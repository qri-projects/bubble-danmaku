
class DanmakuEl{
    constructor(danmakuJson:DANMU_MSG) {
        let info = danmakuJson.info
        this.privilegeType = info[7] || 0

        let medal = info["3"]
        this.medalName = medal[1];
        this.medalRoomId = medal[3];
        this.medalLv = medal[0]
        this.medalColor = "#" + medal[4].toString(16);

        let user:DANMU_MSG_Info_User = info[2]
        this.userId = user[0]
        this.userName = user[1]

        let ul = info[4]
        this.userLevel = ul[0]
        this.userLevelColor = "#" + ul[2].toString(6)
        this.userHeadImg = ""
    }

    /**
     * 舰队类型,0为非舰队, 1总督, 2提督, 3舰长
     */
    privilegeType:number;

    medalName:String;
    medalRoomId:number | string;
    medalLv:number;
    medalColor:String;

    userLevel:number;
    userLevelColor:String;

    userId:number;
    userName:String;
    userHeadImg:String;
}
