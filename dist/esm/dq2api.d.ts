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
export interface IDQ2quoteAPI {
    /**
    * Symbol格式：I.S.TWS.XXXX。
    ** I : 固定保留字
    ** S : 證券
    ** TWS : 交易所
    ** XXXX : 股票代碼
    ** 不分上市、上櫃
    ** 例如：台積電：I.S.TWS.2330、聯發科：I.S.TWS.2454
    ** 零股symbol：I.Z.TWS.XXXX
    *
    *
    * 日期、時間格式： 一律為 GMT+8
    ** 即時報價 FeedAPI::Realtime.Date : YYYYMMDD
    ** 即時報價 FeedAPI::Realtime.Time : HHMMSSmmmuuunnnppp (mmm=milli-second, uuu=micro-second ; nnn=nano ; ppp=pico)
    ** 因FeedAPI::Realtime.Time定義為數值，午夜時段（00 點）開頭的 0 會消失。如收到的數值為 101...，請自行補齊前導零以對應 00:01:01。上午08點、09點同樣。
    ** 歷史資料 omk::HDData.Omk.datetime : YYYYMMDDHHMMSSmmm
    *
    *
    *
    * API 功能說明：
    *
    * 連線：
    ** function：Connect、Disconnect
    ** callback：OnConnectStatusFunc
    *
    * 即時報價：
    ** function：SubQuote、UnsubQuote、GetQuote
    ** callback：OnQuoteDataFunc
    *
    * 歷史資料：
    ** function：QryHistoryData
    ** callback：OnHistoryDataFunc
    *
    * 合約搜尋：
    ** function：SearchContract
    ** callback：OnSearchContractFunc
    *
    * 取得報價server主機時間:
    ** function：GetServerDateTime
    *
    * 品種資訊、分類表、商品列表：
    ** function：SubCommodity、UnsubCommodity、GetCommodity
    ** callback：OnCommodityDataFunc
    *
    * 熱門月對應表：
    ** function：SubHotmap、UnsubHotmap、GetHotmap
    ** callback：OnHotmapFunc
    *
    * 訊息回報：
    ** function：-
    ** callback：OnMessageDataFunc
    *
    */
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
     ** `I.S.TWS.2330.1`、`I.S.TWS.2330.2` 被視為兩種獨立訂閱。若這兩種訂閱同時存在，取消訂閱時需對每一種都發送 UnsubQuote。
     * 報價分為 `Level 1` 和 `Level 2` 訂閱：
     ** `Level 1`：提供基本報價資訊，包括買一、賣一和最新成交價。例如，訂閱 `I.S.TWS.2330.1`。
     ** `Level 2`：包含委託簿數據，需額外訂閱。例如，訂閱 `I.S.TWS.2330.2`。
     * @param {string} symbol 要訂閱的報價合約。
     * @return {string} status
     ** `1`：已重複訂閱
     ** `0`：訂閱成功
     ** `-1`：找不到指定合約
     ** `-2`：尚未連線至伺服器。
     */
    SubQuote(symbol: string): Promise<{
        status: number;
    }>;
    /**
     * 取消訂閱指定合約的報價數據。
     ** `I.F.TWF.TXF.202506.1`、`I.F.TWF.TXF.202506.2` 被視為兩種獨立訂閱。若這兩種訂閱同時存在，取消訂閱時需對每一種都發送 UnsubQuote。
     * @param {string} symbol 要取消訂閱的報價合約。
     */
    UnsubQuote(symbol: string): Promise<void>;
    /**
     * 獲取指定合約的報價數據。未`SubQuote`，返回 `null`。
     * @param {string} symbol 要查詢的報價合約。
     * @return {Uint8Array} `data` : 報價數據(`FeedAPI::Realtime`)。
     * @return {number} `size` : 報價數據的長度。
     */
    GetQuote(symbol: string): Promise<{
        data: Uint8Array;
        size: number;
    }>;
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
    SubCommodity(subject: string): Promise<{
        status: number;
    }>;
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
    GetCommodity(subject: string): Promise<{
        data: string;
        size: number;
    }>;
    /**
     * 查詢並取得指定條件的歷史資料。
     ** `分價表`：指令 `{ “s”: "hd",”c”: "pv",”d”: {“s”: "I.S.TWS.2330"},”r”: "xxx" }`。
     ** `分時表`：指令 `{ “s”: "hd",”c”: "tbl",”d”: {“s”: "I.S.TWS.2330",”bars”: 500,”n”: 1 },”r”: "xxx" }`。
     ** bars 設定取回最新的資料筆數（本例為 500 筆），參數 n 須固定為 1。
     ** `1分K`：指令 `{ “s”: "hd",”c”: "omk",”d”: {“s”: "I.S.TWS.2330",”stime”: 20250408140000000,”etime”: 20250408150000000 },”r”: "xxx" }`。
     ** `日K`：指令 `{ “s”: "hd",”c”: "dk",”d”: {“s”: "I.S.TWS.2330",”stime”: 20250408140000000,”etime”: 20250408150000000 },”r”: "xxx" }`。
     ** r 為自訂鍵值（Key），用於多筆查詢並行時，確保回傳結果能準確對應至原始請求。
     * 1分K、日K 若需要包含除權息調正因子，請加入 `"ExD": 1`。 因會較耗時，需要時才加日此參數。
     * 例如：`{ “s”: "hd",”c”: "dk","ExD": 1,”d”: {“s”: "I.S.TWS.2330",”stime”: 20250408140000000,”etime”: 20250408150000000 },”r”: "xxx" }`。
     * @param {string} qrystr 查詢條件(`JSON 字符串`)。
     * @callback OnHistoryDataFunc
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
    SubHotmap(subject: string): Promise<{
        status: number;
    }>;
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
    GetHotmap(subject: string): Promise<{
        data: string;
        size: number;
    }>;
    /**
     * 取得 `DQ2 server` 當下日期、時間。
     * @return {string} `date` : `server` 當下日期。
     * @return {string} `time` : `server` 當下時間。 HHMMSSmmmuuunnnppp
     */
    GetServerDateTime(): Promise<{
        date: string;
        time: string;
    }>;
    /**
     * 透過關鍵字搜尋合約。
     * @param {string} type 商品類型 `S,SW,F,O`。
     * @param {string} keywords 關鍵字。
     * @param {string} unikey 用戶自訂識別碼，可在回傳結果中辨識此搜尋請求。
     * type：合約搜尋範圍。可選用 S (證券/不含權證)、SW (權證)、F (期貨)、O (選擇權)。支援組合查詢，如 S,SW。
     * @callback OnSearchContractFunc
     */
    SearchContract(type: string, keywords: string, unikey: string): Promise<void>;
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
     * 透過 omk::HDData.recognize，開發者可精確比對並關聯回原查詢的 ubikey，以辨識多項非同步請求的回傳結果。
     * 依據 type 不同，data 內容有所不同：
     ** `hd.pv`：分價表數據。 omk::HDData.pvs
     ** `hd.tbl`：分時表數據。 omk::HDData.tbls
     ** `hd.omk`：1分K數據。 omk::HDData.omks
     ** `hd.dk`：日K數據。 omk::HDData.omks
     * 1分K、日K 若有包含除權息調正因子。除權息還原價格作法如下：
     ** 開 = openprice / predividendadj、高 = highestprice / predividendadj、低 = lowestprice / predividendadj、收 = closeprice / predividendadj
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
     * 透過 quote2::Quote2Data.recognize，開發者可精確比對並關聯回原查詢的 unikey，以辨識多項非同步請求的回傳結果。
    */
    OnSearchContractFunc(callback: OnSearchContractCallback): Promise<void>;
    readonly id: string;
}
export declare const isConnected: (id?: string) => boolean;
/**
 * 建立新的即時報價 API，每個 API 皆為獨立的個體。
 */
export declare const newAPI: () => Promise<IDQ2quoteAPI>;
//# sourceMappingURL=dq2api.d.ts.map