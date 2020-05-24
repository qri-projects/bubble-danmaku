class UserInDB {
    id: number;
    name: String;
    nickName: String;
    faceUrl: String;
    description: string;
    topPhotoFileName: string;
    birthday: string;
    medal: UserInDBMedal|null;
    userLevel: Number|null;
    guardLevel: Number|null;
    updateTime:number;

    constructor(id: number, name: String, nickName: string, faceUrl: String, description: string, topPhotoFileName: string, birthday: string, medal:UserInDBMedal|null = null, userLevel: Number|null = null, guardLevel: Number|null = null, updateTime:number=0) {
        this.id = id;
        this.name = name;
        this.nickName = nickName;
        this.faceUrl = faceUrl;
        this.description = description;
        this.topPhotoFileName = topPhotoFileName;
        this.birthday = birthday;
        this.medal = medal;
        this.userLevel = userLevel;
        this.guardLevel = guardLevel;
        this.updateTime = updateTime;
    }
}

class UserInDBMedal{
    /** 徽章等级 */
    medalLevel: number;
    /** 勋章名 */
    medalName: String;
    /** 主播名 */
    liverName: String;
    /** 直播间, 字符串的貌似是原始房间号 */
    roomId: number | String;

    constructor(medalLevel: number, medalName: String, liverName: String, roomId: number | String) {
        this.medalLevel = medalLevel;
        this.medalName = medalName;
        this.liverName = liverName;
        this.roomId = roomId;
    }
}

function userInDBMedalEqual(medal0:UserInDBMedal|null, medal1:UserInDBMedal|null){
    if (!medal0 && !medal1) {
        return true;
    }
    if (medal0 && medal1) {
        if (medal0.medalLevel != medal1.medalLevel) {
            return false;
        }
        if (medal0.medalName != medal1.medalName) {
            return false;
        }
        if (medal0.liverName != medal1.liverName) {
            return false;
        }
        if (medal0.roomId != medal1.roomId) {
            return false;
        }
        return true;
    }
    return false;
}

let dbConst = {
    "db": {
        "name": "db",
        "version": 2.2,
        stores: {
            "user": {
                storeName: "user",
                keyPath: "id",
                indexes: [
                    {name: "name", unique: false}
                ]
            }
        }
    }
}


class DB {

    db;

    constructor() {
        this.db = null;
    }

    connectAsync() {
        return new Promise<IDBDatabase>(((resolve, reject) => {
            let dbRequest = window.indexedDB.open(dbConst.db.name, dbConst.db.version);
            dbRequest.onsuccess = (e) => {
                this.db = dbRequest.result;
                resolve(this.db);
            }
            dbRequest.onupgradeneeded = (e) => {
                if (!this.db) {
                    this.db = dbRequest.result
                }
                let stores = dbConst.db.stores;
                for (let storeKey in stores) {
                    let store = stores[storeKey];

                    if (!this.db.objectStoreNames.contains(store.storeName)) {
                        // 没有store则创建
                        let objectStore = this.db.createObjectStore(store.storeName, {keyPath: store.keyPath});
                        // 创建索引
                        for (let index of store.indexes) {
                            objectStore.createIndex(index.name, index.name, {"unique": index.unique});
                        }
                    } else {
                    }
                }
            }
            dbRequest.onerror = console.error
        }))
    }

    addAsync(storeName: string, object: Object): Promise<Event> {
        return new Promise((resolve, reject) => {
            let request = this.db.transaction([storeName], 'readwrite')
                .objectStore(storeName)
                .add(object);

            request.onsuccess = function (event) {
                resolve(event);
            };

            request.onerror = function (event) {
                reject(event);
            }
        })
    }

    readAsync(storeName: string, key: string | number) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([storeName]);
            let objectStore = transaction.objectStore(storeName);
            let request = objectStore.get(key);

            request.onerror = function (event) {
                reject(event)
            };

            request.onsuccess = function (event) {
                resolve(request.result)
            };
        })
    }

    updateAsync(storeName:string, object:Object){
        return new Promise(((resolve, reject) => {
            let request = this.db.transaction([storeName], 'readwrite')
                .objectStore(storeName)
                .put(object);
            request.onerror = function (event) {
                reject(event)
            };

            request.onsuccess = function (event) {
                resolve(request.result)
            };
        }))
    }

    async addUserAsync(user: UserInDB) {
        return await this.addAsync("user", user);
    }

    async readUserByIdAsync(userId: number): Promise<UserInDB> {
        return <UserInDB>await this.readAsync("user", userId);
    }

    async updateUserAsync(user:UserInDB){
        return await this.updateAsync("user", user);
    }
}

export default DB;
export {UserInDB, UserInDBMedal, userInDBMedalEqual};
