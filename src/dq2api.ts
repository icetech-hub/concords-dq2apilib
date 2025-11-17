import '../dist/dq2apilib.js';

export type Callback = () => void;
export type OnConnectStatusCallback = (status: number) => void;
export type OnQuoteDataCallback = (symbol: string, data: Uint8Array, dataLen: number) => void;
export type OnCommodityDataCallback = (subject: string, data: string) => void;
export type OnHistoryDataCallback = (type: string, data: Uint8Array) => void;
export type OnMessageDataCallback = (code: number, msg: string) => void;
export type OnCommodityVersionCallback = (subject: string, count: number, timestamp: number) => void;
export type OnHotmapCallback = (subject: string, data: string) => void;
export type OnServerTimeCallback = (date: string, time: string) => void;
export type OnSearchContractCallback = (data: Uint8Array) => void;

const idToConnectCallback = new Map<string, OnConnectStatusCallback>();
const idToQuoteDataCallback = new Map<string, OnQuoteDataCallback>();
const idToCommodityDataCallback = new Map<string, OnCommodityDataCallback>();
const idToHistoryDataCallback = new Map<string, OnHistoryDataCallback>();
const idToMessageDataCallback = new Map<string, OnMessageDataCallback>();
const idToCommodityVersionCallback = new Map<string, OnCommodityVersionCallback>();
const idToHotmapCallback = new Map<string, OnHotmapCallback>();
const idToServerTimeCallback = new Map<string, OnServerTimeCallback>();
const idToSearchContractCallback = new Map<string, OnSearchContractCallback>();

// 為每個 API 實例儲存獨立的 dq2Api 物件和連線狀態
const idToDq2Api = new Map<string, any>();
const idToConnectStatus = new Map<string, boolean>();

let apiIndex: number = 1;
// 移除全域的 dq2Api 和 dq2ApiIsConnect

export interface IDQ2quoteAPI {
    /**
     * 使用提供的憑證和地址建立與 NATS 服務器的連接。
     * @param {string} identity 用戶身份標識。
     * @param {string} company 公司名稱。
     * @param {string} product 產品名稱。
     * @param {string} addr NATS 服務器地址。
     * @param {string} name 用於 NATS 認證的用戶名。
     * @param {string} password 用於 NATS 認證的密碼。
     * @param {number} autoreconnect 表示是否啟用自動重連（當前實現中未明確使用）。0：不自動重連；1：自動重連。
     * @param {number} interval 每 Interval ms 發出 ping。預設值 10000。
     * @param {number} missed 遺失 missed 次 pong，即斷線重連。預設值 3。
     * @callback OnConnectStatusFunc
     */
    Connect(identity: string, company: string, product: string, addr: string, name: string, password: string, autoreconnect: number, interval: number, missed: number): Promise<void>;
    /**
     * 關閉當前的 NATS 連接並重置相關狀態
     */
    Disconnect(): Promise<void>;
    /**
     * 訂閱指定合約的報價數據。
     ** API 維護訂閱計數 (count)，若重複訂閱，則重新推送一次市況。
     ** UnsubQuote 會減少訂閱計數 (count)，當 count = 0 時，才會實際發送取消訂閱請求。
     ** `I.F.TWF.TXF.202506.1`、`I.F.TWF.TXF.202506.2`、`I.F.TWF.TXF.202506.*` 被視為三種獨立訂閱。若這三種訂閱同時存在，取消訂閱時需對每一種都發送 UnsubQuote。
     * 報價分為 `Level 1` 和 `Level 2` 訂閱：
     ** `Level 1`：提供基本報價資訊，包括買一、賣一和最新成交價。例如，訂閱 `I.F.TWF.TXF.202506.1`。
     ** `Level 2`：包含委託簿數據，需額外訂閱。例如，訂閱 `I.F.TWF.TXF.202506.2`。
     ** 若需同時訂閱 `Level 1` 和 `Level 2`，可使用通配符 *，如 `I.F.TWF.TXF.202506.*`。
     * @param {string} symbol 要訂閱的報價合約。
     * @return {string} status 
     ** `1`：已重複訂閱 
     ** `0`：訂閱成功 
     ** `-1`：找不到指定合約 
     ** `-2`：尚未連線至伺服器。
     * @callback OnConnectStatusFunc
     */
    SubQuote(symbol: string): Promise<{ status: number }>;
    /**
     * 取消訂閱指定合約的報價數據。
     ** `I.F.TWF.TXF.202506.1`、`I.F.TWF.TXF.202506.2`、`I.F.TWF.TXF.202506.*` 被視為三種獨立訂閱。若這三種訂閱同時存在，取消訂閱時需對每一種都發送 UnsubQuote。
     * @param {string} symbol 要取消訂閱的報價合約。
     */
    UnsubQuote(symbol: string): Promise<void>;
    /**
     * 獲取指定合約的報價數據。未`SubQuote`，返回 `null`。
     * @param {string} symbol 要查詢的報價合約。
     * @return {Uint8Array} `data` : 報價數據(`FeedAPI::Realtime`)。
     * @return {number} `size` : 報價數據的長度。
     */
    GetQuote(symbol: string): Promise<{ data: Uint8Array; size: number; }>;
    /**
     * 訂閱品種資訊、分類表、商品列表。
     ** 品種資訊 `subject`：`dq2.Info.F.CME.6A`
     ** 分類表 `subject`：`dq2.classify.Master2`
     ** 商品列表 `subject`：`dq2.list.I.F.CME.6A`
     * @param {string} subject 要訂閱的商品主題。
     * @return {number} status 
     ** `0`：訂閱成功。
     ** `-1`：找不到指定 subject。
     */
    SubCommodity(subject: string): Promise<{ status: number }>;
    /**
     * 取消訂閱品種資訊、分類表、商品列表。
     * @param {string} subject 要取消訂閱的商品主題。
     */
    UnsubCommodity(subject: string): Promise<void>;
    /**
     * 獲取指定主題的商品數據。未 `SubCommodity`，返回 `null`。
     * @param {string} subject 要查詢的商品主題。
     * @return {string} `data` : 商品數據(`JSON 字符串`)。
     * @return {number} `size` : 商品數據的長度。
     */
    GetCommodity(subject: string): Promise<{ data: string; size: number; }>;
    /**
     * 查詢並取得指定條件的歷史資料。
     **  `1分K`：指令 `{ “s”: "hd",”c”: "omk",”d”: {“s”: "I.F.TWF.TXF.202504"”,stime”: 20250408140000000,”etime”: 20250408150000000 },” r”: "xxx" }`。
     ** `合約搜尋`：指令 `{"s":"quote2","c":"search","d":{"type":["S", "Z"],"symbol":"台"},"r":"xxx"}`。
     * @param {string} qrystr 查詢條件(`JSON 字符串`)。
     */
    QryHistoryData(qrystr: string): Promise<void>;
    /**
     * 獲取品種資訊、分類表、商品列表，子集個數與更新 `TimeStamp`。
     ** 品種資訊 `subject`：`dq2.Info`
     ** 分類表 `subject`：`dq2.classify`
     ** 商品列表 `subject`：`dq2.list`
     * @param {string} subject 要查詢的商品主題。
     * @callback OnCommodityVersion
     */
    GetCommodityVersion(subject: string): Promise<void>;
    /**
     * 訂閱熱門月對應表。目前回復資料有`Hot`、`Hot2`、`Hot到期日`，未來增加`Near`、`Near2`、`Quart`、`Quatt2`…。
     ** `subject`：`dq2.hot.I.F.TWF.TXF`。
     * @param {string} subject 要訂閱的品種。
     * @return {number} `status` `0`訂閱成功 `-1`找不到指定 `subject`。
     */
    SubHotmap(subject: string): Promise<{ status: number }>;
    /**
     * 取消訂閱熱門月對應表。
     * @param {string} subject 要取消訂閱的品種。
     */
    UnsubHotmap(subject: string): Promise<void>;
    /**
     * 獲取指定主題的品種熱門月對應數據。
     * @param {string} subject 要查詢的品種主題。
     * @return {string} `data` : 熱門月對應表(`JSON 字符串`)。
     * @return {number} `size` : 熱門月對應表數據的長度。
     */
    GetHotmap(subject: string): Promise<{ data: string; size: number; }>;
    /**
     * 取得 `DQ2 server` 當下日期、時間。
     * @return {string} `date` : `server` 當下日期。
     * @return {string} `time` : `server` 當下時間。
     */
    GetServerDateTime(): Promise<{ date: string; time: string; }>;
    /**
     * 透過關鍵字搜尋合約。
     * @param {string} type 商品類型 `S,F,O`。
     * @param {string} keywords 關鍵字。
     */
    SearchContract(type: string, keywords: string): Promise<void>;
    /**
     * 用於處理 `NATS` 連接狀態變化的回調函數。
     * @return {number} `status` 連接狀態。
     ** `1`：表示成功連接到 `NATS` 服務器。
     ** `0`：連接失敗或已斷開。
     ** 其他數字：特殊狀態訊息，但不代表連線成功。
     */
    OnConnectStatusFunc(callback: OnConnectStatusCallback): Promise<void>;
    /**
     * 用於處理報價數據更新的回調函數。
     ** 若需同步處理以確保不漏掉任何 tick，應直接在接收數據時處理。
     ** 若要避免阻塞並進行異步處理，可記錄更新的 Symbol，並異步呼叫 `GetQuote` 以獲取最新報價。
     * @return {string} `symbol` 報價合約代碼。
     * @return {Uint8Array} `data` 報價數據(`FeedAPI::Realtime`)。
     * @return {number} `dataLen` 報價數據長度。
    */
    OnQuoteDataFunc(callback: OnQuoteDataCallback): Promise<void>;
    /**
     * 用於處理品種資訊、分類表、商品列表更新的回調函數。
     ** 品種資訊、分類表、商品列表均對應 `subject` 訂閱，若有更新，將自動推送通知。
     * @return {string} `subject` 商品主題。
     * @return {string} `data` 商品數據(`JSON 字符串`)。
    */
    OnCommodityDataFunc(callback: OnCommodityDataCallback): Promise<void>;
    /**
     * 用於處理查詢指定條件的歷史資料的回調函數。
     * @return {string} `type` 查詢指令 Type。
     * @return {Uint8Array} `data` 歷史資料(`HDAPI.proto`)。
    */
    OnHistoryDataFunc(callback: OnHistoryDataCallback): Promise<void>;
    /**
     * 錯誤訊息、API版本，及API內部Log返回。
     * @return {number} `code` 訊息代碼。
     * @return {string} `msg` 訊息內容。
     ** `0`：API版本訊息。
     ** `101`：`NATS` 斷線重連訊息，請務必接收 LOG 下來。
     ** `103`：API 內部 Log。
     ** `2`：`UnsubQuote` 解訂閱成功，`msg` 為訂閱 `symbol`。
     ** `3`：`SubQuote` 重複訂閱，`msg` 為訂閱 `symbol`。
     ** `12`：`UnsubCommodity` 解訂閱成功，`msg` 為訂閱 `subject`。
     ** `13`：`SubCommodity` 重複訂閱，`msg` 為訂閱 `subject`。
     ** `-1`：`SubQuote` 訂閱失敗，`msg` 為訂閱 `symbol`。
     ** `-3`：`UnsubQuote` 解訂閱失敗，尚有其他重複訂閱，`msg` 為訂閱 `symbol`。
     ** `-11`：`SubCommodity` 訂閱失敗，`msg` 為訂閱 `subject`。
     ** `-13`：`UnsubCommodity` 解訂閱失敗，尚有其他重複訂閱，`msg` 為訂閱 `subject`。
    */
    OnMessageDataFunc(callback: OnMessageDataCallback): Promise<void>;
    /**
     * 用於處理品種資訊、分類表、商品列表，子集個數與更新 `TimeStamp` 的回調函數。
     * @return {string} `subject` 品種資訊、分類表、商品列表。
     * @return {number} `count` 子集個數。
     * @return {number} `timestamp` 商品主題更新時間戳。
    */
    OnCommodityVersionFunc(callback: OnCommodityVersionCallback): Promise<void>;
    /**
     * 熱門月表更新的回調函數。
     ** 熱門月表均對應 `subject` 訂閱，若有更新，將自動推送通知。
     * @return {string} `subject` 品種數據的主題。
     * @return {string} `data` 熱門月對應表(JSON 字符串)。
    */
    OnHotmapFunc(callback: OnHotmapCallback): Promise<void>;
    /**
     * 有訂閱 `server` 時間(SubQuote(`dq2.time.sec.I`))時，回調函數。
     ** 有訂閱 `server` 時間時，若有更新，將自動推送通知。
     * @return {string} `date` server 當下日期。
     * @return {string} `time` server 當下時間。
    */
    OnServerTimeFunc(callback: OnServerTimeCallback): Promise<void>;
    /**
     * 搜尋合約，回調函數。
     * @return {Uint8Array} `data` 搜尋合約結果數據(`quote2.proto`)。
    */
    OnSearchContractFunc(callback: OnSearchContractCallback): Promise<void>;
    readonly id: string;
}

export const isConnected = (id?: string): boolean => {
    if (id) {
        return idToConnectStatus.get(id) || false;
    }
    // 檢查是否有任何實例連線
    return Array.from(idToConnectStatus.values()).some(status => status);
};

const createDQ2ApiInstance = async (id: string, dq2wasmapilib: any) => {
    try {
        // 為每個實例建立獨立的 dq2Api
        const dq2Api = await dq2wasmapilib?.createInstance(id);
        idToDq2Api.set(id, dq2Api);
        idToConnectStatus.set(id, false);

        // 設置回調函數，透過閉包捕獲 id，只觸發對應實例的回調
        dq2Api?.setOnConnectStatusFunc((status: number) => {
            idToConnectStatus.set(id, status === 1);
            const callback = idToConnectCallback.get(id);
            if (callback) {
                callback(status);
            }
        });
        dq2Api?.setOnQuoteDataFunc((symbol: string, data: Uint8Array, dataLen: number) => {
            const callback = idToQuoteDataCallback.get(id);
            if (callback) {
                callback(symbol, data, dataLen);
            }
        });
        dq2Api?.setOnCommodityDataFunc((subject: string, data: string) => {
            const callback = idToCommodityDataCallback.get(id);
            if (callback) {
                callback(subject, data);
            }
        });
        dq2Api?.setOnHistoryDataFunc((type: string, data: Uint8Array) => {
            const callback = idToHistoryDataCallback.get(id);
            if (callback) {
                callback(type, data);
            }
        });
        dq2Api?.setOnMessageDataFunc((code: number, msg: string) => {
            const callback = idToMessageDataCallback.get(id);
            if (callback) {
                callback(code, msg);
            }
        });
        dq2Api?.setCommodityVersionFunc((subject: string, count: number, timestamp: number) => {
            const callback = idToCommodityVersionCallback.get(id);
            if (callback) {
                callback(subject, count, timestamp);
            }
        });
        dq2Api?.setOnHotmapFunc((subject: string, data: string) => {
            const callback = idToHotmapCallback.get(id);
            if (callback) {
                callback(subject, data);
            }
        });
        dq2Api?.setOnServerTimeFunc((date: string, time: string) => {
            const callback = idToServerTimeCallback.get(id);
            if (callback) {
                callback(date, time);
            }
        });
        dq2Api?.setOnSearchContractFunc((data: Uint8Array) => {
            const callback = idToSearchContractCallback.get(id);
            if (callback) {
                callback(data);
            }
        });

    } catch (e) {
        console.error("createDQ2ApiInstance error:", e);
    }
};

/**
 * 建立新的即時報價 API，每個 API 皆為獨立的個體。
 */
export const newAPI = async (): Promise<IDQ2quoteAPI> => {
    const id = Date.now().toString(16) + "_" + apiIndex++;
    
    // 確保 dq2wasmapilib 已載入
    if (typeof (globalThis as any).dq2wasmapilib === 'undefined') {
        throw new Error('dq2wasmapilib not loaded. Please ensure dq2apilib.js is loaded before importing this module.');
    }
    
    await createDQ2ApiInstance(id, (globalThis as any).dq2wasmapilib);
    
    return {
        Connect: async (identity: string, company: string, product: string, addr: string, name: string, password: string, autoreconnect: number, interval: number, missed: number) => {
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
        SubQuote: async (symbol: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            const status: number = dq2Api?.SubQuote(symbol);
            return { status };
        },
        UnsubQuote: async (symbol: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.UnsubQuote(symbol);
            return Promise.resolve();
        },
        GetQuote: async (symbol: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            let data: Uint8Array = new Uint8Array();
            let size: number = 0;
             [data, size] = dq2Api?.GetQuote(symbol);
            return { data, size };
        },
        SubCommodity: async (subject: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            const status: number = dq2Api?.SubCommodity(subject);
            return { status };
        },
        UnsubCommodity: async (subject: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.UnsubCommodity(subject);
            return Promise.resolve();
        },
        GetCommodity: async (subject: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            let data: string = "";
            let size: number = 0;
            [data, size] = dq2Api?.GetCommodity(subject);
            return { data, size };
        },
        QryHistoryData: async (qrystr: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.QryHistoryData(qrystr);
            return Promise.resolve();
        },
        GetCommodityVersion: async (subject: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.GetCommodityVersion(subject);
            return Promise.resolve();
        },
        SubHotmap: async (subject: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            const status: number = dq2Api?.SubHotmap(subject);
            return { status };
        },
        UnsubHotmap: async (subject: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.UnsubHotmap(subject);
            return Promise.resolve();
        },
        GetHotmap: async (subject: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            let data: string = "";
            let size: number = 0;
            [data, size] = dq2Api?.GetHotmap(subject);
            return { data, size };
        },
        GetServerDateTime: async () => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            const result = dq2Api?.GetServerDateTime();
            const date: string = result?.DQ2SvrDate || "";
            const time: string = result?.DQ2SvrTime || "";
            return { date, time };
        },
        SearchContract: async (type: string, keywords: string) => {
            if (!isConnected(id)) {
                throw new Error("DQ2API is not Connect.");
            }
            const dq2Api = idToDq2Api.get(id);
            dq2Api?.SearchContract(type, keywords);
            return Promise.resolve();
        },
        OnConnectStatusFunc: async (callback: OnConnectStatusCallback) => {
            idToConnectCallback.set(id, callback);
            callback(isConnected(id) ? 1 : 0);
            return Promise.resolve();
        },
        OnQuoteDataFunc: async (callback: OnQuoteDataCallback) => {
            idToQuoteDataCallback.set(id, callback);
            return Promise.resolve();
        },
        OnCommodityDataFunc: async (callback: OnCommodityDataCallback) => {
            idToCommodityDataCallback.set(id, callback);
            return Promise.resolve();
        },
        OnHistoryDataFunc: async (callback: OnHistoryDataCallback) => {
            idToHistoryDataCallback.set(id, callback);
            return Promise.resolve();
        },
        OnMessageDataFunc: async (callback: OnMessageDataCallback) => {
            idToMessageDataCallback.set(id, callback);
            return Promise.resolve();
        },
        OnCommodityVersionFunc: async (callback: OnCommodityVersionCallback) => {
            idToCommodityVersionCallback.set(id, callback);
            return Promise.resolve();
        },
        OnHotmapFunc: async (callback: OnHotmapCallback) => {
            idToHotmapCallback.set(id, callback);
            return Promise.resolve();
        },
        OnServerTimeFunc: async (callback: OnServerTimeCallback) => {
            idToServerTimeCallback.set(id, callback);
            return Promise.resolve();
        },
        OnSearchContractFunc: async (callback: OnSearchContractCallback) => {
            idToSearchContractCallback.set(id, callback);
            return Promise.resolve();
        },
        get id() {
            return id;
        },
    };
};