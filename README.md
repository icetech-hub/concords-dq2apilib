# DQ2 API 文檔

## API 內含檔案

### JavaScript (html) 版本
1.  `../dist/dq2apilib.js`: 提供 JavaScript 介面，通過建立此物件來操作 DQ2 API。
2.  `FeedAPI.proto`: Protobuf 定義檔，即時報價使用 `FeedAPI::Realtime`。
3.  `APITest.html`: `dq2wasmapilib` 的測試範例。
4.  `HDAPI.proto`: Protobuf 定義檔，回補歷史資料使用。

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
*   `I.F.TWF.TXF.202506.1`、`I.F.TWF.TXF.202506.2`、`I.F.TWF.TXF.202506.*` 被視為三種獨立訂閱。
*   若這三種訂閱同時存在, 取消訂閱時需對每一種都發送 `UnsubQuote`。
**報價分為 Level 1 和 Level 2 訂閱**:
*   **Level 1**: 提供基本報價資訊，包括買一、賣一和最新成交價。例如, 訂閱 `I.F.TWF.TXF.202506.1`。
*   **Level 2**: 包含委託簿數據, 需額外訂閱。例如, 訂閱 `I.F.TWF.TXF.202506.2`。
*   若需同時訂閱 Level 1 和 Level 2, 可使用通配符 `*`, 如 `I.F.TWF.TXF.202506.*`。

### 4. UnsubQuote
**描述**: 取消訂閱指定合約的報價數據。
**參數**:
*   `symbol` (string): 要取消訂閱的報價合約。
**行為**:
*   `I.F.TWF.TXF.202506.1`、`I.F.TWF.TXF.202506.2`、`I.F.TWF.TXF.202506.*` 被視為三種獨立訂閱。
*   若這三種訂閱同時存在, 取消訂閱時需對每一種都發送 `UnsubQuote`。

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
*   **1分K**: 指令 `{"s":"hd","c":"omk","d":{"s":"I.F.TWF.TXF.202504","stime":20250408140000000,"etime":20250408150000000},"r":"xxx"}`。
*   **合約搜尋**: 指令 `{"s":"quote2","c":"search","d":{"type":["S","Z"],"symbol":"台"},"r":"xxx"}`。

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
**描述**: 訂閱熱門月對應表。目前回復資料有Hot、Hot2、Hot到期日, 未來增加Near、Near2、Quart、Quatt2…。
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
*   `Time`: server當下時間。

### 15. SearchContract
**描述**: 搜尋keyword相關合約。
**參數**:
*   `type` (string): S,F,O。
*   `keyword` (string)

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
*   `data` ([]byte): 搜尋結果。是指向報價數據的二進制指針, 需將此二進制數據反序列化為 Protobuf 物件。

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
| **OnConnectStatusFunc** | `status` int | 连接状态变化时触发的回调函数, status=1 表示连接成功, status=0 表示断开连接。 |
| **OnQuoteDataFunc** | `symbol` string, `data` []byte, `dataLen` int | 行情数据更新时触发的回调函数, symbol 是标的名称, data 是行情数据, dataLen 是数据长度。 |
| **OnCommodityDataFunc** | `subject` string, `data` string | 商品数据更新时触发的回调函数, subject 是商品主题, data 是商品数据。 |
| **OnHistoryDataFunc** | `type` string, `data` []byte | 查詢指定條件的歷史資料的回調函數, type是查詢指令type, data 是查詢回傳数据 |
| **OnMessageDataFunc** | `code` int, `msg` string | 錯誤訊息、API版本, 及API內部Log返回 |
| **OnCommodityVersionFunc** | `subject` string, `count` int, `timestamp` time | 品種資訊、分類表、商品列表版本訊息查詢的回調函數 |
| **OnHotmapFunc** | `subject` string, `data` string | 品種数据更新时触发的回调函数, subject 是品種主题, data 是熱門月数据。 |
| **OnServerTimeFunc** | `date` int, `time` double | 有訂閱server時間時, 若有更新, 將自動推送通知。 |
| **OnHistoryDataFunc** | `data` []byte | 搜尋合約的回調函數, data 是查詢回傳数据 |