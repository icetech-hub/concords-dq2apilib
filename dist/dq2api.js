import '../dist/dq2apilib.js';
const idToConnectCallback = new Map();
const idToQuoteDataCallback = new Map();
const idToCommodityDataCallback = new Map();
const idToHistoryDataCallback = new Map();
const idToMessageDataCallback = new Map();
const idToCommodityVersionCallback = new Map();
const idToHotmapCallback = new Map();
const idToServerTimeCallback = new Map();
const idToSearchContractCallback = new Map();
// 為每個 API 實例儲存獨立的 dq2Api 物件和連線狀態
const idToDq2Api = new Map();
const idToConnectStatus = new Map();
let apiIndex = 1;
export const isConnected = (id) => {
    if (id) {
        return idToConnectStatus.get(id) || false;
    }
    // 檢查是否有任何實例連線
    return Array.from(idToConnectStatus.values()).some(status => status);
};
const createDQ2ApiInstance = async (id, dq2wasmapilib) => {
    try {
        // 為每個實例建立獨立的 dq2Api
        const dq2Api = await dq2wasmapilib?.createInstance(id);
        idToDq2Api.set(id, dq2Api);
        idToConnectStatus.set(id, false);
        // 設置回調函數，透過閉包捕獲 id，只觸發對應實例的回調
        dq2Api?.setOnConnectStatusFunc((status) => {
            idToConnectStatus.set(id, status === 1);
            const callback = idToConnectCallback.get(id);
            if (callback) {
                callback(status);
            }
        });
        dq2Api?.setOnQuoteDataFunc((symbol, data, dataLen) => {
            const callback = idToQuoteDataCallback.get(id);
            if (callback) {
                callback(symbol, data, dataLen);
            }
        });
        dq2Api?.setOnCommodityDataFunc((subject, data) => {
            const callback = idToCommodityDataCallback.get(id);
            if (callback) {
                callback(subject, data);
            }
        });
        dq2Api?.setOnHistoryDataFunc((type, data) => {
            const callback = idToHistoryDataCallback.get(id);
            if (callback) {
                callback(type, data);
            }
        });
        dq2Api?.setOnMessageDataFunc((code, msg) => {
            const callback = idToMessageDataCallback.get(id);
            if (callback) {
                callback(code, msg);
            }
        });
        dq2Api?.setCommodityVersionFunc((subject, count, timestamp) => {
            const callback = idToCommodityVersionCallback.get(id);
            if (callback) {
                callback(subject, count, timestamp);
            }
        });
        dq2Api?.setOnHotmapFunc((subject, data) => {
            const callback = idToHotmapCallback.get(id);
            if (callback) {
                callback(subject, data);
            }
        });
        dq2Api?.setOnServerTimeFunc((date, time) => {
            const callback = idToServerTimeCallback.get(id);
            if (callback) {
                callback(date, time);
            }
        });
        dq2Api?.setOnSearchContractFunc((data) => {
            const callback = idToSearchContractCallback.get(id);
            if (callback) {
                callback(data);
            }
        });
    }
    catch (e) {
        console.error("createDQ2ApiInstance error:", e);
    }
};
/**
 * 建立新的即時報價 API，每個 API 皆為獨立的個體。
 */
export const newAPI = async () => {
    const id = Date.now().toString(16) + "_" + apiIndex++;
    // 確保 dq2wasmapilib 已載入
    if (typeof self.dq2wasmapilib === 'undefined') {
        throw new Error('dq2wasmapilib not loaded. Please ensure dq2apilib.js is loaded before importing this module.');
    }
    await createDQ2ApiInstance(id, self.dq2wasmapilib);
    return {
        Connect: async (identity, company, product, addr, name, password, autoreconnect, interval, missed) => {
            const dq2Api = idToDq2Api.get(id);
            if (!dq2Api) {
                throw new Error("DQ2API instance not found.");
            }
            await dq2Api.Connect(identity, company, product, addr, name, password, autoreconnect, interval, missed);
            // 等待連線成功
            let connectionWaitCount = 0;
            while (!isConnected(id) && connectionWaitCount < 50) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                connectionWaitCount++;
            }
            return Promise.resolve();
        },
        Disconnect: async () => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.Disconnect();
            idToConnectStatus.set(id, false);
            // 清理回調函數
            idToConnectCallback.delete(id);
            idToQuoteDataCallback.delete(id);
            idToCommodityDataCallback.delete(id);
            idToHistoryDataCallback.delete(id);
            idToMessageDataCallback.delete(id);
            idToCommodityVersionCallback.delete(id);
            idToHotmapCallback.delete(id);
            idToServerTimeCallback.delete(id);
            idToSearchContractCallback.delete(id);
            // 清理實例
            idToDq2Api.delete(id);
            idToConnectStatus.delete(id);
            return Promise.resolve();
        },
        SubQuote: async (symbol) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            const status = dq2Api?.SubQuote(symbol);
            return { status };
        },
        UnsubQuote: async (symbol) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.UnsubQuote(symbol);
            return Promise.resolve();
        },
        GetQuote: async (symbol) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            let data = new Uint8Array();
            let size = 0;
            [data, size] = dq2Api?.GetQuote(symbol);
            return { data, size };
        },
        SubCommodity: async (subject) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            const status = dq2Api?.SubCommodity(subject);
            return { status };
        },
        UnsubCommodity: async (subject) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.UnsubCommodity(subject);
            return Promise.resolve();
        },
        GetCommodity: async (subject) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            let data = "";
            let size = 0;
            [data, size] = dq2Api?.GetCommodity(subject);
            return { data, size };
        },
        QryHistoryData: async (qrystr) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.QryHistoryData(qrystr);
            return Promise.resolve();
        },
        GetCommodityVersion: async (subject) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.GetCommodityVersion(subject);
            return Promise.resolve();
        },
        SubHotmap: async (subject) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            const status = dq2Api?.SubHotmap(subject);
            return { status };
        },
        UnsubHotmap: async (subject) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.UnsubHotmap(subject);
            return Promise.resolve();
        },
        GetHotmap: async (subject) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            let data = "";
            let size = 0;
            [data, size] = dq2Api?.GetHotmap(subject);
            return { data, size };
        },
        GetServerDateTime: async () => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            const result = dq2Api?.GetServerDateTime();
            const date = result?.DQ2SvrDate || "";
            const time = result?.DQ2SvrTime || "";
            return { date, time };
        },
        SearchContract: async (type, keywords) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.SearchContract(type, keywords);
            return Promise.resolve();
        },
        OnConnectStatusFunc: async (callback) => {
            idToConnectCallback.set(id, callback);
            callback(isConnected(id) ? 1 : 0);
            return Promise.resolve();
        },
        OnQuoteDataFunc: async (callback) => {
            idToQuoteDataCallback.set(id, callback);
            return Promise.resolve();
        },
        OnCommodityDataFunc: async (callback) => {
            idToCommodityDataCallback.set(id, callback);
            return Promise.resolve();
        },
        OnHistoryDataFunc: async (callback) => {
            idToHistoryDataCallback.set(id, callback);
            return Promise.resolve();
        },
        OnMessageDataFunc: async (callback) => {
            idToMessageDataCallback.set(id, callback);
            return Promise.resolve();
        },
        OnCommodityVersionFunc: async (callback) => {
            idToCommodityVersionCallback.set(id, callback);
            return Promise.resolve();
        },
        OnHotmapFunc: async (callback) => {
            idToHotmapCallback.set(id, callback);
            return Promise.resolve();
        },
        OnServerTimeFunc: async (callback) => {
            idToServerTimeCallback.set(id, callback);
            return Promise.resolve();
        },
        OnSearchContractFunc: async (callback) => {
            idToSearchContractCallback.set(id, callback);
            return Promise.resolve();
        },
        get id() {
            return id;
        },
    };
};
//# sourceMappingURL=dq2api.js.map