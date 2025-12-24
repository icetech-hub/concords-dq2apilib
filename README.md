# DQ2 API 文檔

**Symbol格式**：I.S.TWS.XXXX。 
*  I : 固定保留字
*  S : 證券
*  TWS : 交易所
*  XXXX : 股票代碼
*  不分上市、上櫃
*  例如：台積電：I.S.TWS.2330、聯發科：I.S.TWS.2454 
*  零股symbol：I.Z.TWS.XXXX 

**日期、時間格式**： 一律為 GMT+8
*  即時報價 FeedAPI::Realtime.Date : YYYYMMDD 
*  即時報價 FeedAPI::Realtime.Time : HHMMSSmmmuuunnnppp (mmm=milli-second, uuu=micro-second ; nnn=nano ; ppp=pico)
* 因FeedAPI::Realtime.Time定義為數值，午夜時段（00 點）開頭的 0 會消失。如收到的數值為 101...，請自行補齊前導零以對應 00:01:01。上午08點、09點同樣。
* 歷史資料 omk::HDData.Omk.datetime : YYYYMMDDHHMMSSmmm 

**API 功能說明**：

**連線**：
* function：Connect、Disconnect
* callback：OnConnectStatusFunc

**即時報價**：
* function：SubQuote、UnsubQuote、GetQuote
* callback：OnQuoteDataFunc

**歷史資料**：
* function：QryHistoryData 
* callback：OnHistoryDataFunc 

**合約搜尋**：   
* function：SearchContract 
* callback：OnSearchContractFunc 

**取得報價server主機時間**:
* function：GetServerDateTime 

***品種資訊、分類表、商品列表**：
* function：SubCommodity、UnsubCommodity、GetCommodity
* callback：OnCommodityDataFunc

**熱門月對應表**：
* function：SubHotmap、UnsubHotmap、GetHotmap 
* callback：OnHotmapFunc 

**訊息回報**：
* function：- 
* callback：OnMessageDataFunc


## API 內含檔案

### JavaScript (HTML/Browser) 版本
1.  `dist/dq2apilib.js`: 提供瀏覽器使用的 JavaScript 庫，封裝了 DQ2 API 的操作介面。
2.  `dist/FeedAPI.proto`: Protobuf 定義檔，用於即時報價數據（`FeedAPI::Realtime`）。
3.  `dist/HDAPI.proto`: Protobuf 定義檔，用於歷史數據回補。
4.  `dist/quote2.proto`: Protobuf 定義檔，用於合約搜尋等功能。

### Node.js (CommonJS/ESM) 版本
本套件支援 Node.js 環境，提供 CommonJS 與 ESM 兩種格式：
*   **CommonJS**: 位於 `dist/cjs/`
*   **ESM**: 位於 `dist/esm/`，包含 TypeScript 型別定義檔 (`dq2api.d.ts`)。

---

## 導出函數

### 1. Connect
**描述**: 使用提供的憑證和地址建立與 NATS 服務器的連接。

**參數**:
*   `identity`: 唯一識別client ID。
*   `company`:
*   `product`:
*   `addr` (string): NATS 服務器地址 (例如 "localhost:4222")。
*   `name` (string): 用於 NATS 認證的用戶名。
*   `password` (string): 用於 NATS 認證的密碼。
*   `autoreconnect` (int): 表示是否啟用自動重連 (當前實現中未明確使用)。0: 不自動重連; 1: 自動重連。
*   `Interval` (int): 每 Interval ms 發出ping。JS為option; Go Interval<=0; 使用預設值 10000。
*   `missed` (int): 遺失 missed 次 pong, 即斷線重連。JS為option; Go missed<=0; 使用預設值 3。

### 2. Disconnect
**描述**: 關閉當前的 NATS 連接並重置相關狀態。

### 3. SubQuote
**描述**: 訂閱指定合約的報價數據。

**參數**:
*   `symbol` (string): 要訂閱的報價合約。

**返回值**:
*   `1`: 已重複訂閱。
*   `0`: 訂閱成功。
*   `-1`: 找不到指定合約。
*   `-2`: 尚未連線至伺服器。

**行為**:
*   API 維護訂閱計數 (count)，若重複訂閱，則重新推送一次市況。
*   `UnsubQuote` 會減少訂閱計數 (count)，當 `count = 0` 時，才會實際發送取消訂閱請求。
*   `I.S.TWS.2330.1`、`I.S.TWS.2330.2` 被視為兩種獨立訂閱。
*   若這兩種訂閱同時存在, 取消訂閱時需對每一種都發送 `UnsubQuote`。
**報價分為 Level 1 和 Level 2 訂閱**:
*   **Level 1**: 提供基本報價資訊，包括買一、賣一和最新成交價。例如, 訂閱 `I.S.TWS.2330.1`。
*   **Level 2**: 包含委託簿數據, 需額外訂閱。例如, 訂閱 `I.S.TWS.2330.2`。

### 4. UnsubQuote
**描述**: 取消訂閱指定合約的報價數據。

**參數**:
*   `symbol` (string): 要取消訂閱的報價合約。

**行為**:
*   `I.S.TWS.2330.1`、`I.S.TWS.2330.2` 被視為兩種獨立訂閱。
*   若這兩種訂閱同時存在, 取消訂閱時需對每一種都發送 `UnsubQuote`。

### 5. GetQuote
**描述**: 獲取指定合約的報價數據。未SubQuote, 返回nil。

**參數**:
*   `symbol` (string): 要查詢的報價合約。

**返回值**:
*   `*char`: 是指向報價數據的二進制指針, 需將此二進制數據反序列化為 Protobuf 物件 (`FeedAPI::Realtime`)。
*   `size_t`: 報價數據的長度。

### 6. SubCommodity
**描述**: 訂閱品種資訊、分類表、商品列表。

**參數**:
*   `subject` (string): 要訂閱的商品主題。

**返回值**:
*   `0`: 訂閱成功。
*   `-1`: 找不到指定subject。

**行為**:
*   品種資訊subject: `dq2.Info.F.CME.6A`
*   分類表subject: `dq2.classify.Master2`
*   商品列表subject: `dq2.list.I.F.CME.6A`

### 7. UnsubCommodity
**描述**: 取消訂閱商品資訊、分類表、商品列表。

**參數**:
*   `subject` (string): 要取消訂閱的商品主題。

### 8. GetCommodity
**描述**: 獲取指定主題的商品數據。未SubCommodity, 返回nil。

**參數**:
*   `subject` (string): 要查詢的商品主題。

**返回值**:
*   `*char`: 是指向商品數據的 C 字符串指針, 該數據為 JSON 格式的字符串。
*   `size_t`: 商品數據的長度。

### 9. QryHistoryData
**描述**: 查詢並取得指定條件的歷史資料。

**參數**:
*   `qrystr` (string): 查詢條件, 採用 JSON 格式的指令字串。

**行為**:
*   **分價表**: 指令 `{ “s”: "hd",”c”: "pv",”d”: {“s”: "I.S.TWS.2330"},”r”: "xxx" }`。
*   **分時表**: 指令 `{ “s”: "hd",”c”: "tbl",”d”: {“s”: "I.S.TWS.2330",”bars”: 500,”n”: 1 },”r”: "xxx" }`。
   bars 設定取回最新的資料筆數（本例為 500 筆），參數 n 須固定為 1。
*   **1分K**: 指令 `{ “s”: "hd",”c”: "omk",”d”: {“s”: "I.S.TWS.2330",”stime”: 20250408140000000,”etime”: 20250408150000000 },”r”: "xxx" }`。
*   **日K**: 指令 `{ “s”: "hd",”c”: "dk",”d”: {“s”: "I.S.TWS.2330",”stime”: 20250408140000000,”etime”: 20250408150000000 },”r”: "xxx" }`。
*   r 為自訂鍵值（Key），用於多筆查詢並行時，確保回傳結果能準確對應至原始請求。
*   1分K、日K 若需要包含除權息調正因子，請加入 `"ExD": 1`。 因會較耗時，需要時才加日此參數。
例如：`{ “s”: "hd",”c”: "dk","ExD": 1,”d”: {“s”: "I.S.TWS.2330",”stime”: 20250408140000000,”etime”: 20250408150000000 },”r”: "xxx" }`。

### 10. GetCommodityVersion
**描述**: 獲取品種資訊、分類表、商品列表, 子集個數與更新TimeStamp。

**參數**:
*   `subject` (string): 要查詢的商品主題。
*   品種資訊subject: `dq2.Info`
*   分類表subject: `dq2.classify`
*   商品列表subject: `dq2.list`

**返回值**:
*   無。
*   `CallBack OnCommodityVersion` 返回。

### 11. SubHotmap
**描述**: 訂閱熱門月對應表。目前回覆資料有Hot、Hot2、Hot到期日, 未來增加Near、Near2、Quart、Quatt2…。

**參數**:
*   `subject` (string): 要訂閱的品種。

**返回值**:
*   `0`: 訂閱成功。
*   `-1`: 找不到指定subject。

**行為**:
*   `subject`: `dq2.hot.I.F.TWF.TXF`

### 12. UnsubHotmap
**描述**: 取消訂閱熱門月對應表。

**參數**:
*   `subject` (string): 要取消訂閱的品種。

### 13. GetHotmap
**描述**: 獲取指定主題的品種熱門月對應數據。

**參數**:
*   `subject` (string): 要查詢的品種主題。

**返回值**:
*   `*char`: 是指向商品數據的 C 字符串指針, 該數據為 JSON 格式的字符串。
*   `size_t`: 商品數據的長度。

### 14. GetServerDateTime
**描述**: 取得DQ2 server當下日期、時間。

**返回值**:
*   `Date`: server當下日期。
*   `Time`: server當下時間。 (HHMMSSmmmuuunnnppp)

### 15. SearchContract
**描述**: 搜尋keyword相關合約。

**參數**:
*   `type` (string): S,SW,F,O。
*   `keyword` (string)
*   type：合約搜尋範圍。可選用 S (證券/不含權證)、SW (權證)、F (期貨)、O (選擇權)。支援組合查詢，如 S,SW。

---

## 回調函數

### 1. OnConnectStatusFunc
**描述**: 用於處理 NATS 連接狀態變化的回調函數。

**參數**:
*   `status`: 連接狀態。
*   `0`: 表示連接失敗或已斷開。
*   `1`: 表示成功連接到 NATS 服務器。

### 2. OnQuoteDataFunc
**描述**: 用於處理報價數據更新的回調函數。

**參數**:
*   `symbol` (string): 報價合約代碼。
*   `data` ([]byte): 是指向報價數據的二進制指針, 需將此二進制數據反序列化為 Protobuf 物件 (`FeedAPI::Realtime`)。
*   `dataLen` (int): 數據長度。
**行為**:
*   此處接收即時報價變動資料:
    *   若需同步處理以確保不漏掉任何 tick, 應直接在接收數據時處理。
    *   若要避免阻塞並進行異步處理, 可記錄更新的 Symbol, 並異步呼叫 `GetQuote` 以獲取最新報價。

### 3. OnCommodityDataFunc
**描述**: 用於處理品種資訊、分類表、商品列表更新的回調函數。

**參數**:
*   `subject` (string): 商品數據的主題。
*   `data` (string): 該數據為 JSON 格式的字符串。

**行為**:
*   品種資訊、分類表、商品列表均對應 `subject` 訂閱, 若有更新, 將自動推送通知。

### 4. OnHistoryDataFunc
**描述**: 用於處理查詢指定條件的歷史資料的回調函數。

**參數**:
*   `type` (string): 查詢指令type。
*   `data` ([]byte): 是指向報價數據的二進制指針, 需將此二進制數據反序列化為 Protobuf 物件 (`HDAPI.proto`)。
*   依據 type 不同，data 內容有所不同：
*   hd.pv：分價表數據。 omk::HDData.pvs
*   hd.tbl：分時表數據。 omk::HDData.tbls
*   hd.omk：1分K數據。 omk::HDData.omks
*   hd.dk：日K數據。 omk::HDData.omks
*   1分K、日K 若有包含除權息調正因子。除權息還原價格作法如下：
*   開 = openprice / predividendadj、高 = highestprice / predividendadj、低 = lowestprice / predividendadj、收 = closeprice / predividendadj

### 5. OnMessageDataFunc
**描述**: 錯誤訊息、API版本, 及API內部Log返回。

**參數**:
*   `code` (int): 訊息代碼。
*   `msg` (string): 訊息內容。

| Code | 說明 |
| :--- | :--- |
| `0` | API版本訊息。 |
| `101` | NATS 斷線重連訊息。請務必接收LOG下來。 |
| `103` | API內部Log。 |
| `2` | `UnsubQuote`解訂閱成功, msg為訂閱symbol。 |
| `3` | `SubQuote`重複訂閱, msg為訂閱symbol。 |
| `12` | `UnsubCommodity`解訂閱成功, msg為訂閱subject。 |
| `13` | `SubCommodity`重複訂閱, msg為訂閱subject。 |
| `-1` | `SubQuote`訂閱失敗, msg為訂閱symbol。 |
| `-3` | `UnsubQuote`解訂閱失敗, 尚有其他重複訂閱, msg為訂閱symbol。 |
| `-11` | `SubCommodity`訂閱失敗, msg為訂閱subject。 |
| `-13` | `UnsubCommodity`解訂閱失敗, 尚有其他重複訂閱, msg為訂閱subject。 |

### 6. OnCommodityVersionFunc
**描述**: 品種資訊、分類表、商品列表版本訊息查詢的回調函數。

**參數**:
*   `subject` (string): 品種資訊、分類表、商品列表 (subject)。
*   `count` (int): 子集個數。
*   `timestamp` (time): 商品主題更新時間戳。

### 7. OnHotmapFunc
**描述**: 熱門月表更新的回調函數。

**參數**:
*   `subject` (string): 品種數據的主題。
*   `data` (string): 該數據為 JSON 格式的字符串。

**行為**:
*   熱門月表均對應 `subject` 訂閱, 若有更新, 將自動推送通知。

### 8. OnServerTimeFunc
**描述**: 有訂閱server時間時, 回調函數。

**參數**:
*   `Date`: server當下日期。
*   `Time`: server當下時間。

**行為**:
*   有訂閱server時間時, 若有更新, 將自動推送通知。

### 9. OnSearchContractFunc
**描述**: 搜尋合約, 回調函數。

**參數**:
*   `data` ([]byte): 搜尋結果。是指向報價數據的二進制指針, 需將此二進制數據反序列化為 Protobuf (`quote2.proto`) 物件。
*   透過 quote2::Quote2Data.recognize，開發者可精確比對並關聯回原查詢的 unikey，以辨識多項非同步請求的回傳結果。

---
## 函數總覽表

### 導出函數

| 函數名 | 參數 | 返回值 |
| :--- | :--- | :--- |
| **Connect** | `identity` string, `company` string, `product` string, `addr` string, `name` string, `password` string, `autoreconnect` int | 無 |
| **Disconnect** | 無 | 無 |
| **SubQuote** | `symbol` string | int |
| **UnsubQuote** | `symbol` string | 無 |
| **GetQuote** | `symbol` string | (*char, size_t) |
| **SubCommodity** | `subject` string | int |
| **UnsubCommodity** | `subject` string | 無 |
| **GetCommodity** | `subject` string | (*char, size_t) |
| **QryHistoryData** | `qrystr` string | 無 |
| **GetCommodityVersion** | `subject` string | 無。CallBack OnCommodityVersion 返回 |
| **SubHotmap** | `subject` string | int |
| **UnsubHotmap** | `subject` string | 無 |
| **GetHotmap** | `subject` string | (*char, size_t) |
| **GetServerDateTime** | 無 | (int, double) |
| **SearchContract** | `type` string, `keyword` string | 無 |

### 回調函數

| 回調函數 | 參數 | 說明 |
| :--- | :--- | :--- |
| **OnConnectStatusFunc** | `status` int | 連接狀態變化時觸發的回調函數, status=1 表示連接成功, status=0 表示斷開連接。 |
| **OnQuoteDataFunc** | `symbol` string, `data` []byte, `dataLen` int | 行情數據更新時觸發的回調函數, symbol 是標的名稱, data 是行情數據, dataLen 是數據長度。 |
| **OnCommodityDataFunc** | `subject` string, `data` string | 商品數據更新時觸發的回調函數, subject 是商品主題, data 是商品數據。 |
| **OnHistoryDataFunc** | `type` string, `data` []byte | 查詢指定條件的歷史資料的回調函數, type是查詢指令type, data 是查詢回傳數據 |
| **OnMessageDataFunc** | `code` int, `msg` string | 錯誤訊息、API版本, 及API內部Log返回 |
| **OnCommodityVersionFunc** | `subject` string, `count` int, `timestamp` time | 品種資訊、分類表、商品列表版本訊息查詢的回調函數 |
| **OnHotmapFunc** | `subject` string, `data` string | 品種數據更新時觸發的回調函數, subject 是品種主題, data 是熱門月數據。 |
| **OnServerTimeFunc** | `date` int, `time` double | 有訂閱server時間時, 若有更新, 將自動推送通知。 |
| **OnSearchContractFunc** | `data` []byte | 搜尋合約的回調函數, data 是查詢回傳數據 |