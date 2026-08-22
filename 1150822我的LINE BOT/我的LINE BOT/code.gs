/**
 * LINE → Google Docs 每日行事與工作筆記 4.0（工作儀表板 + 資源回收桶 + 系統健康 + 檔案中心）
 *
 * ============================================================
 * 4.0 長期使用版
 * ============================================================
 * [新] 資源回收桶：管理台刪除改為軟刪除，保留 30 天，可還原；逾期才永久清除。
 *      進入回收桶時，若有本系統建立的行事曆事件，會暫停提醒並加上「🗑️」標示；
 *      還原時會恢復原標題與 popup／email／SMS 提醒。Docs 正文保留到永久刪除，降低誤刪風險。
 * [新] 系統健康中心：索引、Docs、Calendar、Drive 歸檔、LINE 設定、部署、排程一次檢查；
 *      可在後台執行索引修復與安裝每日回收桶維護排程。
 * [新] 檔案中心：依關鍵字／月份／分類／檔案類型篩選，直接開檔、改檔名、移動分類；
 *      PDF／圖片可按需 OCR 並複製結果；另提供「孤兒檔案掃描」，不在每次開頁時拖慢系統。
 * [新] 未來 7 天工作區：逾期、今天、明天、後續日期分組，專看有期限且尚未完成的工作。
 * [改] 後台改為多頁工作台：儀表板／全部紀錄／未來7天／檔案中心／回收桶／系統健康。
 * [改] 索引新增「刪除時間」「回收桶快照」兩欄；舊索引會自動補欄，不需重建。
 * [新] setupV40()：升級後可在 Apps Script 編輯器執行一次，補欄位並建立每日維護排程。
 *
 * ============================================================
 * 3.7 專業管理台改版
 * ============================================================
 * [改] 桌機版改為深色側欄＋工作區架構，資訊層級更清楚。
 * [改] 統計卡採多色語意設計，逾期／今日到期／進行中不再只靠文字辨識。
 * [新] 排序：最新、最舊、期限優先、狀態優先。
 * [新] 統計卡精準篩選「今日到期」與「近七天」，不再錯誤導向全部資料。
 * [新] 匯出目前篩選結果 CSV；可一鍵開啟索引試算表與 Google 日曆。
 * [新] 顯示最後同步時間、目前日期與資料筆數，強化管理台狀態感。
 * [保留] 原有登入、批次、編輯、備註、完成說明、附件、Docs 與刪除機制。
 *
 *
 * ============================================================
 * 3.6 索引重建修正 + 管理台雙欄與穩定性
 * ============================================================
 * [修] 索引重建把「檔案連結：https://…」這種附加行當成獨立紀錄，
 *      於是管理台出現一堆內容只有網址的假資料。
 *      現在附加行會併回上一筆的附件欄，不再自成一列。
 * [新] repairIndexRows()：把既有的假資料清掉並補回附件連結，
 *      不必整個重建索引（重建會弄丟期限與完成時間）。
 * [新] 管理台寬螢幕自動雙欄；過長內容收合成三行，點一下展開。
 * [改] 穩定性：
 *      ・搜尋時不再把清單清空，改成淡化，畫面不會一直閃
 *      ・單筆動作只更新那一列，不整份重載，捲動位置不跳
 *      ・登入工作階段改成滑動視窗：只要有在操作就自動延長，
 *        不會用到一半突然被登出
 *      ・右上角顯示同步狀態，慢的時候看得出來是在跑而不是當掉
 *
 * ============================================================
 * 3.5 註記與進度：備註欄、完成說明、進行中狀態
 * ============================================================
 * 公務上最常見的狀態不是「做完沒」，而是「卡在哪」。
 * 只有待辦／完成兩態，等回覆、等核章、等對方補件全部都長一樣。
 *
 * [新] 三態變四態：筆記 → 待辦 ☐ → 進行中 ◐ → 完成 ☑
 *      進行中仍然算未完成，會留在 /未完成 與統計卡裡，
 *      但看得出來已經動工了。Docs 用 ◐ 標示。
 * [新] 備註欄。隨時可以寫進度，例如「已送主計，等回覆」。
 *      備註存在索引試算表與管理台，不寫進 Docs——
 *      Docs 是流水帳，段落文字一改就會對不上，備註會一直變。
 * [新] 完成說明。標記完成時可以順手寫結案紀錄，
 *      會一起寫進 Docs 那一行：☑ 核銷單　｜完成：主計已收件
 * [新] LINE 指令：
 *        /進行 3            把第 3 項標為進行中
 *        /完成 3｜主計已收件  完成並記下結案說明
 * [改] 管理台：狀態改用下拉選單、備註與完成說明可直接編輯、
 *      勾選完成時會跳出說明輸入框（可略過），批次完成可共用一則說明。
 * [改] 索引試算表新增「備註」「完成說明」兩欄，舊表自動補欄位。
 *
 * ============================================================
 * 3.4 管理台大改版
 * ============================================================
 * [新] 編輯面板取代瀏覽器的 prompt()。可以改內容（多行）、改期限、
 *      切換待辦、看到來源文件與附件，右側滑出，不遮擋清單。
 * [新] 勾選多筆一次處理：完成、轉待辦、轉筆記、刪除。
 *      有全選、跨篩選保留選取，動作前會顯示確認與筆數。
 * [新] 介面重做：品牌色系、類型自動配色、狀態色票、
 *      統計卡可點擊篩選、載入骨架、空狀態提示。
 * [改] 穩定性：
 *      ・所有互動改用事件委派，不再用行內 onclick 組字串
 *        （組字串就要處理引號轉義，3.3 就是死在轉義上）
 *      ・同時只允許一個寫入動作，避免連點造成重複寫入
 *      ・網路瞬斷自動重試一次
 *      ・動作後只重繪清單與統計，不整頁重載，捲動位置不跳
 *      ・篩選條件記在瀏覽器，重新整理不會被清空
 *
 * ============================================================
 * 3.3.1 管理台登入沒反應 + 自訂密碼
 * ============================================================
 * [修] 3.3 的登入鍵完全沒反應。原因在頁面是用「樣板字面值」包起來的，
 *      JavaScript 會先把裡面的 \\/ 、\\s 這些反斜線當成轉義字元吃掉，
 *      於是 linkify 的正則從 [^\\s<] 變成 [^s<]、// 變成註解符號，
 *      整個 <script> 區塊變成語法錯誤 → 頁面上所有函式都不存在，
 *      按鈕當然按了沒事，而且不會跳任何錯誤訊息，最難查。
 *      改用 String.raw 保留原文，反斜線不再被吃掉。
 * [修] 頁面現在會攔截 JavaScript 錯誤並顯示在畫面上，
 *      不會再有「按了沒反應也不知道為什麼」的情況。
 * [新] 管理台可設定自己的密碼，不必沿用 LINE 的 PIN：
 *      在檔案上方填 MY_UI_PASSWORD，執行 setUiPassword()。
 *      密碼以 SHA-256 加鹽儲存，屬性裡看不到原文；
 *      改密碼會讓所有已登入的裝置立刻失效。
 *      執行 clearUiPassword() 可改回使用 OWNER_PIN。
 *
 * ============================================================
 * 3.3 網頁管理台 + 待辦誤判修正
 * ============================================================
 * 兩個問題其實是同一個：LINE 是很好的「輸入」介面，卻是很糟的
 * 「管理」介面；而輸入太寬鬆，管理就會被雜訊淹沒。
 *
 * [修] /未完成 不再什麼都收。舊版只要不是行事曆就一律標成待辦，
 *      於是網址、電話、人名清單、貼上的長段文字全部變成「未完成」。
 *      現在改成要有任務語意才列入待辦：
 *        ・純網址、純號碼、問句、80 字以上的貼上內容 → 筆記
 *        ・出現「要／記得／處理／繳交／聯絡／核銷…」等語意 → 待辦
 *        ・寫了期限（截止／期限／前完成）→ 待辦
 *      判斷難免有例外，所以每筆寫入後都給一顆按鈕可以立刻改判。
 * [新] /清理　把現有待辦裡看起來只是筆記的項目找出來，
 *      確認後一次轉為筆記。舊資料不用手動一筆筆點。
 * [新] 網頁管理台。用瀏覽器打開部署網址加上 ?app=1：
 *        ・PIN 登入（沿用 OWNER_PIN），六小時免登入
 *        ・搜尋、依類型／狀態／日期篩選、統計卡
 *        ・新增（走同一套解析器，會自動建行事曆）
 *        ・完成／還原、待辦與筆記互轉、編輯內容、刪除
 *        ・一鍵開啟對應的 Docs 段落與歸檔檔案
 *      刪除會同時處理 Docs 段落、行事曆事件與索引列，不留孤兒資料。
 *
 * ============================================================
 * 3.2.5 帶參數的函式沒辦法在編輯器直接執行
 * ============================================================
 * Apps Script 的執行按鈕不能傳參數，syncLineWebhook('網址') 這種寫法
 * 只能在編輯器裡改程式碼才跑得動。所以改成填空題：
 *
 * [新] 把 /exec 網址填進檔案最上方的 MY_EXEC_URL，
 *      然後在函式清單選 setWebhook 按執行即可。
 *
 * ============================================================
 * 3.2.4 /dev 測試網址的防呆（這是本系統自己害的）
 * ============================================================
 * ScriptApp.getService().getUrl() 在編輯器裡執行時，回傳的是
 * 結尾 /dev 的「測試部署」網址，而不是結尾 /exec 的正式網址。
 * 舊版的 setupSystem() 與 whereAmI() 直接把它印出來叫人貼到 LINE，
 * 於是一路貼了個 LINE 根本打不進來的網址：
 *   ・/dev 需要 Google 帳號登入才能存取，LINE 沒有登入態，
 *     請求連 doPost 都到不了，執行記錄裡當然一片空白。
 *   ・/dev 永遠跑最新程式碼，所以「已部署版本」也永遠看起來沒問題。
 *
 * [修] webhookUrl_() 偵測到 /dev 會明確標示不能用於 LINE，
 *      setupSystem()、whereAmI() 一併加上警語與正確取得步驟。
 * [修] syncLineWebhook() 拒絕把 /dev 網址寫進 LINE；
 *      可直接帶入正式網址：syncLineWebhook('https://.../exec')，
 *      有設 WEBHOOK_KEY 時會自動補上 ?k=。
 * [新] lineWebhookStatus() 會判斷 LINE 手上那串是不是 /dev。
 *
 * ============================================================
 * 3.2.3 直接查、直接改 LINE 那一端的 Webhook 網址
 * ============================================================
 * 「編輯器一切正常，LINE 卻回舊版的訊息」只剩一種可能：
 * LINE 手上的 Webhook 網址指向的是另一個（舊的）部署。
 * 一個專案可以有很多個部署，每個都有自己的 /exec 網址，
 * 更新其中一個不會動到另一個——這是最難自己看出來的一種。
 *
 * [新] lineWebhookStatus()：直接問 LINE「你手上的網址是哪一個」，
 *      並列出本專案目前的網址供比對。
 * [新] syncLineWebhook()：把 LINE 的 Webhook 網址改成本專案的網址，
 *      改完立刻用 LINE 官方的連線測試驗證，不必在後台複製貼上。
 * [新] checkWebhookUrl('網址')：把 LINE 後台那串網址貼進來，
 *      直接告訴你「那個網址上跑的是哪一版」。
 *
 * ============================================================
 * 3.2.2 把「編輯器可以、LINE 不行」這件事分開驗證
 * ============================================================
 * 編輯器執行的一定是最新程式碼，LINE 打進來的卻是「已部署的那一版」。
 * 兩者版本不同時，症狀就是：診斷全過、資料夾也建好了，
 * 但實際傳檔案還是什麼都沒發生。這版把兩邊拆開驗證：
 *
 * [新] checkDeployment()：程式自己去打自己的網頁應用程式網址，
 *      把「已部署版本」與「編輯器版本」列出來比對。
 *      兩者不同 = 部署沒更新，這是最常見的原因。
 * [新] selfTestArchive()：不經過 LINE，直接跑一次完整歸檔流程
 *      （分類 → 建資料夾 → 寫檔 → 寫 Docs → 寫索引），
 *      並把檔案留在雲端硬碟裡。
 *      這支成功而 LINE 傳檔失敗 → 問題一定在 LINE 到 doPost 之間。
 * [新] doPost 收到任何事件都會先寫一行執行記錄（[webhook] 開頭），
 *      列出事件型態。傳檔案時若「執行項目」完全沒有這行，
 *      代表請求根本沒進到 Apps Script。
 *
 * ============================================================
 * 3.2.1 檔案存不進雲端硬碟時的自我診斷
 * ============================================================
 * 「傳了檔案但雲端硬碟沒東西」可能斷在六個不同的地方，
 * 光看 LINE 的回覆分不出來，所以這版把每一段都變成可單獨檢查的：
 *
 * [新] diagnoseArchive()：在編輯器執行，逐段測試整條鏈路——
 *      部署版本 → LINE 權杖 → 綁定 → 資料夾 → 實際寫檔 → 讀回 → 刪除，
 *      斷在哪一段就印哪一段，並附上該段的處理建議。
 * [新] setArchiveFolderByUrl('資料夾網址')：直接指定要存去哪個資料夾，
 *      會順便測試寫入權限，成功才寫入 ARCHIVE_FOLDER_ID。
 * [新] doGet 會印出版本與部署時間。用瀏覽器打開 Webhook 網址，
 *      若顯示的版本不是你剛貼上的那個 → 部署沒更新，這是最常見的原因：
 *      舊版程式碼遇到非文字訊息只會回「目前只接受文字訊息」，
 *      檔案根本沒有進到歸檔流程，雲端硬碟當然是空的。
 * [新] 歸檔流程每一步都寫執行記錄（[archive] 開頭），
 *      在「執行項目」裡可以看到卡在下載、建檔、辨識還是寫 Docs。
 * [改] 非預期錯誤不再只丟一句失敗，會回報卡在哪一個步驟。
 *
 * ============================================================
 * 3.2 公務分類 + 公文自動抽日期 + 提醒時間修正
 * ============================================================
 * [新] 歸檔自動分類。檔名先判一次；圖片／PDF 再用 OCR 內文複判，
 *      分類變了就自動搬資料夾。存成
 *        LINE 檔案存檔 / 研習通知 / 2026-08 / 20260815-143012_通知.pdf
 *      分類詞可用 /加類 自訂，/分類 可列出目前規則。
 * [新] 公文、通知的 PDF 或照片存檔後，自動抓出「活動日期」，
 *      跳出按鈕問要不要建行事曆——按一下就好，不用重打。
 *      ・會避開「發文日期／來文日期／檔號」等公文本身的日期
 *      ・優先採用帶「時間、地點、召開、辦理、訂於」等提示詞的那一行
 *      ・主旨自動當成事件名稱；地點自動帶入
 *      ・只提議、不自動建立，誤判不會污染行事曆
 * [修] 時間解析支援「時」。公文一律寫「上午9時至下午4時」而不是「9點」，
 *      舊版只認「點」，於是公文抽到日期卻抓不到時間，全部變成全天事件。
 * [修] 全天事件的提醒不再落在半夜。
 *      全天事件的基準點是「當天 00:00」，舊的 240 分鐘會變成前一晚 20:00，
 *      而 Google 日曆規定提醒一定要早於事件開始，
 *      所以「當天 07:30」在 API 上根本設不出來。現在改成：
 *        ・Google 日曆：前一天 07:30 先預告（ALLDAY_REMIND_CLOCK=07:30）
 *        ・LINE 早晨推播：當天 07:30 再報一次今日行程
 *      要改時間只要調 ALLDAY_REMIND_CLOCK 與 MORNING_BRIEF_HOUR。
 *
 * ============================================================
 * 3.1 檔案自動歸檔 + 非文字訊息全面支援
 * ============================================================
 * 舊版遇到圖片、影片、語音、PDF 一律回「目前只接受文字訊息」，
 * 等於把 LINE 最常用的傳檔情境擋在門外。3.1 全部接住：
 *
 * [新] 傳任何檔案 → 自動存進雲端硬碟 → 回連結 → 同步寫入 Docs 與索引
 *      ・資料夾自動分層：LINE 檔案存檔 / 2026 / 2026-08（可改 ARCHIVE.LAYOUT）
 *      ・檔名自動加時間戳：20260815-143012_公文.pdf，永遠不會互相覆蓋
 *      ・file 訊息保留原始檔名；image/video/audio 依 MIME 自動補副檔名
 *      ・下載失敗自動重試（影片剛傳完常在轉檔中，LINE 會先回 202/404）
 *      ・檔案大小雙重把關（LINE 宣告值 + 實際下載值），超過上限先擋下不浪費配額
 * [新] 存檔後的快速按鈕：✏️改檔名、🔍文字辨識、📁開資料夾、🗑️刪除
 * [新] 圖片／PDF 可做 OCR 文字辨識（Drive 轉檔，免額外 API 金鑰），
 *      辨識結果可一鍵存成筆記。
 * [新] 位置訊息會記成「地點紀錄」，附 Google 地圖連結。
 * [新] 貼圖不再觸發錯誤回覆；unfollow / join / leave 等事件靜默略過
 *      （這些事件沒有 replyToken，舊版會多送一次注定失敗的 API 呼叫）。
 * [新] 指令 /檔案（開資料夾、列最近歸檔、關鍵字找檔）、/辨識、/檔名、/取消
 * [改] 撤銷（/撤銷）現在會把歸檔的檔案一併移到垃圾桶，不會留下孤兒檔。
 * [改] 索引試算表新增「附件連結」欄；舊試算表會自動補欄位，不必重建。
 * [改] 綁定檢查抽成 authorizeEvent_()，文字／檔案／postback 三條路徑
 *      共用同一份判斷，不會再有某條路徑漏檢查。
 * [改] 事件路由抽成 routeEvent_()，新增訊息型態只要改一處。
 *
 * ============================================================
 * 3.0 日期解析重構
 * ============================================================
 * 原本是一條寫死順序的 if 鏈，每加一種寫法就更難確定會不會踩到別條。
 * 改成有序的 DATE_RULES 規則表：順序即優先級、每條可獨立測試，
 * 解析失敗的提示訊息也直接從規則表產生，不會與實作各說各話。
 * 執行 listDateFormats() 可列出完整支援清單。
 *
 * 新支援的寫法：
 *   純數字   1150919、20260919
 *   括號星期 9/19(五)、9/19（週六）
 *   日期範圍 9/19-9/21、9/19~21（取開始日）
 *   中文數字 九月十九日、八月二十號
 *   數字星期 週3、星期5、週末
 *   相對天數 3天後、三天後、兩週後、1個月後
 *   相對月份 下個月5號、月底、下個月底、月初
 *   旬       9月上旬、9月中旬、9月下旬、9月底
 *   單獨日   19號、20日（本月，已過則下月）
 *   口語縮寫 明早、明晚、今晚、今早（展開成「明天早上」再解析）
 *
 * 誤判防護（皆有迴歸測試）：
 *   192.168.1.1 不會被切出「168.1.1」當成民國 168 年
 *   第19號公文、第二屆、第3條 由 maskDecoys_ 遮蔽
 *   19號教室、507會議室 不會被當成日期
 *   括號內的星期視為註記，不會蓋掉前面的真日期
 *
 * ============================================================
 * 2.9 修正（公文日期格式）
 * ============================================================
 * [修] 民國年配上點／斜線／橫線的寫法解析不出來。
 *      「115.09.19新北市政府507會議室辦理…」整段回報「找不到日期」。
 *      舊版只認「115年9月19日」與四位西元年，
 *      但公文與通知的日期幾乎都寫成 115.09.19。
 *      邊界排除數字與 . / - ，避免 192.168.1.1 被切出「168.1.1」誤判。
 * [修] 全形數字無法解析。從公文或 Word 複製的文字常帶全形
 *      （８月２０日、２０２６／０９／１９），JS 的 \\d 只認半形。
 *      新增 normalizeWidth_()，全形轉半形是 1:1 對應、長度不變，
 *      因此標題仍會保留使用者原本的全形寫法。
 * [修] 建立行事曆失敗時，改為列出所有看得懂的日期寫法，
 *      不再只丟一個「明天上午8點主任會議」的範例。
 *
 * ============================================================
 * 2.8 新增（LINE 功能選單 Rich Menu）
 * ============================================================
 * 手機上點圖示就送出指令，不用打字。
 * 按鈕用 message 型別，等同使用者親手輸入，完全沿用既有指令路由。
 *
 * 相關函式：
 *   previewRichMenu()   不碰 LINE，先檢查版面與指令對應
 *   setupRichMenu()     建立並啟用（可重複執行，會清掉舊的）
 *   richMenuStatus()    查看目前狀態與圖片
 *   removeRichMenu()    移除選單
 *
 * 選填 Script Property：
 * - RICHMENU_IMAGE_FILE_ID  選單圖片在雲端硬碟的檔案 ID
 *   （未設定時會找名為 richmenu.png 的檔案）
 *
 * 圖片用「功能選單產生器」（richmenu.html）製作，
 * 規格：PNG／JPEG、2500×1686 或 2500×843、1 MB 以內。
 *
 * ============================================================
 * 2.7 新增（索引試算表 + 使用體驗）
 * ============================================================
 * 【儲存架構】Docs 保持不變，仍是人類可讀的正本；
 *   新增「索引試算表」作為機器可讀的查詢層，兩邊雙寫。
 *   ・待辦／搜尋／月統計改為讀試算表，一次 getValues() 取代開 3 份 Docs 掃描
 *   ・試算表寫入失敗只記警告，不影響 Docs（Docs 是真相來源）
 *   ・試算表被刪除也不會壞掉，會自動退回舊的 Docs 掃描路徑
 *   ・舊資料執行一次 rebuildIndexFromDocs() 即可補建
 *   ・撤銷會同步刪索引列，完成會同步更新狀態
 *
 * [新] 待辦到期日：一般筆記句中的日期自動成為期限
 *      （「週五前完成核銷」→ 期限星期五），逾期標紅並優先排序。
 * [新] 寫入後的快速動作按鈕：撤銷／改建行事曆／改成純筆記，不必再打指令。
 * [新] 晚間回顧推播 eveningReview()（預設 17:00）：未完成 + 明日行程。
 * [新] 早晨推播與晚間回顧會略過台灣國定假日（補班日仍推播）。
 * [新] /索引 指令，直接取得試算表網址。
 * [新] 月統計加上「待辦完成率」與「其中由本系統建立 N 筆」，
 *      避免手動建立與訂閱來的活動混進會議時數。
 * [新] /搜尋 結果顯示類型與完成狀態（☐／☑）。
 *
 * 新增選填 Script Properties：
 * - INDEX_SHEET_ID       索引試算表 ID（系統自動建立，不需手動設定）
 * - EVENING_REVIEW_HOUR  晚間回顧時間，預設 17
 * - ALLDAY_REMINDER_MINUTES  全天事件提醒，預設 240（前一天 20:00）
 *
 * ⚠️ 2.7 需要新增 OAuth 範圍：https://www.googleapis.com/auth/spreadsheets
 *    請一併更新 appsscript.json，並重新授權一次。
 *
 * ============================================================
 * 2.6 變更（P0 嚴重修正 + P1 正確性／體驗）
 * ============================================================
 * [P0-1] 撤銷位置錯誤：同一天第 2 筆之後，內容插在 header+2，
 *        原本一律從 header 刪起，會刪掉「日期標題＋水平線」而留下要刪的內容。
 *        改為依 createdDateHeader 計算 removeIndex，topDate 固定看 header 位置。
 * [P0-1b] 新增撤銷指紋防呆 undoFingerprintCheck_()，
 *        文件被手動編輯過就中止撤銷，不再盲刪。
 * [P0-2] UNDO_STACK 撐爆 Script Property 9KB 上限：
 *        原文截斷為 150 字，writeUndoStack_() 加寫入失敗降級。
 *        DOC_REGISTRY 加上只保留最近 36 個月的修剪。
 * [P0-3] 去重標記改為兩段式（processing / done），
 *        執行中途硬中斷時 LINE 重送不再被誤判為重複而丟棄。
 * [P0-4] Docs 寫入失敗時回滾已建立的行事曆事件，不再留下無法撤銷的孤兒事件。
 * [P0-5] 「明天9點到校服務」被削成「校服務」。真正成因不是標題清理正則，
 *        而是 removeSpans_() 逐一 slice 時無法處理「重疊的 span」：
 *        時間正則的前導 \s* 會把已遮蔽的日期區段吃進來，
 *        產生 {0,4} 與日期的 {0,2} 重疊，後套用者落在已位移的字串上而多刪一字。
 *        修法有三層：
 *          (a) removeSpans_() 改用保留遮罩，天生對重疊免疫；
 *          (b) 新增 trimSpan_()，把 span 兩端空白修掉，從源頭避免重疊；
 *          (c) 標題清理 ^(前|以前|要|去|到|有) 加上必須後接空白的邊界要求。
 *        受害詞例：到校、到職、有氧、要事、去年。
 *
 * [P1-1] 全天事件提醒改用 ALLDAY_REMINDER_MINUTES（預設 240 = 前一天 20:00），
 *        原本 30 分鐘會在前一晚 23:30 跳通知。
 * [P1-2] 帶參數的指令（完成／搜尋／改／加詞）改為只認斜線版本，
 *        避免「完成：核銷」「改 開會時間」這類筆記被誤攔成指令。
 * [P1-3] /搜尋 分開統計「總命中數」與「顯示筆數」，不再永遠顯示 10 筆。
 * [P1-4] 日期解析加月日範圍預檢，「14-16點」不再誤判成 14 月而回報「日期不存在」。
 * [P1-5] 完成後同步更新待辦快取，重複點同一顆按鈕會回「已完成過」而非「找不到」。
 * [P1-6] 地點解析的 @ 不再吃掉 email（abc@school.edu）。
 * [P1-7] /今日 對跨日延續中的事件顯示「延續中」，不再顯示昨天的時刻。
 * [P1-8] undoLastEntry_() 改回傳 {ok, message}，移除字串比對耦合。
 * [P1-9] 版本號與變更說明同步（原檔頭停在 2.2，APP.VERSION 卻是 2.5）。
 *
 * ============================================================
 * 2.1 → 2.2 的既有變更（保留供對照）
 * ============================================================
 * [修] 「下週三／下星期三／下禮拜三／下下週一」不再被誤判為本週
 * [修] 「8點20分提醒我」不再把 20 分誤當成「提前 20 分鐘提醒」
 * [修] 「上午11點到1點」不再變成隔天凌晨
 * [修] HEADER_CHILDREN 改為自動偵測，不再寫死 3
 * [修] 「記得」只在句首移除，句中語意保留
 * [修] 「5/10下午2點」黏著中文也能解析
 * [修] 「第3點」不再被當成 3:00
 * [修] 支援 凌晨／清晨／傍晚／夜間／半夜
 * [修] 標題移除改用「位置遮罩」，不再字串誤刪
 * [新] Quick Reply 改用 postback，聊天室不再出現 __確認行事曆__
 * [新] 每日早晨自動推播今日行程
 * [新] 多層撤銷（預設 5 筆）
 * [新] /本週 /下週 /本月 /未完成 /完成 /搜尋 /改 /加詞 /詞庫 /文件 YYYYMM
 * [新] 待辦追蹤：一般筆記自動標記 ☐，完成後劃線改為 ☑
 * [新] 關鍵字表可用 Script Property 或 /加詞 自行維護
 * [新] Docs 按月分檔，避免長期變慢（APP.MONTHLY_DOC 可關閉）
 * [新] Webhook 金鑰驗證（預設關閉，enableWebhookKey() 才啟用）、綁定防暴力破解
 * [新] 地點解析（地點：XXX 或 @XXX）
 * [新] runParserTests() 內建解析器自我測試、whereAmI() 一鍵健檢
 *
 * 必填 Script Properties：
 * - LINE_CHANNEL_ACCESS_TOKEN
 * - OWNER_PIN
 *
 * 選填 Script Properties：
 * - WEBHOOK_KEY              執行 enableWebhookKey() 才會產生（預設不啟用）
 * - GOOGLE_CALENDAR_ID       未設定則使用預設行事曆
 * - JOURNAL_DOC_TITLE        預設「我的每日行事與工作筆記」
 * - JOURNAL_FOLDER_ID        指定文件存放資料夾
 * - EVENT_REMINDER_MINUTES   行事曆預設提前提醒，預設 30
 * - TODO_REMINDER_MINUTES    提醒事項預設提前提醒，預設 10
 * - EVENT_WORDS / WORK_WORDS 自訂關鍵字（逗號分隔，或用 /加詞）
 * - MORNING_BRIEF_HOUR       早晨推播時間，預設 7
 * - ARCHIVE_FOLDER_ID        [3.1] 檔案歸檔資料夾（留空會自動建立並回填）
 * - ALLDAY_REMIND_CLOCK      [3.2] 全天事件提醒時刻，預設 07:30（＝前一天早上先預告）
 * - ARCHIVE_CATEGORY_WORDS   [3.2] 自訂歸檔分類詞（JSON，或用 /加類 增加）
 */

/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
 * 填空區：把「管理部署作業」複製到的網址貼在下面兩個引號中間，
 * 存檔後，在上方函式清單選「setWebhook」按執行。
 *
 * 網址結尾必須是 /exec。結尾 /dev 的是測試網址，LINE 打不進來。
 * 例：https://script.google.com/macros/s/AKfycb....../exec
 * ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */
const MY_EXEC_URL = '';

/* ★★★ 網頁管理台的密碼。填好後執行 setUiPassword() 寫入，
 *     寫入成功再把這裡清空即可（密碼會以雜湊形式保存）。
 *     留空 = 沿用 LINE 綁定用的 OWNER_PIN。 ★★★ */
const MY_UI_PASSWORD = '';

/**
 * [3.2.5 新] 一鍵把上面的網址寫進 LINE。
 * Apps Script 的執行鈕不能傳參數，所以用填空的方式代替。
 */
function setWebhook() {
  const url = String(MY_EXEC_URL || '').trim();

  if (!url) {
    const msg = [
      '請先填 MY_EXEC_URL。',
      '',
      '1. 部署 →「管理部署作業」→ 選「網頁應用程式」那一筆',
      '2. 複製網址（結尾 /exec）',
      '3. 貼到本檔案最上方的 MY_EXEC_URL = \'這裡\'',
      '4. 存檔（Ctrl+S）後，函式清單選 setWebhook 再按執行'
    ].join('\n');
    console.log(msg);
    return msg;
  }

  return syncLineWebhook(url);
}

const APP = {
  VERSION: '4.0',
  TZ: 'Asia/Taipei',
  DOC_TITLE: '我的每日行事與工作筆記',
  DEFAULT_EVENT_MINUTES: 60,
  DEFAULT_EVENT_REMINDER_MINUTES: 30,
  DEFAULT_TODO_REMINDER_MINUTES: 10,
  // [3.2 改] 全天事件的提醒基準是「當天 00:00」，而且提醒一定要早於起點，
  //          所以「當天 07:30 通知」在 Google 日曆是設不出來的。
  //          改用「幾點通知」的寫法：ALLDAY_REMIND_CLOCK = '07:30'
  //          → 1440 - 450 = 990 分鐘前 = 前一天 07:30，不會再掉到半夜。
  //          當天早上的提醒由 LINE 早晨推播（MORNING_HOUR + nearMinute(30)）負責。
  ALLDAY_REMIND_CLOCK: '07:30',
  DEFAULT_ALLDAY_REMINDER_MINUTES: 990,
  EVENT_CACHE_SECONDS: 21600,
  EVENT_PROCESSING_SECONDS: 90,   // [2.6 新] 處理中標記的存活時間
  FALLBACK_HEADER_CHILDREN: 3,
  MONTHLY_DOC: true,          // 改成 false 就永遠只用一份文件
  UNDO_STACK_SIZE: 5,
  UNDO_TEXT_MAX: 150,         // [2.6 新] 撤銷堆疊存的原文長度上限
  REGISTRY_MAX_KEYS: 36,      // [2.6 新] 文件註冊表最多保留幾個月
  PENDING_TTL_SECONDS: 600,
  LOCK_WAIT_MS: 10000,
  MORNING_HOUR: 7,
  EVENING_HOUR: 17,           // [2.7 新] 晚間回顧時間
  MORNING_SKIP_WEEKEND: true,
  SKIP_HOLIDAY: true,         // [2.7 新] 國定假日不推播
  SEARCH_MAX_HITS: 10,
  SEARCH_MAX_DOCS: 6,
  TODO_MAX_ITEMS: 15,
  TODO_MAX_DOCS: 3,
  TODO_QUICK_BUTTONS: 5
};

const DEFAULT_EVENT_WORDS = [
  '會議', '會報', '研習', '面試', '課發會', '主任會議', '行政會議', '校務會議',
  '教評會', '領域會議', '學年會議', '聚餐', '回診', '看診', '門診', '約診',
  '活動', '典禮', '講座', '訪視', '評選', '開會', '晤談', '會談', '電話',
  '通話', '接送', '出發', '集合', '報到', '上課', '考試', '觀課', '議課',
  '家長會', '座談', '說明會', '運動會', '校慶', '督學', '視導', '演練'
].join(',');

const DEFAULT_WORK_WORDS = [
  '完成', '整理', '準備', '製作', '撰寫', '繳交', '交件', '資料', '簡報',
  '處理', '確認', '聯絡', '追蹤', '回覆', '填寫', '彙整', '修改', '檢查',
  '送出', '申請', '核章', '上傳', '列印', '統計', '盤點', '核銷'
].join(',');

const PAST_WORDS_RE = /(已經|已完成|完成了|處理完|談了|討論了|確認了|聯絡了|剛剛|剛才|昨天|前天|上週|上星期)/;
const REMINDER_INTENT_RE = /(提醒我|提醒一下|記得|別忘了|不要忘記|勿忘)/;
const DATE_HEADING_RE = /^\d{4}年\d{1,2}月\d{1,2}日 星期[一二三四五六日]$/;

// 待辦標記：寫入 Docs 時，工作型筆記會加上 ☐，完成後改為 ☑
const TASK_OPEN = '☐';
const TASK_DONE = '☑';
const TASK_DOING = '◐';        // [3.5] 進行中：仍算未完成，但已經動工
const TODO_CACHE_KEY = 'last_todo_list';

// [2.7 新] 寫進行事曆事件描述的標記，用來區分「本系統建立」與其他來源
const EVENT_TAG = '由 LINE 記事助理建立';

// [2.7 新] Google 內建的台灣假日行事曆
const TW_HOLIDAY_CALENDAR_ID = 'zh.taiwan#holiday@group.v.calendar.google.com';

/* ============================================================
 * 一、Webhook 入口
 * ============================================================ */

/**
 * [3.2.1 改] 用瀏覽器打開 Webhook 網址就能確認「跑的是哪一版」。
 * 部署沒更新是「檔案傳不進雲端硬碟」最常見的原因：
 * 舊版遇到非文字訊息只會回「目前只接受文字訊息」，根本不會進歸檔流程。
 */
function doGet(e) {
  const params = (e && e.parameter) || {};

  // [3.3] ?app=1 → 網頁管理台；沒帶參數維持純文字狀態頁，
  //       checkDeployment() 靠這個文字判斷版本，不能改成 HTML。
  if (params.app === '1' || params.page === 'app') {
    return renderNoteApp_();
  }

  const props = PropertiesService.getScriptProperties();
  const text = [
    'LINE → Google Docs 每日行事與工作筆記 ' + APP.VERSION + ' 運作中',
    '檔案歸檔：' + (ARCHIVE.ENABLED ? '啟用（' + ARCHIVE.LAYOUT + '）' : '關閉'),
    '歸檔資料夾ID：' + (props.getProperty('ARCHIVE_FOLDER_ID') || '（尚未建立）'),
    '現在時間：' + formatChineseDateTime_(new Date()),
    '',
    '※ 若這裡顯示的版本不是你剛貼上的版本，代表部署沒有更新：',
    '　 部署 →「管理部署作業」→ 編輯（鉛筆）→ 版本選「新版本」→ 部署。',
    '',
    '網頁管理台：在這個網址後面加上 ?app=1'
  ].join('\n');

  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const ok = ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);

  try {
    // Apps Script 取不到 HTTP Header，無法驗 X-Line-Signature，
    // 改以 URL 參數金鑰擋掉外部偽造請求。
    // 【重要】此功能預設「關閉」。只有你主動執行 enableWebhookKey() 才會啟用，
    //         避免忘了更新 LINE 的 Webhook URL 而整個系統靜默失效。
    const expectedKey = PropertiesService.getScriptProperties().getProperty('WEBHOOK_KEY');
    if (expectedKey) {
      const gotKey = e && e.parameter ? e.parameter.k : '';
      if (gotKey !== expectedKey) {
        console.error(
          '❌ Webhook 金鑰不符，請求已被擋下。\n' +
          '　　收到的 k：「' + gotKey + '」\n' +
          '　　應該要是：「' + expectedKey + '」\n' +
          '　　請把 LINE 的 Webhook URL 更新為 whereAmI() 印出的網址，\n' +
          '　　或執行 disableWebhookKey() 先關閉這道防護。'
        );
        return ok;
      }
    }

    const payload = JSON.parse(
      e && e.postData && e.postData.contents ? e.postData.contents : '{"events":[]}'
    );

    const incoming = payload.events || [];

    // [3.2.2 新] 先留下「請求確實有進來」的證據。
    // 傳檔案時若執行記錄裡沒有這一行，代表問題在 LINE 到 doPost 之間
    //（Webhook 未啟用、網址過期、金鑰不符），跟歸檔程式無關。
    console.log('[webhook] 收到 ' + incoming.length + ' 個事件：' +
      (incoming.map(function (ev) {
        return ev ? ev.type + (ev.message ? '/' + ev.message.type : '') : '?';
      }).join('、') || '（空，通常是 LINE 的連線測試）'));

    incoming.forEach(function (event) {
      if (!event) return;

      // [2.6 修] 原本在「處理前」就寫入永久去重標記，一旦執行中途硬中斷
      //          （逾時、配額用盡），LINE 依規範重送時會被當成重複直接丟棄，
      //          使用者永遠收不到回應也沒有紀錄。
      //          改為兩段式：先標記 processing（短 TTL），處理結束才升級為 done。
      if (!markEventProcessing_(event.webhookEventId)) return;

      try {
        routeEvent_(event);
        markEventDone_(event.webhookEventId);
      } catch (err) {
        console.error(err && err.stack ? err.stack : err);
        safeReply_(event && event.replyToken, '⚠️ 處理失敗：' + getErrorMessage_(err));
        // 已經回覆過使用者且本函式回傳 200，不需要 LINE 再重送一次
        markEventDone_(event.webhookEventId);
      }
    });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
  }

  return ok;
}

/* ============================================================
 * 二、訊息路由
 * ============================================================ */

/**
 * [3.1 新] 事件路由集中在這裡。
 * 舊版把判斷寫在 doPost 的 try 區塊裡，每加一種訊息型態就要動主流程；
 * 而且「不是 text 就回錯誤」會連貼圖、系統事件都一起誤傷。
 */
function routeEvent_(event) {
  if (event.type === 'follow') {
    safeReply_(event.replyToken, '👋 歡迎使用 LINE 記事助理\n\n請先輸入：綁定 你的PIN');
    return;
  }

  // 這些事件不帶 replyToken（或不需回應），直接略過，不要浪費一次 API 呼叫
  if (event.type === 'unfollow' || event.type === 'join' || event.type === 'leave' ||
      event.type === 'memberJoined' || event.type === 'memberLeft' ||
      event.type === 'accountLink' || event.type === 'videoPlayComplete') {
    return;
  }

  if (event.type === 'postback') {
    handlePostback_(event);
    return;
  }

  if (event.type !== 'message' || !event.message) return;

  const type = event.message.type;
  if (type === 'text') { handleText_(event); return; }
  if (MEDIA_KIND[type]) { handleMedia_(event); return; }
  if (type === 'location') { handleLocation_(event); return; }
  if (type === 'sticker') { return; }        // 貼圖不回應，避免互相洗版

  safeReply_(event.replyToken, '這個訊息型態（' + type + '）目前不支援。');
}

/**
 * [3.1 新] 綁定檢查。文字、檔案、postback 共用同一份判斷。
 * 回傳 true 才可以繼續處理。
 */
function authorizeEvent_(event) {
  const props = PropertiesService.getScriptProperties();
  const userId = event.source && event.source.userId ? event.source.userId : '';
  const ownerId = props.getProperty('OWNER_USER_ID') || '';

  if (!ownerId) {
    safeReply_(event.replyToken, '尚未綁定。請輸入：綁定 你的PIN');
    return false;
  }
  if (!userId || userId !== ownerId) {
    console.warn('非綁定使用者的訊息，已忽略。userId=' + userId);
    return false;
  }
  return true;
}

function handleText_(event) {
  const text = String(event.message.text || '').trim();
  if (!text) return;

  const userId = event.source && event.source.userId ? event.source.userId : '';

  const bindMatch = text.match(/^綁定\s*[:：]?\s*(.+)$/);
  if (bindMatch) {
    bindOwner_(event.replyToken, userId, bindMatch[1].trim());
    return;
  }

  if (!authorizeEvent_(event)) return;

  // [3.1 新] 若正在等使用者輸入（例如剛按下「改檔名」），先交給待命動作處理
  if (consumePendingAction_(event.replyToken, text)) return;

  if (handleCommand_(event.replyToken, text)) return;

  const receivedAt = new Date();
  const decision = classifyInput_(text, receivedAt);

  if (decision.action === 'ask') {
    replyWithDecisionButtons_(event.replyToken, text, receivedAt);
    return;
  }

  processClassifiedInput_(event.replyToken, text, receivedAt, decision);
}

function handleCommand_(replyToken, text) {
  if (/^(\/說明|說明|help)$/i.test(text)) {
    safeReply_(replyToken, getHelpText_());
    return true;
  }
  if (/^(\/狀態|狀態)$/i.test(text)) {
    safeReply_(replyToken, buildStatusText_());
    return true;
  }
  if (/^(\/今日|今日)$/i.test(text)) {
    safeReply_(replyToken, buildDayScheduleText_(new Date(), '今日'));
    return true;
  }
  if (/^(\/明日|明日)$/i.test(text)) {
    safeReply_(replyToken, buildDayScheduleText_(addDays_(new Date(), 1), '明日'));
    return true;
  }
  if (/^(\/本週|本週)$/i.test(text)) {
    safeReply_(replyToken, buildWeekScheduleText_(0, '本週'));
    return true;
  }
  if (/^(\/下週|下週)$/i.test(text)) {
    safeReply_(replyToken, buildWeekScheduleText_(1, '下週'));
    return true;
  }
  if (/^(\/撤銷|撤銷)$/i.test(text)) {
    // [2.6 修] undoLastEntry_() 改回傳 {ok, message}
    safeReply_(replyToken, undoLastEntry_().message);
    return true;
  }

  if (/^(\/未完成|未完成|\/待辦|待辦)$/i.test(text)) {
    replyUnfinished_(replyToken);
    return true;
  }

  if (/^(\/詞庫|詞庫)$/i.test(text)) {
    safeReply_(replyToken, buildWordListText_());
    return true;
  }

  // [3.1 新] 檔案歸檔相關指令。
  // 無參數的完整比對可以免斜線；帶關鍵字的一律要斜線，
  // 否則「檔案要在週五前繳交」這種筆記會被當成搜尋指令吃掉。
  if (/^(\/檔案|檔案|\/歸檔|歸檔)$/.test(text)) {
    safeReply_(replyToken, buildArchiveText_(''));
    return true;
  }

  // [3.5] 標為進行中
  // 用自己的變數，不要借用後面才宣告的 m——
  // JS 的 let 有暫時性死區，在宣告前碰它會整個函式拋錯，
  // 連帶讓後面所有指令一起壞掉（3.5 就是這樣讓 /索引 也失效）。
  const doingMatch = text.match(/^\/進行\s*[:：]?\s*(.+)$/);
  if (doingMatch) {
    safeReply_(replyToken, startTask_(doingMatch[1].trim()));
    return true;
  }

  // [3.3] 清理待辦雜訊
  if (/^(\/清理|清理待辦)$/.test(text)) {
    const preview = buildCleanupPreview_();
    if (!preview.count) {
      safeReply_(replyToken, preview.text);
    } else {
      replyWithActions_(replyToken, preview.text, [
        { label: '🧹 全部轉為筆記', data: 'a=cleanup', display: '全部轉為筆記' }
      ]);
    }
    return true;
  }

  if (/^(\/管理|\/網頁|管理台)$/.test(text)) {
    safeReply_(replyToken, buildNoteAppLinkText_());
    return true;
  }

  if (/^(\/分類|分類)$/.test(text)) {
    safeReply_(replyToken, buildCategoryText_());
    return true;
  }

  if (/^(\/辨識|辨識|\/OCR|OCR)$/i.test(text)) {
    replyOcrLast_(replyToken);
    return true;
  }

  let fm = text.match(/^\/檔案\s*[:：]?\s*(.+)$/);
  if (fm) {
    safeReply_(replyToken, buildArchiveText_(fm[1].trim()));
    return true;
  }

  fm = text.match(/^\/檔名\s*[:：]?\s*(.+)$/);
  if (fm) {
    const last = readLastArchive_();
    safeReply_(replyToken, last && last.fileId
      ? renameArchivedFile_(last.fileId, fm[1].trim())
      : '目前沒有剛歸檔的檔案可以更名。');
    return true;
  }

  if (/^\/取消$/.test(text)) {
    CacheService.getScriptCache().remove(PENDING_ACTION_KEY);
    safeReply_(replyToken, '已取消目前的待命動作。');
    return true;
  }

  // [2.7 新] 索引試算表捷徑
  if (/^(\/索引|索引|\/表|試算表)$/i.test(text)) {
    const url = indexSheetUrl_();
    safeReply_(replyToken, url
      ? '📊 索引試算表\n' + url + '\n\n（可直接在試算表裡篩選、排序、做樞紐分析）'
      : '⚠️ 索引試算表尚未建立，請在 Apps Script 執行 rebuildIndexFromDocs()。');
    return true;
  }

  // 這兩個指令的參數是固定 6 位數字，完整錨定後不會誤攔筆記，保留免斜線寫法
  let m = text.match(/^(?:\/本月|本月|\/月報|月報)\s*(\d{6})?$/i);
  if (m) {
    safeReply_(replyToken, buildMonthSummaryText_(m[1] || ''));
    return true;
  }

  m = text.match(/^(?:\/文件|文件|Google文件)\s*(\d{6})?$/i);
  if (m) {
    safeReply_(replyToken, buildDocLinkText_(m[1] || ''));
    return true;
  }

  // ── [2.6 修] 以下帶自由參數的指令一律只認斜線版本 ──
  // 原本「完成：核銷」「搜尋 資料」「改 開會時間」「加詞 …」會把
  // 使用者本來想記的筆記誤攔成指令，內容直接消失。
  m = text.match(/^\/完成\s*[:：]?\s*(.+)$/);
  if (m) {
    safeReply_(replyToken, completeTask_(m[1].trim()));
    return true;
  }

  m = text.match(/^\/搜尋\s*[:：]?\s*(.+)$/);
  if (m) {
    safeReply_(replyToken, searchJournal_(m[1].trim()));
    return true;
  }

  m = text.match(/^\/改\s*[:：]?\s*(.+)$/);
  if (m) {
    amendLastEntry_(replyToken, m[1].trim());
    return true;
  }

  m = text.match(/^\/加類\s+(\S+)\s+(.+)$/);
  if (m) {
    safeReply_(replyToken, addCategoryWord_(m[1], m[2].trim()));
    return true;
  }

  m = text.match(/^\/加詞\s+(行事曆|工作)\s+(.+)$/);
  if (m) {
    safeReply_(replyToken, addKeyword_(m[1], m[2].trim()));
    return true;
  }

  // [2.6 新] 打錯的斜線指令不要靜靜變成一筆筆記
  if (/^\//.test(text)) {
    safeReply_(replyToken,
      '找不到這個指令：' + text.split(/\s/)[0] + '\n\n' +
      '輸入 /說明 查看可用指令。\n' +
      '（若你是想記筆記，開頭請不要用 /）'
    );
    return true;
  }

  return false;
}

function handlePostback_(event) {
  if (!authorizeEvent_(event)) return;

  const data = {};
  String(event.postback && event.postback.data ? event.postback.data : '')
    .split('&')
    .forEach(function (kv) {
      const pair = kv.split('=');
      if (pair[0]) data[pair[0]] = decodeURIComponent(pair[1] || '');
    });

  const cache = CacheService.getScriptCache();

  // [3.1 新] 檔案歸檔的快速動作
  if (data.a === 'fname') {
    if (!data.f) {
      safeReply_(event.replyToken, '找不到要更名的檔案。');
      return;
    }
    cache.put(PENDING_ACTION_KEY, JSON.stringify({ type: 'rename', fileId: data.f }), ARCHIVE.PENDING_TTL_SECONDS);
    safeReply_(event.replyToken,
      '✏️ 請直接輸入新檔名（副檔名可省略，會自動保留）。\n' +
      '不想改了就輸入 /取消。');
    return;
  }

  if (data.a === 'ocr') {
    safeReply_(event.replyToken, runOcr_(data.f, ''));
    return;
  }

  if (data.a === 'ocrsave') {
    const cached = data.k ? cache.get(data.k) : '';
    if (!cached) {
      safeReply_(event.replyToken, '辨識結果已逾時，請重新執行 /辨識。');
      return;
    }
    cache.remove(data.k);
    processClassifiedInput_(event.replyToken, cached, new Date(),
      { action: 'note', kind: '事件紀錄', forced: true });
    return;
  }

  // [3.3] 待辦／筆記改判　[3.5] 加上進行中
  if (data.a === 'ontodo' || data.a === 'offtodo' || data.a === 'doing') {
    const state = data.a === 'ontodo' ? 'todo' : (data.a === 'doing' ? 'doing' : 'note');
    const res = setEntryState_(data.u, state);
    safeReply_(event.replyToken, (res.ok ? '' : '⚠️ ') + res.message);
    return;
  }

  // [3.3] 清理待辦雜訊
  if (data.a === 'cleanup') {
    safeReply_(event.replyToken, runCleanupTodos_());
    return;
  }

  // [3.2] 從公文內文建立行事曆
  if (data.a === 'mkcal') {
    const payloadRaw = data.k ? cache.get(data.k) : '';
    if (!payloadRaw) {
      safeReply_(event.replyToken, '這個日期建議已逾時，請重新執行 /辨識 或直接用文字輸入。');
      return;
    }
    cache.remove(data.k);
    createEventFromDoc_(event.replyToken, JSON.parse(payloadRaw));
    return;
  }

  if (data.a === 'fdel') {
    safeReply_(event.replyToken, archiveDeleteFile_(data.f));
    return;
  }

  if (data.a === 'fdir') {
    safeReply_(event.replyToken, buildArchiveText_(''));
    return;
  }

  // [2.7 新] 寫入後快速動作：直接撤銷
  if (data.a === 'undo') {
    safeReply_(event.replyToken, undoLastEntry_().message);
    return;
  }

  // [2.7 新] 寫入後快速動作：撤銷並改用另一種型態重寫
  if (data.a === 'tocal' || data.a === 'tonote') {
    const raw0 = data.k ? cache.get(data.k) : '';
    if (!raw0) {
      safeReply_(event.replyToken, '這筆內容已逾時，請直接重新輸入一次。');
      return;
    }
    cache.remove(data.k);

    const undo = undoLastEntry_();
    if (!undo.ok) {
      safeReply_(event.replyToken, undo.message);
      return;
    }

    const saved = JSON.parse(raw0);
    const when = new Date(saved.receivedAt);
    processClassifiedInput_(
      event.replyToken,
      saved.text,
      when,
      data.a === 'tocal'
        ? { action: 'calendar', kind: '行事曆', forced: true }
        : { action: 'note', kind: '一般筆記', forced: true }
    );
    return;
  }

  // 待辦完成按鈕
  if (data.a === 'done') {
    const raw = cache.get(TODO_CACHE_KEY);
    if (!raw) {
      safeReply_(event.replyToken, '待辦清單已過期，請重新輸入 /未完成。');
      return;
    }
    const list = JSON.parse(raw);
    const idx = Number(data.i);
    if (!(idx >= 0 && idx < list.length)) {
      safeReply_(event.replyToken, '找不到這個項目，請重新輸入 /未完成。');
      return;
    }
    // [2.6 修] 原本重複點同一顆按鈕會回「可能已被撤銷或手動修改」，訊息完全誤導。
    if (list[idx].done) {
      safeReply_(event.replyToken, '這一項剛才已經完成了 ✅\n' + String(list[idx].content).slice(0, 60));
      return;
    }
    safeReply_(event.replyToken, markDone_(list[idx].docId, list[idx].line, list[idx].content, list[idx].uid));
    return;
  }

  const raw = data.k ? cache.get(data.k) : '';
  if (!raw) {
    safeReply_(event.replyToken, '這筆待確認內容已失效或逾時，請重新輸入。');
    return;
  }
  cache.remove(data.k);

  if (data.a === 'cancel') {
    safeReply_(event.replyToken, '已取消，沒有寫入文件或行事曆。');
    return;
  }

  const pending = JSON.parse(raw);
  const decision = data.a === 'cal'
    ? { action: 'calendar', kind: '行事曆', forced: true }
    : { action: 'note', kind: '一般筆記', forced: true };

  processClassifiedInput_(event.replyToken, pending.text, new Date(pending.receivedAt), decision);
}

function replyWithDecisionButtons_(replyToken, text, receivedAt) {
  const key = 'pend_' + Utilities.getUuid().replace(/-/g, '').slice(0, 12);
  CacheService.getScriptCache().put(
    key,
    JSON.stringify({ text: text, receivedAt: receivedAt.toISOString() }),
    APP.PENDING_TTL_SECONDS
  );

  replyMessages_(replyToken, [{
    type: 'text',
    text: '這一則要建立行事曆嗎？\n\n' + String(text).slice(0, 300),
    quickReply: {
      items: [
        { type: 'action', action: { type: 'postback', label: '建立行事曆', data: 'a=cal&k=' + key, displayText: '建立行事曆' } },
        { type: 'action', action: { type: 'postback', label: '只寫筆記', data: 'a=note&k=' + key, displayText: '只寫筆記' } },
        { type: 'action', action: { type: 'postback', label: '取消', data: 'a=cancel&k=' + key, displayText: '取消' } }
      ]
    }
  }]);
}

/* ============================================================
 * 三、語意判斷
 * ============================================================ */

function classifyInput_(text, now) {
  if (/^行事曆\s*[:：]/.test(text)) return { action: 'calendar', kind: '行事曆', forced: true };
  if (/^提醒\s*[:：]/.test(text)) return { action: 'calendar', kind: '提醒事項', forced: true };
  if (/^(筆記|札記|生活札記|紀錄)\s*[:：]/.test(text)) {
    return { action: 'note', kind: detectInputKind_(text), forced: true };
  }

  // [3.0] 分類階段也要看得懂「明早9點開會」，否則會判成筆記而不建行事曆
  const probe = maskDecoys_(expandSynonyms_(text));
  const hasDate = !!parseDateSafely_(probe, now);
  const hasTime = parseTimeRangeSafely_(probe).hasTime;
  const eventWords = wordRe_('EVENT_WORDS', DEFAULT_EVENT_WORDS);
  const workWords = wordRe_('WORK_WORDS', DEFAULT_WORK_WORDS);

  if (REMINDER_INTENT_RE.test(text) && hasDate && hasTime) {
    return { action: 'calendar', kind: '提醒事項', forced: false };
  }
  if (PAST_WORDS_RE.test(text)) {
    return { action: 'note', kind: '事件紀錄', forced: false };
  }
  if (hasDate && hasTime && eventWords.test(text) && !workWords.test(text)) {
    return { action: 'calendar', kind: '行事曆', forced: false };
  }
  if (workWords.test(text)) {
    return { action: 'note', kind: '一般筆記', forced: false };
  }
  if (hasDate && hasTime) {
    return { action: 'ask', kind: '行事曆', forced: false };
  }
  return { action: 'note', kind: '一般筆記', forced: false };
}

function processClassifiedInput_(replyToken, originalText, receivedAt, decision) {
  const cleanText = stripIntentWords_(stripTypePrefix_(originalText));
  let calendarResult = null;
  let calendarError = null;

  if (decision.action === 'calendar') {
    try {
      const eventData = parseCalendarInput_(cleanText, receivedAt, decision.kind);
      calendarResult = createCalendarEvent_(eventData);
    } catch (err) {
      calendarError = getErrorMessage_(err);
    }
  }

  // [3.3 改] 一般筆記還要「看起來像待辦」才列入 ☐。
  //          舊版把所有筆記都當待辦，/未完成 於是塞滿網址與人名。
  const isTask = decision.action === 'note' &&
    decision.kind === '一般筆記' &&
    looksLikeTask_(cleanText);

  // [2.7 新] 一般筆記若句中含日期，該日期即視為到期日。
  //          「週五前完成核銷」「明天整理代理教師資料」都能自動帶出期限。
  const due = isTask ? parseNoteDue_(cleanText, receivedAt) : null;

  // [2.6 修] 原本 appendToJournalDoc_ 拋錯（例如 tryLock 逾時）時，
  //          行事曆事件已經建好卻沒有進 undo stack，會變成無法撤銷的孤兒事件。
  let written = null;
  try {
    written = appendToJournalDoc_({
      receivedAt: receivedAt,
      type: decision.kind,
      text: cleanText,
      // 只有「一般筆記」列入待辦；行事曆、提醒、事件紀錄、生活札記都不列入
      isTask: isTask,
      due: due,
      calendarResult: calendarResult,
      calendarError: calendarError
    });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    let tail;
    if (!calendarResult) {
      tail = '沒有任何資料被寫入，請重新輸入一次。';
    } else if (deleteCalendarEvent_(calendarResult.calendarId, calendarResult.id)) {
      tail = '已同時取消剛才建立的行事曆，請重新輸入一次。';
    } else {
      tail = '⚠️ 行事曆事件已建立但無法自動移除，請到 Google 日曆手動確認。';
    }
    safeReply_(replyToken, '⚠️ 寫入 Google Docs 失敗：' + getErrorMessage_(err) + '\n' + tail);
    return;
  }

  // [2.7 新] 寫完直接給快速動作按鈕，不必再手動打 /撤銷 或 /改
  const actionKey = 'act_' + newUid_();
  CacheService.getScriptCache().put(
    actionKey,
    JSON.stringify({ text: originalText, receivedAt: receivedAt.toISOString() }),
    APP.PENDING_TTL_SECONDS
  );

  if (calendarResult) {
    replyWithActions_(replyToken, buildCreatedReply_(calendarResult), [
      { label: '↩️ 撤銷', data: 'a=undo', display: '撤銷' },
      { label: '📝 改成純筆記', data: 'a=tonote&k=' + actionKey, display: '改成純筆記' }
    ]);
  } else if (calendarError) {
    replyWithActions_(replyToken,
      '📝 已先寫入 Google Docs\n' +
      '⚠️ 未建立行事曆：' + calendarError + '\n\n' +
      buildDateFormatHint_(),
      [{ label: '↩️ 撤銷', data: 'a=undo', display: '撤銷' }]
    );
  } else {
    const tail = isTask
      ? '\n\n☐ 已列入待辦' +
        (due ? '，期限 ' + Utilities.formatDate(due, APP.TZ, 'M/d') : '') +
        '（輸入 /未完成 查看）'
      : '';

    // [3.3 新] 待辦與筆記的判斷一定會有例外，所以直接給一顆改判鍵。
    //          與其把判斷做得更複雜，不如讓修正只要一秒。
    const actions = [
      { label: '↩️ 撤銷', data: 'a=undo', display: '撤銷' },
      { label: '📅 改建行事曆', data: 'a=tocal&k=' + actionKey, display: '改建行事曆' }
    ];
    const uid = written && written.uid ? written.uid : '';
    if (uid) {
      actions.push(isTask
        ? { label: '📝 不是待辦', data: 'a=offtodo&u=' + uid, display: '改為純筆記' }
        : { label: '☐ 列入待辦', data: 'a=ontodo&u=' + uid, display: '列入待辦' });
    }

    replyWithActions_(replyToken,
      '📝 已寫入筆記（' + decision.kind + '）\n' +
      formatChineseDateTime_(receivedAt) + '\n' +
      cleanText.slice(0, 120) + tail,
      actions
    );
  }
}

/* ------------------------------------------------------------
 * [3.3] 這一段是不是「待辦」？
 *
 * 舊版的判斷是「不是行事曆就是待辦」，結果 /未完成 變成垃圾場：
 * 貼上的網址、電話、人名清單、整段複製的文章全部帶著 ☐ 排隊。
 * 待辦清單一旦不可信，就沒有人會看它。
 *
 * 判斷難免有例外，所以寧可少收：漏判只要按一顆按鈕就能補上，
 * 誤收卻會讓整份清單失去意義。
 * ------------------------------------------------------------ */

/*
 * 單字動詞的誤判率高得驚人：「需」會吃到「需求」，「得」會吃到「覺得」，
 * 「要」會吃到「重要」「主要」。所以一律用兩字以上的詞，
 * 單獨的「要」另外用後接動詞的形式限定。
 */
const TASK_INTENT_RE = new RegExp([
  '記得', '別忘', '毋忘', '待辦', '代辦', '需要', '必須', '務必',
  '處理', '完成', '繳交', '繳費', '送出', '提交', '呈報', '陳核', '核章',
  '申請', '報名', '填報', '填寫', '統計', '整理', '彙整', '準備', '備妥',
  '聯絡', '聯繫', '通知', '回覆', '回報', '確認', '核對', '查對', '清查',
  '追蹤', '催件', '安排', '預約', '訂購', '訂便當', '訂餐',
  '影印', '列印', '簽名', '簽核', '用印', '核銷', '請購', '採購', '請領',
  '上傳', '下載', '寄出', '寄送', '發文', '公告', '檢查', '修改', '更新',
  '製作', '建置', '排課', '盤點', '盤查', '調查', '約訪', '致電',
  'todo', 'TODO',
  // 「要 + 動詞」才算，避開重要／主要／只要
  '要(?:交|送|做|辦|寫|買|印|問|找|給|開|報|填|改|核|簽|去|來|發|回|查|收|訂|排|準備|處理|通知|聯絡|確認|完成)'
].join('|'));

// 這些詞裡面藏著動詞字，先拿掉再判斷，免得整段被誤認成待辦
const TASK_DECOY_RE = /重要|主要|只要|不要|需求|覺得|值得|曉得|懂得|使得|免得|難得|不得|所得|心得|報告書|請查照|請鼓勵/g;

// 明確寫了期限的，一定是要做的事
const TASK_DUE_RE = /(截止|期限|deadline|due|前完成|以前完成|之前完成|前繳|前交|前送)/i;

// 問句、感想、單純紀錄，不是待辦
const NOT_TASK_TAIL_RE = /(嗎|呢|吧)\s*[?？。]?\s*$|[?？]\s*$/;

function looksLikeTask_(text) {
  const raw = String(text || '').trim();
  if (!raw) return false;

  // 只有網址（一個或多個）
  if (/^(https?:\/\/\S+[\s,、]*)+$/i.test(raw)) return false;

  // 只有號碼、時間、代號這類資料
  if (/^[\d\s\-()+#:：、,，.／/]+$/.test(raw)) return false;

  // 問句
  if (NOT_TASK_TAIL_RE.test(raw)) return false;

  // 明確期限一律算待辦
  if (TASK_DUE_RE.test(raw.replace(TASK_DECOY_RE, ''))) return true;

  const probe = raw.replace(TASK_DECOY_RE, '');
  const hasIntent = TASK_INTENT_RE.test(probe);

  // 貼上來的長內容（會議紀錄、公文內文、題目）：除非語意很明確，否則當資料
  if (raw.length >= 80) return hasIntent && raw.length < 200;

  // 網址佔了大半，其餘只是說明文字
  const urls = raw.match(/https?:\/\/\S+/gi) || [];
  if (urls.length) {
    const rest = raw.replace(/https?:\/\/\S+/gi, '').trim();
    if (rest.length < 8) return false;
    if (!hasIntent) return false;
  }

  return hasIntent;
}

/**
 * [3.3] 事後改判：把某一筆在 ☐ 待辦與純筆記之間切換。
 * Docs 是真相來源，所以兩邊都要改——只改索引會造成清單與文件互相矛盾。
 */
function setTaskFlag_(uid, makeTask) {
  return setEntryState_(uid, makeTask ? 'todo' : 'note');
}

/**
 * [3.5] 狀態切換：筆記 / 待辦 ☐ / 進行中 ◐。
 * Docs 與索引同時改——只改一邊會讓清單與文件互相矛盾，
 * 而且段落文字對不上之後，之後的編輯與刪除都會失敗。
 */
function setEntryState_(uid, state) {
  const marks = { note: '', todo: TASK_OPEN + ' ', doing: TASK_DOING + ' ' };
  const statuses = { note: STATUS_NONE, todo: STATUS_TODO, doing: STATUS_DOING };
  if (!(state in marks)) return { ok: false, message: '未知的狀態。' };

  const row = indexFindRowByUid_(uid);
  if (!row) return { ok: false, message: '找不到這一筆（索引裡沒有）。' };

  const sheet = getIndexSheet_();
  const docId = String(sheet.getRange(row, SHEET.COL.DOC_ID).getValue() || '');
  const oldLine = String(sheet.getRange(row, SHEET.COL.PARA).getValue() || '');
  const content = String(sheet.getRange(row, SHEET.COL.CONTENT).getValue() || '');
  const status = String(sheet.getRange(row, SHEET.COL.STATUS).getValue() || '');

  if (status === STATUS_DONE) {
    return { ok: false, message: '這一筆已完成，請先還原再改狀態。' };
  }
  if (status === statuses[state]) {
    return { ok: false, message: '狀態沒有變動。' };
  }

  const newLine = marks[state] + content;

  if (docId && oldLine) {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(APP.LOCK_WAIT_MS)) return { ok: false, message: '系統忙碌中，請稍後再試。' };
    try {
      const doc = DocumentApp.openById(docId);
      const paragraphs = doc.getBody().getParagraphs();
      let hit = null;
      for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].getText().trim() === oldLine.trim()) { hit = paragraphs[i]; break; }
      }
      if (hit) {
        hit.setText(newLine);
        hit.editAsText().setForegroundColor('#000000').setStrikethrough(false);
      }
      doc.saveAndClose();
    } catch (err) {
      lock.releaseLock();
      return { ok: false, message: '文件更新失敗：' + getErrorMessage_(err) };
    }
    lock.releaseLock();
  }

  sheet.getRange(row, SHEET.COL.PARA).setValue(newLine);
  sheet.getRange(row, SHEET.COL.STATUS).setValue(statuses[state]);
  if (state === 'note') sheet.getRange(row, SHEET.COL.DUE).setValue('');

  const messages = {
    note: '📝 已改為純筆記（不再出現在 /未完成）',
    todo: '☐ 已列入待辦',
    doing: '◐ 已標為進行中（仍算未完成）'
  };
  return { ok: true, message: messages[state], content: content };
}

/**
 * [3.5] 備註只寫索引，不寫 Docs。
 * Docs 是流水帳，段落文字每改一次就要重新對齊；
 * 而備註本來就是會一直更新的東西，放進去只會讓兩邊一直打架。
 */
function updateRemark_(uid, remark) {
  const row = indexFindRowByUid_(uid);
  if (!row) return { ok: false, message: '找不到這一筆。' };

  const sheet = getIndexSheet_();
  const cur = String(sheet.getRange(row, SHEET.COL.REMARK).getValue() || '');
  const next = String(remark || '').trim().slice(0, 500);
  if (cur === next) return { ok: true, changed: false };

  sheet.getRange(row, SHEET.COL.REMARK).setValue(next);
  return { ok: true, changed: true };
}

function updateDoneNote_(uid, note) {
  const row = indexFindRowByUid_(uid);
  if (!row) return { ok: false, message: '找不到這一筆。' };

  const sheet = getIndexSheet_();
  const cur = String(sheet.getRange(row, SHEET.COL.DONE_NOTE).getValue() || '');
  const next = String(note || '').trim().slice(0, 300);
  if (cur === next) return { ok: true, changed: false };

  sheet.getRange(row, SHEET.COL.DONE_NOTE).setValue(next);
  return { ok: true, changed: true };
}

/**
 * [4.0] 管理台刪除改為「軟刪除」。
 * - 索引列不刪，只寫入刪除時間，因此 30 天內能完整還原。
 * - Docs 正文先保留，直到永久刪除才移除，避免誤刪後找不回原文。
 * - 若有本系統建立的 Calendar 事件，先把標題加上 🗑️ 並移除 popup 提醒；
 *   原標題與提醒分鐘數存進回收桶快照，還原時補回。
 */
const TRASH = {
  RETENTION_DAYS: 30,
  PURGE_BATCH: 20,
  AUTO_CACHE_SECONDS: 3600,
  TRIGGER_HANDLER: 'runTrashMaintenance'
};

function readTrashSnapshot_(raw) {
  try { return raw ? JSON.parse(String(raw)) : {}; }
  catch (err) { return {}; }
}

function muteCalendarForTrash_(calendarId, eventId) {
  if (!eventId) return { ok: true, event: null };
  try {
    const calendar = calendarId ? CalendarApp.getCalendarById(calendarId) : getCalendar_();
    if (!calendar) return { ok: false, message: '找不到行事曆' };
    const event = calendar.getEventById(eventId);
    if (!event) return { ok: false, message: '找不到行事曆事件' };

    const title = event.getTitle();
    // 4.0：回收桶要可逆。removeAllReminders() 會把各類提醒一起移除，
    // 因此先把目前可讀到的 popup／email／SMS 分別快照，還原時逐一補回。
    const popup = event.getPopupReminders ? event.getPopupReminders() : [];
    const email = event.getEmailReminders ? event.getEmailReminders() : [];
    const sms = event.getSmsReminders ? event.getSmsReminders() : [];
    if (title.indexOf('🗑️ ') !== 0) event.setTitle('🗑️ ' + title);
    if (event.removeAllReminders) event.removeAllReminders();

    return { ok: true, event: { title: title, popup: popup || [], email: email || [], sms: sms || [] } };
  } catch (err) {
    return { ok: false, message: getErrorMessage_(err) };
  }
}

function restoreCalendarFromTrash_(calendarId, eventId, snapshot) {
  const s = snapshot && snapshot.event;
  if (!eventId || !s) return { ok: true, changed: false };
  try {
    const calendar = calendarId ? CalendarApp.getCalendarById(calendarId) : getCalendar_();
    if (!calendar) return { ok: false, message: '找不到行事曆' };
    const event = calendar.getEventById(eventId);
    if (!event) return { ok: false, message: '行事曆事件已不存在，筆記仍可還原' };

    if (s.title) event.setTitle(String(s.title));
    if (event.removeAllReminders) event.removeAllReminders();

    function restoreReminderList_(values, methodName) {
      (values || []).forEach(function (minutes) {
        const n = Number(minutes);
        if (!Number.isFinite(n) || n < 5 || n > 40320) return;
        if (typeof event[methodName] === 'function') event[methodName](n);
      });
    }
    restoreReminderList_(s.popup, 'addPopupReminder');
    restoreReminderList_(s.email, 'addEmailReminder');
    restoreReminderList_(s.sms, 'addSmsReminder');
    return { ok: true, changed: true };
  } catch (err) {
    return { ok: false, message: getErrorMessage_(err) };
  }
}

function deleteEntryByUid_(uid) {
  const row = indexFindRowByUid_(uid, false);
  if (!row) return { ok: false, message: '找不到這一筆，或已在資源回收桶。' };

  const sheet = getIndexSheet_();
  const calId = String(sheet.getRange(row, SHEET.COL.CAL_ID).getValue() || '');
  const eventId = String(sheet.getRange(row, SHEET.COL.EVENT_ID).getValue() || '');

  const snapshot = {};
  const cal = muteCalendarForTrash_(calId, eventId);
  if (cal.event) snapshot.event = cal.event;

  sheet.getRange(row, SHEET.COL.DELETED_AT).setValue(new Date());
  sheet.getRange(row, SHEET.COL.TRASH_SNAPSHOT).setValue(JSON.stringify(snapshot));
  try { CacheService.getScriptCache().remove(TODO_CACHE_KEY); } catch (err) {}

  let message = '已移到資源回收桶，30 天內可還原。';
  if (eventId) {
    message += cal.ok
      ? ' 行事曆提醒已暫停。'
      : ' ⚠️ 行事曆暫停提醒失敗：' + cal.message;
  }
  return { ok: true, message: message };
}

function restoreEntryFromTrash_(uid) {
  const row = indexFindRowByUid_(uid, true);
  if (!row) return { ok: false, message: '回收桶裡找不到這一筆。' };

  const sheet = getIndexSheet_();
  const deletedAt = sheet.getRange(row, SHEET.COL.DELETED_AT).getValue();
  if (!deletedAt) return { ok: false, message: '這一筆不在資源回收桶。' };

  const calId = String(sheet.getRange(row, SHEET.COL.CAL_ID).getValue() || '');
  const eventId = String(sheet.getRange(row, SHEET.COL.EVENT_ID).getValue() || '');
  const snapshot = readTrashSnapshot_(sheet.getRange(row, SHEET.COL.TRASH_SNAPSHOT).getValue());
  const cal = restoreCalendarFromTrash_(calId, eventId, snapshot);

  sheet.getRange(row, SHEET.COL.DELETED_AT).clearContent();
  sheet.getRange(row, SHEET.COL.TRASH_SNAPSHOT).clearContent();
  try { CacheService.getScriptCache().remove(TODO_CACHE_KEY); } catch (err) {}

  return {
    ok: true,
    message: cal.ok ? '已從資源回收桶還原。' : '筆記已還原；⚠️ ' + cal.message
  };
}

/** 永久刪除：沿用 3.7 的真正刪除語意。 */
function hardDeleteEntryByUid_(uid) {
  const row = indexFindRowByUid_(uid, true);
  if (!row) return { ok: false, message: '找不到這一筆。' };

  const sheet = getIndexSheet_();
  const docId = String(sheet.getRange(row, SHEET.COL.DOC_ID).getValue() || '');
  const line = String(sheet.getRange(row, SHEET.COL.PARA).getValue() || '');
  const calId = String(sheet.getRange(row, SHEET.COL.CAL_ID).getValue() || '');
  const eventId = String(sheet.getRange(row, SHEET.COL.EVENT_ID).getValue() || '');
  const notes = [];

  if (eventId) {
    notes.push(deleteCalendarEvent_(calId, eventId) ? '行事曆事件已刪除' : '⚠️ 行事曆事件不存在或刪除失敗');
  }

  if (docId && line) {
    try {
      const doc = DocumentApp.openById(docId);
      const body = doc.getBody();
      const paragraphs = body.getParagraphs();
      let removed = false;
      for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].getText().trim() === line.trim()) {
          body.removeChild(paragraphs[i]);
          removed = true;
          break;
        }
      }
      doc.saveAndClose();
      notes.push(removed ? 'Docs 段落已刪除' : '⚠️ Docs 找不到對應段落（可能已手動改過）');
    } catch (err) {
      notes.push('⚠️ Docs 刪除失敗：' + getErrorMessage_(err));
    }
  }

  indexDeleteByUid_(uid, true);
  notes.push('索引已永久移除');
  return { ok: true, message: notes.join('｜') };
}

function trashRemainingDays_(deletedAt) {
  if (!deletedAt) return TRASH.RETENTION_DAYS;
  const purgeAt = addDays_(startOfDay_(deletedAt), TRASH.RETENTION_DAYS);
  const diff = Math.ceil((purgeAt.getTime() - startOfDay_(new Date()).getTime()) / 86400000);
  return Math.max(0, diff);
}

function purgeExpiredTrash_(maxItems) {
  const limit = Math.max(1, Math.min(Number(maxItems) || TRASH.PURGE_BATCH, 50));
  const cutoff = addDays_(new Date(), -TRASH.RETENTION_DAYS);
  const expired = indexReadAll_(true).filter(function (r) {
    return r.deletedAt && r.deletedAt < cutoff;
  }).sort(function (a, b) { return a.deletedAt - b.deletedAt; }).slice(0, limit);

  let done = 0;
  const errors = [];
  expired.forEach(function (r) {
    try {
      const res = hardDeleteEntryByUid_(r.uid);
      if (res && res.ok) done++;
      else errors.push(res && res.message ? res.message : r.uid);
    } catch (err) { errors.push(getErrorMessage_(err)); }
  });
  return { ok: errors.length === 0, done: done, failed: errors.length, errors: errors.slice(0, 3) };
}

function maybeAutoPurgeTrash_() {
  const cache = CacheService.getScriptCache();
  const key = 'trash_purge_v40';
  if (cache.get(key)) return;
  try { purgeExpiredTrash_(TRASH.PURGE_BATCH); }
  catch (err) { console.warn('回收桶自動維護失敗：' + getErrorMessage_(err)); }
  cache.put(key, '1', TRASH.AUTO_CACHE_SECONDS);
}

/**
 * [3.3] 修改內容。Docs 與索引同步，☐／☑ 前綴保留。
 */
function updateEntryText_(uid, newText) {
  const text = String(newText || '').trim();
  if (!text) return { ok: false, message: '內容不可以空白。' };

  const row = indexFindRowByUid_(uid);
  if (!row) return { ok: false, message: '找不到這一筆。' };

  const sheet = getIndexSheet_();
  const docId = String(sheet.getRange(row, SHEET.COL.DOC_ID).getValue() || '');
  const oldLine = String(sheet.getRange(row, SHEET.COL.PARA).getValue() || '');

  let prefix = '';
  if (oldLine.indexOf(TASK_OPEN) === 0) prefix = TASK_OPEN + ' ';
  else if (oldLine.indexOf(TASK_DONE) === 0) prefix = TASK_DONE + ' ';
  const newLine = prefix + text;

  if (docId && oldLine) {
    try {
      const doc = DocumentApp.openById(docId);
      const paragraphs = doc.getBody().getParagraphs();
      for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].getText().trim() === oldLine.trim()) {
          paragraphs[i].setText(newLine);
          break;
        }
      }
      doc.saveAndClose();
    } catch (err) {
      return { ok: false, message: 'Docs 更新失敗：' + getErrorMessage_(err) };
    }
  }

  sheet.getRange(row, SHEET.COL.CONTENT).setValue(text);
  sheet.getRange(row, SHEET.COL.PARA).setValue(newLine);
  return { ok: true, message: '已更新' };
}

/**
 * [3.3] 把待辦改回未完成狀態（網頁台的「還原」）。
 */
function reopenEntryByUid_(uid) {
  const row = indexFindRowByUid_(uid);
  if (!row) return { ok: false, message: '找不到這一筆。' };

  const sheet = getIndexSheet_();
  const docId = String(sheet.getRange(row, SHEET.COL.DOC_ID).getValue() || '');
  const oldLine = String(sheet.getRange(row, SHEET.COL.PARA).getValue() || '');
  const content = String(sheet.getRange(row, SHEET.COL.CONTENT).getValue() || '');
  const newLine = TASK_OPEN + ' ' + content;

  if (docId && oldLine) {
    try {
      const doc = DocumentApp.openById(docId);
      const paragraphs = doc.getBody().getParagraphs();
      for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].getText().trim() === oldLine.trim()) {
          paragraphs[i].setText(newLine);
          paragraphs[i].editAsText().setForegroundColor('#000000').setStrikethrough(false);
          break;
        }
      }
      doc.saveAndClose();
    } catch (err) {
      return { ok: false, message: 'Docs 更新失敗：' + getErrorMessage_(err) };
    }
  }

  sheet.getRange(row, SHEET.COL.PARA).setValue(newLine);
  sheet.getRange(row, SHEET.COL.STATUS).setValue(STATUS_TODO);
  sheet.getRange(row, SHEET.COL.DONE_AT).setValue('');
  return { ok: true, message: '已還原為待辦' };
}

/**
 * [3.3] 找出「看起來只是筆記」的待辦。給 /清理 與網頁台共用。
 */
function findNoiseTodos_() {
  return indexReadAll_()
    .filter(function (r) { return r.status === STATUS_TODO; })
    .filter(function (r) { return !looksLikeTask_(r.content); });
}

function buildCleanupPreview_() {
  const noise = findNoiseTodos_();
  if (!noise.length) {
    return { text: '👍 目前的待辦清單看起來都是真的待辦，不需要清理。', count: 0 };
  }

  const lines = ['🧹 找到 ' + noise.length + ' 筆看起來只是筆記的待辦：', ''];
  noise.slice(0, 12).forEach(function (r, i) {
    lines.push((i + 1) + '. ' + r.content.slice(0, 40).replace(/\n/g, ' '));
  });
  if (noise.length > 12) lines.push('…等 ' + noise.length + ' 筆');
  lines.push('', '轉為筆記後就不會再出現在 /未完成（內容不會刪除）。');

  return { text: lines.join('\n'), count: noise.length };
}

function runCleanupTodos_() {
  const noise = findNoiseTodos_();
  let done = 0;
  let failed = 0;

  noise.forEach(function (r) {
    const res = setTaskFlag_(r.uid, false);
    if (res.ok) done++;
    else failed++;
  });

  return '🧹 清理完成\n轉為筆記：' + done + ' 筆' + (failed ? '\n失敗：' + failed + ' 筆' : '') +
    '\n\n輸入 /未完成 看看清單。';
}

/**
 * [2.7 新] 一般筆記的到期日判定。
 * 優先看明確的「截止／期限／deadline」，否則以句中出現的日期為期限。
 */
function parseNoteDue_(text, now) {
  const m = String(text).match(/(?:截止|期限|deadline|due)\s*[:：]?\s*([^\s，,。；;]{1,20})/i);
  if (m) {
    const explicit = parseDateSafely_(normalizeWidth_(m[1]), now);
    if (explicit) return explicit.date;
  }
  const found = parseDateSafely_(maskDecoys_(expandSynonyms_(String(text))), now);
  return found ? found.date : null;
}

// [2.9 新] 解析失敗時，直接告訴使用者哪些寫法可行，不要只丟一個範例
function buildDateFormatHint_() {
  // [3.0] 直接從規則表產生，新增規則時提示自動同步，不會各說各話
  const eg = DATE_RULES.map(function (r) { return '　' + r.eg; });
  return ['看得懂的日期寫法：'].concat(eg).concat([
    '',
    '時間：9點／上午9點半／09:00-11:00／明早9點',
    '沒寫時間會建成全天活動。'
  ]).join('\n');
}

// [2.7 新] 帶快速動作按鈕的回覆
function replyWithActions_(replyToken, text, actions) {
  const items = (actions || []).slice(0, 13).map(function (a) {
    return {
      type: 'action',
      action: {
        type: 'postback',
        label: String(a.label).slice(0, 20),
        data: a.data,
        displayText: a.display || a.label
      }
    };
  });

  try {
    replyMessages_(replyToken, [{
      type: 'text',
      text: String(text).slice(0, 4900),
      quickReply: items.length ? { items: items } : undefined
    }]);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    safeReply_(replyToken, text);
  }
}

function amendLastEntry_(replyToken, newText) {
  // [2.6 修] 原本用 undoMsg.indexOf('已撤銷') 判斷成功，與訊息文字硬耦合。
  const undo = undoLastEntry_();
  if (!undo.ok) {
    safeReply_(replyToken, undo.message);
    return;
  }
  const now = new Date();
  let decision = classifyInput_(newText, now);
  if (decision.action === 'ask') {
    decision = { action: 'note', kind: '一般筆記', forced: true };
  }
  processClassifiedInput_(replyToken, newText, now, decision);
}

function detectInputKind_(text) {
  if (/^行事曆\s*[:：]/.test(text)) return '行事曆';
  if (/^提醒\s*[:：]/.test(text)) return '提醒事項';
  if (/^(札記|生活札記)\s*[:：]/.test(text)) return '生活札記';
  if (/^筆記\s*[:：]/.test(text)) return '一般筆記';
  if (/^紀錄\s*[:：]/.test(text)) return '事件紀錄';
  return '一般筆記';
}

function stripTypePrefix_(text) {
  return String(text)
    .replace(/^(行事曆|提醒|札記|生活札記|筆記|紀錄)\s*[:：]\s*/, '')
    .trim();
}

// [修正] 只在句首移除意圖詞，句中的「記得」保留語意
function stripIntentWords_(text) {
  return String(text)
    .replace(/^(請)?(提醒我|提醒一下|別忘了|不要忘記|勿忘|記得)\s*/, '')
    .trim();
}

/* ============================================================
 * 四、關鍵字表（可自行維護）
 * ============================================================ */

function getWordList_(key, fallback) {
  const raw = PropertiesService.getScriptProperties().getProperty(key);
  return String(raw || fallback)
    .split(/[,，、\s]+/)
    .map(function (s) { return s.trim(); })
    .filter(Boolean);
}

function wordRe_(key, fallback) {
  const list = getWordList_(key, fallback).map(escapeRegExp_);
  if (!list.length) return /$^/;
  return new RegExp('(' + list.join('|') + ')');
}

function addKeyword_(category, word) {
  const key = category === '行事曆' ? 'EVENT_WORDS' : 'WORK_WORDS';
  const fallback = category === '行事曆' ? DEFAULT_EVENT_WORDS : DEFAULT_WORK_WORDS;
  const list = getWordList_(key, fallback);
  const words = word.split(/[,，、\s]+/).map(function (s) { return s.trim(); }).filter(Boolean);
  const added = [];

  words.forEach(function (w) {
    if (list.indexOf(w) < 0) { list.push(w); added.push(w); }
  });

  if (!added.length) return '這些詞已經在「' + category + '」詞庫裡了。';
  PropertiesService.getScriptProperties().setProperty(key, list.join(','));
  return '✅ 已加入「' + category + '」詞庫：' + added.join('、') + '\n目前共 ' + list.length + ' 個詞。';
}

function buildWordListText_() {
  const ev = getWordList_('EVENT_WORDS', DEFAULT_EVENT_WORDS);
  const wk = getWordList_('WORK_WORDS', DEFAULT_WORK_WORDS);
  return [
    '📚 判斷詞庫',
    '',
    '【行事曆詞】共 ' + ev.length + ' 個',
    ev.join('、').slice(0, 900),
    '',
    '【工作詞】共 ' + wk.length + ' 個',
    wk.join('、').slice(0, 900),
    '',
    '新增方式：/加詞 行事曆 教評會',
    '　　　　　/加詞 工作 核銷'
  ].join('\n');
}

/* ============================================================
 * 五、日期時間解析
 * ============================================================ */

/**
 * [2.9 新] 全形數字與分隔符正規化。
 * 從公文、Word 複製過來的文字常帶全形（５０７、８月２０日、２０２６／０９／１９），
 * JS 的 \d 只認半形，會整段解析失敗。
 *
 * 全形轉半形是 1:1 對應，字串長度不變，
 * 因此 span 索引仍可套回「原文」，標題會保留使用者原本的全形寫法。
 */
function normalizeWidth_(text) {
  const MAP = { '／': '/', '－': '-', '．': '.', '：': ':', '～': '~', '　': ' ' };
  return String(text).replace(/[０-９／－．：～　]/g, function (c) {
    if (MAP[c]) return MAP[c];
    return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
  });
}

/**
 * 遮蔽會誤觸解析的詞。長度不變，索引可對齊原文。
 * [修正] 第3點意見 → 不可當成 3 點鐘
 * [3.0]  第19號公文、第二屆、第3條 → 不可當成 19 號（日期）
 *        新增「單獨日」規則後，這類序數詞的誤判風險才浮現。
 */
function maskDecoys_(text) {
  return normalizeWidth_(text)
    .replace(/第\s*[零〇一二兩三四五六七八九十\d]{1,3}\s*[點號屆條項款次期梯]/g,
      function (s) { return blank_(s.length); })
    .replace(/[（(]\s*[零〇一二兩三四五六七八九十\d]{1,4}\s*[)）]\s*號/g,
      function (s) { return blank_(s.length); });
}

/**
 * [3.0 新] 口語縮寫展開。
 * 「明早」「今晚」同時帶著日期與時段，但兩者黏在一起誰都解不到。
 * 展開成「明天早上」後，日期與時間解析各自都能命中。
 *
 * 這會改變字串長度，所以只用在行事曆解析路徑，
 * 而且展開後的文字會一路用到底（標題也從它算），內部保持一致。
 * 寫進 Docs 的仍是使用者原文。
 */
function expandSynonyms_(text) {
  return String(text)
    .replace(/明早|明晨/g, '明天早上')
    .replace(/明晚/g, '明天晚上')
    .replace(/明午/g, '明天中午')
    .replace(/今早|今晨/g, '今天早上')
    .replace(/今晚/g, '今天晚上')
    .replace(/今午/g, '今天中午')
    .replace(/昨晚/g, '昨天晚上')
    .replace(/後天早|後早/g, '後天早上');
}

function blank_(n) {
  let s = '';
  for (let i = 0; i < n; i++) s += ' ';
  return s;
}

function maskSpan_(text, span) {
  if (!span) return text;
  return text.slice(0, span.start) + blank_(span.len) + text.slice(span.start + span.len);
}

/**
 * [修正] 用位置切除而非字串取代，避免片段重疊誤刪
 * [2.6 重修] 舊版逐一 slice，一旦兩個 span 重疊（例如時間正則的前導 \s*
 *            吃進了已被遮蔽的日期區段，產生 {0,4} 與 {0,2} 重疊），
 *            後套用的 span 會落在已被前一次位移過的字串上而多刪一個字
 *            ——「明天9點到校服務」就是這樣變成「校服務」的。
 *            改為建立保留遮罩，天生對重疊免疫。
 */
function removeSpans_(text, spans) {
  const src = String(text);
  const keep = [];
  for (let i = 0; i < src.length; i++) keep.push(true);

  (spans || []).filter(Boolean).forEach(function (s) {
    const start = Math.max(0, Number(s.start));
    const end = Math.min(src.length, Number(s.start) + Number(s.len));
    for (let i = start; i < end; i++) keep[i] = false;
  });

  let out = '';
  for (let i = 0; i < src.length; i++) out += keep[i] ? src.charAt(i) : ' ';
  return out.replace(/\s+/g, ' ').trim();
}

/**
 * [2.6 新] 把 span 兩端的空白修掉。
 * 正則裡的 \s* 常會把前面已遮蔽的區段一併吃進來，
 * 造成 span 起點提前、與其他 span 重疊。
 */
function trimSpan_(text, span) {
  if (!span) return span;
  const src = String(text);
  let start = span.start;
  let end = span.start + span.len;
  while (start < end && /\s/.test(src.charAt(start))) start++;
  while (end > start && /\s/.test(src.charAt(end - 1))) end--;
  return { start: start, len: end - start };
}

function parseDateSafely_(text, now) {
  try { return parseDate_(text, now); }
  catch (err) { return null; }
}

function parseTimeRangeSafely_(text) {
  try { return parseTimeRange_(text); }
  catch (err) { return { hasTime: false, span: null }; }
}

/* ------------------------------------------------------------
 * 日期規則表（3.0 重構）
 *
 * 原本是一條寫死順序的 if 鏈，每加一種寫法就更難確定會不會踩到別條。
 * 改成有序規則表後：順序即優先級、每條可獨立測試、
 * 也可以用 listDateFormats() 把支援清單直接列給使用者看。
 *
 * 每條規則回傳 { date, span } 或 null。
 * span 必須對齊「正規化後但長度相同」的文字，之後才切得掉。
 * 規則內可以丟出例外（例如 2月30日），由 parseDateSafely_ 接住。
 * ------------------------------------------------------------ */

const CN_D = '零〇一二兩三四五六七八九十百';

function anyNum_(value) {
  const t = String(value).trim();
  if (/^\d+$/.test(t)) return Number(t);
  return parseChineseNumber_(t);
}
function mkDate_(date, start, len) {
  return { date: date, span: { start: start, len: len } };
}
function startOfMonth_(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function shiftMonth_(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, date.getDate());
}
function lastDayOfMonth_(year, month) {
  return new Date(year, month, 0).getDate();
}
// 只寫了月日沒寫年：取「今年，若已過則明年」
function yearGuess_(base, month, day, start, len) {
  let year = base.getFullYear();
  if (new Date(year, month - 1, day) < base) year++;
  return validatedDateResult_(year, month, day, start, len);
}
function monthGuess_(base, day, start, len) {
  let ref = startOfMonth_(base);
  if (new Date(base.getFullYear(), base.getMonth(), day) < base) ref = shiftMonth_(ref, 1);
  return validatedDateResult_(ref.getFullYear(), ref.getMonth() + 1, day, start, len);
}
/**
 * [3.0 新] 取第一個「沒有被括號包住」的匹配。
 * 用於星期規則：（週六）、(五) 這類括號註記要略過。
 */
function firstUnbracketedMatch_(text, globalRe) {
  globalRe.lastIndex = 0;
  let m;
  while ((m = globalRe.exec(text)) !== null) {
    if (!isBracketed_(text, m.index, m[0].length)) return m;
    if (globalRe.lastIndex === m.index) globalRe.lastIndex++;   // 防零長度卡住
  }
  return null;
}

function isBracketed_(text, start, len) {
  let i = start - 1;
  while (i >= 0 && /\s/.test(text.charAt(i))) i--;
  const before = i >= 0 ? text.charAt(i) : '';
  if (before !== '(' && before !== '（') return false;

  let j = start + len;
  while (j < text.length && /\s/.test(text.charAt(j))) j++;
  const after = j < text.length ? text.charAt(j) : '';
  return after === ')' || after === '）';
}

function monthPrefixShift_(prefix) {
  const p = prefix || '';
  if (/^下下/.test(p)) return 2;
  if (/^上上/.test(p)) return -2;
  if (/^下/.test(p)) return 1;
  if (/^上/.test(p)) return -1;
  return 0;
}

const DATE_RULES = [

  // ── 相對日 ──
  { name: '相對日', eg: '今天／明天／後天／大後天／昨天',
    run: function (text, base) {
      const table = [
        { re: /大後天/, d: 3 }, { re: /大前天/, d: -3 },
        { re: /後天|後日/, d: 2 }, { re: /前天/, d: -2 },
        { re: /明天|明日|翌日/, d: 1 }, { re: /昨天|昨日/, d: -1 },
        { re: /今天|今日|本日/, d: 0 }
      ];
      for (let i = 0; i < table.length; i++) {
        const m = text.match(table[i].re);
        if (m) return mkDate_(addDays_(base, table[i].d), m.index, m[0].length);
      }
      return null;
    } },

  { name: 'N天後', eg: '3天後／三天後／兩天前',
    run: function (text, base) {
      let m = text.match(new RegExp('([' + CN_D + '\\d]{1,3})\\s*[天日]\\s*(?:後|以後|之後|過後)'));
      if (m) {
        const n = anyNum_(m[1]);
        if (isFinite(n) && n > 0 && n <= 365) return mkDate_(addDays_(base, n), m.index, m[0].length);
      }
      m = text.match(new RegExp('([' + CN_D + '\\d]{1,3})\\s*[天日]\\s*(?:前|以前|之前)'));
      if (m) {
        const n2 = anyNum_(m[1]);
        if (isFinite(n2) && n2 > 0 && n2 <= 365) return mkDate_(addDays_(base, -n2), m.index, m[0].length);
      }
      return null;
    } },

  { name: 'N週後／N個月後', eg: '兩週後／1個月後',
    run: function (text, base) {
      let m = text.match(new RegExp('([' + CN_D + '\\d]{1,3})\\s*個?\\s*(?:週|周|星期|禮拜)\\s*(?:後|以後|之後)'));
      if (m) {
        const n = anyNum_(m[1]);
        if (isFinite(n) && n > 0 && n <= 104) return mkDate_(addDays_(base, n * 7), m.index, m[0].length);
      }
      m = text.match(new RegExp('([' + CN_D + '\\d]{1,3})\\s*個?\\s*月\\s*(?:後|以後|之後)'));
      if (m) {
        const n2 = anyNum_(m[1]);
        if (isFinite(n2) && n2 > 0 && n2 <= 36) return mkDate_(shiftMonth_(base, n2), m.index, m[0].length);
      }
      return null;
    } },

  // ── 星期 ──
  // [修正] 原本 (下下週|下週|本週|這週)?(?:星期|禮拜|週) 會回溯成只匹配「週三」，
  //        導致「下週三」被當成本週三。改為前綴與單位分離。
  { name: '星期', eg: '下週三／這週五／週3／星期二／下週末',
    run: function (text, base) {
      let target, prefix, span;

      // [3.0] 括號內的星期是「註記」不是日期本體。
      //       「9/19（週六）運動會」若讓星期規則先命中，會變成最近的週六，
      //       整個日期都跑掉。這裡跳過被括號包住的匹配。
      const m = firstUnbracketedMatch_(text,
        /(下下|下個|下|本個|本|這個|這)?\s*(?:週|周|星期|禮拜)\s*([一二三四五六日天]|[1-7])/g);
      if (m) {
        target = chineseWeekday_(m[2]);
        prefix = m[1] || '';
        span = trimSpan_(text, { start: m.index, len: m[0].length });
      } else {
        const w = firstUnbracketedMatch_(text,
          /(下下|下個|下|本個|本|這個|這)?\s*(?:週末|周末)/g);
        if (!w) return null;
        target = 6;                       // 週末以週六為準
        prefix = w[1] || '';
        span = trimSpan_(text, { start: w.index, len: w[0].length });
      }
      if (target === undefined) return null;

      // 有「本／這／下／下下」時，以「日曆週」為準（週一為一週之始），
      // 而不是「下一個同星期」——否則週四說「下週三」會算成 +13 天。
      if (prefix) {
        const monday = startOfWeek_(base, 0);
        const dayIdx = (target === 0 ? 7 : target) - 1;
        let weeks = 0;
        if (/^下下/.test(prefix)) weeks = 2;
        else if (/^下/.test(prefix)) weeks = 1;
        return { date: addDays_(monday, weeks * 7 + dayIdx), span: span };
      }

      // 沒有修飾詞：指「下一個」該星期（今天符合就算今天）
      const offset = (target - base.getDay() + 7) % 7;
      return { date: addDays_(base, offset), span: span };
    } },

  // ── 純數字串（公文文號常見）──
  { name: '西元8碼', eg: '20260919',
    run: function (text) {
      const m = text.match(/(^|[^\d])((?:19|20)\d{2})(\d{2})(\d{2})(?!\d)/);
      if (!m || !isValidMonthDay_(Number(m[3]), Number(m[4]))) return null;
      const lead = m[1].length;
      return validatedDateResult_(Number(m[2]), Number(m[3]), Number(m[4]),
        m.index + lead, m[0].length - lead);
    } },

  { name: '民國7碼', eg: '1150919',
    run: function (text) {
      const m = text.match(/(^|[^\d])(1\d{2})(\d{2})(\d{2})(?!\d)/);
      if (!m || !isValidMonthDay_(Number(m[3]), Number(m[4]))) return null;
      const lead = m[1].length;
      return validatedDateResult_(Number(m[2]) + 1911, Number(m[3]), Number(m[4]),
        m.index + lead, m[0].length - lead);
    } },

  // ── 年月日 ──
  { name: '年月日', eg: '115年9月19日／民國115年9月19日／2026年9月19日',
    run: function (text) {
      const m = text.match(/(?:民國\s*)?(\d{3,4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*[日號]?/);
      if (!m) return null;
      let year = Number(m[1]);
      if (year < 1911) year += 1911;     // 民國轉西元
      return validatedDateResult_(year, Number(m[2]), Number(m[3]), m.index, m[0].length);
    } },

  // [2.9] 公文與通知的日期幾乎都寫成 115.09.19。
  //       前後邊界都排除數字與 . / - ，否則 192.168.1.1 會從中間的
  //       「168.1.1」被切出來，誤判成民國 168 年（實測過）。
  { name: '民國點分隔', eg: '115.09.19／115/9/19／115-09-19',
    run: function (text) {
      const m = text.match(/(^|[^\d.\/\-])(1\d{2})\s*[.\/\-]\s*(\d{1,2})\s*[.\/\-]\s*(\d{1,2})(?![\d.\/\-])/);
      if (!m || !isValidMonthDay_(Number(m[3]), Number(m[4]))) return null;
      const lead = m[1].length;
      return validatedDateResult_(Number(m[2]) + 1911, Number(m[3]), Number(m[4]),
        m.index + lead, m[0].length - lead);
    } },

  { name: '西元點分隔', eg: '2026.09.19／2026/9/19／2026-09-19',
    run: function (text) {
      const m = text.match(/(\d{4})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{1,2})(?![\d.\/\-])/);
      if (!m || !isValidMonthDay_(Number(m[2]), Number(m[3]))) return null;
      return validatedDateResult_(Number(m[1]), Number(m[2]), Number(m[3]), m.index, m[0].length);
    } },

  // ── 相對月份 ──
  { name: '相對月加日', eg: '下個月5號／這個月20日',
    run: function (text, base) {
      const m = text.match(new RegExp('(下下|下|這|本|上上|上)\\s*個?\\s*月\\s*([' + CN_D + '\\d]{1,3})\\s*[日號]'));
      if (!m) return null;
      const day = anyNum_(m[2]);
      if (!(day >= 1 && day <= 31)) return null;
      const t = shiftMonth_(startOfMonth_(base), monthPrefixShift_(m[1]));
      return validatedDateResult_(t.getFullYear(), t.getMonth() + 1, day, m.index, m[0].length);
    } },

  { name: '月份加旬', eg: '9月上旬／9月中旬／9月底',
    run: function (text, base) {
      const m = text.match(new RegExp('([' + CN_D + '\\d]{1,3})\\s*月\\s*(上旬|中旬|下旬|初|中|底|末)'));
      if (!m) return null;
      const month = anyNum_(m[1]);
      if (!(month >= 1 && month <= 12)) return null;
      let year = base.getFullYear();
      if (new Date(year, month - 1, 1) < startOfMonth_(base)) year++;
      const tag = m[2];
      let day;
      if (tag === '初') day = 1;
      else if (tag === '上旬') day = 5;
      else if (tag === '中' || tag === '中旬') day = 15;
      else if (tag === '下旬') day = 25;
      else day = lastDayOfMonth_(year, month);
      return validatedDateResult_(year, month, day, m.index, m[0].length);
    } },

  { name: '月初中底', eg: '月底／月初／下個月底',
    run: function (text, base) {
      const m = text.match(/(下下|下|這|本|上上|上)?\s*個?\s*月\s*(初|中旬|中|底|末)/);
      if (!m) return null;
      const t = shiftMonth_(startOfMonth_(base), monthPrefixShift_(m[1]));
      const year = t.getFullYear(), month = t.getMonth() + 1;
      const tag = m[2];
      let day;
      if (tag === '初') day = 1;
      else if (tag === '中' || tag === '中旬') day = 15;
      else day = lastDayOfMonth_(year, month);
      return validatedDateResult_(year, month, day, m.index, m[0].length);
    } },

  // ── 月日 ──
  { name: '中文月日', eg: '九月十九日／八月二十號',
    run: function (text, base) {
      const m = text.match(/([一二三四五六七八九十]{1,3})\s*月\s*([一二三四五六七八九十]{1,3})\s*[日號]/);
      if (!m) return null;
      const month = parseChineseNumber_(m[1]), day = parseChineseNumber_(m[2]);
      if (!isValidMonthDay_(month, day)) return null;
      return yearGuess_(base, month, day, m.index, m[0].length);
    } },

  { name: '月日', eg: '9月19日／9月19號',
    run: function (text, base) {
      const m = text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*[日號]?/);
      if (!m || !isValidMonthDay_(Number(m[1]), Number(m[2]))) return null;
      return yearGuess_(base, Number(m[1]), Number(m[2]), m.index, m[0].length);
    } },

  { name: '日期範圍', eg: '9/19-9/21／9/19~21（取開始日）',
    run: function (text, base) {
      const m = text.match(/(^|[^\d.\/\-])(\d{1,2})[\/\-](\d{1,2})\s*[-~～至到–—]\s*(?:\d{1,2}[\/\-])?\d{1,2}(?![\d\/\-])/);
      if (!m || !isValidMonthDay_(Number(m[2]), Number(m[3]))) return null;
      const lead = m[1].length;
      return yearGuess_(base, Number(m[2]), Number(m[3]), m.index + lead, m[0].length - lead);
    } },

  // [修正] 原本要求前後空白，「5/10下午2點」抓不到。改為非數字邊界。
  // 括號星期（9/19(五)）一併吃掉，才不會殘留在標題裡。
  { name: '月/日', eg: '9/19／9-19／9/19(五)',
    run: function (text, base) {
      const m = text.match(/(^|[^\d.\/\-])(\d{1,2})[\/\-](\d{1,2})(?![\d\/\-])(\s*[（(]\s*(?:週|周|星期|禮拜)?\s*[一二三四五六日天]\s*[)）])?/);
      if (!m || !isValidMonthDay_(Number(m[2]), Number(m[3]))) return null;
      const lead = m[1].length;
      return yearGuess_(base, Number(m[2]), Number(m[3]), m.index + lead, m[0].length - lead);
    } },

  // 最弱的規則，放最後：只寫日、沒寫月
  { name: '單獨日', eg: '19號／20日（本月，已過則下月）',
    run: function (text, base) {
      const m = text.match(new RegExp(
        '(^|[^\\d])([' + CN_D + '\\d]{1,3})\\s*[日號](?!\\d)' +
        '(?!\\s*(?:教室|樓|館|室|桌|櫃|巷|弄|之|字|函|公報|公告))'
      ));
      if (!m) return null;
      const day = anyNum_(m[2]);
      if (!(day >= 1 && day <= 31)) return null;
      const lead = m[1].length;
      return monthGuess_(base, day, m.index + lead, m[0].length - lead);
    } }
];

function parseDate_(rawText, now) {
  // [2.9] 在解析器入口正規化，而不是只在 maskDecoys_ 裡做。
  //       否則沒走 maskDecoys_ 的呼叫端（例如「截止：」分支）仍讀不懂全形。
  //       轉換為 1:1、長度不變，回傳的 span 仍可套回原文。
  const text = normalizeWidth_(rawText);
  const base = startOfDay_(now);

  for (let i = 0; i < DATE_RULES.length; i++) {
    const hit = DATE_RULES[i].run(text, base);
    if (hit) return hit;
  }
  return null;
}

// 把支援清單列出來，給 /日期 指令與解析失敗提示共用
function listDateFormats() {
  const lines = ['=== 看得懂的日期寫法 ==='];
  DATE_RULES.forEach(function (r, i) {
    lines.push(String(i + 1).padStart(2, ' ') + '. ' + r.name + '　' + r.eg);
  });
  const text = lines.join('\n');
  console.log(text);
  return text;
}

// [2.6 新] 便宜的前置過濾。真正的日曆合法性（例如 2/30）仍由 validatedDateResult_ 把關。
function isValidMonthDay_(month, day) {
  return Number.isFinite(month) && Number.isFinite(day) &&
    month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

function validatedDateResult_(year, month, day, start, len) {
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('日期不存在');
  }
  return { date: date, span: { start: start, len: len } };
}

const PERIOD_GROUP = '(上午|早上|清晨|凌晨|半夜|中午|下午|傍晚|晚上|夜間)';
const CN_NUM = '[零〇一二兩三四五六七八九十\\d]{1,3}';

function parseTimeRange_(rawText) {
  const text = normalizeWidth_(rawText);   // [2.9] 同上，長度不變
  const result = {
    hasTime: false,
    startHour: null,
    startMinute: 0,
    endHour: null,
    endMinute: 0,
    span: null
  };

  const P = PERIOD_GROUP + '?\\s*';
  const SEP = '\\s*(?:-|~|～|至|到|—|–)\\s*';

  // 1) 09:00-11:00
  let m = text.match(new RegExp(P + '(\\d{1,2})\\s*[:：]\\s*(\\d{2})' + SEP + P + '(\\d{1,2})\\s*[:：]\\s*(\\d{2})'));
  if (m) {
    result.hasTime = true;
    result.startHour = normalizeHour_(Number(m[2]), m[1]);
    result.startMinute = Number(m[3]);
    result.endHour = normalizeHour_(Number(m[5]), m[4] || m[1]);
    result.endMinute = Number(m[6]);
    result.span = trimSpan_(text, { start: m.index, len: m[0].length });
    validateTimeResult_(result);
    return result;
  }

  // 2) 上午九點半到十一點／上午9時至下午4時
  //    [3.2] 公文一律寫「時」不寫「點」（上午9時30分），舊版只認「點」，
  //          於是公文抽到日期卻永遠抓不到時間，全部變成全天事件。
  m = text.match(new RegExp(P + '(' + CN_NUM + ')\\s*[點時]\\s*(半|' + CN_NUM + '\\s*分?)?' + SEP + P + '(' + CN_NUM + ')\\s*[點時]\\s*(半|' + CN_NUM + '\\s*分?)?'));
  if (m) {
    result.hasTime = true;
    result.startHour = normalizeHour_(parseChineseNumber_(m[2]), m[1]);
    result.startMinute = parseMinute_(m[3]);
    result.endHour = normalizeHour_(parseChineseNumber_(m[5]), m[4] || m[1]);
    result.endMinute = parseMinute_(m[6]);
    result.span = trimSpan_(text, { start: m.index, len: m[0].length });
    validateTimeResult_(result);
    return result;
  }

  // 3) 14:30
  m = text.match(new RegExp(P + '(\\d{1,2})\\s*[:：]\\s*(\\d{2})'));
  if (m) {
    result.hasTime = true;
    result.startHour = normalizeHour_(Number(m[2]), m[1]);
    result.startMinute = Number(m[3]);
    result.span = trimSpan_(text, { start: m.index, len: m[0].length });
    validateTimeResult_(result);
    return result;
  }

  // 4) 下午兩點半／下午2時30分
  m = text.match(new RegExp(P + '(' + CN_NUM + ')\\s*[點時]\\s*(半|' + CN_NUM + '\\s*分?)?'));
  if (m) {
    result.hasTime = true;
    result.startHour = normalizeHour_(parseChineseNumber_(m[2]), m[1]);
    result.startMinute = parseMinute_(m[3]);
    result.span = trimSpan_(text, { start: m.index, len: m[0].length });
    validateTimeResult_(result);
  }

  return result;
}

function validateTimeResult_(result) {
  const validStart = result.startHour >= 0 && result.startHour <= 23 &&
    result.startMinute >= 0 && result.startMinute <= 59;
  const validEnd = result.endHour === null ||
    (result.endHour >= 0 && result.endHour <= 23 && result.endMinute >= 0 && result.endMinute <= 59);
  if (!validStart || !validEnd) throw new Error('時間格式不正確');
}

// [修正] 補上 凌晨／清晨／傍晚／夜間／半夜
function normalizeHour_(hour, period) {
  const p = period || '';
  if (hour < 0 || hour > 23) return hour;
  if (/凌晨|半夜/.test(p)) return hour === 12 ? 0 : hour;
  if (/上午|早上|清晨/.test(p)) return hour === 12 ? 0 : hour;
  if (/中午/.test(p)) return hour < 11 ? hour + 12 : hour;
  if (/下午|傍晚|晚上|夜間/.test(p)) return hour < 12 ? hour + 12 : hour;
  return hour;
}

function parseMinute_(text) {
  if (!text) return 0;
  const s = String(text).trim();
  if (s === '半') return 30;
  return parseChineseNumber_(s.replace(/分/g, '').trim());
}

function parseChineseNumber_(value) {
  const s = String(value).trim();
  if (/^\d+$/.test(s)) return Number(s);
  const map = { 零: 0, 〇: 0, 一: 1, 二: 2, 兩: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  if (s === '十') return 10;
  if (s.indexOf('十') >= 0) {
    const parts = s.split('十');
    const tens = parts[0] ? map[parts[0]] : 1;
    const ones = parts[1] ? map[parts[1]] : 0;
    if (tens === undefined || ones === undefined) throw new Error('無法辨識數字：' + value);
    return tens * 10 + ones;
  }
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] === undefined) throw new Error('無法辨識數字：' + value);
    out += String(map[s[i]]);
  }
  return Number(out);
}

function chineseWeekday_(char) {
  // [3.0] 一併支援「週3」「星期7」這種數字寫法（7 視為星期日）
  return {
    日: 0, 天: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6,
    '7': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6
  }[char];
}

// [修正] 必須有「提前／提早」或「…前」，避免把「8點20分提醒我」的 20 分吃掉。
// 另外本函式一律在「時間片段已被遮蔽」的文字上執行。
function parseReminderSuffix_(probe) {
  const out = { minutes: null, span: null };

  let m = probe.match(/(?:不提醒|不用提醒|免提醒|不必提醒)/);
  if (m) {
    out.minutes = 0;
    out.span = { start: m.index, len: m[0].length };
    return out;
  }

  const QTY = '(半小時|半天|\\d+\\s*(?:分鐘|分|小時|鐘頭|天))';
  m = probe.match(new RegExp('(?:提前|提早)\\s*' + QTY + '\\s*(?:前)?\\s*(?:再|才)?\\s*(?:提醒|通知)?'));
  if (!m) m = probe.match(new RegExp(QTY + '\\s*前\\s*(?:再|才)?\\s*(?:提醒|通知)'));
  if (!m) return out;

  out.span = { start: m.index, len: m[0].length };
  const value = m[1].replace(/\s/g, '');

  if (value === '半小時') out.minutes = 30;
  else if (value === '半天') out.minutes = 720;
  else if (/天$/.test(value)) out.minutes = Number(value.replace('天', '')) * 1440;
  else if (/小時|鐘頭$/.test(value)) out.minutes = Number(value.replace(/小時|鐘頭/, '')) * 60;
  else out.minutes = Number(value.replace(/分鐘|分/g, ''));

  if (!Number.isFinite(out.minutes) || out.minutes < 0) { out.minutes = null; out.span = null; }
  if (out.minutes !== null) out.minutes = Math.min(out.minutes, 40320);
  return out;
}

function parseLocation_(probe) {
  const m1 = probe.match(/(?:地點|地址)\s*[:：]\s*([^\s，,。；;]{1,40})/);
  if (m1) return { location: m1[1].trim(), span: { start: m1.index, len: m1[0].length } };

  // [2.6 修] 原本 /@\s*(...)/ 會把 email 的網域當成地點
  //          （「通知 abc@school.edu」→ 地點變成 school.edu）。
  //          現在要求 @ 前面是句首或空白／標點，且網域內不得再出現 @。
  const m2 = probe.match(/(^|[\s，,。；;、（(])@\s*([^\s，,。；;、）)@]{1,40})/);
  if (!m2) return { location: '', span: null };
  const lead = m2[1].length;
  return {
    location: m2[2].trim(),
    span: { start: m2.index + lead, len: m2[0].length - lead }
  };
}

/* ============================================================
 * 六、組出行事曆事件
 * ============================================================ */

function parseCalendarInput_(rawText, now, kind) {
  if (!rawText) throw new Error('沒有輸入內容');

  // [3.0] 先展開口語縮寫（明早→明天早上）。展開後的文字一路用到底，
  //       標題也從它算，內部長度一致；寫進 Docs 的仍是使用者原文。
  const text = expandSynonyms_(String(rawText));

  // probe 與 text 等長，索引可互相對齊
  let probe = maskDecoys_(text);
  const spans = [];

  const dateInfo = parseDate_(probe, now);
  if (!dateInfo) throw new Error('找不到日期');
  spans.push(dateInfo.span);
  probe = maskSpan_(probe, dateInfo.span);

  const timeInfo = parseTimeRange_(probe);
  if (timeInfo.span) { spans.push(timeInfo.span); probe = maskSpan_(probe, timeInfo.span); }

  const reminderInfo = parseReminderSuffix_(probe);
  if (reminderInfo.span) { spans.push(reminderInfo.span); probe = maskSpan_(probe, reminderInfo.span); }

  const locationInfo = parseLocation_(probe);
  if (locationInfo.span) { spans.push(locationInfo.span); probe = maskSpan_(probe, locationInfo.span); }

  // 日期時間被切掉後，意圖詞可能才跑到句首，這裡再清一次
  // [2.6 修] 原本 ^(前|以前|要|去|到|有)\s* 沒有邊界要求，
  //          「明天9點到校服務」會被削成「校服務」，「到職」「有氧課程」同樣受害。
  //          改為必須後接空白才視為贅詞。
  let title = removeSpans_(text, spans)
    .replace(/^(請)?(提醒我|提醒一下|別忘了|不要忘記|勿忘|記得)\s*/, '')
    .replace(/^(前|以前|要|去|到|有)(?=\s)\s*/, '')
    .trim();
  if (!title) throw new Error('找不到事項名稱');

  const explicitReminder = reminderInfo.minutes !== null;
  const reminderMinutes = explicitReminder
    ? reminderInfo.minutes
    : getDefaultReminder_(kind);

  if (!timeInfo.hasTime) {
    if (kind === '提醒事項') {
      timeInfo.hasTime = true;
      timeInfo.startHour = 9;
      timeInfo.startMinute = 0;
    } else {
      return {
        kind: kind,
        title: title,
        calendarTitle: title,
        location: locationInfo.location,
        allDay: true,
        start: startOfDay_(dateInfo.date),
        end: addDays_(startOfDay_(dateInfo.date), 1),
        // [2.6 修] 全天事件的提醒是相對「當天 00:00」計算，
        //          沿用 30 分鐘會在前一晚 23:30 跳通知。
        //          使用者沒有明講時改用全天專用預設（240 分 = 前一天 20:00）。
        reminderMinutes: explicitReminder ? reminderMinutes : getAllDayReminder_()
      };
    }
  }

  const y = dateInfo.date.getFullYear();
  const mo = dateInfo.date.getMonth();
  const d = dateInfo.date.getDate();
  const start = new Date(y, mo, d, timeInfo.startHour, timeInfo.startMinute, 0, 0);

  let end;
  if (timeInfo.endHour !== null) {
    end = new Date(y, mo, d, timeInfo.endHour, timeInfo.endMinute, 0, 0);
    // [修正] 「上午11點到1點」原本會變成隔天凌晨。先試同日下午，再退回跨日。
    if (end <= start) {
      const plus12 = new Date(end.getTime() + 12 * 3600000);
      end = (plus12 > start && plus12.getTime() - start.getTime() <= 12 * 3600000)
        ? plus12
        : new Date(end.getTime() + 86400000);
    }
  } else {
    end = new Date(start.getTime() + APP.DEFAULT_EVENT_MINUTES * 60000);
  }

  return {
    kind: kind,
    title: title,
    calendarTitle: kind === '提醒事項' ? '提醒｜' + title : title,
    location: locationInfo.location,
    allDay: false,
    start: start,
    end: end,
    reminderMinutes: reminderMinutes
  };
}

function createCalendarEvent_(data) {
  const calendar = getCalendar_();
  const options = {};
  if (data.location) options.location = data.location;
  options.description = EVENT_TAG + '（' + APP.VERSION + '）';

  const event = data.allDay
    ? calendar.createAllDayEvent(data.calendarTitle, data.start, options)
    : calendar.createEvent(data.calendarTitle, data.start, data.end, options);

  if (data.reminderMinutes > 0) {
    try {
      event.addPopupReminder(Math.max(5, Math.min(data.reminderMinutes, 40320)));
    } catch (err) {
      console.warn('提醒設定失敗：' + getErrorMessage_(err));
    }
  }

  return {
    id: event.getId(),
    calendarId: calendar.getId(),
    kind: data.kind,
    title: data.title,
    location: data.location || '',
    start: data.start,
    end: data.end,
    allDay: data.allDay,
    reminderMinutes: data.reminderMinutes
  };
}

// [2.6 新] 撤銷與回滾共用。回傳是否確實刪掉了事件。
function deleteCalendarEvent_(calendarId, eventId) {
  if (!eventId) return false;
  try {
    const calendar = calendarId ? CalendarApp.getCalendarById(calendarId) : getCalendar_();
    if (!calendar) return false;
    const event = calendar.getEventById(eventId);
    if (!event) return false;
    event.deleteEvent();
    return true;
  } catch (err) {
    console.warn('刪除行事曆事件失敗：' + getErrorMessage_(err));
    return false;
  }
}

function getCalendar_() {
  const id = PropertiesService.getScriptProperties().getProperty('GOOGLE_CALENDAR_ID');
  if (!id) return CalendarApp.getDefaultCalendar();
  const calendar = CalendarApp.getCalendarById(id);
  if (!calendar) throw new Error('找不到 GOOGLE_CALENDAR_ID 對應的行事曆');
  return calendar;
}

// [2.6 新] 全天事件專用預設提醒（Script Property：ALLDAY_REMINDER_MINUTES）
/**
 * [3.2 改] 全天事件的提醒分鐘數。
 * 優先看 ALLDAY_REMIND_CLOCK（HH:MM，直覺）；
 * 舊的 ALLDAY_REMINDER_MINUTES 仍然有效，設了就以它為準。
 */
function getAllDayReminder_() {
  const props = PropertiesService.getScriptProperties();

  const raw = props.getProperty('ALLDAY_REMINDER_MINUTES');
  if (raw !== null && String(raw).trim() !== '') {
    const value = Number(raw);
    if (Number.isFinite(value) && value >= 0) return value;
  }

  const fromClock = clockToAllDayMinutes_(
    props.getProperty('ALLDAY_REMIND_CLOCK') || APP.ALLDAY_REMIND_CLOCK
  );
  return fromClock === null ? APP.DEFAULT_ALLDAY_REMINDER_MINUTES : fromClock;
}

/**
 * 'HH:MM' → 全天事件要用的「提前幾分鐘」。
 * 全天事件起點是當天 00:00，提醒必須早於起點，
 * 因此 07:30 通知 = 1440 - 450 = 990 分鐘前 = 前一天 07:30。
 */
function clockToAllDayMinutes_(clock) {
  const m = String(clock || '').match(/^(\d{1,2})\s*[:：]\s*(\d{1,2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (!(h >= 0 && h <= 23 && mi >= 0 && mi <= 59)) return null;
  const minutes = 1440 - (h * 60 + mi);
  return minutes > 0 ? minutes : null;
}

function getDefaultReminder_(kind) {
  const props = PropertiesService.getScriptProperties();
  const key = kind === '提醒事項' ? 'TODO_REMINDER_MINUTES' : 'EVENT_REMINDER_MINUTES';
  const fallback = kind === '提醒事項'
    ? APP.DEFAULT_TODO_REMINDER_MINUTES
    : APP.DEFAULT_EVENT_REMINDER_MINUTES;
  // [修正] 原本 Number(null) === 0 會被判定合法，導致預設提醒永遠變成「不通知」
  const raw = props.getProperty(key);
  if (raw === null || String(raw).trim() === '') return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

/* ============================================================
 * 七、Google Docs：註冊表、寫入、撤銷
 * ============================================================ */

function docKey_(date) {
  return APP.MONTHLY_DOC ? Utilities.formatDate(date, APP.TZ, 'yyyyMM') : 'MAIN';
}

function readRegistry_() {
  try {
    return JSON.parse(PropertiesService.getScriptProperties().getProperty('DOC_REGISTRY') || '{}');
  } catch (err) {
    return {};
  }
}

function writeRegistry_(reg) {
  // [2.6 修] 按月累積，Script Property 單一值上限約 9KB，長期會逼近上限。
  //          只保留最近 REGISTRY_MAX_KEYS 個月（'MAIN' 為非月份鍵，排序後恆在最前，一定保留）。
  let target = reg;
  const keys = Object.keys(reg);
  if (keys.length > APP.REGISTRY_MAX_KEYS) {
    const keep = keys.sort().reverse().slice(0, APP.REGISTRY_MAX_KEYS);
    target = {};
    keep.forEach(function (k) { target[k] = reg[k]; });
  }
  PropertiesService.getScriptProperties().setProperty('DOC_REGISTRY', JSON.stringify(target));
}

function saveRegistryEntry_(key, entry) {
  const reg = readRegistry_();
  reg[key] = entry;
  writeRegistry_(reg);
}

// 2.1 舊資料接軌：把原本的單一文件掛到「當月」，之後才開始分月
function migrateLegacyDoc_() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('MIGRATED_V22') === '1') return;

  const legacyId = props.getProperty('JOURNAL_DOC_ID');
  if (legacyId) {
    const reg = readRegistry_();
    const key = docKey_(new Date());
    if (!reg[key]) {
      reg[key] = {
        id: legacyId,
        header: 0,
        topDate: props.getProperty('TOP_JOURNAL_DATE') || ''
      };
      writeRegistry_(reg);
    }
  }
  props.setProperty('MIGRATED_V22', '1');
}

// [修正] 不再寫死 3。掃描第一條水平線的位置，得到真正的表頭長度。
function detectHeaderChildren_(doc) {
  const body = doc.getBody();
  const n = Math.min(body.getNumChildren(), 12);
  for (let i = 0; i < n; i++) {
    if (body.getChild(i).getType() === DocumentApp.ElementType.HORIZONTAL_RULE) {
      return i + 1;
    }
  }
  return APP.FALLBACK_HEADER_CHILDREN;
}

function createJournalDoc_(date) {
  const props = PropertiesService.getScriptProperties();
  const base = props.getProperty('JOURNAL_DOC_TITLE') || APP.DOC_TITLE;
  const title = APP.MONTHLY_DOC
    ? base + '（' + Utilities.formatDate(date, APP.TZ, 'yyyy年M月') + '）'
    : base;

  const doc = DocumentApp.create(title);
  const body = doc.getBody();
  body.appendParagraph(title).setHeading(DocumentApp.ParagraphHeading.TITLE);
  body.appendParagraph('最新日期與最新紀錄顯示在上方；LINE 內容會自動判斷行事曆、提醒或筆記。');
  body.appendHorizontalRule();
  doc.saveAndClose();

  const folderId = props.getProperty('JOURNAL_FOLDER_ID');
  if (folderId) {
    try {
      DriveApp.getFileById(doc.getId()).moveTo(DriveApp.getFolderById(folderId));
    } catch (err) {
      console.warn('移動文件到指定資料夾失敗：' + getErrorMessage_(err));
    }
  }

  return DocumentApp.openById(doc.getId());
}

function getJournalContext_(date) {
  migrateLegacyDoc_();

  const key = docKey_(date);
  const reg = readRegistry_();
  let entry = reg[key];
  let doc = null;
  let dirty = false;

  if (entry && entry.id) {
    try {
      doc = DocumentApp.openById(entry.id);
    } catch (err) {
      console.warn('文件無法開啟，將重新建立：' + getErrorMessage_(err));
      entry = null;
    }
  }

  if (!doc) {
    doc = createJournalDoc_(date);
    entry = { id: doc.getId(), header: 0, topDate: '' };
    dirty = true;
  }

  if (!entry.header) {
    entry.header = detectHeaderChildren_(doc);
    dirty = true;
  }

  if (dirty) saveRegistryEntry_(key, entry);
  return { key: key, entry: entry, doc: doc };
}

function getOrCreateJournalDoc_() {
  return getJournalContext_(new Date()).doc;
}

function appendToJournalDoc_(entry) {
  const lock = LockService.getScriptLock();
  // [修正] 原本等 30 秒，replyToken 早已失效。改為 10 秒並明確報錯。
  if (!lock.tryLock(APP.LOCK_WAIT_MS)) throw new Error('系統忙碌中，請 10 秒後再送一次');

  try {
    const ctx = getJournalContext_(entry.receivedAt);
    const doc = ctx.doc;
    const body = doc.getBody();
    const header = ctx.entry.header;
    const dateKey = formatChineseDate_(entry.receivedAt);

    let index = header;
    let insertedCount = 0;
    let createdDateHeader = false;

    if ((ctx.entry.topDate || '') !== dateKey) {
      body.insertParagraph(index++, dateKey).setHeading(DocumentApp.ParagraphHeading.HEADING1);
      body.insertHorizontalRule(index++);
      insertedCount += 2;
      createdDateHeader = true;
    } else {
      index += 2;
    }

    const timeText = Utilities.formatDate(entry.receivedAt, APP.TZ, 'HH:mm');
    body.insertParagraph(index++, timeText + '｜' + entry.type)
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    insertedCount++;

    const contentText = entry.isTask ? TASK_OPEN + ' ' + entry.text : entry.text;
    body.insertParagraph(index++, contentText).setSpacingAfter(4);
    insertedCount++;

    if (entry.calendarResult) {
      body.insertParagraph(index++, buildDocScheduleLine_(entry.calendarResult))
        .editAsText().setForegroundColor('#555555');
      insertedCount++;

      if (entry.calendarResult.location) {
        body.insertParagraph(index++, '地點：' + entry.calendarResult.location)
          .editAsText().setForegroundColor('#555555');
        insertedCount++;
      }

      body.insertParagraph(index++, '提醒：' + formatReminderText_(entry.calendarResult.reminderMinutes, entry.calendarResult.allDay))
        .editAsText().setForegroundColor('#555555');
      insertedCount++;
    }

    if (entry.calendarError) {
      body.insertParagraph(index++, '未建立行事曆：' + entry.calendarError)
        .editAsText().setForegroundColor('#B00020');
      insertedCount++;
    }

    // [3.1 新] 附加行（檔案連結、地圖連結…）。連結只掛在網址上，前綴文字保持純文字。
    (entry.extraLines || []).forEach(function (line) {
      const prefix = String(line.prefix || '');
      const url = String(line.url || '');
      const full = line.text ? String(line.text) : (prefix + url);
      const para = body.insertParagraph(index++, full);
      const t = para.editAsText();
      t.setForegroundColor('#555555');
      if (url && full.indexOf(url) >= 0) {
        const from = full.indexOf(url);
        try { t.setLinkUrl(from, from + url.length - 1, url); }
        catch (err) { console.warn('連結設定失敗：' + getErrorMessage_(err)); }
      }
      insertedCount++;
    });

    body.insertParagraph(index, '');
    insertedCount++;

    doc.saveAndClose();

    ctx.entry.topDate = dateKey;
    saveRegistryEntry_(ctx.key, ctx.entry);

    // [2.7 新] 雙寫索引試算表。Docs 是真相來源，索引寫失敗只記警告，
    //          不讓使用者的紀錄因為試算表問題而遺失。
    const uid = newUid_();
    try {
      indexAppendRow_({
        uid: uid,
        createdAt: entry.receivedAt,
        type: entry.type,
        content: entry.text,
        status: entry.isTask ? STATUS_TODO : STATUS_NONE,
        due: entry.due || null,
        docKey: ctx.key,
        docId: doc.getId(),
        calendarId: entry.calendarResult ? entry.calendarResult.calendarId : '',
        eventId: entry.calendarResult ? entry.calendarResult.id : '',
        line: contentText,
        location: entry.calendarResult ? (entry.calendarResult.location || '') : '',
        attach: entry.attachUrl || ''          // [3.1 新] 附件連結
      });
    } catch (err) {
      console.warn('索引寫入失敗（Docs 已成功寫入）：' + getErrorMessage_(err));
    }

    pushUndoStack_({
      uid: uid,
      docKey: ctx.key,
      docId: doc.getId(),
      header: header,
      insertedCount: insertedCount,
      createdDateHeader: createdDateHeader,
      dateKey: dateKey,
      calendarEventId: entry.calendarResult ? entry.calendarResult.id : '',
      calendarId: entry.calendarResult ? entry.calendarResult.calendarId : '',
      text: entry.text,
      createdAt: entry.receivedAt.toISOString(),
      driveFileId: entry.driveFileId || ''     // [3.1 新] 撤銷時連檔案一起收回
    });

    // [3.3] 回傳 uid 與段落位置，讓呼叫端可以立刻對這一筆做後續操作
    //（改判待辦、網頁台編輯）。舊呼叫端忽略回傳值，不受影響。
    return {
      uid: uid,
      docId: doc.getId(),
      docKey: ctx.key,
      line: contentText,
      isTask: !!entry.isTask
    };
  } finally {
    lock.releaseLock();
  }
}

function readUndoStack_() {
  try {
    return JSON.parse(PropertiesService.getScriptProperties().getProperty('UNDO_STACK') || '[]');
  } catch (err) {
    return [];
  }
}

function writeUndoStack_(stack) {
  const trimmed = stack.slice(0, APP.UNDO_STACK_SIZE);
  const props = PropertiesService.getScriptProperties();
  try {
    props.setProperty('UNDO_STACK', JSON.stringify(trimmed));
  } catch (err) {
    // [2.6 新] 萬一仍超過屬性上限，逐步降級而不是讓整筆寫入失敗
    console.warn('撤銷堆疊寫入失敗，改存最近 1 筆：' + getErrorMessage_(err));
    try {
      props.setProperty('UNDO_STACK', JSON.stringify(trimmed.slice(0, 1)));
    } catch (err2) {
      console.warn('撤銷堆疊仍無法寫入，已清空：' + getErrorMessage_(err2));
      props.deleteProperty('UNDO_STACK');
    }
  }
}

function pushUndoStack_(meta) {
  // [2.6 修] 原本存完整原文。LINE 單則上限 5000 字，中文 UTF-8 約 15KB，
  //          單一 Script Property 上限僅約 9KB —— 一筆長訊息就會讓 setProperty 拋錯，
  //          連帶使整個寫入流程失敗。這裡先截斷。
  const safe = {};
  Object.keys(meta).forEach(function (k) { safe[k] = meta[k]; });
  safe.text = String(meta.text || '').slice(0, APP.UNDO_TEXT_MAX);

  const stack = readUndoStack_();
  stack.unshift(safe);
  writeUndoStack_(stack);
}

/**
 * [新] 多層撤銷
 * [2.6 修] 回傳改為 { ok, message }。
 *
 * 關鍵修正：撤銷的起始位置必須看 createdDateHeader。
 *   ・該天第一筆（createdDateHeader = true）：
 *     插入內容從 header 開始（含日期標題與水平線）→ removeIndex = header
 *   ・同一天第二筆之後（createdDateHeader = false）：
 *     插入內容從 header + 2 開始（跳過日期標題與水平線）→ removeIndex = header + 2
 *
 * 舊版一律用 header，會刪掉「日期標題 + 水平線」，反而把要撤銷的內容留在文件裡，
 * 而且 detectTopDate_ 隨後回傳空字串，下一筆又重建日期標題，文件會越用越亂。
 * 這個錯誤不會拋任何例外，是靜默損壞。
 */
function undoLastEntry_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(APP.LOCK_WAIT_MS)) {
    return { ok: false, message: '系統忙碌中，請稍後再試。' };
  }

  try {
    const stack = readUndoStack_();
    if (!stack.length) return { ok: false, message: '目前沒有可撤銷的紀錄。' };

    const meta = stack.shift();
    writeUndoStack_(stack);

    const headerLen = Number(meta.header || APP.FALLBACK_HEADER_CHILDREN);
    const removeIndex = headerLen + (meta.createdDateHeader ? 0 : 2);

    let docNote = '';
    let docRemoved = false;
    let doc = null;

    try {
      doc = DocumentApp.openById(meta.docId);
    } catch (err) {
      doc = null;
      docNote = '⚠️ 找不到對應文件，僅處理行事曆。';
    }

    if (doc) {
      const body = doc.getBody();
      const guard = undoFingerprintCheck_(body, removeIndex, meta);

      if (guard.ok) {
        for (let i = 0; i < Number(meta.insertedCount || 0); i++) {
          if (body.getNumChildren() > removeIndex + 1) {
            body.removeChild(body.getChild(removeIndex));
          }
        }
        // topDate 一律看 header 位置（日期標題的固定位置），不可用 removeIndex
        const newTopDate = detectTopDate_(body, headerLen);
        doc.saveAndClose();
        docRemoved = true;

        const reg = readRegistry_();
        if (reg[meta.docKey]) {
          reg[meta.docKey].topDate = newTopDate;
          writeRegistry_(reg);
        }
      } else {
        doc.saveAndClose();
        docNote = guard.message;
      }
    }

    const calRemoved = meta.calendarEventId
      ? deleteCalendarEvent_(meta.calendarId, meta.calendarEventId)
      : false;

    // [3.1 新] 歸檔的檔案一併移到垃圾桶（垃圾桶可還原，不直接永久刪除）
    let fileTrashed = false;
    if (meta.driveFileId) {
      try {
        DriveApp.getFileById(meta.driveFileId).setTrashed(true);
        fileTrashed = true;
      } catch (err) {
        console.warn('歸檔檔案移除失敗：' + getErrorMessage_(err));
      }
    }

    // [2.7 新] 同步移除索引列
    if (meta.uid) {
      try { indexDeleteByUid_(meta.uid); }
      catch (err) { console.warn('索引列刪除失敗：' + getErrorMessage_(err)); }
    }

    if (!docRemoved && !calRemoved && !fileTrashed) {
      return {
        ok: false,
        message: (docNote || '⚠️ 撤銷失敗。') +
          '\n\n這筆已從撤銷清單移除，如有殘留請直接到 Google Docs 手動刪除。'
      };
    }

    const lines = ['↩️ 已撤銷上一筆', String(meta.text || '').slice(0, APP.UNDO_TEXT_MAX)];
    if (fileTrashed) lines.push('🗑️ 歸檔檔案已移到雲端硬碟垃圾桶（可還原）');
    if (meta.driveFileId && !fileTrashed) lines.push('⚠️ 歸檔檔案未能移除，請手動確認。');
    if (!docRemoved) lines.push('', docNote + '\n（行事曆已刪除，Docs 內容請手動移除）');
    if (meta.calendarEventId && !calRemoved) lines.push('', '⚠️ 行事曆事件未能移除，請手動確認。');

    const remain = readUndoStack_().length;
    if (remain) lines.push('', '（還可再撤銷 ' + remain + ' 筆）');

    return { ok: true, message: lines.join('\n') };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [2.6 新] 撤銷指紋防呆。
 * 舊版直接照 index 盲刪，只要使用者在 Docs 頂端手動加過段落，
 * 撤銷就會刪掉別人的內容而且不會有任何警告。
 */
function undoFingerprintCheck_(body, removeIndex, meta) {
  const count = Number(meta.insertedCount || 0);
  if (!count) return { ok: false, message: '⚠️ 這筆紀錄沒有記錄可撤銷的段落數。' };

  if (body.getNumChildren() < removeIndex + count) {
    return { ok: false, message: '⚠️ 文件結構與紀錄不符（段落數不足），為安全起見中止撤銷。' };
  }

  const first = body.getChild(removeIndex);
  const firstText = first.getText ? first.getText().trim() : '';

  if (meta.createdDateHeader) {
    if (firstText !== String(meta.dateKey || '')) {
      return { ok: false, message: '⚠️ 文件最上方不是這筆紀錄的日期標題，可能已被手動編輯，撤銷中止。' };
    }
  } else if (!/^\d{2}:\d{2}｜/.test(firstText)) {
    return { ok: false, message: '⚠️ 文件最上方不是預期的紀錄開頭，可能已被手動編輯，撤銷中止。' };
  }

  // 內容比對：撤銷區塊裡要找得到原文開頭
  const probe = String(meta.text || '').trim().slice(0, 10);
  if (probe) {
    let found = false;
    for (let i = removeIndex; i < removeIndex + count; i++) {
      const child = body.getChild(i);
      if (child.getText && child.getText().indexOf(probe) >= 0) { found = true; break; }
    }
    if (!found) {
      return { ok: false, message: '⚠️ 文件內容與這筆紀錄對不起來，撤銷中止。' };
    }
  }

  return { ok: true, message: '' };
}

function detectTopDate_(body, header) {
  if (body.getNumChildren() <= header) return '';
  const child = body.getChild(header);
  if (!child.getText) return '';
  const text = child.getText().trim();
  return DATE_HEADING_RE.test(text) ? text : '';
}

/* ============================================================
 * 七之二、索引試算表（2.7 新增）
 *
 * 設計原則：
 *   ・Google Docs 仍是「人類可讀的正本」，寫入邏輯完全不變。
 *   ・試算表是「機器可讀的索引」，供待辦、搜尋、統計快速查詢。
 *   ・兩邊雙寫。試算表寫失敗只記警告，不影響 Docs（Docs 是真相來源）。
 *   ・所有查詢都是「索引優先、Docs 保底」，
 *     即使試算表被刪掉，系統仍可運作，只是慢一點。
 *   ・舊資料用 rebuildIndexFromDocs() 一次補建。
 * ============================================================ */

const SHEET = {
  NAME: '紀錄索引',
  HEADERS: [
    'UID', '建立時間', '日期', '時間', '類型', '內容',
    '狀態', '到期日', '完成時間', '文件月份', '文件ID',
    '行事曆ID', '事件ID', '段落文字', '地點', '附件連結',
    '備註', '完成說明', '刪除時間', '回收桶快照'
  ],
  COL: {
    UID: 1, CREATED: 2, DATE: 3, TIME: 4, TYPE: 5, CONTENT: 6,
    STATUS: 7, DUE: 8, DONE_AT: 9, DOC_KEY: 10, DOC_ID: 11,
    CAL_ID: 12, EVENT_ID: 13, PARA: 14, LOCATION: 15, ATTACH: 16,
    REMARK: 17, DONE_NOTE: 18, DELETED_AT: 19, TRASH_SNAPSHOT: 20
  }
};

const STATUS_TODO = '待辦';
const STATUS_DONE = '完成';
const STATUS_NONE = '—';
const STATUS_DOING = '進行中';   // [3.5]

// 同一次執行內快取，避免重複開檔
let __indexSheetCache = null;

function newUid_() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 12);
}

function getIndexSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('INDEX_SHEET_ID');

  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (err) {
      console.warn('索引試算表無法開啟，將重新建立：' + getErrorMessage_(err));
    }
  }

  const base = props.getProperty('JOURNAL_DOC_TITLE') || APP.DOC_TITLE;
  const ss = SpreadsheetApp.create(base + '（索引）');
  props.setProperty('INDEX_SHEET_ID', ss.getId());

  const folderId = props.getProperty('JOURNAL_FOLDER_ID');
  if (folderId) {
    try {
      DriveApp.getFileById(ss.getId()).moveTo(DriveApp.getFolderById(folderId));
    } catch (err) {
      console.warn('移動索引試算表失敗：' + getErrorMessage_(err));
    }
  }
  return ss;
}

function getIndexSheet_() {
  if (__indexSheetCache) return __indexSheetCache;

  const ss = getIndexSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET.NAME);
  if (!sheet) {
    const first = ss.getSheets()[0];
    if (first && first.getLastRow() === 0 && ss.getSheets().length === 1) {
      first.setName(SHEET.NAME);
      sheet = first;
    } else {
      sheet = ss.insertSheet(SHEET.NAME);
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, SHEET.HEADERS.length)
      .setValues([SHEET.HEADERS])
      .setFontWeight('bold')
      .setBackground('#E8EAED');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(SHEET.COL.CONTENT, 320);
    sheet.setColumnWidth(SHEET.COL.PARA, 320);
    sheet.hideColumns(SHEET.COL.DOC_KEY, 4);   // 文件月份 / 文件ID / 行事曆ID / 事件ID
    sheet.hideColumns(SHEET.COL.PARA, 1);
  } else {
    ensureIndexColumns_(sheet);                // [3.1 新] 舊試算表自動補欄位
  }

  __indexSheetCache = sheet;
  return sheet;
}

/**
 * [3.1 新] 欄位自動遷移。
 * 3.0 的索引只有 15 欄，直接沿用會讀不到新的「附件連結」欄；
 * 舊版做法通常是叫使用者重建整張表，但那會把已完成時間等歷史資料洗掉。
 * 這裡只補標題列，資料列原封不動。
 */
function ensureIndexColumns_(sheet) {
  const width = SHEET.HEADERS.length;
  const maxCols = sheet.getMaxColumns();
  if (maxCols < width) sheet.insertColumnsAfter(maxCols, width - maxCols);

  const current = sheet.getRange(1, 1, 1, width).getValues()[0];
  let dirty = false;
  for (let i = 0; i < width; i++) {
    if (String(current[i] || '') !== SHEET.HEADERS[i]) {
      current[i] = SHEET.HEADERS[i];
      dirty = true;
    }
  }
  if (dirty) {
    sheet.getRange(1, 1, 1, width)
      .setValues([current])
      .setFontWeight('bold')
      .setBackground('#E8EAED');
  }
}

function indexAvailable_() {
  try {
    getIndexSheet_();
    return true;
  } catch (err) {
    console.warn('索引試算表不可用：' + getErrorMessage_(err));
    return false;
  }
}

function indexSheetUrl_() {
  try {
    return getIndexSpreadsheet_().getUrl();
  } catch (err) {
    return '';
  }
}

/* ------------------------------------------------------------
 * 讀取
 * ------------------------------------------------------------ */

function indexReadAll_(includeDeleted) {
  const sheet = getIndexSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return [];

  const values = sheet.getRange(2, 1, last - 1, SHEET.HEADERS.length).getValues();
  const out = [];
  for (let i = 0; i < values.length; i++) {
    const r = values[i];
    if (!r[SHEET.COL.UID - 1]) continue;

    const deletedAt = toDateOrNull_(r[SHEET.COL.DELETED_AT - 1]);
    if (deletedAt && !includeDeleted) continue;

    out.push({
      row: i + 2,
      uid: String(r[SHEET.COL.UID - 1]),
      created: toDateOrNull_(r[SHEET.COL.CREATED - 1]),
      dateText: String(r[SHEET.COL.DATE - 1] || ''),
      time: String(r[SHEET.COL.TIME - 1] || ''),
      type: String(r[SHEET.COL.TYPE - 1] || ''),
      content: String(r[SHEET.COL.CONTENT - 1] || ''),
      status: String(r[SHEET.COL.STATUS - 1] || ''),
      due: toDateOrNull_(r[SHEET.COL.DUE - 1]),
      doneAt: toDateOrNull_(r[SHEET.COL.DONE_AT - 1]),
      docKey: String(r[SHEET.COL.DOC_KEY - 1] || ''),
      docId: String(r[SHEET.COL.DOC_ID - 1] || ''),
      calendarId: String(r[SHEET.COL.CAL_ID - 1] || ''),
      eventId: String(r[SHEET.COL.EVENT_ID - 1] || ''),
      line: String(r[SHEET.COL.PARA - 1] || ''),
      location: String(r[SHEET.COL.LOCATION - 1] || ''),
      attach: String(r[SHEET.COL.ATTACH - 1] || ''),
      remark: String(r[SHEET.COL.REMARK - 1] || ''),
      doneNote: String(r[SHEET.COL.DONE_NOTE - 1] || ''),
      deletedAt: deletedAt,
      trashSnapshot: String(r[SHEET.COL.TRASH_SNAPSHOT - 1] || '')
    });
  }
  return out;
}

function toDateOrNull_(value) {
  if (!value) return null;
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return isNaN(value.getTime()) ? null : value;
  }
  const s = String(value).trim();
  if (!s) return null;
  const m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/* ------------------------------------------------------------
 * 寫入
 * ------------------------------------------------------------ */

function indexAppendRow_(rec) {
  const sheet = getIndexSheet_();
  const row = [];
  row[SHEET.COL.UID - 1] = rec.uid;
  row[SHEET.COL.CREATED - 1] = rec.createdAt;
  row[SHEET.COL.DATE - 1] = Utilities.formatDate(rec.createdAt, APP.TZ, 'yyyy-MM-dd');
  row[SHEET.COL.TIME - 1] = Utilities.formatDate(rec.createdAt, APP.TZ, 'HH:mm');
  row[SHEET.COL.TYPE - 1] = rec.type || '';
  row[SHEET.COL.CONTENT - 1] = rec.content || '';
  row[SHEET.COL.STATUS - 1] = rec.status || STATUS_NONE;
  row[SHEET.COL.DUE - 1] = rec.due ? Utilities.formatDate(rec.due, APP.TZ, 'yyyy-MM-dd') : '';
  row[SHEET.COL.DONE_AT - 1] = '';
  row[SHEET.COL.DOC_KEY - 1] = rec.docKey || '';
  row[SHEET.COL.DOC_ID - 1] = rec.docId || '';
  row[SHEET.COL.CAL_ID - 1] = rec.calendarId || '';
  row[SHEET.COL.EVENT_ID - 1] = rec.eventId || '';
  row[SHEET.COL.PARA - 1] = rec.line || '';
  row[SHEET.COL.LOCATION - 1] = rec.location || '';
  row[SHEET.COL.ATTACH - 1] = rec.attach || '';
  row[SHEET.COL.REMARK - 1] = rec.remark || '';
  row[SHEET.COL.DONE_NOTE - 1] = '';
  row[SHEET.COL.DELETED_AT - 1] = '';
  row[SHEET.COL.TRASH_SNAPSHOT - 1] = '';

  for (let i = 0; i < SHEET.HEADERS.length; i++) {
    if (row[i] === undefined) row[i] = '';
  }
  sheet.appendRow(row);
}

function indexFindRowByUid_(uid, includeDeleted) {
  if (!uid) return 0;
  const sheet = getIndexSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return 0;

  // 一次讀 UID + 刪除時間；被放進回收桶的資料，既有完成／編輯 API 一律視為不存在。
  const width = SHEET.COL.DELETED_AT - SHEET.COL.UID + 1;
  const rows = sheet.getRange(2, SHEET.COL.UID, last - 1, width).getValues();
  const deletedOffset = SHEET.COL.DELETED_AT - SHEET.COL.UID;
  for (let i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i][0]) !== String(uid)) continue;
    if (!includeDeleted && rows[i][deletedOffset]) return 0;
    return i + 2;
  }
  return 0;
}

function indexDeleteByUid_(uid, includeDeleted) {
  const row = indexFindRowByUid_(uid, !!includeDeleted);
  if (!row) return false;
  getIndexSheet_().deleteRow(row);
  return true;
}

/**
 * [3.5 改] doneLine 由呼叫端傳入，確保索引的「段落文字」與 Docs 完全一致。
 * 之前是自己把 ☐ 換成 ☑，一旦 Docs 那行還多了完成說明就會對不上，
 * 後續的還原、編輯、刪除全都會找不到段落。
 */
function indexMarkDone_(uid, doneLine, doneNote) {
  const row = indexFindRowByUid_(uid);
  if (!row) return false;

  const sheet = getIndexSheet_();
  sheet.getRange(row, SHEET.COL.STATUS).setValue(STATUS_DONE);
  sheet.getRange(row, SHEET.COL.DONE_AT).setValue(new Date());
  if (doneNote !== undefined && doneNote !== null) {
    sheet.getRange(row, SHEET.COL.DONE_NOTE).setValue(String(doneNote));
  }

  if (doneLine) {
    sheet.getRange(row, SHEET.COL.PARA).setValue(doneLine);
    return true;
  }

  const para = String(sheet.getRange(row, SHEET.COL.PARA).getValue() || '');
  if (para.indexOf(TASK_OPEN) === 0 || para.indexOf(TASK_DOING) === 0) {
    sheet.getRange(row, SHEET.COL.PARA).setValue(TASK_DONE + para.slice(1));
  }
  return true;
}

/* ------------------------------------------------------------
 * 從既有 Docs 重建索引（舊資料補建 / 索引損毀時修復）
 * 在 Apps Script 編輯器直接執行這支即可。
 * ------------------------------------------------------------ */

/**
 * [3.6 新] 修掉索引裡的假資料，不必整個重建。
 *
 * 重建會把期限、完成時間、行事曆事件 ID 全部洗掉（Docs 裡沒有這些），
 * 所以能用修的就不要重建——這是資料維護的基本原則。
 *
 * 處理兩件事：
 *   1. 內容只是「檔案連結：…」的列 → 把網址補到上一列的附件欄，然後刪掉
 *   2. 內容開頭殘留 ☐ ☑ ◐ 的列 → 拿掉符號，狀態改由狀態欄決定
 */
function repairIndexRows() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(60000)) return '系統忙碌中，請稍後再試。';

  try {
    const sheet = getIndexSheet_();
    const last = sheet.getLastRow();
    if (last < 2) return '索引是空的，沒有東西要修。';

    const width = SHEET.HEADERS.length;
    const values = sheet.getRange(2, 1, last - 1, width).getValues();

    let merged = 0;
    let cleaned = 0;
    const keep = [];

    values.forEach(function (row) {
      const content = String(row[SHEET.COL.CONTENT - 1] || '').trim();
      const m = content.match(/^(檔案連結|來源檔案|地圖)[：:]\s*(\S+)/);

      if (m) {
        // 併回上一筆，然後這一列不留
        if (keep.length) {
          const prev = keep[keep.length - 1];
          if (!prev[SHEET.COL.ATTACH - 1]) prev[SHEET.COL.ATTACH - 1] = m[2];
        }
        merged++;
        return;
      }

      const para = String(row[SHEET.COL.PARA - 1] || '');
      if (content.indexOf(TASK_OPEN) === 0 || content.indexOf(TASK_DONE) === 0 ||
          content.indexOf(TASK_DOING) === 0) {
        row[SHEET.COL.CONTENT - 1] = content.slice(1).trim();
        cleaned++;
      }
      if (!para && row[SHEET.COL.CONTENT - 1]) {
        row[SHEET.COL.PARA - 1] = row[SHEET.COL.CONTENT - 1];
      }

      keep.push(row);
    });

    if (!merged && !cleaned) return '✅ 索引沒有需要修正的資料（共 ' + values.length + ' 筆）。';

    sheet.getRange(2, 1, last - 1, width).clearContent();
    if (keep.length) sheet.getRange(2, 1, keep.length, width).setValues(keep);

    const msg = [
      '🔧 索引修復完成',
      '原本 ' + values.length + ' 筆 → 現在 ' + keep.length + ' 筆',
      '併回附件連結：' + merged + ' 筆',
      '清掉殘留符號：' + cleaned + ' 筆',
      '',
      '期限、完成時間、行事曆事件都保留了。'
    ].join('\n');
    console.log(msg);
    return msg;
  } finally {
    lock.releaseLock();
  }
}

function indexRowFromRecord_(r) {
  const row = [];
  row[SHEET.COL.UID - 1] = r.uid || newUid_();
  row[SHEET.COL.CREATED - 1] = r.created || '';
  row[SHEET.COL.DATE - 1] = r.created ? Utilities.formatDate(r.created, APP.TZ, 'yyyy-MM-dd') : (r.dateText || '');
  row[SHEET.COL.TIME - 1] = r.created ? Utilities.formatDate(r.created, APP.TZ, 'HH:mm') : (r.time || '');
  row[SHEET.COL.TYPE - 1] = r.type || '';
  row[SHEET.COL.CONTENT - 1] = r.content || '';
  row[SHEET.COL.STATUS - 1] = r.status || STATUS_NONE;
  row[SHEET.COL.DUE - 1] = r.due ? Utilities.formatDate(r.due, APP.TZ, 'yyyy-MM-dd') : '';
  row[SHEET.COL.DONE_AT - 1] = r.doneAt || '';
  row[SHEET.COL.DOC_KEY - 1] = r.docKey || '';
  row[SHEET.COL.DOC_ID - 1] = r.docId || '';
  row[SHEET.COL.CAL_ID - 1] = r.calendarId || '';
  row[SHEET.COL.EVENT_ID - 1] = r.eventId || '';
  row[SHEET.COL.PARA - 1] = r.line || '';
  row[SHEET.COL.LOCATION - 1] = r.location || '';
  row[SHEET.COL.ATTACH - 1] = r.attach || '';
  row[SHEET.COL.REMARK - 1] = r.remark || '';
  row[SHEET.COL.DONE_NOTE - 1] = r.doneNote || '';
  row[SHEET.COL.DELETED_AT - 1] = r.deletedAt || '';
  row[SHEET.COL.TRASH_SNAPSHOT - 1] = r.trashSnapshot || '';
  for (let i = 0; i < SHEET.HEADERS.length; i++) if (row[i] === undefined) row[i] = '';
  return row;
}

function rebuildIndexFromDocs() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(60000)) return '系統忙碌中，請稍後再試。';

  try {
    // [4.0] 重建前先保存回收桶資料。Docs 正文仍存在，若不做這一步，
    // 重建會把已刪資料重新當成新紀錄，等於「回收桶失效」。
    const trashed = indexReadAll_(true).filter(function (r) { return !!r.deletedAt; });
    const skip = {};
    trashed.forEach(function (r) {
      const key = (r.docId || '') + '\n' + String(r.line || '').trim();
      if (r.docId && r.line) skip[key] = (skip[key] || 0) + 1;
    });

    const sheet = getIndexSheet_();
    const last = sheet.getLastRow();
    if (last > 1) sheet.deleteRows(2, last - 1);

    const reg = readRegistry_();
    const keys = Object.keys(reg).sort();
    const rows = [];
    let docCount = 0;

    keys.forEach(function (key) {
      const info = reg[key];
      if (!info || !info.id) return;

      let doc;
      try { doc = DocumentApp.openById(info.id); }
      catch (err) { console.warn('重建索引：跳過無法開啟的文件 ' + key); return; }
      docCount++;

      const lines = doc.getBody().getText().split('\n');
      let currentDate = null;
      let pending = null;
      let lastAcceptedRow = null;

      lines.forEach(function (raw) {
        const line = raw.trim();
        if (!line) return;

        if (DATE_HEADING_RE.test(line)) {
          currentDate = parseDateHeading_(line);
          pending = null;
          lastAcceptedRow = null;
          return;
        }

        const head = line.match(/^(\d{2}):(\d{2})｜(.+)$/);
        if (head) {
          pending = { hh: Number(head[1]), mm: Number(head[2]), type: head[3].trim() };
          lastAcceptedRow = null;
          return;
        }

        if (/^(行程時間|提醒時間|地點|提醒|未建立行事曆)[：:]/.test(line)) return;

        const attachLine = line.match(/^(檔案連結|來源檔案|地圖)[：:]\s*(\S+)/);
        if (attachLine) {
          if (lastAcceptedRow && !lastAcceptedRow[SHEET.COL.ATTACH - 1]) {
            lastAcceptedRow[SHEET.COL.ATTACH - 1] = attachLine[2];
          }
          return;
        }

        if (!pending) return;

        const deletedKey = info.id + '\n' + line.trim();
        if (skip[deletedKey] > 0) {
          skip[deletedKey]--;
          pending = null;
          lastAcceptedRow = null;
          return;
        }

        const isDone = line.indexOf(TASK_DONE) === 0;
        const isTodo = line.indexOf(TASK_OPEN) === 0;
        const isDoing = line.indexOf(TASK_DOING) === 0;
        const content = (isDone || isTodo || isDoing) ? line.slice(1).trim() : line;
        const base = currentDate || new Date();
        const createdAt = new Date(base.getFullYear(), base.getMonth(), base.getDate(), pending.hh, pending.mm, 0, 0);

        const row = [];
        row[SHEET.COL.UID - 1] = newUid_();
        row[SHEET.COL.CREATED - 1] = createdAt;
        row[SHEET.COL.DATE - 1] = Utilities.formatDate(createdAt, APP.TZ, 'yyyy-MM-dd');
        row[SHEET.COL.TIME - 1] = Utilities.formatDate(createdAt, APP.TZ, 'HH:mm');
        row[SHEET.COL.TYPE - 1] = pending.type;
        row[SHEET.COL.CONTENT - 1] = content;
        row[SHEET.COL.STATUS - 1] = isDone ? STATUS_DONE : (isDoing ? STATUS_DOING : (isTodo ? STATUS_TODO : STATUS_NONE));
        row[SHEET.COL.DUE - 1] = '';
        row[SHEET.COL.DONE_AT - 1] = '';
        row[SHEET.COL.DOC_KEY - 1] = key;
        row[SHEET.COL.DOC_ID - 1] = info.id;
        row[SHEET.COL.CAL_ID - 1] = '';
        row[SHEET.COL.EVENT_ID - 1] = '';
        row[SHEET.COL.PARA - 1] = line;
        row[SHEET.COL.LOCATION - 1] = '';
        row[SHEET.COL.ATTACH - 1] = '';
        row[SHEET.COL.REMARK - 1] = '';
        row[SHEET.COL.DONE_NOTE - 1] = '';
        row[SHEET.COL.DELETED_AT - 1] = '';
        row[SHEET.COL.TRASH_SNAPSHOT - 1] = '';
        for (let i = 0; i < SHEET.HEADERS.length; i++) if (row[i] === undefined) row[i] = '';
        rows.push(row);
        lastAcceptedRow = row;
        pending = null;
      });
    });

    // 回收桶列原封不動放回索引最後方；其 UID、期限、事件 ID、備註全部保留。
    trashed.forEach(function (r) { rows.push(indexRowFromRecord_(r)); });

    if (rows.length) sheet.getRange(2, 1, rows.length, SHEET.HEADERS.length).setValues(rows);

    const activeRows = rows.filter(function (r) { return !r[SHEET.COL.DELETED_AT - 1]; });
    const todo = activeRows.filter(function (r) { return r[SHEET.COL.STATUS - 1] === STATUS_TODO; }).length;
    const infoText = [
      '=== 索引重建完成 ===',
      '掃描文件：' + docCount + ' 份',
      '有效紀錄：' + activeRows.length + ' 筆',
      '回收桶保留：' + trashed.length + ' 筆',
      '其中待辦：' + todo + ' 筆',
      '',
      '索引試算表：', indexSheetUrl_(), '',
      '注意：從 Docs 重建的舊紀錄仍不含行事曆事件 ID 與到期日；',
      '　　　但 4.0 回收桶內既有資料會完整保留，不會被重建復活。'
    ].join('\n');
    console.log(infoText);
    return infoText;
  } finally {
    lock.releaseLock();
  }
}

/* ============================================================
 * 八、查詢與回覆
 * ============================================================ */

function buildDocLinkText_(ym) {
  const reg = readRegistry_();
  if (ym) {
    const entry = reg[ym];
    if (!entry) return '找不到 ' + ym + ' 的文件。輸入 /文件 查看本月。';
    try {
      return '📘 ' + ym + '\n' + DocumentApp.openById(entry.id).getUrl();
    } catch (err) {
      return '⚠️ ' + ym + ' 的文件無法開啟。';
    }
  }

  const ctx = getJournalContext_(new Date());
  const keys = Object.keys(reg).filter(function (k) { return k !== ctx.key; }).sort().reverse().slice(0, 5);
  const lines = ['📘 本月筆記', ctx.doc.getUrl()];
  if (keys.length) {
    lines.push('', '往月份：' + keys.join('、'), '（輸入 /文件 ' + keys[0] + ' 可開啟）');
  }
  return lines.join('\n');
}

function buildDayScheduleText_(date, label) {
  const calendar = getCalendar_();
  const start = startOfDay_(date);
  const end = addDays_(start, 1);
  const events = calendar.getEvents(start, end).sort(function (a, b) {
    return a.getStartTime().getTime() - b.getStartTime().getTime();
  });

  const lines = ['📅 ' + label + '｜' + formatChineseDate_(date)];
  if (!events.length) {
    lines.push('', '目前沒有行程或提醒。');
    return lines.join('\n');
  }

  lines.push('');
  events.forEach(function (event, i) {
    // [2.6 修] 前一天開始、今天仍在進行的事件，原本會顯示「昨天的 HH:mm」而造成誤讀。
    let time;
    if (event.isAllDayEvent()) {
      time = '全天';
    } else if (event.getStartTime() < start) {
      time = '延續中';
    } else {
      time = Utilities.formatDate(event.getStartTime(), APP.TZ, 'HH:mm');
    }
    const place = event.getLocation ? (event.getLocation() || '') : '';
    lines.push((i + 1) + '. ' + time + '　' + event.getTitle() + (place ? '（' + place + '）' : ''));
  });
  return lines.join('\n');
}

// [新] 整週一次看完
function buildWeekScheduleText_(weekOffset, label) {
  const calendar = getCalendar_();
  const monday = startOfWeek_(new Date(), weekOffset);
  const end = addDays_(monday, 7);
  const events = calendar.getEvents(monday, end).sort(function (a, b) {
    return a.getStartTime().getTime() - b.getStartTime().getTime();
  });

  const lines = ['🗓 ' + label + '｜' +
    Utilities.formatDate(monday, APP.TZ, 'M/d') + ' – ' +
    Utilities.formatDate(addDays_(monday, 6), APP.TZ, 'M/d')];

  if (!events.length) {
    lines.push('', '這週沒有任何行程。');
    return lines.join('\n');
  }

  let currentKey = '';
  events.forEach(function (event) {
    const day = event.getStartTime();
    const key = Utilities.formatDate(day, APP.TZ, 'yyyyMMdd');
    if (key !== currentKey) {
      currentKey = key;
      lines.push('', '── ' + formatChineseDate_(day));
    }
    const time = event.isAllDayEvent()
      ? '全天'
      : Utilities.formatDate(day, APP.TZ, 'HH:mm');
    lines.push('　' + time + '　' + event.getTitle());
  });

  return lines.join('\n').slice(0, 4800);
}

// [新] 本月摘要：統計筆記類型分佈、活躍天數、行事曆場次
function buildMonthSummaryText_(ym) {
  const now = new Date();
  const key = ym || docKey_(now);

  if (!/^\d{6}$/.test(key)) {
    return '月份格式請用 YYYYMM，例如：/本月 202507';
  }

  const year = Number(key.slice(0, 4));
  const month = Number(key.slice(4, 6));
  if (month < 1 || month > 12) return '月份不正確，請用 YYYYMM，例如：/本月 202507';

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 1);
  const isCurrent = (key === docKey_(now));

  const lines = ['📊 ' + year + '年' + month + '月摘要'];
  if (isCurrent) {
    lines.push('（統計至 ' + Utilities.formatDate(now, APP.TZ, 'M/d') + '）');
  }
  lines.push('');

  // ── 筆記統計 ──
  // [2.7 改] 索引優先。索引還能算出「待辦完成率」，Docs 掃描做不到。
  const reg = readRegistry_();
  const entry = reg[key];
  let docUrl = '';
  if (entry && entry.id) {
    try { docUrl = DocumentApp.openById(entry.id).getUrl(); }
    catch (err) { console.warn('讀取月份文件失敗：' + getErrorMessage_(err)); }
  }

  let stats = null;
  if (indexAvailable_()) {
    try { stats = monthStatsFromIndex_(monthStart, monthEnd); }
    catch (err) { console.warn('索引統計失敗：' + getErrorMessage_(err)); }
  }
  if (!stats) stats = monthStatsFromDocs_(entry);

  if (!stats.total) {
    lines.push('這個月還沒有任何紀錄。');
  } else {
    lines.push('📝 紀錄共 ' + stats.total + ' 筆，分佈在 ' + stats.dayCount + ' 天');
    lines.push('');
    Object.keys(stats.typeCount)
      .sort(function (a, b) { return stats.typeCount[b] - stats.typeCount[a]; })
      .forEach(function (type) {
        const n = stats.typeCount[type];
        const bar = repeatStr_('▪', Math.min(10, Math.max(1, Math.round(n / stats.total * 10))));
        lines.push('　' + padRight_(type, 5) + ' ' + bar + ' ' + n);
      });

    if (stats.dayCount) {
      lines.push('', '　平均每天 ' + (stats.total / stats.dayCount).toFixed(1) + ' 筆');
    }

    if (stats.todoTotal) {
      const rate = Math.round(stats.todoDone / stats.todoTotal * 100);
      lines.push('', '✅ 待辦完成率 ' + rate + '%　（' +
        stats.todoDone + '/' + stats.todoTotal + '，未完成 ' +
        (stats.todoTotal - stats.todoDone) + ' 筆）');
    }
  }

  // ── 行事曆統計 ──
  try {
    const events = getCalendar_().getEvents(monthStart, monthEnd);
    let allDay = 0;
    let reminders = 0;
    let totalMinutes = 0;
    let fromBot = 0;

    events.forEach(function (ev) {
      // [2.7 新] 區分「本系統建立」與行事曆上的其他來源，
      //          否則會議時數會把手動建立與訂閱來的活動一起算進去。
      try {
        if (String(ev.getDescription() || '').indexOf(EVENT_TAG) >= 0) fromBot++;
      } catch (e) { /* 忽略無法讀取描述的事件 */ }

      if (ev.isAllDayEvent()) { allDay++; return; }
      if (ev.getTitle().indexOf('提醒｜') === 0) { reminders++; return; }
      totalMinutes += (ev.getEndTime().getTime() - ev.getStartTime().getTime()) / 60000;
    });

    const meetings = events.length - allDay - reminders;
    lines.push('', '📅 行事曆共 ' + events.length + ' 筆');
    lines.push('　會議行程 ' + meetings + '　提醒 ' + reminders + '　全天 ' + allDay);
    if (totalMinutes > 0) {
      lines.push('　會議時數約 ' + (totalMinutes / 60).toFixed(1) + ' 小時');
    }
    lines.push('　其中由本系統建立 ' + fromBot + ' 筆');
  } catch (err) {
    lines.push('', '📅 行事曆統計失敗：' + getErrorMessage_(err));
  }

  if (docUrl) lines.push('', '📘 Google 文件：', docUrl);
  const sheetUrl = indexSheetUrl_();
  if (sheetUrl) lines.push('', '📊 索引試算表：', sheetUrl);

  const others = Object.keys(reg).filter(function (k) { return k !== key; }).sort().reverse().slice(0, 4);
  if (others.length) {
    lines.push('', '其他月份：' + others.join('、'), '（輸入 /本月 ' + others[0] + '）');
  }

  return lines.join('\n').slice(0, 4800);
}

// [2.7 新] 月統計：索引路徑（可算完成率）
function monthStatsFromIndex_(monthStart, monthEnd) {
  const rows = indexReadAll_().filter(function (r) {
    return r.created && r.created >= monthStart && r.created < monthEnd;
  });

  const typeCount = {};
  const activeDays = {};
  let todoTotal = 0;
  let todoDone = 0;

  rows.forEach(function (r) {
    const type = r.type || '未分類';
    typeCount[type] = (typeCount[type] || 0) + 1;
    activeDays[Utilities.formatDate(r.created, APP.TZ, 'yyyyMMdd')] = true;
    if (r.status === STATUS_TODO) todoTotal++;
    if (r.status === STATUS_DONE) { todoTotal++; todoDone++; }
  });

  return {
    total: rows.length,
    dayCount: Object.keys(activeDays).length,
    typeCount: typeCount,
    todoTotal: todoTotal,
    todoDone: todoDone
  };
}

// 保底路徑：從當月 Docs 文字統計（無法得知完成率）
function monthStatsFromDocs_(entry) {
  const empty = { total: 0, dayCount: 0, typeCount: {}, todoTotal: 0, todoDone: 0 };
  if (!entry || !entry.id) return empty;

  let docText = '';
  try {
    docText = DocumentApp.openById(entry.id).getBody().getText();
  } catch (err) {
    return empty;
  }
  if (!docText) return empty;

  const typeCount = {};
  const activeDays = {};
  let total = 0;
  let currentDay = '';

  docText.split('\n').forEach(function (raw) {
    const line = raw.trim();
    if (!line) return;
    if (DATE_HEADING_RE.test(line)) { currentDay = line; return; }
    const hit = line.match(/^\d{2}:\d{2}｜(.+)$/);
    if (hit) {
      const type = hit[1].trim();
      typeCount[type] = (typeCount[type] || 0) + 1;
      total++;
      if (currentDay) activeDays[currentDay] = true;
    }
  });

  return {
    total: total,
    dayCount: Object.keys(activeDays).length,
    typeCount: typeCount,
    todoTotal: 0,
    todoDone: 0
  };
}

function repeatStr_(s, n) {
  let out = '';
  for (let i = 0; i < n; i++) out += s;
  return out;
}

// 中文字寬約為英數兩倍，用全形空白補齊讓長條圖對齊
function padRight_(text, width) {
  let out = String(text);
  while (out.length < width) out += '　';
  return out;
}

/* ------------------------------------------------------------
 * 待辦追蹤：工作型筆記寫入時標記 ☐，完成後改為 ☑
 * ------------------------------------------------------------ */

/**
 * 待辦清單。
 * [2.7 改] 索引優先：一次 getValues() 取代開啟最多 3 份 Docs 逐字掃描。
 *          索引不可用時自動退回舊的 Docs 掃描，功能不會消失。
 */
function listUnfinished_() {
  if (indexAvailable_()) {
    try {
      return listUnfinishedFromIndex_();
    } catch (err) {
      console.warn('索引查詢失敗，改用 Docs 掃描：' + getErrorMessage_(err));
    }
  }
  return listUnfinishedFromDocs_();
}

function listUnfinishedFromIndex_() {
  const items = indexReadAll_()
    // [3.5] 進行中也算未完成——事情開始做了不代表可以從清單上消失
    .filter(function (r) { return r.status === STATUS_TODO || r.status === STATUS_DOING; })
    .map(function (r) {
      return {
        uid: r.uid,
        docId: r.docId,
        docKey: r.docKey,
        date: r.created ? startOfDay_(r.created) : null,
        dateText: r.created ? formatChineseDate_(r.created) : '',
        due: r.due,
        line: r.line,
        content: r.content,
        state: r.status === STATUS_DOING ? 'doing' : 'todo',
        remark: r.remark
      };
    });

  return sortTodoItems_(items);
}

/**
 * 排序規則（2.7）：
 *   1. 有到期日的排前面，愈早到期愈前面（逾期最前）
 *   2. 沒有到期日的依建立時間，愈舊愈前面（拖愈久愈該處理）
 */
function sortTodoItems_(items) {
  return items.sort(function (a, b) {
    const da = a.due ? a.due.getTime() : null;
    const db = b.due ? b.due.getTime() : null;
    if (da !== null && db !== null) return da - db;
    if (da !== null) return -1;
    if (db !== null) return 1;
    const ta = a.date ? a.date.getTime() : 0;
    const tb = b.date ? b.date.getTime() : 0;
    return ta - tb;
  });
}

// 保底路徑：掃描最近幾個月的 Docs，收集所有未完成項目
function listUnfinishedFromDocs_() {
  const reg = readRegistry_();
  const keys = Object.keys(reg).sort().reverse().slice(0, APP.TODO_MAX_DOCS);
  const items = [];

  for (let i = 0; i < keys.length; i++) {
    const info = reg[keys[i]];
    if (!info || !info.id) continue;

    let text;
    try {
      text = DocumentApp.openById(info.id).getBody().getText();
    } catch (err) {
      console.warn('讀取文件失敗：' + getErrorMessage_(err));
      continue;
    }

    const lines = text.split('\n');
    let currentDate = '';
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j].trim();
      if (!line) continue;
      if (DATE_HEADING_RE.test(line)) { currentDate = line; continue; }
      if (line.indexOf(TASK_OPEN) === 0 || line.indexOf(TASK_DOING) === 0) {
        items.push({
          uid: '',
          docId: info.id,
          docKey: keys[i],
          dateText: currentDate,
          date: parseDateHeading_(currentDate),
          due: null,
          line: line,
          content: line.slice(1).trim(),
          state: line.indexOf(TASK_DOING) === 0 ? 'doing' : 'todo',
          remark: ''
        });
      }
    }
  }

  return sortTodoItems_(items);
}

function parseDateHeading_(text) {
  const m = String(text).match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/**
 * [2.7 新] 待辦的緊急度標籤。
 * 有到期日就以到期日為準（逾期最醒目）；沒有到期日才退回「拖了幾天」。
 */
function todoUrgency_(item, refDate) {
  const today = startOfDay_(refDate || new Date());

  if (item.due) {
    const days = Math.round((startOfDay_(item.due).getTime() - today.getTime()) / 86400000);
    if (days < 0) return { overdue: true, label: '　🔴 逾期' + Math.abs(days) + '天' };
    if (days === 0) return { overdue: false, label: '　🟠 今天到期' };
    if (days === 1) return { overdue: false, label: '　🟡 明天到期' };
    if (days <= 3) return { overdue: false, label: '　🟡 ' + days + '天後' };
    return { overdue: false, label: '　' + Utilities.formatDate(item.due, APP.TZ, 'M/d') + '到期' };
  }

  if (item.date) {
    const age = Math.round((today.getTime() - startOfDay_(item.date).getTime()) / 86400000);
    if (age >= 7) return { overdue: false, label: '　🔴 已 ' + age + '天' };
    if (age >= 3) return { overdue: false, label: '　🟡 已 ' + age + '天' };
    if (age >= 1) return { overdue: false, label: '　已 ' + age + '天' };
    return { overdue: false, label: '　今天' };
  }

  return { overdue: false, label: '' };
}

function replyUnfinished_(replyToken) {
  const all = listUnfinished_();

  if (!all.length) {
    safeReply_(replyToken, '🎉 目前沒有未完成事項。\n\n（一般筆記會自動列入待辦，行事曆與事件紀錄不會）');
    return;
  }

  const items = all.slice(0, APP.TODO_MAX_ITEMS);

  // 存起來，讓 /完成 3 這種編號寫法能對應
  CacheService.getScriptCache().put(
    TODO_CACHE_KEY,
    JSON.stringify(items.map(function (it) {
      return {
        uid: it.uid || '', docId: it.docId, line: it.line, content: it.content,
        done: false, state: it.state || 'todo'
      };
    })),
    3600
  );

  const overdue = all.filter(function (it) { return todoUrgency_(it).overdue; }).length;
  const lines = ['📋 未完成事項　共 ' + all.length + ' 筆' +
    (overdue ? '（🔴 逾期 ' + overdue + ' 筆）' : ''), ''];

  items.forEach(function (it, i) {
    const mark = it.state === 'doing' ? '◐ ' : '';
    lines.push((i + 1) + '. ' + mark + it.content.slice(0, 50) + todoUrgency_(it).label);
    if (it.remark) lines.push('　　📌 ' + String(it.remark).slice(0, 40));
  });

  if (all.length > items.length) {
    lines.push('', '（僅顯示前 ' + items.length + ' 筆）');
  }
  const doing = all.filter(function (it) { return it.state === 'doing'; }).length;
  if (doing) lines.push('', '◐ 進行中 ' + doing + ' 筆');
  lines.push('', '完成方式：點下方按鈕，或輸入 /完成 3');
  lines.push('標為進行中：/進行 3　　完成並附說明：/完成 3｜主計已收件');

  const buttons = items.slice(0, APP.TODO_QUICK_BUTTONS).map(function (it, i) {
    return {
      type: 'action',
      action: {
        type: 'postback',
        label: '✓' + (i + 1) + ' ' + it.content.slice(0, 14),
        data: 'a=done&i=' + i,
        displayText: '完成第 ' + (i + 1) + ' 項'
      }
    };
  });

  try {
    replyMessages_(replyToken, [{
      type: 'text',
      text: lines.join('\n').slice(0, 4900),
      quickReply: buttons.length ? { items: buttons } : undefined
    }]);
  } catch (err) {
    safeReply_(replyToken, lines.join('\n'));
  }
}

// query 可以是編號（1、2、3）或關鍵字
function completeTask_(rawQuery) {
  if (!rawQuery) return '請指定要完成的項目，例如：/完成 3　或　/完成 代理教師資料';

  // [3.5] /完成 3｜主計已收件　→ 完成並記下結案說明
  const parts = String(rawQuery).split(/[|｜]/);
  const query = parts[0].trim();
  const doneNote = parts.length > 1 ? parts.slice(1).join('｜').trim() : '';
  if (!query) return '請指定要完成的項目，例如：/完成 3｜主計已收件';

  const cache = CacheService.getScriptCache();

  if (/^\d+$/.test(query)) {
    const raw = cache.get(TODO_CACHE_KEY);
    if (!raw) return '待辦清單已過期，請先輸入 /未完成 再用編號。';

    const list = JSON.parse(raw);
    const idx = Number(query) - 1;
    if (idx < 0 || idx >= list.length) {
      return '編號超出範圍，目前清單有 ' + list.length + ' 筆。';
    }
    if (list[idx].done) {
      return '這一項剛才已經完成了 ✅\n' + String(list[idx].content).slice(0, 60);
    }
    return markDone_(list[idx].docId, list[idx].line, list[idx].content, list[idx].uid, doneNote);
  }

  const matches = listUnfinished_().filter(function (it) {
    return it.content.indexOf(query) >= 0;
  });

  if (!matches.length) return '找不到包含「' + query + '」的未完成事項。';

  if (matches.length > 1) {
    const preview = matches.slice(0, 5).map(function (it, i) {
      return (i + 1) + '. ' + it.content.slice(0, 40);
    });
    return ['找到 ' + matches.length + ' 筆符合的項目，請講得更明確一點：', '']
      .concat(preview).join('\n');
  }

  return markDone_(matches[0].docId, matches[0].line, matches[0].content, matches[0].uid, doneNote);
}

/**
 * [3.5] /進行 3　或　/進行 核銷
 * 用法刻意跟 /完成 一致，不必記兩套。
 */
function startTask_(query) {
  if (!query) return '請指定項目，例如：/進行 3　或　/進行 核銷';

  const cache = CacheService.getScriptCache();

  if (/^\d+$/.test(query)) {
    const raw = cache.get(TODO_CACHE_KEY);
    if (!raw) return '待辦清單已過期，請先輸入 /未完成 再用編號。';
    const list = JSON.parse(raw);
    const idx = Number(query) - 1;
    if (idx < 0 || idx >= list.length) return '編號超出範圍，目前清單有 ' + list.length + ' 筆。';
    if (!list[idx].uid) return '這一筆沒有索引資料，無法改狀態（可到管理台操作）。';
    const res = setEntryState_(list[idx].uid, 'doing');
    return (res.ok ? '' : '⚠️ ') + res.message + '\n' + String(list[idx].content).slice(0, 60);
  }

  const matches = listUnfinished_().filter(function (it) {
    return it.content.indexOf(query) >= 0 && it.uid;
  });
  if (!matches.length) return '找不到包含「' + query + '」的未完成事項。';
  if (matches.length > 1) {
    const preview = matches.slice(0, 5).map(function (it, i) {
      return (i + 1) + '. ' + it.content.slice(0, 40);
    });
    return ['找到 ' + matches.length + ' 筆，請講得更明確一點：', ''].concat(preview).join('\n');
  }

  const res = setEntryState_(matches[0].uid, 'doing');
  return (res.ok ? '' : '⚠️ ') + res.message + '\n' + matches[0].content.slice(0, 60);
}

// [2.6 新] 把快取清單裡對應的項目標記為已完成
function markTodoCacheDone_(docId, lineText) {
  const cache = CacheService.getScriptCache();
  const raw = cache.get(TODO_CACHE_KEY);
  if (!raw) return;
  try {
    const list = JSON.parse(raw);
    let changed = false;
    list.forEach(function (it) {
      if (it.docId === docId && it.line === lineText) { it.done = true; changed = true; }
    });
    if (changed) cache.put(TODO_CACHE_KEY, JSON.stringify(list), 3600);
  } catch (err) {
    console.warn('待辦快取更新失敗：' + getErrorMessage_(err));
  }
}

function markDone_(docId, lineText, content, uid, doneNote) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(APP.LOCK_WAIT_MS)) return '系統忙碌中，請稍後再試。';

  try {
    let doc;
    try {
      doc = DocumentApp.openById(docId);
    } catch (err) {
      return '⚠️ 找不到對應文件。';
    }

    const paragraphs = doc.getBody().getParagraphs();
    let hit = null;
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].getText().trim() === lineText) { hit = paragraphs[i]; break; }
    }

    if (!hit) {
      doc.saveAndClose();
      return '⚠️ 這筆項目找不到了，可能已被撤銷或手動修改。';
    }

    const note = String(doneNote || '').trim();
    const doneText = TASK_DONE + ' ' + content + (note ? '　｜完成：' + note : '');
    hit.setText(doneText);
    const style = hit.editAsText();
    style.setForegroundColor('#888888');
    style.setStrikethrough(true);
    doc.saveAndClose();

    // [2.6 新] 同步標記快取，避免同一顆按鈕被再按一次時回報誤導訊息
    markTodoCacheDone_(docId, lineText);

    // [2.7 新] 同步更新索引試算表
    if (uid) {
      try { indexMarkDone_(uid, doneText, note); }
      catch (err) { console.warn('索引狀態更新失敗：' + getErrorMessage_(err)); }
    }

    const remain = listUnfinished_().length;
    return '✅ 已完成\n' + content.slice(0, 100) + (note ? '\n📌 ' + note : '') +
      '\n\n' + (remain ? '還有 ' + remain + ' 筆未完成。' : '所有事項都完成了 🎉');
  } finally {
    lock.releaseLock();
  }
}

// [新] 全文搜尋　[2.7 改] 索引優先，並顯示類型與完成狀態
function searchJournal_(keyword) {
  if (!keyword) return '請輸入要搜尋的關鍵字，例如：/搜尋 課發會';

  if (indexAvailable_()) {
    try {
      return searchFromIndex_(keyword);
    } catch (err) {
      console.warn('索引搜尋失敗，改用 Docs 掃描：' + getErrorMessage_(err));
    }
  }
  return searchFromDocs_(keyword);
}

function searchFromIndex_(keyword) {
  const all = indexReadAll_();
  const matched = all.filter(function (r) {
    return r.content.indexOf(keyword) >= 0;
  });

  if (!matched.length) return '🔍 找不到包含「' + keyword + '」的紀錄。';

  // 新的排前面
  matched.sort(function (a, b) {
    const ta = a.created ? a.created.getTime() : 0;
    const tb = b.created ? b.created.getTime() : 0;
    return tb - ta;
  });

  const show = matched.slice(0, APP.SEARCH_MAX_HITS);
  const head = '🔍 「' + keyword + '」找到 ' + matched.length + ' 筆' +
    (matched.length > show.length ? '（顯示最近 ' + show.length + ' 筆）' : '');

  const lines = [head, ''];
  show.forEach(function (r) {
    const mark = r.status === STATUS_DONE ? '☑ ' : (r.status === STATUS_TODO ? '☐ ' : '');
    const when = r.created ? Utilities.formatDate(r.created, APP.TZ, 'M/d HH:mm') : r.dateText;
    lines.push('・' + when + '｜' + r.type);
    lines.push('　' + mark + r.content.slice(0, 70));
  });

  lines.push('', '📊 索引：' + indexSheetUrl_());
  return lines.join('\n').slice(0, 4800);
}

function searchFromDocs_(keyword) {
  const reg = readRegistry_();
  const keys = Object.keys(reg).sort().reverse().slice(0, APP.SEARCH_MAX_DOCS);
  const hits = [];
  let total = 0;

  for (let k = 0; k < keys.length; k++) {
    let text;
    try {
      text = DocumentApp.openById(reg[keys[k]].id).getBody().getText();
    } catch (err) {
      continue;
    }

    const lines = text.split('\n');
    let currentDate = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (DATE_HEADING_RE.test(line)) { currentDate = line; continue; }
      if (/^\d{2}:\d{2}｜/.test(line)) continue;
      if (line.indexOf(keyword) >= 0) {
        total++;
        if (hits.length < APP.SEARCH_MAX_HITS) {
          hits.push('・' + (currentDate || '（未標日期）') + '\n　' + line.slice(0, 70));
        }
      }
    }
  }

  if (!total) return '🔍 找不到包含「' + keyword + '」的紀錄。';

  const head = '🔍 「' + keyword + '」找到 ' + total + ' 筆' +
    (total > hits.length ? '（顯示最近 ' + hits.length + ' 筆）' : '');
  return [head, ''].concat(hits).join('\n').slice(0, 4800);
}

function buildCreatedReply_(result) {
  const lines = [result.kind === '提醒事項' ? '🔔 已建立提醒' : '✅ 已建立行事曆', ''];
  lines.push(result.title);
  lines.push(buildReplyScheduleLine_(result));
  if (result.location) lines.push('地點：' + result.location);
  lines.push('提醒：' + formatReminderText_(result.reminderMinutes, result.allDay));
  lines.push('', '已同步寫入 Google Docs。', '輸入 /撤銷 可刪除上一筆，/改 內容 可重寫。');
  return lines.join('\n');
}

function buildReplyScheduleLine_(result) {
  if (result.allDay) return '時間：' + formatChineseDate_(result.start) + '（全天）';
  return '時間：' + formatChineseDateTime_(result.start) +
    ' – ' + Utilities.formatDate(result.end, APP.TZ, 'HH:mm');
}

function buildDocScheduleLine_(result) {
  if (result.allDay) return '行程時間：' + formatChineseDate_(result.start) + '（全天）';
  return (result.kind === '提醒事項' ? '提醒時間：' : '行程時間：') + formatChineseDateTime_(result.start);
}

function buildStatusText_() {
  const props = PropertiesService.getScriptProperties();
  const ctx = getJournalContext_(new Date());
  const undoCount = readUndoStack_().length;
  return [
    '✅ 系統正常',
    '版本：' + APP.VERSION,
    '文件：' + ctx.doc.getName(),
    '表頭長度：' + ctx.entry.header,
    '行事曆：' + getCalendar_().getName(),
    '可撤銷筆數：' + undoCount,
    '未完成事項：' + listUnfinished_().length + ' 筆',
    '全天事件提醒：' + formatReminderText_(getAllDayReminder_(), true) +
      '（當天 ' + (props.getProperty('ALLDAY_REMIND_CLOCK') || APP.ALLDAY_REMIND_CLOCK) + ' 另有 LINE 早晨推播）',
    '索引試算表：' + (indexAvailable_() ? '✅ 正常' : '⚠️ 不可用（查詢改用 Docs 掃描）'),
    '檔案歸檔：' + (ARCHIVE.ENABLED
      ? (props.getProperty('ARCHIVE_FOLDER_ID') ? '✅ 已啟用' : '✅ 已啟用（首次上傳時建立資料夾）')
      : '關閉'),
    '單檔上限：' + formatBytes_(ARCHIVE.MAX_BYTES),
    '晚間回顧：' + (hasEveningTrigger_() ? '已啟用' : '未啟用'),
    '功能選單：' + (props.getProperty('RICHMENU_ID') ? '已啟用' : '未啟用'),
    '早晨推播：' + (hasMorningTrigger_() ? '已啟用' : '未啟用'),
    'Webhook 金鑰：' + (props.getProperty('WEBHOOK_KEY') ? '已設定' : '未設定')
  ].join('\n');
}

function getHelpText_() {
  return [
    '📘 使用方式',
    '',
    '直接輸入即可：',
    '明天上午9點主任會議 → 建立行事曆',
    '下週三下午2點課發會 → 建立行事曆',
    '明天8點記得打電話給代課老師 → 建立提醒',
    '明天整理代理教師資料 → 只寫筆記',
    '',
    '進階寫法：',
    '週五14:00-16:00教評會 地點：會議室',
    '明天9點主任會議 提前1天提醒',
    '',
    '語意不清時會跳按鈕詢問。',
    '',
    '強制指定：',
    '行事曆：明天下午2點課發會',
    '提醒：星期五下午5點完成資料',
    '筆記：明天的會議可能改期',
    '',
    '指令：',
    '/今日　/明日　/本週　/下週',
    '/未完成　待辦清單（可按鈕勾選完成）',
    '/完成 3　完成第3項（也可 /完成 關鍵字）',
    '/本月　本月統計摘要（/本月 202507 查往月）',
    '/文件　開啟本月 Docs（/文件 202507 查往月）',
    '/搜尋 關鍵字',
    '/改 新內容　重寫上一筆',
    '/撤銷　刪除上一筆（可連撤 ' + APP.UNDO_STACK_SIZE + ' 筆）',
    '/加詞 行事曆 教評會　自訂判斷詞',
    '/索引　開啟索引試算表',
    '/檔案　開歸檔資料夾（/檔案 關鍵字 可找檔）',
    '/辨識　辨識最後一個圖片或 PDF 的文字',
    '/檔名 新名稱　替最後歸檔的檔案改名',
    '/進行 3　把第 3 項標為進行中（◐，仍算未完成）',
    '/完成 3｜主計已收件　完成並記下結案說明',
    '/清理　把只是筆記的待辦一次轉回筆記',
    '/管理　取得網頁管理台網址',
    '/分類　看歸檔分類規則',
    '/加類 研習通知 增能　自訂分類詞',
    '/詞庫　/狀態　/說明',
    '',
    '※ /完成 /搜尋 /改 /加詞 /檔案關鍵字 必須加斜線，',
    '　 否則「完成：核銷」這種句子會被當成筆記正常記下來。',
    '',
    '💡 待辦會自動抓期限：',
    '「週五前完成核銷」→ 期限星期五，逾期會標紅。',
    '💡 每次寫入後可直接按按鈕撤銷或改變型態。',
    '💡 聊天室下方的「功能選單」可直接點選常用指令。',
    '',
    '📎 直接傳檔案（照片／影片／語音／PDF／Word…）',
    '　 會自動存進雲端硬碟並回傳連結，',
    '　 同時寫進 Docs 與索引，可按鈕改檔名、OCR、刪除。',
    '📂 會自動判斷公務分類（研習通知、開會通知、公文…）',
    '　 存成「分類／年月」兩層資料夾。',
    '📅 公文或通知的 PDF、照片，會自動抓出活動日期，',
    '　 跳按鈕問要不要建行事曆——按一下就好。'
  ].join('\n');
}

/* ============================================================
 * 九、LINE 傳送
 * ============================================================ */

function replyText_(replyToken, text) {
  replyMessages_(replyToken, [{ type: 'text', text: String(text).slice(0, 4900) }]);
}

function replyMessages_(replyToken, messages) {
  if (!replyToken) return;
  const token = getRequiredProperty_('LINE_CHANNEL_ACCESS_TOKEN');
  const response = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ replyToken: replyToken, messages: messages }),
    muteHttpExceptions: true
  });
  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('LINE 回覆失敗（HTTP ' + code + '）：' + response.getContentText());
  }
}

// replyToken 失效時自動改用 push，訊息不會遺失
function safeReply_(replyToken, text) {
  try {
    replyText_(replyToken, text);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    try { pushText_(text); } catch (e2) { console.error(getErrorMessage_(e2)); }
  }
}

function pushText_(text) {
  const props = PropertiesService.getScriptProperties();
  const userId = props.getProperty('OWNER_USER_ID');
  if (!userId) throw new Error('尚未綁定 OWNER_USER_ID');
  const token = getRequiredProperty_('LINE_CHANNEL_ACCESS_TOKEN');
  const response = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text: String(text).slice(0, 4900) }]
    }),
    muteHttpExceptions: true
  });
  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('LINE 推播失敗（HTTP ' + code + '）：' + response.getContentText());
  }
}

// [2.6 改] 兩段式去重。回傳 true 表示「可以處理」。
function markEventProcessing_(eventId) {
  if (!eventId) return true;                    // 沒有 id 就不去重，一律放行
  const cache = CacheService.getScriptCache();
  const key = eventCacheKey_(eventId);
  if (cache.get(key)) return false;             // processing 或 done → 略過
  cache.put(key, 'processing', APP.EVENT_PROCESSING_SECONDS);
  return true;
}

function markEventDone_(eventId) {
  if (!eventId) return;
  try {
    CacheService.getScriptCache().put(eventCacheKey_(eventId), 'done', APP.EVENT_CACHE_SECONDS);
  } catch (err) {
    console.warn('去重標記寫入失敗：' + getErrorMessage_(err));
  }
}

function eventCacheKey_(eventId) {
  return 'line_event_' + eventId;
}

/* ============================================================
 * 十、綁定與安全
 * ============================================================ */

function bindOwner_(replyToken, userId, inputPin) {
  const props = PropertiesService.getScriptProperties();
  const cache = CacheService.getScriptCache();
  const expectedPin = props.getProperty('OWNER_PIN') || '';
  const boundId = props.getProperty('OWNER_USER_ID') || '';

  if (!expectedPin) {
    safeReply_(replyToken, '尚未設定 OWNER_PIN。請先到 Apps Script 的「指令碼屬性」設定。');
    return;
  }

  // 已綁定其他帳號時直接拒絕，需先執行 resetOwnerBinding()
  if (boundId && boundId !== userId) {
    safeReply_(replyToken, '此機器人已綁定其他帳號。');
    return;
  }

  const failKey = 'bindfail_' + (userId || 'anon');
  const fails = Number(cache.get(failKey) || 0);
  if (fails >= 5) {
    safeReply_(replyToken, '嘗試次數過多，請 10 分鐘後再試。');
    return;
  }

  if (inputPin !== expectedPin) {
    cache.put(failKey, String(fails + 1), 600);
    safeReply_(replyToken, 'PIN 不正確。（剩餘 ' + (4 - fails) + ' 次）');
    return;
  }
  if (!userId) {
    safeReply_(replyToken, '無法取得 LINE User ID，請從一對一聊天送出。');
    return;
  }

  cache.remove(failKey);
  props.setProperty('OWNER_USER_ID', userId);
  safeReply_(replyToken,
    '✅ 綁定完成\n\n' +
    '直接輸入日期、時間與事項，系統會自動判斷。\n' +
    '輸入 /說明 查看完整用法。'
  );
}

function resetOwnerBinding() {
  PropertiesService.getScriptProperties().deleteProperty('OWNER_USER_ID');
  console.log('已解除 LINE 帳號綁定。');
}

/* ============================================================
 * 十一、安裝與排程
 * ============================================================ */

function setupSystem() {
  const props = PropertiesService.getScriptProperties();
  const ctx = getJournalContext_(new Date());
  const missing = [];
  if (!props.getProperty('LINE_CHANNEL_ACCESS_TOKEN')) missing.push('LINE_CHANNEL_ACCESS_TOKEN');
  if (!props.getProperty('OWNER_PIN')) missing.push('OWNER_PIN');

  const info = [
    '=== 安裝完成 ' + APP.VERSION + ' ===',
    '文件網址：' + ctx.doc.getUrl(),
    '偵測到的表頭長度：' + ctx.entry.header,
    missing.length ? '⚠️ 尚未設定指令碼屬性：' + missing.join('、') : '✅ 必填屬性齊全',
    '',
    'LINE Webhook URL 請設為：',
    webhookUrl_(),
    isDevUrl_(webhookUrl_()) ? '\n' + devUrlWarning_() + '\n' : '',
    '',
    '索引試算表：' + (indexSheetUrl_() || '（尚未建立）'),
    '歸檔資料夾：' + archiveFolderUrlSafe_(),
    '',
    '下一步：',
    '1. 部署 →「管理部署作業」→ 版本選「新版本」→ 部署',
    '2. 在 LINE 輸入「綁定 你的PIN」',
    '3. 執行 setupDailyTrigger() 開啟每日早晨推播',
    '4. 執行 setupEveningTrigger() 開啟晚間回顧（選用）',
    '5. 舊資料補建索引：執行 rebuildIndexFromDocs()',
    '6. 圖形選單：設好 RICHMENU_IMAGE_FILE_ID 後執行 setupRichMenu()',
    '7. 檔案歸檔：執行 setupArchiveFolder() 先建好資料夾，',
    '　 或用 setArchiveFolderByUrl(\'資料夾網址\') 指定既有資料夾',
    '8. 傳檔沒反應時：先執行 lineWebhookStatus()，再執行 diagnoseArchive()',
    '',
    '（選用）想加一層防偽造保護再執行 enableWebhookKey()，',
    '　　　　它會印出新網址，務必同步更新到 LINE 後台。'
  ].join('\n');

  console.log(info);
  return info;
}

/**
 * [3.2.4] 注意：在編輯器裡執行時，getUrl() 回傳的是結尾 /dev 的「測試網址」。
 * 那個網址要 Google 登入才進得去，LINE 用不了——不能直接貼到 LINE 後台。
 * 這裡照實回傳，由呼叫端負責提醒（改寫成 /exec 是行不通的，
 * 兩者的 ID 不同，正式網址只能從「管理部署作業」複製）。
 */
function webhookUrl_() {
  const key = PropertiesService.getScriptProperties().getProperty('WEBHOOK_KEY');
  let base;
  try {
    base = ScriptApp.getService().getUrl();
  } catch (err) {
    return '（尚未部署為網頁應用程式）';
  }
  if (!base) return '（尚未部署為網頁應用程式）';
  return base + (key ? '?k=' + key : '');
}

function isDevUrl_(url) {
  return /\/dev(\?|$)/.test(String(url || ''));
}

function devUrlWarning_() {
  return [
    '⚠️ 這是「測試部署」網址（結尾 /dev），LINE 不能用！',
    '　 /dev 需要 Google 帳號登入才存取得到，LINE 沒有登入態，',
    '　 請求連 doPost 都進不來，執行記錄會完全空白。',
    '',
    '　 正確網址的取得方式：',
    '　 部署 →「管理部署作業」→ 選「網頁應用程式」那一筆',
    '　 → 複製結尾為 /exec 的網址（沒有的話先「新增部署作業」）。',
    '　 拿到後執行：syncLineWebhook(\'貼上那串 /exec 網址\')'
  ].join('\n');
}

/**
 * 把使用者貼進來的網址補上 WEBHOOK_KEY（若有啟用）。
 */
function withWebhookKey_(url) {
  const key = PropertiesService.getScriptProperties().getProperty('WEBHOOK_KEY');
  const clean = String(url || '').trim();
  if (!key || clean.indexOf('k=' + key) >= 0) return clean;
  return clean + (clean.indexOf('?') >= 0 ? '&' : '?') + 'k=' + key;
}

// 一鍵健檢：任何時候「LINE 沒反應」都先跑這支
function whereAmI() {
  const p = PropertiesService.getScriptProperties();
  const lines = ['=== 系統健檢 ' + APP.VERSION + ' ==='];

  lines.push('LINE_CHANNEL_ACCESS_TOKEN：' + (p.getProperty('LINE_CHANNEL_ACCESS_TOKEN') ? '✅ 已設定' : '❌ 缺少'));
  lines.push('OWNER_PIN：' + (p.getProperty('OWNER_PIN') ? '✅ 已設定' : '❌ 缺少'));
  lines.push('OWNER_USER_ID：' + (p.getProperty('OWNER_USER_ID') ? '✅ 已綁定' : '❌ 未綁定，請在 LINE 輸入「綁定 你的PIN」'));

  const key = p.getProperty('WEBHOOK_KEY');
  lines.push('Webhook 金鑰：' + (key ? '已啟用（LINE 網址必須帶 ?k=' + key + '）' : '未啟用（不驗證）'));

  let url = '';
  try { url = ScriptApp.getService().getUrl() || ''; } catch (err) { url = ''; }
  lines.push('部署狀態：' + (url ? '✅ 已部署' : '❌ 尚未部署為網頁應用程式'));
  if (isDevUrl_(url)) {
    lines.push('');
    lines.push(devUrlWarning_());
    lines.push('');
  }

  try {
    lines.push('行事曆：✅ ' + getCalendar_().getName());
  } catch (err) {
    lines.push('行事曆：❌ ' + getErrorMessage_(err));
  }

  try {
    const ctx = getJournalContext_(new Date());
    lines.push('文件：✅ ' + ctx.doc.getName() + '（表頭 ' + ctx.entry.header + '）');
  } catch (err) {
    lines.push('文件：❌ ' + getErrorMessage_(err));
  }

  try {
    lines.push('索引試算表：' + (indexAvailable_() ? '✅ ' + indexSheetUrl_() : '⚠️ 不可用'));
  } catch (err) {
    lines.push('索引試算表：❌ ' + getErrorMessage_(err));
  }

  lines.push('早晨推播：' + (hasMorningTrigger_() ? '✅ 已啟用' : '未啟用'));
  lines.push('晚間回顧：' + (hasEveningTrigger_() ? '✅ 已啟用' : '未啟用'));
  lines.push('國定假日略過：' + (APP.SKIP_HOLIDAY ? '啟用' : '關閉'));
  lines.push('功能選單：' + (p.getProperty('RICHMENU_ID') ? '✅ 已啟用' : '未啟用（執行 setupRichMenu()）'));
  lines.push('');
  lines.push('★ LINE 後台的 Webhook URL 必須完全等於下面這一行：');
  lines.push(webhookUrl_());
  lines.push('');
  lines.push('提醒：貼上新程式碼後，一定要重新「部署 → 管理部署作業 → 版本選『新版本』」，');
  lines.push('　　　否則 /exec 網址仍執行舊版程式。');

  const text = lines.join('\n');
  console.log(text);
  return text;
}

function enableWebhookKey() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('WEBHOOK_KEY', Utilities.getUuid().replace(/-/g, '').slice(0, 16));
  const info = [
    '✅ 已啟用 Webhook 金鑰。',
    '',
    '⚠️ 現在請立刻把 LINE Developers 的 Webhook URL 改成：',
    webhookUrl_(),
    '',
    '沒有同步更新的話，LINE 訊息會全部被擋下（執行紀錄會顯示錯誤）。',
    '想關閉請執行 disableWebhookKey()。'
  ].join('\n');
  console.log(info);
  return info;
}

function disableWebhookKey() {
  PropertiesService.getScriptProperties().deleteProperty('WEBHOOK_KEY');
  const info = [
    '✅ 已關閉 Webhook 金鑰驗證，不帶 ?k= 的網址也能運作。',
    '',
    'LINE Webhook URL 可設為：',
    webhookUrl_()
  ].join('\n');
  console.log(info);
  return info;
}

// [新] 每日早晨自動推播今日行程
function setupDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'dailyMorningBrief') ScriptApp.deleteTrigger(t);
  });

  const hour = Number(PropertiesService.getScriptProperties().getProperty('MORNING_BRIEF_HOUR'));
  const useHour = Number.isFinite(hour) && hour >= 0 && hour <= 23 ? hour : APP.MORNING_HOUR;

  ScriptApp.newTrigger('dailyMorningBrief')
    .timeBased()
    .atHour(useHour)
    .nearMinute(30)
    .everyDays(1)
    .create();

  console.log('已建立每日 ' + useHour + ':30 左右的早晨推播。');
}

function removeDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'dailyMorningBrief') ScriptApp.deleteTrigger(t);
  });
  console.log('已移除早晨推播。');
}

function hasMorningTrigger_() {
  try {
    return ScriptApp.getProjectTriggers().some(function (t) {
      return t.getHandlerFunction() === 'dailyMorningBrief';
    });
  } catch (err) {
    return false;
  }
}

/**
 * [2.7 新] 台灣國定假日判斷。
 * 使用 Google 內建的台灣假日行事曆；讀不到就當作上班日（寧可多推播，不要漏推播）。
 * 補班日（假日行事曆上標為「補行上班」）不算假日。
 */
function isTaiwanHoliday_(date) {
  if (!APP.SKIP_HOLIDAY) return false;
  try {
    const cal = CalendarApp.getCalendarById(TW_HOLIDAY_CALENDAR_ID);
    if (!cal) return false;
    const events = cal.getEventsForDay(date);
    for (let i = 0; i < events.length; i++) {
      const title = String(events[i].getTitle() || '');
      if (/補行上班|補班/.test(title)) return false;
      return true;
    }
    return false;
  } catch (err) {
    console.warn('假日判斷失敗，視為上班日：' + getErrorMessage_(err));
    return false;
  }
}

function shouldSkipBriefing_(now) {
  const day = now.getDay();
  if (APP.MORNING_SKIP_WEEKEND && (day === 0 || day === 6)) return '週末';
  if (isTaiwanHoliday_(now)) return '國定假日';
  return '';
}

function dailyMorningBrief() {
  const now = new Date();
  const skip = shouldSkipBriefing_(now);
  if (skip) {
    console.log('今天是' + skip + '，略過早晨推播。');
    return;
  }

  try {
    let msg = '☀️ 早安\n\n' + buildDayScheduleText_(now, '今日');
    try {
      msg += '\n' + buildTodoDigest_(3);
    } catch (e) {
      console.warn('待辦統計失敗：' + getErrorMessage_(e));
    }
    pushText_(msg);
  } catch (err) {
    console.error('早晨推播失敗：' + getErrorMessage_(err));
  }
}

/**
 * [2.7 新] 晚間回顧：今天還沒做完的事 + 明天的行程。
 * 對主任這種「白天一直被打斷」的工作型態，收工前掃一次比早上更有用。
 */
function eveningReview() {
  const now = new Date();
  const skip = shouldSkipBriefing_(now);
  if (skip) {
    console.log('今天是' + skip + '，略過晚間回顧。');
    return;
  }

  try {
    const parts = ['🌙 收工前回顧'];
    try {
      parts.push('', buildTodoDigest_(5).replace(/^\n+/, ''));
    } catch (e) {
      console.warn('待辦統計失敗：' + getErrorMessage_(e));
    }
    parts.push('', '── 明天 ──', buildDayScheduleText_(addDays_(now, 1), '明日'));
    pushText_(parts.join('\n'));
  } catch (err) {
    console.error('晚間回顧失敗：' + getErrorMessage_(err));
  }
}

// [2.7 新] 待辦摘要區塊，早安與晚間回顧共用
function buildTodoDigest_(limit) {
  const todo = listUnfinished_();
  if (!todo.length) return '\n📋 沒有未完成事項 🎉';

  const overdue = todo.filter(function (it) { return todoUrgency_(it).overdue; }).length;
  const head = '\n📋 未完成 ' + todo.length + ' 筆' +
    (overdue ? '（🔴 逾期 ' + overdue + ' 筆）' : '');

  const rows = todo.slice(0, limit).map(function (it, i) {
    return '　' + (i + 1) + '. ' + it.content.slice(0, 30) + todoUrgency_(it).label;
  });

  return head + '\n' + rows.join('\n') +
    (todo.length > limit ? '\n　…輸入 /未完成 查看全部' : '');
}

function setupEveningTrigger() {
  removeEveningTrigger();

  const raw = Number(PropertiesService.getScriptProperties().getProperty('EVENING_REVIEW_HOUR'));
  const hour = Number.isFinite(raw) && raw >= 0 && raw <= 23 ? raw : APP.EVENING_HOUR;

  ScriptApp.newTrigger('eveningReview')
    .timeBased()
    .atHour(hour)
    .nearMinute(0)
    .everyDays(1)
    .create();

  const info = '已建立每日 ' + hour + ':00 左右的晚間回顧推播。';
  console.log(info);
  return info;
}

function removeEveningTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'eveningReview') ScriptApp.deleteTrigger(t);
  });
}

function hasEveningTrigger_() {
  try {
    return ScriptApp.getProjectTriggers().some(function (t) {
      return t.getHandlerFunction() === 'eveningReview';
    });
  } catch (err) {
    return false;
  }
}

/* ============================================================
 * 十一之二、LINE 功能選單（Rich Menu）2.8 新增
 *
 * 手機上點圖示就送出指令，不用打字。
 *
 * 按鈕動作用 message 型別 —— 等同使用者親手輸入該指令，
 * 因此完全沿用既有的 handleCommand_ 路由，不需要新的處理邏輯。
 *
 * 安裝流程：
 *   1. 用「功能選單產生器」做出 PNG，上傳到雲端硬碟
 *   2. 指令碼屬性設 RICHMENU_IMAGE_FILE_ID = 該檔案 ID
 *   3. 執行 setupRichMenu()
 *   4. 關掉 LINE 聊天室再開一次
 * ============================================================ */

const RICHMENU = {
  ENABLED: true,
  NAME: '記事助理選單',
  CHAT_BAR_TEXT: '功能選單',
  LAYOUT: '2x3',              // '2x3' = 2500x1686（六格）、'1x3' = 2500x843（三格）
  CELLS: [
    { label: '今日', text: '/今日' },
    { label: '明日', text: '/明日' },
    { label: '本週', text: '/本週' },
    { label: '未完成', text: '/未完成' },
    { label: '撤銷', text: '/撤銷' },
    { label: '索引', text: '/索引' }
  ]
};

const LINE_API = 'https://api.line.me/v2/bot';
const LINE_DATA_API = 'https://api-data.line.me/v2/bot';

/* ------------------------------------------------------------
 * 版面計算
 * ------------------------------------------------------------ */

function richMenuGeometry_() {
  const cols = 3;
  const rows = RICHMENU.LAYOUT === '1x3' ? 1 : 2;
  const colWidths = [833, 833, 834];      // 合計 2500
  const rowHeight = 843;

  const boxes = [];
  let y = 0;
  for (let r = 0; r < rows; r++) {
    let x = 0;
    for (let c = 0; c < cols; c++) {
      boxes.push({ x: x, y: y, width: colWidths[c], height: rowHeight });
      x += colWidths[c];
    }
    y += rowHeight;
  }

  return {
    size: { width: 2500, height: rowHeight * rows },
    boxes: boxes
  };
}

function buildRichMenuBody_() {
  const geo = richMenuGeometry_();
  const cells = RICHMENU.CELLS.slice(0, geo.boxes.length);

  if (cells.length < geo.boxes.length) {
    throw new Error(
      'RICHMENU.CELLS 只有 ' + cells.length + ' 個，' +
      RICHMENU.LAYOUT + ' 版面需要 ' + geo.boxes.length + ' 個。'
    );
  }

  const areas = geo.boxes.map(function (box, i) {
    return {
      bounds: box,
      action: {
        type: 'message',
        label: String(cells[i].label).slice(0, 20),
        text: cells[i].text
      }
    };
  });

  return {
    size: geo.size,
    selected: false,            // 預設收合，不擋聊天內容
    name: String(RICHMENU.NAME).slice(0, 300),
    chatBarText: String(RICHMENU.CHAT_BAR_TEXT).slice(0, 14),
    areas: areas
  };
}

/* ------------------------------------------------------------
 * 圖片來源
 * ------------------------------------------------------------ */

function getRichMenuImageBlob_() {
  const props = PropertiesService.getScriptProperties();
  const fileId = props.getProperty('RICHMENU_IMAGE_FILE_ID');

  let file = null;
  if (fileId) {
    try {
      file = DriveApp.getFileById(fileId);
    } catch (err) {
      throw new Error('RICHMENU_IMAGE_FILE_ID 對應的檔案打不開：' + getErrorMessage_(err));
    }
  } else {
    // 沒設屬性時，找雲端硬碟裡叫 richmenu.png 的檔案
    const it = DriveApp.getFilesByName('richmenu.png');
    if (it.hasNext()) file = it.next();
  }

  if (!file) {
    throw new Error(
      '找不到選單圖片。請先用產生器做出 PNG 並上傳到雲端硬碟，\n' +
      '再把檔案 ID 設到指令碼屬性 RICHMENU_IMAGE_FILE_ID，\n' +
      '或直接把檔案命名為 richmenu.png。'
    );
  }

  const blob = file.getBlob();
  const type = blob.getContentType();
  if (type !== 'image/png' && type !== 'image/jpeg') {
    throw new Error('選單圖片必須是 PNG 或 JPEG，目前是 ' + type + '。');
  }

  const bytes = blob.getBytes().length;
  if (bytes > 1024 * 1024) {
    throw new Error(
      '選單圖片 ' + (bytes / 1024 / 1024).toFixed(2) + ' MB，超過 LINE 的 1 MB 上限。' +
      '請改用三格版面（2500×843），或先壓縮 PNG。'
    );
  }

  return { blob: blob, file: file, bytes: bytes, type: type };
}

/* ------------------------------------------------------------
 * LINE API
 * ------------------------------------------------------------ */

function lineApi_(method, url, options) {
  const opt = options || {};
  const params = {
    method: method,
    headers: { Authorization: 'Bearer ' + getRequiredProperty_('LINE_CHANNEL_ACCESS_TOKEN') },
    muteHttpExceptions: true
  };
  if (opt.json) {
    params.contentType = 'application/json';
    params.payload = JSON.stringify(opt.json);
  }
  if (opt.bytes) {
    params.contentType = opt.contentType;
    params.payload = opt.bytes;
  }

  const res = UrlFetchApp.fetch(url, params);
  const code = res.getResponseCode();
  const text = res.getContentText();

  if (code < 200 || code >= 300) {
    throw new Error('LINE API ' + method + ' ' + url.replace(LINE_API, '').replace(LINE_DATA_API, '') +
      ' 失敗（HTTP ' + code + '）：' + text);
  }
  return text ? JSON.parse(text) : {};
}

function listRichMenus_() {
  const data = lineApi_('get', LINE_API + '/richmenu/list');
  return data.richmenus || [];
}

/* ------------------------------------------------------------
 * 主要操作
 * ------------------------------------------------------------ */

/**
 * 建立並啟用功能選單。可重複執行，會先清掉舊的。
 */
function setupRichMenu() {
  if (!RICHMENU.ENABLED) {
    const off = '功能選單已在 RICHMENU.ENABLED 關閉，未執行任何動作。';
    console.log(off);
    return off;
  }

  const body = buildRichMenuBody_();
  const image = getRichMenuImageBlob_();

  // 先取得圖片，確認沒問題才動既有選單，避免中途失敗留下沒有選單的狀態
  const existing = listRichMenus_();

  const created = lineApi_('post', LINE_API + '/richmenu', { json: body });
  const id = created.richMenuId;
  if (!id) throw new Error('LINE 沒有回傳 richMenuId，建立失敗。');

  try {
    lineApi_('post', LINE_DATA_API + '/richmenu/' + id + '/content', {
      bytes: image.blob.getBytes(),
      contentType: image.type
    });
    lineApi_('post', LINE_API + '/user/all/richmenu/' + id);
  } catch (err) {
    // 上傳或啟用失敗就把剛建立的空選單收掉，不留垃圾
    try { lineApi_('delete', LINE_API + '/richmenu/' + id); } catch (e2) { /* 忽略 */ }
    throw err;
  }

  // 舊選單改到現在才刪，確保新的已經上線
  let removed = 0;
  existing.forEach(function (m) {
    try { lineApi_('delete', LINE_API + '/richmenu/' + m.richMenuId); removed++; }
    catch (err) { console.warn('刪除舊選單失敗：' + getErrorMessage_(err)); }
  });

  PropertiesService.getScriptProperties().setProperty('RICHMENU_ID', id);

  const info = [
    '=== 功能選單已啟用 ===',
    '版面：' + RICHMENU.LAYOUT + '（' + body.size.width + '×' + body.size.height + '，' +
      body.areas.length + ' 格）',
    '圖片：' + image.file.getName() + '　' + Math.round(image.bytes / 1024) + ' KB',
    'richMenuId：' + id,
    '清除舊選單：' + removed + ' 個',
    '',
    '按鈕對應：',
    body.areas.map(function (a, i) {
      return '　' + i + '. ' + a.action.label + ' → ' + a.action.text;
    }).join('\n'),
    '',
    '請關掉 LINE 聊天室再開一次，選單才會出現。'
  ].join('\n');

  console.log(info);
  return info;
}

/**
 * 移除功能選單（聊天室恢復成一般輸入框）。
 */
function removeRichMenu() {
  try {
    lineApi_('delete', LINE_API + '/user/all/richmenu');
  } catch (err) {
    console.warn('取消預設選單失敗（可能本來就沒有）：' + getErrorMessage_(err));
  }

  let removed = 0;
  listRichMenus_().forEach(function (m) {
    try { lineApi_('delete', LINE_API + '/richmenu/' + m.richMenuId); removed++; }
    catch (err) { console.warn('刪除選單失敗：' + getErrorMessage_(err)); }
  });

  PropertiesService.getScriptProperties().deleteProperty('RICHMENU_ID');

  const info = '已移除功能選單，共刪除 ' + removed + ' 個。請重開 LINE 聊天室。';
  console.log(info);
  return info;
}

/**
 * 查看目前 LINE 上有哪些選單。
 */
function richMenuStatus() {
  const lines = ['=== 功能選單狀態 ==='];

  try {
    const menus = listRichMenus_();
    lines.push('LINE 上的選單：' + menus.length + ' 個');
    menus.forEach(function (m) {
      lines.push('　・' + m.name + '　' + m.size.width + '×' + m.size.height +
        '　' + m.areas.length + ' 格　' + m.richMenuId);
    });
  } catch (err) {
    lines.push('查詢失敗：' + getErrorMessage_(err));
  }

  const saved = PropertiesService.getScriptProperties().getProperty('RICHMENU_ID');
  lines.push('本系統記錄的 ID：' + (saved || '（無）'));

  try {
    const image = getRichMenuImageBlob_();
    lines.push('選單圖片：✅ ' + image.file.getName() + '　' +
      Math.round(image.bytes / 1024) + ' KB　' + image.type);
  } catch (err) {
    lines.push('選單圖片：❌ ' + getErrorMessage_(err));
  }

  const geo = richMenuGeometry_();
  lines.push('目前設定：' + RICHMENU.LAYOUT + '　' +
    geo.size.width + '×' + geo.size.height + '　需要 ' + geo.boxes.length + ' 格　' +
    '（CELLS 有 ' + RICHMENU.CELLS.length + ' 個）');

  const text = lines.join('\n');
  console.log(text);
  return text;
}

/**
 * 不動 LINE，先在執行紀錄檢查版面與指令對應是否正確。
 */
function previewRichMenu() {
  const body = buildRichMenuBody_();
  const lines = [
    '=== 功能選單預覽（未送出）===',
    '尺寸：' + body.size.width + '×' + body.size.height,
    '選單列文字：' + body.chatBarText,
    ''
  ];
  body.areas.forEach(function (a, i) {
    lines.push(i + '. ' + a.action.label +
      '　→ 送出「' + a.action.text + '」' +
      '　[x' + a.bounds.x + ' y' + a.bounds.y +
      ' w' + a.bounds.width + ' h' + a.bounds.height + ']');
  });

  // 指令是否真的存在
  const known = /^\/(今日|明日|本週|下週|未完成|待辦|完成|本月|月報|文件|搜尋|改|撤銷|加詞|詞庫|索引|表|試算表|狀態|說明)/;
  const bad = body.areas.filter(function (a) { return !known.test(a.action.text); });
  lines.push('');
  lines.push(bad.length
    ? '⚠️ 這些按鈕的指令不在已知清單裡，按下去會收到「找不到指令」：\n　' +
      bad.map(function (a) { return a.action.text; }).join('、')
    : '✅ 所有按鈕都對應到現有指令');

  const text = lines.join('\n');
  console.log(text);
  return text;
}

/* ============================================================
 * 十一之四、檔案自動歸檔（3.1 新增）
 * ============================================================
 * 設計重點：
 *   ・Drive 是檔案的真相來源，Docs 是人看的紀錄，試算表是機器查的索引。
 *     三邊都寫，但只有 Drive 寫失敗才算失敗——Docs／索引寫失敗只記警告，
 *     檔案已經存進雲端硬碟就不該讓使用者以為沒存到。
 *   ・檔名一律加時間戳，同名檔案不會互相覆蓋，也不必問使用者要不要覆寫。
 *   ・LINE 的內容有保存期限（約 7 天），所以「先存下來」比「等你想到再存」重要，
 *     整個流程不需要任何確認步驟。
 *
 * 相關指令：
 *   /檔案            開歸檔資料夾 + 列最近歸檔
 *   /檔案 關鍵字      在歸檔紀錄裡找檔
 *   /辨識            對最後一個圖片／PDF 做 OCR
 *   /檔名 新名稱      替最後歸檔的檔案改名
 * ============================================================ */

const ARCHIVE = {
  ENABLED: true,
  ROOT_NAME: 'LINE 檔案存檔',
  // [3.2] 'category' → 存檔根目錄/研習通知/2026-08（預設，公務最好找）
  //       'month' → 2026/2026-08　　'type' → 圖片　　'flat' → 全部同一層
  LAYOUT: 'category',
  FALLBACK_CATEGORY: '其他',
  PHOTO_CATEGORY: '照片',
  // UrlFetch 回應上限約 50MB，留餘裕。超過的檔案 LINE 端多半也是影片，建議改用雲端硬碟直傳。
  MAX_BYTES: 40 * 1024 * 1024,
  FETCH_RETRY: 4,
  RETRY_WAIT_MS: 1500,
  PENDING_TTL_SECONDS: 600,
  KEEP_ORIGINAL_NAME: true,     // file 訊息保留原始檔名（前面仍加時間戳）
  OCR_ENABLED: true,
  OCR_LANGUAGE: 'zh-TW',
  OCR_MAX_CHARS: 1500,
  AUTO_OCR_HINT: true,          // 圖片／PDF 存好後，按鈕列出現「文字辨識」

  // [3.2] 存檔時自動辨識圖片／PDF。同一趟轉檔同時服務「分類複判」與「抽日期」兩件事。
  //       大檔轉檔慢，超過上限就只做檔名分類，避免拖到 LINE 回覆時限。
  AUTO_OCR: true,
  AUTO_OCR_MAX_BYTES: 8 * 1024 * 1024,
  AUTO_EVENT: true              // 從辨識到的內文提議建立行事曆
};

/* ------------------------------------------------------------
 * [3.2] 公務分類規則
 *
 * 順序即優先級（同分時排前面的贏）。
 * fallbackOnly 的分類只有在其他分類全部沒中時才會採用——
 * 「受文者／發文字號」幾乎每份公文都有，若一視同仁，
 * 研習通知、開會通知會全部被歸成「公文」，等於沒有分類。
 * 自訂詞：/加類 研習通知 增能　或設 ARCHIVE_CATEGORY_WORDS（JSON）
 * ------------------------------------------------------------ */

const DOC_CATEGORIES = [
  { name: '研習通知', words: ['研習', '工作坊', '增能', '講座', '培訓', '進修', '師培', '研討會', '種子教師', '備課'] },
  { name: '開會通知', words: ['開會通知', '會議通知', '議程', '會議紀錄', '簽到表', '課發會', '教評會', '校務會議', '行政會議', '學年會議', '領域會議'] },
  { name: '課程與課表', words: ['課表', '課程計畫', '教學進度', '總體課程', '彈性學習', '學習領域', '教科書', '選書', '課程地圖', '素養'] },
  { name: '教師人事', words: ['代理教師', '代課', '甄選', '聘任', '介聘', '差假', '鐘點', '員額', '編制', '導師', '超額', '成績考核', '敘薪'] },
  { name: '學生事務', words: ['學籍', '註冊', '轉學', '新生', '編班', '成績單', '評量', '名冊', '獎狀', '畢業', '特教', '中輟'] },
  { name: '經費核銷', words: ['核銷', '請購', '採購', '經費', '發票', '收據', '預算', '結報', '報價', '決標', '補助款'] },
  { name: '活動與競賽', words: ['競賽', '比賽', '校慶', '運動會', '園遊會', '音樂會', '成果發表', '闖關', '展演', '參訪'] },
  { name: '評鑑與訪視', words: ['評鑑', '訪視', '視導', '督學', '自我檢核', '訪查', '複評'] },
  { name: '表單範本', words: ['表單', '範本', '格式', '申請表', '空白表', '調查表', '回條'] },
  { name: '公文', words: ['受文者', '發文字號', '速別', '密等', '函轉', '主旨', '正本', '副本', '教育局', '市政府'], fallbackOnly: true }
];

// 公文本身的日期（發文、收文、檔號…）不是活動日期，掃描時必須跳過
const DOC_DATE_SKIP_RE = /(發文日期|來文日期|收文日期|發文字號|檔\s*號|保存年限|列印日期|建檔日期|出生|到職|生效日期|有效期限至|文別)/;

// 帶這些詞的那一行，比較可能是「活動本身」的日期
const DOC_EVENT_HINT_RE = /(時間|舉行|召開|辦理|訂於|排定|開會|上課|集合|報到|辦理日期|活動日期)/;

// 這些是「要交件的期限」，不是活動當天；同一份公文常兩種日期並存，
// 抓錯的話行事曆會排在報名截止日而不是研習當天。
const DOC_DEADLINE_HINT_RE = /(截止|收件|繳交|報名日期|報名至|以前|前完成|備文|函復)/;

const MEDIA_KIND = {
  image: { label: '圖片', icon: '🖼️', ext: 'jpg', folder: '圖片' },
  video: { label: '影片', icon: '🎬', ext: 'mp4', folder: '影片' },
  audio: { label: '語音', icon: '🎙️', ext: 'm4a', folder: '語音' },
  file:  { label: '檔案', icon: '📎', ext: '',    folder: '檔案' }
};

const ARCHIVE_TYPE = '檔案存檔';
const LOCATION_TYPE = '地點紀錄';
const PENDING_ACTION_KEY = 'pending_action';
const LAST_ARCHIVE_KEY = 'LAST_ARCHIVE';

/* ------------------------------------------------------------
 * 主流程
 * ------------------------------------------------------------ */

/**
 * [3.2.1 改] 外層只負責「不要無聲失敗」。
 * 任何沒被內層接住的例外都會寫進執行記錄（含原始事件），
 * 並回報卡在哪一個步驟，不會只留下一句「處理失敗」。
 */
function handleMedia_(event) {
  if (!authorizeEvent_(event)) return;

  const started = Date.now();
  ARCHIVE_STEP.now = '開始';
  try {
    archiveIncomingMedia_(event);
  } catch (err) {
    console.error('[archive] 步驟「' + ARCHIVE_STEP.now + '」發生未預期錯誤：' +
      (err && err.stack ? err.stack : err));
    try {
      console.error('[archive] 原始事件：' + JSON.stringify(event));
    } catch (e2) { /* 事件無法序列化就算了 */ }

    safeReply_(event.replyToken,
      '⚠️ 檔案處理失敗\n' +
      '步驟：' + ARCHIVE_STEP.now + '\n' +
      '訊息：' + getErrorMessage_(err) + '\n\n' +
      '請在 Apps Script 執行 diagnoseArchive() 取得完整診斷。');
  } finally {
    console.log('[archive] 結束於「' + ARCHIVE_STEP.now + '」，耗時 ' +
      ((Date.now() - started) / 1000).toFixed(1) + ' 秒');
  }
}

// 目前執行到哪一步。失敗時要能明確指出斷點，不然使用者只會看到「失敗」兩個字。
const ARCHIVE_STEP = { now: '' };

function archiveIncomingMedia_(event) {
  const msg = event.message;
  const kind = MEDIA_KIND[msg.type];
  if (!kind) {
    safeReply_(event.replyToken, '這個訊息型態目前不支援。');
    return;
  }
  if (!ARCHIVE.ENABLED) {
    safeReply_(event.replyToken, '檔案歸檔目前關閉（ARCHIVE.ENABLED = false）。');
    return;
  }

  const receivedAt = new Date();
  console.log('[archive] 收到 ' + msg.type + ' 訊息，messageId=' + msg.id +
    '，fileName=' + (msg.fileName || '（無）') + '，fileSize=' + (msg.fileSize || '（未提供）'));

  // LINE 先宣告的大小若已超標，直接擋下，不必浪費一次下載配額
  ARCHIVE_STEP.now = '大小檢查';
  const declared = Number(msg.fileSize || 0);
  if (declared && declared > ARCHIVE.MAX_BYTES) {
    safeReply_(event.replyToken,
      '⚠️ 這個檔案 ' + formatBytes_(declared) + '，超過單檔上限 ' + formatBytes_(ARCHIVE.MAX_BYTES) + '。\n' +
      '請改用手機的「分享到雲端硬碟」直接上傳。');
    return;
  }

  ARCHIVE_STEP.now = '向 LINE 下載內容';
  let blob;
  try {
    blob = fetchLineContent_(msg.id, msg.contentProvider);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    safeReply_(event.replyToken, '⚠️ 取得檔案內容失敗：' + getErrorMessage_(err));
    return;
  }

  const bytes = blob.getBytes().length;
  if (bytes > ARCHIVE.MAX_BYTES) {
    safeReply_(event.replyToken,
      '⚠️ 檔案 ' + formatBytes_(bytes) + ' 超過上限 ' + formatBytes_(ARCHIVE.MAX_BYTES) + '，未存檔。');
    return;
  }

  const mime = blob.getContentType();
  console.log('[archive] 下載完成：' + formatBytes_(bytes) + '，MIME=' + mime);

  // [3.2] 第一輪分類只看檔名——快，而且檔名是人取的，訊號最乾淨
  let category = classifyArchive_(msg.fileName || '', '', mime);

  ARCHIVE_STEP.now = '取得歸檔資料夾';
  let file;
  let folder;
  try {
    folder = archiveTargetFolder_(receivedAt, kind, category.name);
    console.log('[archive] 目標資料夾：' + folder.getName() + '（' + folder.getId() + '）');

    ARCHIVE_STEP.now = '寫入雲端硬碟';
    blob.setName(buildArchiveName_(msg, kind, receivedAt, blob));
    file = folder.createFile(blob);
    console.log('[archive] 已建立檔案：' + file.getId());
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    safeReply_(event.replyToken,
      '⚠️ 存入雲端硬碟失敗（步驟：' + ARCHIVE_STEP.now + '）：' + getErrorMessage_(err) + '\n\n' +
      '請在 Apps Script 執行 diagnoseArchive() 檢查資料夾與權限。');
    return;
  }

  // [3.2] 圖片／PDF 自動辨識一次，同一份文字同時用來「複判分類」與「抽日期」
  ARCHIVE_STEP.now = '自動文字辨識';
  let ocrText = '';
  if (shouldAutoOcr_(mime, bytes)) {
    try {
      ocrText = ocrDriveFile_(file.getId());
      console.log('[archive] 辨識到 ' + ocrText.length + ' 個字');
    } catch (err) {
      console.warn('[archive] 自動辨識失敗（不影響存檔）：' + getErrorMessage_(err));
    }
  }

  if (ocrText) {
    const better = classifyArchive_(msg.fileName || file.getName(), ocrText, mime);
    if (better.name !== category.name && better.score > category.score) {
      category = better;
      try {
        const moved = archiveTargetFolder_(receivedAt, kind, category.name);
        if (moved.getId() !== folder.getId()) {
          file.moveTo(moved);
          folder = moved;
        }
      } catch (err) {
        console.warn('分類搬移失敗，檔案留在原資料夾：' + getErrorMessage_(err));
      }
    }
  }

  const name = file.getName();
  const url = file.getUrl();
  const summary = kind.icon + ' [' + category.name + '] ' + name + '（' + formatBytes_(bytes) + '）';

  try {
    file.setDescription([
      'LINE 歸檔',
      formatChineseDateTime_(receivedAt),
      '分類：' + category.name + (category.hits.length ? '（命中 ' + category.hits.join('、') + '）' : ''),
      'messageId：' + msg.id
    ].join('｜'));
  } catch (err) {
    console.warn('檔案說明寫入失敗：' + getErrorMessage_(err));
  }

  // 檔案已經安全落地，Docs／索引寫失敗只提醒，不算整件事失敗
  ARCHIVE_STEP.now = '寫入 Docs 與索引';
  let docNote = '';
  try {
    appendToJournalDoc_({
      receivedAt: receivedAt,
      type: ARCHIVE_TYPE,
      text: summary,
      isTask: false,
      extraLines: [{ prefix: '檔案連結：', url: url }],
      attachUrl: url,
      driveFileId: file.getId()
    });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    docNote = '\n⚠️ 檔案已存好，但寫入 Docs 失敗：' + getErrorMessage_(err);
  }

  rememberLastArchive_({ fileId: file.getId(), name: name, url: url, type: msg.type, category: category.name });

  // [3.2] 公文／通知抽日期：只提議，按了才建
  ARCHIVE_STEP.now = '偵測日期';
  let eventData = null;
  if (ocrText) {
    try {
      eventData = extractDocEvent_(ocrText, name, receivedAt);
    } catch (err) {
      console.warn('日期偵測失敗：' + getErrorMessage_(err));
    }
  }

  const actions = [];
  let eventBlock = '';
  if (eventData) {
    const key = 'doc_' + newUid_();
    CacheService.getScriptCache().put(key, JSON.stringify({
      title: eventData.title,
      location: eventData.location,
      allDay: eventData.allDay,
      start: eventData.start.toISOString(),
      end: eventData.end.toISOString(),
      reminderMinutes: eventData.reminderMinutes,
      url: url,
      name: name
    }), APP.PENDING_TTL_SECONDS);

    eventBlock = '\n\n' + buildDocEventPreview_(eventData);
    actions.push({ label: '📅 建立行事曆', data: 'a=mkcal&k=' + key, display: '建立行事曆' });
  }

  actions.push({ label: '✏️ 改檔名', data: 'a=fname&f=' + file.getId(), display: '改檔名' });
  if (ARCHIVE.AUTO_OCR_HINT !== false && ARCHIVE.OCR_ENABLED && ocrCapable_(mime)) {
    actions.push({ label: '🔍 全文辨識', data: 'a=ocr&f=' + file.getId(), display: '全文辨識' });
  }
  actions.push({ label: '📁 開資料夾', data: 'a=fdir', display: '開資料夾' });
  actions.push({ label: '🗑️ 刪除', data: 'a=fdel&f=' + file.getId(), display: '刪除這個檔案' });

  ARCHIVE_STEP.now = '回覆 LINE';
  replyWithActions_(event.replyToken, [
    '📥 已存到雲端硬碟',
    name,
    formatBytes_(bytes) + '｜' + category.name + '／' + folder.getName(),
    '',
    url
  ].join('\n') + docNote + eventBlock, actions);
}

/**
 * 位置訊息 → 地點紀錄（附 Google 地圖連結）。
 */
function handleLocation_(event) {
  if (!authorizeEvent_(event)) return;

  const msg = event.message;
  const title = String(msg.title || msg.address || '地點').trim();
  const address = String(msg.address || '').trim();
  const map = 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(msg.latitude + ',' + msg.longitude);
  const receivedAt = new Date();

  try {
    appendToJournalDoc_({
      receivedAt: receivedAt,
      type: LOCATION_TYPE,
      text: '📍 ' + title + (address && address !== title ? '（' + address + '）' : ''),
      isTask: false,
      extraLines: [{ prefix: '地圖：', url: map }],
      attachUrl: map
    });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    safeReply_(event.replyToken, '⚠️ 寫入失敗：' + getErrorMessage_(err));
    return;
  }

  replyWithActions_(event.replyToken,
    '📍 已記錄地點\n' + title + (address ? '\n' + address : '') + '\n\n' + map,
    [{ label: '↩️ 撤銷', data: 'a=undo', display: '撤銷' }]);
}

/* ------------------------------------------------------------
 * 下載
 * ------------------------------------------------------------ */

/**
 * 向 LINE 取回訊息內容。
 * 影片剛傳完常還在轉檔，LINE 會先回 202；內容尚未就緒時也可能回 404。
 * 這兩種都是「等一下就好」，所以要重試，不能一次失敗就放棄。
 */
function fetchLineContent_(messageId, provider) {
  const type = provider && provider.type ? provider.type : 'line';

  if (type === 'external') {
    const ext = provider.originalContentUrl;
    if (!ext) throw new Error('這則訊息由外部服務提供內容，且沒有可下載的網址。');
    const r = UrlFetchApp.fetch(ext, { muteHttpExceptions: true, followRedirects: true });
    if (r.getResponseCode() !== 200) {
      throw new Error('外部內容下載失敗（HTTP ' + r.getResponseCode() + '）。');
    }
    return r.getBlob();
  }

  const token = getRequiredProperty_('LINE_CHANNEL_ACCESS_TOKEN');
  const url = LINE_DATA_API + '/message/' + encodeURIComponent(messageId) + '/content';
  let code = 0;
  let body = '';

  for (let i = 0; i < ARCHIVE.FETCH_RETRY; i++) {
    if (i > 0) Utilities.sleep(ARCHIVE.RETRY_WAIT_MS * i);

    const res = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });
    code = res.getResponseCode();
    if (code === 200) return res.getBlob();

    body = String(res.getContentText() || '').slice(0, 200);
    // 202 轉檔中、404 尚未就緒、429 限流、5xx 暫時性 → 重試；其餘直接放棄
    if (code !== 202 && code !== 404 && code !== 429 && code < 500) break;
  }

  if (code === 410) throw new Error('LINE 已刪除此訊息內容（內容僅保留一段時間）。');
  if (code === 401 || code === 403) throw new Error('LINE 權杖無效或權限不足（HTTP ' + code + '）。');
  if (code === 202) throw new Error('影片仍在轉檔，請 30 秒後重新傳一次。');
  throw new Error('向 LINE 下載內容失敗（HTTP ' + code + '）：' + body);
}

/* ------------------------------------------------------------
 * 資料夾與檔名
 * ------------------------------------------------------------ */

function archiveRootFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('ARCHIVE_FOLDER_ID');

  if (id) {
    try {
      const f = DriveApp.getFolderById(id);
      if (!f.isTrashed || !f.isTrashed()) return f;
    } catch (err) {
      console.warn('ARCHIVE_FOLDER_ID 打不開，將重新建立：' + getErrorMessage_(err));
    }
  }

  let parent = null;
  const journalFolderId = props.getProperty('JOURNAL_FOLDER_ID');
  if (journalFolderId) {
    try { parent = DriveApp.getFolderById(journalFolderId); }
    catch (err) { console.warn('JOURNAL_FOLDER_ID 打不開，歸檔資料夾改建在雲端硬碟根目錄。'); }
  }

  const root = parent
    ? getOrCreateChildFolder_(parent, ARCHIVE.ROOT_NAME)
    : getOrCreateTopFolder_(ARCHIVE.ROOT_NAME);

  props.setProperty('ARCHIVE_FOLDER_ID', root.getId());
  return root;
}

function getOrCreateChildFolder_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function getOrCreateTopFolder_(name) {
  const it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

function archiveTargetFolder_(date, kind, category) {
  const root = archiveRootFolder_();
  const month = Utilities.formatDate(date, APP.TZ, 'yyyy-MM');

  if (ARCHIVE.LAYOUT === 'flat') return root;
  if (ARCHIVE.LAYOUT === 'type') return getOrCreateChildFolder_(root, kind.folder);

  if (ARCHIVE.LAYOUT === 'category') {
    const name = category || ARCHIVE.FALLBACK_CATEGORY;
    return getOrCreateChildFolder_(getOrCreateChildFolder_(root, name), month);
  }

  const year = Utilities.formatDate(date, APP.TZ, 'yyyy');
  return getOrCreateChildFolder_(getOrCreateChildFolder_(root, year), month);
}

/* ------------------------------------------------------------
 * [3.2] 分類
 * ------------------------------------------------------------ */

function categoryRules_() {
  const rules = DOC_CATEGORIES.map(function (r) {
    return { name: r.name, words: r.words.slice(), fallbackOnly: !!r.fallbackOnly };
  });

  const raw = PropertiesService.getScriptProperties().getProperty('ARCHIVE_CATEGORY_WORDS');
  if (!raw) return rules;

  try {
    const extra = JSON.parse(raw);
    Object.keys(extra).forEach(function (name) {
      const words = String(extra[name]).split(/[,，、\s]+/).filter(Boolean);
      if (!words.length) return;
      const hit = rules.filter(function (r) { return r.name === name; })[0];
      if (hit) hit.words = hit.words.concat(words);
      else rules.unshift({ name: name, words: words, fallbackOnly: false });  // 自訂分類優先
    });
  } catch (err) {
    console.warn('自訂分類讀取失敗，改用內建規則：' + getErrorMessage_(err));
  }
  return rules;
}

/**
 * 檔名命中權重 3、內文命中權重 1。
 * 檔名是人取的，訊號比 OCR 內文乾淨得多，所以權重明顯拉開。
 */
function classifyArchive_(fileName, ocrText, mimeType) {
  const name = normalizeWidth_(String(fileName || ''));
  const text = normalizeWidth_(String(ocrText || '')).slice(0, 4000);
  const rules = categoryRules_();

  let best = { name: '', score: 0, hits: [] };
  let fallback = { name: '', score: 0, hits: [] };

  rules.forEach(function (rule) {
    let score = 0;
    const hits = [];
    rule.words.forEach(function (w) {
      if (!w) return;
      if (name.indexOf(w) >= 0) { score += 3; hits.push(w); }
      else if (text && text.indexOf(w) >= 0) { score += 1; hits.push(w); }
    });
    if (!score) return;

    const cand = { name: rule.name, score: score, hits: hits.slice(0, 4) };
    if (rule.fallbackOnly) {
      if (score > fallback.score) fallback = cand;
    } else if (score > best.score) {
      best = cand;
    }
  });

  if (best.score > 0) return best;
  if (fallback.score > 0) return fallback;
  if (String(mimeType || '').indexOf('image/') === 0) {
    return { name: ARCHIVE.PHOTO_CATEGORY, score: 0, hits: [] };
  }
  return { name: ARCHIVE.FALLBACK_CATEGORY, score: 0, hits: [] };
}

function shouldAutoOcr_(mimeType, bytes) {
  return ARCHIVE.AUTO_OCR && ARCHIVE.OCR_ENABLED &&
    ocrCapable_(mimeType) && Number(bytes || 0) <= ARCHIVE.AUTO_OCR_MAX_BYTES;
}

function addCategoryWord_(category, word) {
  const name = String(category || '').trim();
  const w = String(word || '').trim();
  if (!name || !w) return '用法：/加類 研習通知 增能';

  const props = PropertiesService.getScriptProperties();
  let map = {};
  try { map = JSON.parse(props.getProperty('ARCHIVE_CATEGORY_WORDS') || '{}'); }
  catch (err) { map = {}; }

  const words = String(map[name] || '').split(/[,，、\s]+/).filter(Boolean);
  if (words.indexOf(w) >= 0) return '「' + w + '」已經在「' + name + '」裡了。';
  words.push(w);
  map[name] = words.join(',');
  props.setProperty('ARCHIVE_CATEGORY_WORDS', JSON.stringify(map));

  return '✅ 已把「' + w + '」加進分類「' + name + '」\n' +
    '（下一次歸檔就會生效；輸入 /分類 可看完整規則）';
}

function buildCategoryText_() {
  const rules = categoryRules_();
  const lines = ['🗂️ 歸檔分類規則', '分層方式：' + ARCHIVE.LAYOUT, ''];
  rules.forEach(function (r) {
    lines.push('・' + r.name + (r.fallbackOnly ? '（保底）' : ''));
    lines.push('　' + r.words.join('、'));
  });
  lines.push('', '沒中任何規則：圖片→' + ARCHIVE.PHOTO_CATEGORY + '，其餘→' + ARCHIVE.FALLBACK_CATEGORY);
  lines.push('新增分類詞：/加類 研習通知 增能');
  return lines.join('\n').slice(0, 4800);
}

/* ------------------------------------------------------------
 * [3.2] 從公文、通知的內文抽出活動日期
 *
 * 只提議、不自動建立。公文格式千奇百怪，誤判在所難免，
 * 但「跳一顆按鈕」的誤判成本是零，「自動建一堆假事件」的成本很高。
 * ------------------------------------------------------------ */

function extractDocEvent_(rawText, fileName, now) {
  if (!ARCHIVE.AUTO_EVENT) return null;

  const text = normalizeWidth_(String(rawText || ''));
  if (!text) return null;

  const lines = text.split(/[\n\r]+/);
  const floor = addDays_(startOfDay_(now), -1);
  const horizon = addDays_(startOfDay_(now), 540);   // 一年半內才合理
  const candidates = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.length > 150) continue;        // 整段長句誤判率高
    if (DOC_DATE_SKIP_RE.test(line)) continue;

    const probe = maskDecoys_(expandSynonyms_(line));
    const dateInfo = parseDateSafely_(probe, now);
    if (!dateInfo) continue;
    if (dateInfo.date < floor || dateInfo.date > horizon) continue;

    const rest = maskSpan_(probe, dateInfo.span);
    const timeInfo = parseTimeRangeSafely_(rest);
    const locInfo = parseLocation_(rest);

    const hasTime = !!(timeInfo && timeInfo.hasTime);
    let score = 0;
    if (DOC_EVENT_HINT_RE.test(line)) score += 3;
    if (hasTime) score += 3;                              // 寫了幾點的通常就是活動本身
    if (locInfo && locInfo.location) score += 1;
    if (DOC_DEADLINE_HINT_RE.test(line)) score -= 3;      // 報名截止日不是活動日

    candidates.push({
      date: dateInfo.date,
      time: hasTime ? timeInfo : null,
      location: locInfo && locInfo.location ? locInfo.location : '',
      line: line.slice(0, 80),
      score: score,
      order: i
    });
  }

  if (!candidates.length) return null;

  // 分數高 > 日期早 > 出現得早
  candidates.sort(function (a, b) {
    if (a.score !== b.score) return b.score - a.score;
    if (a.date.getTime() !== b.date.getTime()) return a.date - b.date;
    return a.order - b.order;
  });

  const best = candidates[0];
  if (!best.location) {
    const loc = extractDocLocation_(text);
    if (loc) best.location = loc;
  }

  const title = extractDocSubject_(text) || titleFromFileName_(fileName) || '（未命名事項）';
  return buildDocEventData_(best, title, candidates.length);
}

function extractDocSubject_(text) {
  const m = text.match(/主\s*旨\s*[:：]\s*([^\n]{2,100})/);
  if (m) return trimSubject_(m[1]);

  const first = text.split(/[\n\r]+/).map(function (x) { return x.trim(); })
    .filter(function (x) { return x.length >= 4 && !DOC_DATE_SKIP_RE.test(x); })[0];
  return first ? trimSubject_(first) : '';
}

function trimSubject_(raw) {
  return String(raw)
    // 公文尾巴的客套話對行事曆標題沒有意義
    .replace(/[，,。；;]?\s*(請\s*查\s*照.*|請鼓勵.*|請貴校.*|請轉知.*|請於.*|敬請.*|如說明.*|惠予.*)$/, '')
    // 開頭的公文動詞同理
    .replace(/^(檢送|檢陳|函轉|轉知|轉發|有關|茲|為)\s*/, '')
    .replace(/[，,]?\s*(實施計畫|計畫|辦法|資料)?\s*[1１一]\s*份\s*$/, '')
    .replace(/\s+/g, ' ')
    .replace(/[，,、。；;]+$/, '')
    .trim()
    .slice(0, 60);
}

function extractDocLocation_(text) {
  const m = text.match(/(?:地\s*點|地\s*址)\s*[:：]\s*([^\s，,。；;\n]{2,40})/);
  if (m) return m[1].trim();
  const m2 = text.match(/([^\s，,。；;\n]{2,20}(?:會議室|活動中心|禮堂|視聽教室|國小|國中|高中|大學|研習中心))/);
  return m2 ? m2[1].trim() : '';
}

function titleFromFileName_(name) {
  return String(name || '')
    .replace(/^\d{8}-\d{6}_/, '')
    .replace(/\.[A-Za-z0-9]{1,6}$/, '')
    .trim();
}

/**
 * 直接組出 createCalendarEvent_ 要的資料，不再回頭走一次文字解析——
 * 把日期時間拼回字串再 parse，主旨裡的數字（115學年度、第3條）
 * 有機會反過來被當成日期，那種錯很難查。
 */
function buildDocEventData_(best, title, candidateCount) {
  const y = best.date.getFullYear();
  const mo = best.date.getMonth();
  const d = best.date.getDate();

  if (!best.time) {
    return {
      kind: '行事曆',
      title: title,
      calendarTitle: title,
      location: best.location || '',
      allDay: true,
      start: startOfDay_(best.date),
      end: addDays_(startOfDay_(best.date), 1),
      reminderMinutes: getAllDayReminder_(),
      sourceLine: best.line,
      candidateCount: candidateCount
    };
  }

  const start = new Date(y, mo, d, best.time.startHour, best.time.startMinute, 0, 0);
  let end;
  if (best.time.endHour !== null && best.time.endHour !== undefined) {
    end = new Date(y, mo, d, best.time.endHour, best.time.endMinute, 0, 0);
  }
  if (!end || end <= start) {
    end = new Date(start.getTime() + APP.DEFAULT_EVENT_MINUTES * 60000);
  }

  return {
    kind: '行事曆',
    title: title,
    calendarTitle: title,
    location: best.location || '',
    allDay: false,
    start: start,
    end: end,
    reminderMinutes: getDefaultReminder_('行事曆'),
    sourceLine: best.line,
    candidateCount: candidateCount
  };
}

function buildDocEventPreview_(data) {
  const lines = ['📅 內文偵測到日期，要建立行事曆嗎？', ''];
  lines.push(data.title);
  lines.push(data.allDay
    ? formatChineseDate_(data.start) + '（全天）'
    : formatChineseDate_(data.start) + ' ' +
      Utilities.formatDate(data.start, APP.TZ, 'HH:mm') + '–' +
      Utilities.formatDate(data.end, APP.TZ, 'HH:mm'));
  if (data.location) lines.push('地點：' + data.location);
  lines.push('提醒：' + formatReminderText_(data.reminderMinutes, data.allDay));
  lines.push('依據：' + data.sourceLine);
  if (data.candidateCount > 1) {
    lines.push('（文中還有其他日期，若抓錯請直接用文字輸入正確時間）');
  }
  return lines.join('\n');
}

/**
 * 按下「建立行事曆」後真正動手。
 * 事件與檔案分開記——撤銷這筆行事曆不應該連帶刪掉已經歸檔的檔案，
 * 所以這裡不帶 driveFileId。
 */
function createEventFromDoc_(replyToken, payload) {
  const data = {
    kind: '行事曆',
    title: payload.title,
    calendarTitle: payload.title,
    location: payload.location || '',
    allDay: !!payload.allDay,
    start: new Date(payload.start),
    end: new Date(payload.end),
    reminderMinutes: Number(payload.reminderMinutes) || 0
  };

  let result;
  try {
    result = createCalendarEvent_(data);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    safeReply_(replyToken, '⚠️ 建立行事曆失敗：' + getErrorMessage_(err));
    return;
  }

  const receivedAt = new Date();
  let note = '';
  try {
    appendToJournalDoc_({
      receivedAt: receivedAt,
      type: '行事曆',
      text: data.title + '（來源：' + (payload.name || '歸檔檔案') + '）',
      isTask: false,
      calendarResult: result,
      extraLines: payload.url ? [{ prefix: '來源檔案：', url: payload.url }] : [],
      attachUrl: payload.url || ''
    });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    note = '\n⚠️ 行事曆已建立，但寫入 Docs 失敗：' + getErrorMessage_(err);
  }

  replyWithActions_(replyToken, buildCreatedReply_(result) + note,
    [{ label: '↩️ 撤銷', data: 'a=undo', display: '撤銷' }]);
}

function archiveFolderUrlSafe_() {
  try { return archiveRootFolder_().getUrl(); }
  catch (err) { return '（取得失敗：' + getErrorMessage_(err) + '）'; }
}

/**
 * 檔名 = 時間戳 + 原始名（或型態） + 副檔名。
 * 時間戳放前面，資料夾照名稱排序就等於照時間排序。
 */
function buildArchiveName_(msg, kind, date, blob) {
  const stamp = Utilities.formatDate(date, APP.TZ, 'yyyyMMdd-HHmmss');
  let base = '';
  let ext = '';

  if (msg.type === 'file' && msg.fileName && ARCHIVE.KEEP_ORIGINAL_NAME) {
    const raw = String(msg.fileName);
    const dot = raw.lastIndexOf('.');
    if (dot > 0 && dot < raw.length - 1) {
      base = raw.slice(0, dot);
      ext = raw.slice(dot + 1);
    } else {
      base = raw;
    }
  }

  if (!ext) ext = extFromMime_(blob.getContentType()) || kind.ext || 'bin';
  if (!base) base = kind.label;

  return stamp + '_' + sanitizeFileName_(base) + '.' + String(ext).toLowerCase();
}

function extFromMime_(contentType) {
  const map = {
    'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
    'image/webp': 'webp', 'image/heic': 'heic', 'image/bmp': 'bmp',
    'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/3gpp': '3gp',
    'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/aac': 'aac',
    'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/ogg': 'ogg',
    'application/pdf': 'pdf', 'application/zip': 'zip',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt', 'text/csv': 'csv', 'application/json': 'json'
  };
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  return map[type] || '';
}

function sanitizeFileName_(name) {
  const cleaned = String(name)
    .replace(/[\\/:*?"<>|\r\n\t]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return cleaned || '未命名';
}

function formatBytes_(n) {
  const v = Number(n) || 0;
  if (v < 1024) return v + ' B';
  if (v < 1024 * 1024) return (v / 1024).toFixed(1) + ' KB';
  return (v / 1024 / 1024).toFixed(2) + ' MB';
}

/* ------------------------------------------------------------
 * 最近一次歸檔 / 待命動作
 * ------------------------------------------------------------ */

function rememberLastArchive_(info) {
  try {
    PropertiesService.getScriptProperties().setProperty(LAST_ARCHIVE_KEY, JSON.stringify(info));
  } catch (err) {
    console.warn('最近歸檔紀錄寫入失敗：' + getErrorMessage_(err));
  }
}

function readLastArchive_() {
  try {
    return JSON.parse(PropertiesService.getScriptProperties().getProperty(LAST_ARCHIVE_KEY) || 'null');
  } catch (err) {
    return null;
  }
}

/**
 * 按下「改檔名」後，下一則文字就是新檔名。
 * 只有在待命狀態下才攔截，而且斜線指令一律放行——
 * 使用者中途想查 /今日 不該被吃掉，待命狀態會保留到逾時或 /取消。
 */
function consumePendingAction_(replyToken, text) {
  const cache = CacheService.getScriptCache();
  const raw = cache.get(PENDING_ACTION_KEY);
  if (!raw) return false;

  if (/^(\/取消|取消)$/.test(text)) {
    cache.remove(PENDING_ACTION_KEY);
    safeReply_(replyToken, '已取消，檔案維持原本名稱。');
    return true;
  }
  if (/^\//.test(text)) return false;

  let pending;
  try { pending = JSON.parse(raw); }
  catch (err) { cache.remove(PENDING_ACTION_KEY); return false; }

  cache.remove(PENDING_ACTION_KEY);

  if (pending.type === 'rename') {
    safeReply_(replyToken, renameArchivedFile_(pending.fileId, text));
    return true;
  }
  return false;
}

function renameArchivedFile_(fileId, rawName) {
  if (!fileId) return '找不到要更名的檔案。';

  let file;
  try { file = DriveApp.getFileById(fileId); }
  catch (err) { return '⚠️ 檔案打不開（可能已被刪除）：' + getErrorMessage_(err); }

  const oldName = file.getName();
  const dot = oldName.lastIndexOf('.');
  const oldExt = dot > 0 ? oldName.slice(dot + 1) : '';

  let name = sanitizeFileName_(rawName);
  if (oldExt && !new RegExp('\\.' + escapeRegExp_(oldExt) + '$', 'i').test(name)) {
    name = name + '.' + oldExt;
  }

  try { file.setName(name); }
  catch (err) { return '⚠️ 更名失敗：' + getErrorMessage_(err); }

  // 4.0：Drive、Docs、索引必須一起成功。若同步失敗就把 Drive 名稱改回去，
  // 否則畫面會顯示舊檔名、Drive 卻已是新檔名，之後永久刪除也可能對不到段落。
  let synced = false;
  let syncError = '';
  try { synced = indexRenameByAttach_(file.getUrl(), oldName, name); }
  catch (err) { syncError = getErrorMessage_(err); }
  if (!synced) {
    let rollback = true;
    try { file.setName(oldName); }
    catch (err) {
      rollback = false;
      syncError += (syncError ? '｜' : '') + 'Drive 回復原檔名失敗：' + getErrorMessage_(err);
    }
    return '⚠️ 更名未完成：Docs／索引同步失敗' + (syncError ? '（' + syncError + '）' : '') +
      (rollback ? '，Drive 已回復原檔名。' : '，且 Drive 無法自動回復，請到檔案中心檢查。');
  }

  const last = readLastArchive_();
  if (last && last.fileId === fileId) {
    last.name = name;
    rememberLastArchive_(last);
  }

  return '✏️ 已更名\n' + oldName + '\n　↓\n' + name;
}

/**
 * 索引裡的內容欄長這樣：🖼️ [研習通知] 20260815-143012_通知.pdf（1.2 MB）
 * 只把舊檔名換成新檔名，圖示、分類、大小一律原樣保留——
 * 用「重組字串」的做法每加一個欄位就會弄丟一次資訊。
 */
function indexRenameByAttach_(url, oldName, newName) {
  if (!url || !oldName || !indexAvailable_()) return false;
  const sheet = getIndexSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return false;

  const values = sheet.getRange(2, SHEET.COL.ATTACH, last - 1, 1).getValues();
  for (let i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]) !== url) continue;

    const row = i + 2;
    const docId = String(sheet.getRange(row, SHEET.COL.DOC_ID).getValue() || '');
    const oldLine = String(sheet.getRange(row, SHEET.COL.PARA).getValue() || '');
    const oldContent = String(sheet.getRange(row, SHEET.COL.CONTENT).getValue() || '');
    const newLine = oldLine.indexOf(oldName) >= 0 ? oldLine.split(oldName).join(newName) : oldLine;
    const newContent = oldContent.indexOf(oldName) >= 0 ? oldContent.split(oldName).join(newName) : oldContent;

    // 先改 Docs，再改索引。若只改索引，之後刪除／編輯會因段落文字對不上而失敗。
    if (docId && oldLine && newLine !== oldLine) {
      try {
        const doc = DocumentApp.openById(docId);
        const ps = doc.getBody().getParagraphs();
        let found = false;
        for (let j = 0; j < ps.length; j++) {
          if (ps[j].getText().trim() === oldLine.trim()) {
            ps[j].setText(newLine);
            found = true;
            break;
          }
        }
        doc.saveAndClose();
        if (!found) throw new Error('Docs 找不到原始檔名段落');
      } catch (err) {
        console.warn('Docs 更名同步失敗：' + getErrorMessage_(err));
        return false;
      }
    }

    sheet.getRange(row, SHEET.COL.CONTENT).setValue(newContent);
    sheet.getRange(row, SHEET.COL.PARA).setValue(newLine);
    return true;
  }
  return false;
}

function archiveDeleteFile_(fileId) {
  if (!fileId) return '找不到要刪除的檔案。';

  let name = '';
  try {
    const file = DriveApp.getFileById(fileId);
    name = file.getName();
    file.setTrashed(true);
  } catch (err) {
    return '⚠️ 刪除失敗：' + getErrorMessage_(err);
  }

  // 如果剛好是最後一筆紀錄，連 Docs 與索引一起收回，不留孤兒紀錄
  const stack = readUndoStack_();
  if (stack.length && stack[0].driveFileId === fileId) {
    const undo = undoLastEntry_();
    return '🗑️ 已把 ' + name + ' 移到垃圾桶。\n' + undo.message;
  }
  return '🗑️ 已把 ' + name + ' 移到垃圾桶（Docs 紀錄保留，可用 /撤銷 或手動刪除）。';
}

/* ------------------------------------------------------------
 * 查詢
 * ------------------------------------------------------------ */

function buildArchiveText_(keyword) {
  const lines = ['📁 檔案歸檔', '資料夾：' + archiveFolderUrlSafe_(), ''];

  let recs = [];
  try {
    recs = indexReadAll_().filter(function (r) { return r.type === ARCHIVE_TYPE; });
  } catch (err) {
    lines.push('⚠️ 索引讀取失敗：' + getErrorMessage_(err));
    return lines.join('\n');
  }

  if (keyword) {
    recs = recs.filter(function (r) { return r.content.indexOf(keyword) >= 0; });
  }

  recs.sort(function (a, b) {
    return (b.created ? b.created.getTime() : 0) - (a.created ? a.created.getTime() : 0);
  });

  if (!recs.length) {
    lines.push(keyword ? '找不到檔名含「' + keyword + '」的歸檔。' : '目前還沒有歸檔紀錄。');
    return lines.join('\n');
  }

  const show = recs.slice(0, 8);
  lines.push(keyword
    ? '🔍「' + keyword + '」找到 ' + recs.length + ' 筆' + (recs.length > show.length ? '（顯示最近 8 筆）' : '')
    : '最近歸檔（共 ' + recs.length + ' 筆）');
  lines.push('');

  show.forEach(function (r) {
    const when = r.created ? Utilities.formatDate(r.created, APP.TZ, 'M/d HH:mm') : r.dateText;
    lines.push('・' + when + '　' + r.content.slice(0, 60));
    if (r.attach) lines.push('　' + r.attach);
  });

  return lines.join('\n').slice(0, 4800);
}

/* ------------------------------------------------------------
 * OCR（用 Drive 轉檔做文字辨識，不需要另外的 API 金鑰）
 * ------------------------------------------------------------ */

function ocrCapable_(contentType) {
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  return type === 'application/pdf' || type.indexOf('image/') === 0;
}

function replyOcrLast_(replyToken) {
  const last = readLastArchive_();
  if (!last || !last.fileId) {
    safeReply_(replyToken, '目前沒有可辨識的檔案，請先傳一張圖片或 PDF。');
    return;
  }
  safeReply_(replyToken, runOcr_(last.fileId, last.name));
}

function runOcr_(fileId, name) {
  if (!ARCHIVE.OCR_ENABLED) return '文字辨識已在 ARCHIVE.OCR_ENABLED 關閉。';
  if (!fileId) return '找不到要辨識的檔案。';

  let text;
  try {
    text = ocrDriveFile_(fileId);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return '⚠️ 文字辨識失敗：' + getErrorMessage_(err);
  }

  if (!text) return '🔍 沒有辨識到文字。';

  const shown = text.slice(0, ARCHIVE.OCR_MAX_CHARS);
  const head = '🔍 文字辨識' + (name ? '（' + name + '）' : '');
  return head + '\n\n' + shown + (text.length > shown.length ? '\n\n…（過長已截斷）' : '');
}

/**
 * Drive 的「複製成 Google 文件」在轉檔時會順便做 OCR。
 * 用 REST 呼叫是因為進階 Drive 服務要另外手動開啟，
 * 這裡用 ScriptApp.getOAuthToken() 沿用既有的 drive 權限即可。
 */
function ocrDriveFile_(fileId) {
  const url = 'https://www.googleapis.com/drive/v3/files/' + encodeURIComponent(fileId) +
    '/copy?ocrLanguage=' + encodeURIComponent(ARCHIVE.OCR_LANGUAGE) +
    '&supportsAllDrives=true&fields=id';

  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify({
      name: 'OCR-TEMP-' + Utilities.formatDate(new Date(), APP.TZ, 'yyyyMMddHHmmss'),
      mimeType: 'application/vnd.google-apps.document'
    }),
    muteHttpExceptions: true
  });

  const code = res.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('Drive 轉檔失敗（HTTP ' + code + '）：' + res.getContentText().slice(0, 200));
  }

  const docId = JSON.parse(res.getContentText()).id;
  try {
    const text = DocumentApp.openById(docId).getBody().getText();
    return String(text || '').replace(/\n{3,}/g, '\n\n').trim();
  } finally {
    try { DriveApp.getFileById(docId).setTrashed(true); }
    catch (err) { console.warn('OCR 暫存文件清除失敗：' + getErrorMessage_(err)); }
  }
}

/* ------------------------------------------------------------
 * 安裝與健檢（在編輯器直接執行）
 * ------------------------------------------------------------ */

/**
 * [3.2.1 新] 直接指定歸檔資料夾。
 * 貼雲端硬碟的資料夾網址或 ID 都可以。
 * 會先實際寫一個測試檔進去，確認真的有寫入權限才寫進屬性——
 * 只把 ID 記下來、等到使用者傳檔案才發現沒權限，是最糟的失敗時機。
 */
function setArchiveFolderByUrl(input) {
  const id = extractDriveFolderId_(input);
  if (!id) {
    const msg = '❌ 看不出資料夾 ID。請貼完整網址，例如：\n' +
      'https://drive.google.com/drive/folders/xxxxxxxxxxxxxxxxx';
    console.log(msg);
    return msg;
  }

  let folder;
  try {
    folder = DriveApp.getFolderById(id);
  } catch (err) {
    const msg = '❌ 打不開這個資料夾（' + id + '）：' + getErrorMessage_(err) + '\n' +
      '　 請確認這是「資料夾」而不是檔案，且該資料夾屬於執行這支程式的 Google 帳號，\n' +
      '　 或至少已把該帳號設為編輯者。';
    console.log(msg);
    return msg;
  }

  try {
    const probe = folder.createFile('（權限測試）.txt', '這是權限測試檔，可以直接刪除。', MimeType.PLAIN_TEXT);
    probe.setTrashed(true);
  } catch (err) {
    const msg = '❌ 這個資料夾無法寫入：' + getErrorMessage_(err) + '\n' +
      '　 請把執行這支程式的 Google 帳號設為該資料夾的「編輯者」。';
    console.log(msg);
    return msg;
  }

  PropertiesService.getScriptProperties().setProperty('ARCHIVE_FOLDER_ID', folder.getId());
  const msg = [
    '✅ 歸檔資料夾已指定',
    '名稱：' + folder.getName(),
    'ID：' + folder.getId(),
    '網址：' + folder.getUrl(),
    '',
    '之後的檔案會存成：' + folder.getName() + ' / 分類 / 年月 /'
  ].join('\n');
  console.log(msg);
  return msg;
}

function extractDriveFolderId_(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';
  const m = raw.match(/\/folders\/([A-Za-z0-9_-]{10,})/) ||
            raw.match(/[?&]id=([A-Za-z0-9_-]{10,})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{10,}$/.test(raw) ? raw : '';
}

/**
 * [3.2.3 新] 查 LINE 那一端目前設定的 Webhook 網址。
 *
 * 一個 Apps Script 專案可以有多個部署，每個部署的 /exec 網址都不同。
 * 更新了 A 部署、LINE 卻指著 B 部署，症狀就是「編輯器全對、LINE 全錯」，
 * 而且從編輯器這邊完全看不出來——只能去問 LINE。
 */
function lineWebhookStatus() {
  const lines = ['=== LINE Webhook 現況 ==='];
  const mine = webhookUrl_();

  let theirs = '';
  try {
    const info = lineApi_('get', LINE_API + '/channel/webhook/endpoint');
    theirs = info.endpoint || '';
    lines.push('LINE 手上的網址：' + (theirs || '（未設定）'));
    lines.push('Webhook 啟用狀態：' + (info.active ? '✅ 啟用' : '❌ 停用（請到 LINE Developers 開啟）'));
    if (isDevUrl_(theirs)) {
      lines.push('');
      lines.push('❌ LINE 手上那串是 /dev 測試網址 —— 這就是問題所在。');
      lines.push(devUrlWarning_());
      lines.push('');
    }
  } catch (err) {
    lines.push('❌ 讀取失敗：' + getErrorMessage_(err));
    const out0 = lines.join('\n');
    console.log(out0);
    return out0;
  }

  lines.push('本專案的網址：' + mine);
  lines.push('');

  if (!theirs) {
    lines.push('❌ LINE 還沒設定 Webhook 網址。執行 syncLineWebhook() 直接幫你填。');
  } else if (theirs === mine) {
    lines.push('✅ 兩邊一致。');
    lines.push('　 若行為仍像舊版，執行 checkDeployment() 確認這個網址上跑的是哪一版。');
  } else {
    lines.push('❌ 兩邊不一致 —— LINE 打的是另一個部署。');
    lines.push('　 這就是「編輯器都正常、LINE 卻回舊版訊息」的典型原因。');
    lines.push('　 執行 syncLineWebhook() 一鍵改成本專案的網址。');
  }

  const out = lines.join('\n');
  console.log(out);
  return out;
}

/**
 * [3.2.3 新] 把 LINE 的 Webhook 網址改成本專案目前的網址，並立刻測試。
 * 省掉在 LINE Developers 後台手動複製貼上（也就省掉貼錯的機會）。
 */
function syncLineWebhook(execUrl) {
  const url = withWebhookKey_(execUrl || webhookUrl_());
  const lines = ['=== 同步 LINE Webhook 網址 ==='];

  if (url.indexOf('http') !== 0) {
    lines.push('❌ 本專案尚未部署為網頁應用程式，沒有網址可以填。');
    const out0 = lines.join('\n');
    console.log(out0);
    return out0;
  }

  // [3.2.4] 寧可拒絕，也不要把一個 LINE 打不進來的網址寫進去。
  //         這種設定錯了不會報錯，只會安靜地什麼都不發生，最難查。
  if (isDevUrl_(url)) {
    lines.push('❌ 拒絕寫入：' + url);
    lines.push(devUrlWarning_());
    const outDev = lines.join('\n');
    console.log(outDev);
    return outDev;
  }

  try {
    const before = lineApi_('get', LINE_API + '/channel/webhook/endpoint');
    lines.push('原本：' + (before.endpoint || '（未設定）'));
  } catch (err) {
    lines.push('（讀不到原本的設定：' + getErrorMessage_(err) + '）');
  }

  lines.push('改成：' + url);

  try {
    lineApi_('put', LINE_API + '/channel/webhook/endpoint', { json: { endpoint: url } });
    lines.push('✅ 已更新');
  } catch (err) {
    lines.push('❌ 更新失敗：' + getErrorMessage_(err));
    lines.push('　 權杖需要有 Messaging API 的頻道設定權限，或改到後台手動貼上。');
    const out1 = lines.join('\n');
    console.log(out1);
    return out1;
  }

  try {
    const test = lineApi_('post', LINE_API + '/channel/webhook/test', { json: { endpoint: url } });
    lines.push('連線測試：' + (test.success ? '✅ 成功' : '❌ 失敗') +
      '（HTTP ' + (test.statusCode || '?') + '）' +
      (test.reason ? '｜' + test.reason : '') +
      (test.detail ? '｜' + test.detail : ''));
  } catch (err) {
    lines.push('⚠️ 連線測試失敗：' + getErrorMessage_(err));
  }

  lines.push('', '接著執行 checkDeployment() 確認這個網址上跑的是最新版。');

  const out = lines.join('\n');
  console.log(out);
  return out;
}

/**
 * [3.2.3 新] 把 LINE 後台那串網址貼進來，直接看它跑的是哪一版。
 * 例：checkWebhookUrl('https://script.google.com/macros/s/AKfy.../exec')
 */
function checkWebhookUrl(url) {
  const target = String(url || '').trim();
  const lines = ['=== 指定網址版本檢查 ==='];

  if (target.indexOf('http') !== 0) {
    lines.push('❌ 請貼完整網址（https:// 開頭）。');
    const out0 = lines.join('\n');
    console.log(out0);
    return out0;
  }

  lines.push('檢查網址：' + target);
  lines.push('編輯器版本：' + APP.VERSION);

  try {
    const res = UrlFetchApp.fetch(target, { muteHttpExceptions: true, followRedirects: true });
    const body = String(res.getContentText() || '');
    const m = body.match(/工作筆記\s+([0-9.]+)\s+運作中/);
    lines.push('HTTP 狀態：' + res.getResponseCode());
    lines.push('該網址版本：' + (m ? m[1] : '（讀不到）'));
    lines.push('');
    if (m && m[1] === APP.VERSION) {
      lines.push('✅ 這個網址跑的是最新程式碼。');
    } else {
      lines.push('❌ 這個網址跑的是舊程式碼（或不是這個專案）。');
      lines.push('　 執行 syncLineWebhook() 讓 LINE 改指到本專案目前的網址，');
      lines.push('　 或到「管理部署作業」把這個部署的版本改成「新版本」。');
    }
    lines.push('', '回應開頭：' + body.slice(0, 120));
  } catch (err) {
    lines.push('❌ 連不上：' + getErrorMessage_(err));
  }

  const out = lines.join('\n');
  console.log(out);
  return out;
}

/**
 * [3.2.2 新] 比對「編輯器版本」與「已部署版本」。
 *
 * 編輯器執行的永遠是最新程式碼，LINE 打到的卻是部署時凍結的那一版。
 * 診斷全過、資料夾也建好了、但傳檔案毫無反應——幾乎都是這個差異造成的。
 */
function checkDeployment() {
  const lines = ['=== 部署版本比對 ==='];
  lines.push('編輯器版本：' + APP.VERSION);

  const url = webhookUrl_();
  lines.push('Webhook 網址：' + url);

  if (url.indexOf('http') !== 0) {
    lines.push('', '❌ 尚未部署為網頁應用程式。');
    lines.push('　 部署 →「新增部署作業」→ 類型選「網頁應用程式」→ 存取權限「任何人」。');
    const out0 = lines.join('\n');
    console.log(out0);
    return out0;
  }

  let body = '';
  try {
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    lines.push('HTTP 狀態：' + res.getResponseCode());
    body = String(res.getContentText() || '');
  } catch (err) {
    lines.push('', '❌ 連不上自己的網頁應用程式：' + getErrorMessage_(err));
    const out1 = lines.join('\n');
    console.log(out1);
    return out1;
  }

  const m = body.match(/工作筆記\s+([0-9.]+)\s+運作中/);
  const deployed = m ? m[1] : '';
  lines.push('已部署版本：' + (deployed || '（讀不到，可能是舊版或存取權限不是「任何人」）'));
  lines.push('');

  if (deployed === APP.VERSION) {
    lines.push('✅ 兩邊一致，LINE 打到的就是這份程式碼。');
    lines.push('　 若傳檔案仍沒反應，請看「執行項目」有沒有 [webhook] 開頭的記錄。');
  } else {
    lines.push('❌ 版本不一致 —— 這就是傳檔案沒反應的原因。');
    lines.push('　 LINE 目前執行的是舊版程式碼，舊版遇到圖片或檔案只會回');
    lines.push('　「目前只接受文字訊息」，根本不會進到歸檔流程。');
    lines.push('');
    lines.push('　 解法：部署 →「管理部署作業」→ 右上角鉛筆（編輯）');
    lines.push('　　　　→ 版本選「新版本」→ 部署。');
    lines.push('　 注意：一定要選「新版本」，只按部署不換版本是不會更新的。');
  }

  const out = lines.join('\n');
  console.log(out);
  return out;
}

/**
 * [3.2.2 新] 不經過 LINE，直接跑一次完整歸檔流程。
 *
 * 這支成功而 LINE 傳檔失敗，就能斷定問題在 LINE 到 doPost 之間，
 * 不必再懷疑資料夾、權限或分類邏輯。
 * 測試檔會留在雲端硬碟裡，看得到才算數。
 */
function selfTestArchive() {
  const lines = ['=== 歸檔流程自我測試 ==='];
  const now = new Date();

  const sample = [
    '新北市政府教育局 函',
    '發文日期：中華民國115年8月10日',
    '主旨：檢送本市115學年度「課程領導人培訓」研習實施計畫1份，請查照。',
    '一、研習時間：115年9月19日（星期六）上午9時至下午4時。',
    '二、地點：新北市政府507會議室。'
  ].join('\n');

  try {
    const kind = MEDIA_KIND.file;
    const fileName = Utilities.formatDate(now, APP.TZ, 'yyyyMMdd-HHmmss') + '_自我測試研習通知.txt';

    const category = classifyArchive_(fileName, sample, 'text/plain');
    lines.push('分類：' + category.name + (category.hits.length ? '（命中 ' + category.hits.join('、') + '）' : ''));

    const folder = archiveTargetFolder_(now, kind, category.name);
    lines.push('資料夾：' + folder.getName() + '（' + folder.getId() + '）');

    const file = folder.createFile(fileName, sample, MimeType.PLAIN_TEXT);
    lines.push('✅ 已建立檔案：' + file.getUrl());

    const summary = kind.icon + ' [' + category.name + '] ' + fileName + '（' + formatBytes_(sample.length) + '）';
    try {
      appendToJournalDoc_({
        receivedAt: now,
        type: ARCHIVE_TYPE,
        text: summary,
        isTask: false,
        extraLines: [{ prefix: '檔案連結：', url: file.getUrl() }],
        attachUrl: file.getUrl(),
        driveFileId: file.getId()
      });
      lines.push('✅ 已寫入 Docs 與索引（可用 /撤銷 收回這筆測試）');
    } catch (err) {
      lines.push('⚠️ Docs／索引寫入失敗：' + getErrorMessage_(err));
    }

    const ev = extractDocEvent_(sample, fileName, now);
    lines.push(ev
      ? '✅ 日期偵測：' + formatChineseDate_(ev.start) + '　' + ev.title
      : '⚠️ 日期偵測：沒有抓到日期');

    rememberLastArchive_({ fileId: file.getId(), name: fileName, url: file.getUrl(), type: 'file', category: category.name });

    lines.push('', '結論：歸檔流程本身正常。');
    lines.push('若 LINE 傳檔仍沒反應，請執行 checkDeployment() 比對部署版本。');
  } catch (err) {
    lines.push('❌ 流程中斷：' + getErrorMessage_(err));
    lines.push(err && err.stack ? String(err.stack).slice(0, 500) : '');
  }

  const out = lines.join('\n');
  console.log(out);
  return out;
}

/**
 * [3.2.1 新] 整條鏈路的逐段診斷。
 * 「檔案沒進雲端硬碟」可能斷在部署、權杖、綁定、資料夾、權限、配額，
 * 這支把每一段分開測，讓你一眼看到斷點，而不是猜。
 */
function diagnoseArchive() {
  const props = PropertiesService.getScriptProperties();
  const out = ['=== 檔案歸檔診斷 ' + APP.VERSION + ' ==='];
  let blocking = 0;

  function ok(label, detail) { out.push('✅ ' + label + (detail ? '：' + detail : '')); }
  function bad(label, detail, hint) {
    blocking++;
    out.push('❌ ' + label + (detail ? '：' + detail : ''));
    if (hint) out.push('　　→ ' + hint);
  }
  function warn(label, detail) { out.push('⚠️ ' + label + (detail ? '：' + detail : '')); }

  // 1. 部署
  out.push('', '【1】部署');
  let url = '';
  try { url = ScriptApp.getService().getUrl() || ''; } catch (err) { url = ''; }
  if (url) {
    ok('網頁應用程式已部署', url);
    // [3.2.2] 不要只叫使用者自己去比對，直接打一次自己的網址驗證
    try {
      const res = UrlFetchApp.fetch(webhookUrl_(), { muteHttpExceptions: true, followRedirects: true });
      const m = String(res.getContentText() || '').match(/工作筆記\s+([0-9.]+)\s+運作中/);
      const deployed = m ? m[1] : '';
      if (deployed === APP.VERSION) {
        ok('已部署版本與編輯器一致', deployed);
      } else {
        bad('已部署版本 ' + (deployed || '讀不到') + '，編輯器版本 ' + APP.VERSION,
          '兩者不同 = LINE 執行的是舊程式碼',
          '部署 →「管理部署作業」→ 編輯 → 版本選「新版本」→ 部署（一定要換版本）。');
      }
    } catch (err) {
      warn('無法連線自己的網頁應用程式', getErrorMessage_(err));
    }
  } else {
    bad('尚未部署為網頁應用程式', '', '部署 →「新增部署作業」→ 類型選「網頁應用程式」。');
  }

  // 2. LINE 權杖
  out.push('', '【2】LINE 連線');
  if (!props.getProperty('LINE_CHANNEL_ACCESS_TOKEN')) {
    bad('缺少 LINE_CHANNEL_ACCESS_TOKEN', '', '到「專案設定 → 指令碼屬性」補上。');
  } else {
    try {
      const info = lineApi_('get', LINE_API + '/info');
      ok('權杖有效', info.displayName || info.basicId || '（已連線）');
    } catch (err) {
      bad('權杖驗證失敗', getErrorMessage_(err), '權杖過期或複製時被截斷，請到 LINE Developers 重新產生。');
    }
  }
  out.push(props.getProperty('OWNER_USER_ID') ? '✅ 已綁定使用者' : '❌ 尚未綁定（在 LINE 輸入「綁定 你的PIN」）');

  // 3. 歸檔資料夾
  out.push('', '【3】歸檔資料夾');
  const folderId = props.getProperty('ARCHIVE_FOLDER_ID');
  out.push('ARCHIVE_FOLDER_ID：' + (folderId || '（尚未設定，首次歸檔會自動建立）'));

  let root = null;
  try {
    root = archiveRootFolder_();
    ok('資料夾可取得', root.getName() + '　' + root.getUrl());
  } catch (err) {
    bad('資料夾取得失敗', getErrorMessage_(err),
      '執行 setArchiveFolderByUrl(\'你的資料夾網址\') 直接指定一個可寫入的資料夾。');
  }

  // 4. 實際寫入
  out.push('', '【4】實際寫入測試');
  if (root) {
    try {
      const kind = MEDIA_KIND.file;
      const target = archiveTargetFolder_(new Date(), kind, '其他');
      const probe = target.createFile('歸檔測試.txt', '診斷用測試檔，可直接刪除。', MimeType.PLAIN_TEXT);
      const readBack = DriveApp.getFileById(probe.getId()).getName();
      ok('可以建立檔案', target.getName() + ' / ' + readBack);
      ok('測試檔網址', probe.getUrl());
      probe.setTrashed(true);
      ok('測試檔已移到垃圾桶');
    } catch (err) {
      bad('寫入失敗', getErrorMessage_(err),
        '多半是資料夾權限或雲端硬碟空間；換一個自己擁有的資料夾再測一次。');
    }
  } else {
    warn('略過寫入測試', '資料夾都取不到了');
  }

  // 5. 設定
  out.push('', '【5】設定');
  out.push('ARCHIVE.ENABLED：' + ARCHIVE.ENABLED + (ARCHIVE.ENABLED ? '' : '　← 關著就不會存檔'));
  out.push('分層方式：' + ARCHIVE.LAYOUT);
  out.push('單檔上限：' + formatBytes_(ARCHIVE.MAX_BYTES));
  out.push('自動辨識：' + (ARCHIVE.AUTO_OCR ? '開' : '關') + '（' + formatBytes_(ARCHIVE.AUTO_OCR_MAX_BYTES) + ' 以內）');

  // 6. OCR
  out.push('', '【6】文字辨識（Drive 轉檔）');
  if (!ARCHIVE.OCR_ENABLED) {
    warn('OCR 已關閉');
  } else if (root) {
    try {
      const img = Utilities.newBlob(Utilities.base64Decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
      ), 'image/png', 'ocr-probe.png');
      const tmp = root.createFile(img);
      try {
        ocrDriveFile_(tmp.getId());
        ok('OCR 轉檔可正常呼叫');
      } finally {
        tmp.setTrashed(true);
      }
    } catch (err) {
      warn('OCR 無法使用（不影響存檔，只影響自動分類與抽日期）', getErrorMessage_(err));
    }
  }

  out.push('', blocking
    ? '結論：有 ' + blocking + ' 項阻斷問題，請先處理上面標 ❌ 的部分。'
    : '結論：本機各段都正常。接著執行 selfTestArchive() 跑一次完整流程，'
      + '再到「執行項目」看傳檔時有沒有 [webhook] 與 [archive] 開頭的記錄。');

  const text = out.join('\n');
  console.log(text);
  return text;
}

function setupArchiveFolder() {
  const folder = archiveRootFolder_();
  const info = [
    '=== 檔案歸檔設定 ===',
    '資料夾名稱：' + folder.getName(),
    '資料夾網址：' + folder.getUrl(),
    'ARCHIVE_FOLDER_ID：' + folder.getId(),
    '分層方式：' + ARCHIVE.LAYOUT,
    '單檔上限：' + formatBytes_(ARCHIVE.MAX_BYTES),
    '',
    '想改存到別的資料夾，直接把 ARCHIVE_FOLDER_ID 改成該資料夾 ID 即可。'
  ].join('\n');
  console.log(info);
  return info;
}

function archiveStatus() {
  const props = PropertiesService.getScriptProperties();
  const last = readLastArchive_();
  const lines = [
    '=== 檔案歸檔狀態 ===',
    '開關：' + (ARCHIVE.ENABLED ? '啟用' : '關閉'),
    'ARCHIVE_FOLDER_ID：' + (props.getProperty('ARCHIVE_FOLDER_ID') || '（尚未建立）'),
    '資料夾網址：' + archiveFolderUrlSafe_(),
    '分層方式：' + ARCHIVE.LAYOUT,
    '自動辨識：' + (ARCHIVE.AUTO_OCR ? '開（' + formatBytes_(ARCHIVE.AUTO_OCR_MAX_BYTES) + ' 以內）' : '關'),
    '自動抽日期：' + (ARCHIVE.AUTO_EVENT ? '開' : '關'),
    'OCR：' + (ARCHIVE.OCR_ENABLED ? ARCHIVE.OCR_LANGUAGE : '關閉'),
    '最近歸檔：' + (last ? last.name + '\n　　' + last.url : '（無）')
  ];

  let count = 0;
  try {
    count = indexReadAll_().filter(function (r) { return r.type === ARCHIVE_TYPE; }).length;
    lines.push('歸檔筆數（索引）：' + count);
  } catch (err) {
    lines.push('歸檔筆數：索引讀取失敗（' + getErrorMessage_(err) + '）');
  }

  const info = lines.join('\n');
  console.log(info);
  return info;
}

/* ============================================================
 * 十一之五、網頁管理台（3.3 新增）
 * ============================================================
 * LINE 適合輸入，不適合管理：清單一長就只能一直往上滑，
 * 改一筆內容要打指令，刪一筆更麻煩。所以把「管理」搬到瀏覽器，
 * 「輸入」留在 LINE，兩邊共用同一份 Docs 與索引。
 *
 * 網址：部署網址 + ?app=1
 * 登入：沿用 OWNER_PIN，成功後六小時免登入。
 *
 * 安全性說明：
 *   網頁應用程式的存取權必須是「任何人」，LINE 才打得進來，
 *   所以網址等於公開。真正的門鎖是 PIN：
 *   ・沒有有效 token，任何一支資料 API 都會直接拒絕
 *   ・PIN 連錯 5 次鎖 10 分鐘
 *   ・token 存在指令碼屬性，最多同時 5 個裝置，六小時到期
 * ============================================================ */

const UI_SESSION_KEY = 'UI_SESSIONS';
const UI_SESSION_HOURS = 6;
const UI_MAX_SESSIONS = 5;
const UI_FAIL_KEY = 'ui_login_fail';
const UI_MAX_FAIL = 5;

function renderNoteApp_() {
  return HtmlService.createHtmlOutput(NOTE_APP_HTML)
    .setTitle('筆記管理台')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function buildNoteAppLinkText_() {
  const base = webhookUrl_();
  if (base.indexOf('http') !== 0) return '尚未部署為網頁應用程式，無法產生管理台網址。';
  if (isDevUrl_(base)) return devUrlWarning_();

  const clean = base.split('?')[0];
  return [
    '🖥️ 網頁管理台',
    clean + '?app=1',
    '',
    PropertiesService.getScriptProperties().getProperty('UI_PASSWORD_HASH')
      ? '用你設定的管理台密碼登入，六小時內免再登入。'
      : '用 PIN 登入（就是綁定用的那組），六小時內免再登入。',
    '可以搜尋、篩選、新增、編輯、刪除、完成，也能把誤判的待辦改回筆記。'
  ].join('\n');
}

/* ------------------------------------------------------------
 * 登入與權杖
 * ------------------------------------------------------------ */

/**
 * [3.3.1] 登入畫面的提示文字。順便當成「頁面連得到伺服器嗎」的測試。
 */
function uiHint() {
  const props = PropertiesService.getScriptProperties();
  return {
    ok: true,
    hint: props.getProperty('UI_PASSWORD_HASH')
      ? '請輸入管理台密碼'
      : '請輸入 PIN（與 LINE 綁定時使用的同一組）',
    version: APP.VERSION
  };
}

function uiLogin(pin) {
  const props = PropertiesService.getScriptProperties();
  const hash = props.getProperty('UI_PASSWORD_HASH') || '';
  const salt = props.getProperty('UI_PASSWORD_SALT') || '';
  const ownerPin = props.getProperty('OWNER_PIN') || '';

  if (!hash && !ownerPin) {
    return { ok: false, message: '尚未設定密碼。請執行 setUiPassword() 或先設定 OWNER_PIN。' };
  }

  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get(UI_FAIL_KEY) || 0);
  if (fails >= UI_MAX_FAIL) {
    return { ok: false, message: '嘗試次數過多，請 10 分鐘後再試。' };
  }

  const input = String(pin || '').trim();
  const passed = hash ? (sha256Hex_(input + salt) === hash) : (input === ownerPin);

  if (!passed) {
    cache.put(UI_FAIL_KEY, String(fails + 1), 600);
    return { ok: false, message: '密碼不正確（還有 ' + (UI_MAX_FAIL - fails - 1) + ' 次機會）' };
  }

  cache.remove(UI_FAIL_KEY);
  const token = Utilities.getUuid();
  const sessions = uiReadSessions_();
  sessions.push({ t: token, exp: Date.now() + UI_SESSION_HOURS * 3600 * 1000 });
  uiWriteSessions_(sessions.slice(-UI_MAX_SESSIONS));

  return { ok: true, token: token, version: APP.VERSION };
}

function uiLogout(token) {
  const sessions = uiReadSessions_().filter(function (s) { return s.t !== token; });
  uiWriteSessions_(sessions);
  return { ok: true };
}

/**
 * [3.3.1] 設定管理台專用密碼。
 * 只存雜湊值，屬性裡看不到原文；改密碼會讓所有已登入裝置立刻失效。
 */
function setUiPassword() {
  const pw = String(MY_UI_PASSWORD || '').trim();
  if (pw.length < 4) {
    const msg = [
      '請先填 MY_UI_PASSWORD（至少 4 個字元）。',
      '',
      '1. 打開 code.gs，找到最上方的 MY_UI_PASSWORD',
      '2. 填入想用的密碼，例如：const MY_UI_PASSWORD = \'lujiang2026\';',
      '3. 存檔（Ctrl+S），函式清單選 setUiPassword 按執行',
      '4. 成功後把引號裡的密碼清空再存檔即可'
    ].join('\n');
    console.log(msg);
    return msg;
  }

  const props = PropertiesService.getScriptProperties();
  const salt = Utilities.getUuid();
  props.setProperty('UI_PASSWORD_SALT', salt);
  props.setProperty('UI_PASSWORD_HASH', sha256Hex_(pw + salt));
  props.deleteProperty(UI_SESSION_KEY);          // 既有登入全部失效

  const msg = [
    '✅ 管理台密碼已設定（共 ' + pw.length + ' 個字元）',
    '',
    '・屬性裡只留雜湊值，看不到原文',
    '・所有已登入的裝置都已被登出，請用新密碼重新登入',
    '・LINE 的綁定 PIN（OWNER_PIN）不受影響',
    '',
    '請記得把 MY_UI_PASSWORD 的內容清空後存檔。',
    '想改回用 OWNER_PIN 登入：執行 clearUiPassword()'
  ].join('\n');
  console.log(msg);
  return msg;
}

function clearUiPassword() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty('UI_PASSWORD_HASH');
  props.deleteProperty('UI_PASSWORD_SALT');
  props.deleteProperty(UI_SESSION_KEY);
  const msg = '已移除管理台專用密碼，改回使用 OWNER_PIN 登入（所有裝置需重新登入）。';
  console.log(msg);
  return msg;
}

function sha256Hex_(text) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, String(text), Utilities.Charset.UTF_8);
  return bytes.map(function (b) {
    return ('0' + (b & 0xFF).toString(16)).slice(-2);
  }).join('');
}

function uiReadSessions_() {
  try {
    const raw = PropertiesService.getScriptProperties().getProperty(UI_SESSION_KEY) || '[]';
    const now = Date.now();
    return JSON.parse(raw).filter(function (s) { return s && s.exp > now; });
  } catch (err) {
    return [];
  }
}

function uiWriteSessions_(sessions) {
  try {
    PropertiesService.getScriptProperties().setProperty(UI_SESSION_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn('工作階段寫入失敗：' + getErrorMessage_(err));
  }
}

/**
 * [3.6 改] 滑動視窗：只要還在操作就自動延長，不會用到一半被登出。
 * 固定六小時到期，對「整個下午都在處理公文」的情境非常擾人。
 */
function uiCheck_(token) {
  const sessions = uiReadSessions_();
  const hit = sessions.filter(function (s) { return s.t === token; })[0];
  if (!hit) throw new Error('AUTH');   // 前端看到 AUTH 就跳回登入畫面

  const fresh = Date.now() + UI_SESSION_HOURS * 3600 * 1000;
  // 每延長超過 10 分鐘才寫一次，避免每次呼叫都動到指令碼屬性
  if (fresh - hit.exp > 10 * 60 * 1000) {
    hit.exp = fresh;
    uiWriteSessions_(sessions);
  }
  return true;
}

/* ------------------------------------------------------------
 * 資料 API
 * ------------------------------------------------------------ */

function uiRecord_(r) {
  return {
    uid: r.uid,
    date: r.created ? Utilities.formatDate(r.created, APP.TZ, 'yyyy-MM-dd') : r.dateText,
    time: r.created ? Utilities.formatDate(r.created, APP.TZ, 'HH:mm') : r.time,
    weekday: r.created ? ['日','一','二','三','四','五','六'][r.created.getDay()] : '',
    type: r.type,
    content: r.content,
    status: r.status,
    due: r.due ? Utilities.formatDate(r.due, APP.TZ, 'yyyy-MM-dd') : '',
    doneAt: r.doneAt ? Utilities.formatDate(r.doneAt, APP.TZ, 'yyyy-MM-dd HH:mm') : '',
    location: r.location,
    attach: r.attach,
    remark: r.remark || '',
    doneNote: r.doneNote || '',
    state: r.status === STATUS_DONE ? 'done'
      : (r.status === STATUS_DOING ? 'doing'
        : (r.status === STATUS_TODO ? 'todo' : 'note')),
    docUrl: r.docId ? 'https://docs.google.com/document/d/' + r.docId + '/edit' : '',
    hasEvent: !!r.eventId,
    deletedAt: r.deletedAt ? Utilities.formatDate(r.deletedAt, APP.TZ, 'yyyy-MM-dd HH:mm') : '',
    trashDaysLeft: r.deletedAt ? trashRemainingDays_(r.deletedAt) : null,
    overdue: !!((r.status === STATUS_TODO || r.status === STATUS_DOING) &&
      r.due && r.due < startOfDay_(new Date()))
  };
}

function uiQuery(token, opts) {
  uiCheck_(token);
  const o = opts || {};
  const limit = Math.min(Number(o.limit) || 200, 400);

  let list = indexReadAll_();

  if (o.status === 'todo') {
    // 待辦與進行中都還沒結案，一起看比較符合實際用法
    list = list.filter(function (r) { return r.status === STATUS_TODO || r.status === STATUS_DOING; });
  } else if (o.status === 'doing') {
    list = list.filter(function (r) { return r.status === STATUS_DOING; });
  } else if (o.status === 'done') {
    list = list.filter(function (r) { return r.status === STATUS_DONE; });
  } else if (o.status === 'note') {
    list = list.filter(function (r) {
      return r.status !== STATUS_TODO && r.status !== STATUS_DOING && r.status !== STATUS_DONE;
    });
  } else if (o.status === 'overdue') {
    const today = startOfDay_(new Date());
    list = list.filter(function (r) {
      return (r.status === STATUS_TODO || r.status === STATUS_DOING) && r.due && r.due < today;
    });
  } else if (o.status === 'dueToday') {
    const today = startOfDay_(new Date());
    list = list.filter(function (r) {
      return (r.status === STATUS_TODO || r.status === STATUS_DOING) &&
        r.due && r.due.getTime() === today.getTime();
    });
  } else if (o.status === 'week') {
    const weekAgo = addDays_(startOfDay_(new Date()), -7);
    list = list.filter(function (r) { return r.created && r.created >= weekAgo; });
  }

  if (o.type) list = list.filter(function (r) { return r.type === o.type; });

  const q = String(o.q || '').trim();
  if (q) {
    list = list.filter(function (r) {
      return r.content.indexOf(q) >= 0 || r.type.indexOf(q) >= 0 ||
        r.location.indexOf(q) >= 0 || (r.remark || '').indexOf(q) >= 0 ||
        (r.doneNote || '').indexOf(q) >= 0;
    });
  }

  if (o.from) {
    const from = new Date(o.from + 'T00:00:00');
    list = list.filter(function (r) { return r.created && r.created >= from; });
  }
  if (o.to) {
    const to = new Date(o.to + 'T23:59:59');
    list = list.filter(function (r) { return r.created && r.created <= to; });
  }

  const sort = String(o.sort || 'newest');
  list.sort(function (a, b) {
    const at = a.created ? a.created.getTime() : 0;
    const bt = b.created ? b.created.getTime() : 0;
    if (sort === 'oldest') return at - bt;
    if (sort === 'due') {
      const ad = a.due ? a.due.getTime() : Number.MAX_SAFE_INTEGER;
      const bd = b.due ? b.due.getTime() : Number.MAX_SAFE_INTEGER;
      return ad === bd ? bt - at : ad - bd;
    }
    if (sort === 'status') {
      function rank(r) {
        if ((r.status === STATUS_TODO || r.status === STATUS_DOING) && r.due && r.due < startOfDay_(new Date())) return 0;
        if (r.status === STATUS_DOING) return 1;
        if (r.status === STATUS_TODO) return 2;
        if (r.status === STATUS_DONE) return 4;
        return 3;
      }
      const ar = rank(a), br = rank(b);
      return ar === br ? bt - at : ar - br;
    }
    return bt - at;
  });

  return {
    ok: true,
    total: list.length,
    shown: Math.min(list.length, limit),
    items: list.slice(0, limit).map(uiRecord_)
  };
}

function uiStats(token) {
  uiCheck_(token);
  maybeAutoPurgeTrash_();
  const all = indexReadAll_();
  const allWithTrash = indexReadAll_(true);
  const today = startOfDay_(new Date());
  const weekAgo = addDays_(today, -7);
  const weekEnd = addDays_(today, 7);

  const todos = all.filter(function (r) {
    return r.status === STATUS_TODO || r.status === STATUS_DOING;
  });
  const types = {};
  all.forEach(function (r) { if (r.type) types[r.type] = (types[r.type] || 0) + 1; });

  return {
    ok: true,
    version: APP.VERSION,
    total: all.length,
    todo: todos.length,
    doing: all.filter(function (r) { return r.status === STATUS_DOING; }).length,
    overdue: todos.filter(function (r) { return r.due && r.due < today; }).length,
    dueToday: todos.filter(function (r) {
      return r.due && r.due.getTime() === today.getTime();
    }).length,
    upcoming7: todos.filter(function (r) {
      return r.due && r.due >= today && r.due < weekEnd;
    }).length,
    week: all.filter(function (r) { return r.created && r.created >= weekAgo; }).length,
    files: all.filter(function (r) { return r.type === ARCHIVE_TYPE; }).length,
    trash: allWithTrash.filter(function (r) { return !!r.deletedAt; }).length,
    noise: findNoiseTodos_().length,
    types: Object.keys(types).sort(),
    sheetUrl: indexSheetUrl_() || '',
    archiveUrl: archiveFolderUrlSafe_() || ''
  };
}

function uiCreate(token, text) {
  uiCheck_(token);
  const raw = String(text || '').trim();
  if (!raw) return { ok: false, message: '請輸入內容。' };

  const now = new Date();
  const decision = classifyInput_(raw, now);
  // 網頁端不做「要建行事曆嗎」的追問，先照筆記寫進去，需要再從清單改
  if (decision.action === 'ask') decision.action = 'note';

  const cleanText = stripIntentWords_(stripTypePrefix_(raw));
  let calendarResult = null;
  let calendarError = null;

  if (decision.action === 'calendar') {
    try {
      calendarResult = createCalendarEvent_(parseCalendarInput_(cleanText, now, decision.kind));
    } catch (err) {
      calendarError = getErrorMessage_(err);
    }
  }

  const isTask = decision.action === 'note' &&
    decision.kind === '一般筆記' &&
    looksLikeTask_(cleanText);
  const due = isTask ? parseNoteDue_(cleanText, now) : null;

  try {
    const written = appendToJournalDoc_({
      receivedAt: now,
      type: decision.kind,
      text: cleanText,
      isTask: isTask,
      due: due,
      calendarResult: calendarResult,
      calendarError: calendarError
    });
    return {
      ok: true,
      uid: written ? written.uid : '',
      isTask: isTask,
      type: decision.kind,
      calendar: calendarResult ? formatChineseDateTime_(calendarResult.start) : '',
      message: (isTask ? '☐ 已列入待辦' : '📝 已寫入筆記') +
        (calendarResult ? '，並建立行事曆' : '') +
        (calendarError ? '（行事曆未建立：' + calendarError + '）' : '')
    };
  } catch (err) {
    if (calendarResult) deleteCalendarEvent_(calendarResult.calendarId, calendarResult.id);
    return { ok: false, message: '寫入失敗：' + getErrorMessage_(err) };
  }
}

function uiComplete(token, uid, note) {
  uiCheck_(token);
  return completeByUid_(uid, note);
}

function completeByUid_(uid, note) {
  const row = indexFindRowByUid_(uid);
  if (!row) return { ok: false, message: '找不到這一筆。' };

  const sheet = getIndexSheet_();
  const status = String(sheet.getRange(row, SHEET.COL.STATUS).getValue() || '');
  if (status === STATUS_DONE) return { ok: true, message: '已經是完成狀態。' };

  const docId = String(sheet.getRange(row, SHEET.COL.DOC_ID).getValue() || '');
  const line = String(sheet.getRange(row, SHEET.COL.PARA).getValue() || '');
  const content = String(sheet.getRange(row, SHEET.COL.CONTENT).getValue() || '');

  // 純筆記沒有 ☐ 前綴，先補成待辦再標完成，否則 Docs 找不到對應段落
  if (status !== STATUS_TODO && status !== STATUS_DOING) {
    const promoted = setEntryState_(uid, 'todo');
    if (!promoted.ok) return promoted;
    const newLine = String(getIndexSheet_().getRange(row, SHEET.COL.PARA).getValue() || '');
    const message = markDone_(docId, newLine, content, uid, note);
    return { ok: message.indexOf('⚠️') < 0, message: message };
  }

  const message = markDone_(docId, line, content, uid, note);
  return { ok: message.indexOf('⚠️') < 0, message: message };
}

/**
 * [3.4] 批次處理。一次最多 50 筆——再多會撞到 Apps Script 的執行時間上限，
 * 而且使用者也不會想等一個沒有進度回饋的長操作。
 */
function uiBatch(token, action, uids, note) {
  uiCheck_(token);

  const list = (uids || []).slice(0, 50);
  if (!list.length) return { ok: false, message: '沒有選取任何項目。' };

  const labels = { del: '移到回收桶', done: '完成', note: '轉為筆記', task: '轉為待辦', doing: '轉為進行中' };
  if (!labels[action]) return { ok: false, message: '未知的動作。' };

  let done = 0;
  let failed = 0;
  const errors = [];

  list.forEach(function (uid) {
    try {
      let r;
      if (action === 'del') r = deleteEntryByUid_(uid);
      else if (action === 'done') r = completeByUid_(uid, note);
      else if (action === 'note') r = setEntryState_(uid, 'note');
      else if (action === 'doing') r = setEntryState_(uid, 'doing');
      else r = setEntryState_(uid, 'todo');

      if (r && r.ok) done++;
      else { failed++; if (r && r.message) errors.push(r.message); }
    } catch (err) {
      failed++;
      errors.push(getErrorMessage_(err));
    }
  });

  return {
    ok: failed === 0,
    done: done,
    failed: failed,
    message: labels[action] + ' ' + done + ' 筆' +
      (failed ? '，失敗 ' + failed + ' 筆（' + errors.slice(0, 2).join('；') + '）' : '') +
      (uids.length > list.length ? '（一次最多 50 筆，其餘請再操作一次）' : '')
  };
}

/**
 * [3.4] 編輯面板要用的單筆資料。
 */
function uiGet(token, uid) {
  uiCheck_(token);
  const hit = indexReadAll_().filter(function (r) { return r.uid === uid; })[0];
  if (!hit) return { ok: false, message: '找不到這一筆。' };
  const rec = uiRecord_(hit);
  rec.ok = true;
  return rec;
}

/**
 * [3.4] 一次存下編輯面板的所有變更。
 * 內容改動最容易失敗（Docs 段落被手動編輯過就對不上），所以先做，
 * 失敗就整筆中止，不會出現「期限改了、內容沒改」的半套狀態。
 */
function uiSave(token, uid, data) {
  uiCheck_(token);
  const d = data || {};
  const notes = [];

  if (typeof d.text === 'string') {
    const hit = indexReadAll_().filter(function (r) { return r.uid === uid; })[0];
    if (hit && hit.content !== d.text.trim()) {
      const r = updateEntryText_(uid, d.text);
      if (!r.ok) return r;
      notes.push('內容已更新');
    }
  }

  if (typeof d.state === 'string' && d.state) {
    const row = indexFindRowByUid_(uid);
    const status = row ? String(getIndexSheet_().getRange(row, SHEET.COL.STATUS).getValue() || '') : '';
    const nowState = status === STATUS_DONE ? 'done'
      : (status === STATUS_DOING ? 'doing' : (status === STATUS_TODO ? 'todo' : 'note'));
    if (nowState !== 'done' && nowState !== d.state) {
      const r = setEntryState_(uid, d.state);
      if (!r.ok) return r;
      notes.push({ note: '已改為筆記', todo: '已列入待辦', doing: '已標為進行中' }[d.state]);
    }
  }

  if (typeof d.remark === 'string') {
    const r = updateRemark_(uid, d.remark);
    if (!r.ok) return r;
    if (r.changed) notes.push(d.remark.trim() ? '備註已更新' : '備註已清除');
  }

  if (typeof d.doneNote === 'string') {
    const r = updateDoneNote_(uid, d.doneNote);
    if (!r.ok) return r;
    if (r.changed) notes.push('完成說明已更新');
  }

  if (typeof d.due === 'string') {
    const r = updateEntryDue_(uid, d.due);
    if (!r.ok) return r;
    if (r.changed) notes.push(d.due ? '期限已設為 ' + d.due : '期限已清除');
  }

  return { ok: true, message: notes.length ? notes.join('｜') : '沒有變更' };
}

function updateEntryDue_(uid, dueStr) {
  const row = indexFindRowByUid_(uid);
  if (!row) return { ok: false, message: '找不到這一筆。' };

  const sheet = getIndexSheet_();
  const cur = String(sheet.getRange(row, SHEET.COL.DUE).getValue() || '');
  const next = String(dueStr || '').trim();

  if (next && !/^\d{4}-\d{2}-\d{2}$/.test(next)) {
    return { ok: false, message: '期限格式要是 yyyy-mm-dd。' };
  }
  const curNorm = cur && cur.indexOf('-') < 0
    ? Utilities.formatDate(toDateOrNull_(cur) || new Date(), APP.TZ, 'yyyy-MM-dd')
    : cur;

  if (curNorm === next) return { ok: true, changed: false };
  sheet.getRange(row, SHEET.COL.DUE).setValue(next);
  return { ok: true, changed: true };
}

function uiReopen(token, uid) {
  uiCheck_(token);
  return reopenEntryByUid_(uid);
}

function uiSetTask(token, uid, makeTask) {
  uiCheck_(token);
  return setEntryState_(uid, makeTask ? 'todo' : 'note');
}

/**
 * [3.5] 狀態下拉選單用：'note' | 'todo' | 'doing'
 */
function uiSetState(token, uid, state) {
  uiCheck_(token);
  return setEntryState_(uid, state);
}

function uiUpdate(token, uid, text) {
  uiCheck_(token);
  return updateEntryText_(uid, text);
}

function uiDelete(token, uid) {
  uiCheck_(token);
  return deleteEntryByUid_(uid);
}

function uiCleanup(token) {
  uiCheck_(token);
  const before = findNoiseTodos_().length;
  if (!before) return { ok: true, message: '目前沒有需要清理的待辦。', count: 0 };
  runCleanupTodos_();
  return { ok: true, message: '已把 ' + before + ' 筆轉為筆記。', count: before };
}

/* ============================================================
 * 十一之六、4.0 管理中心 API
 * ============================================================ */

function uiDashboard(token) {
  uiCheck_(token);
  maybeAutoPurgeTrash_();
  const all = indexReadAll_();
  const allWithTrash = indexReadAll_(true);
  const today = startOfDay_(new Date());
  const tomorrow = addDays_(today, 1);
  const weekEnd = addDays_(today, 7);
  const todos = all.filter(function (r) { return r.status === STATUS_TODO || r.status === STATUS_DOING; });

  const recent = all.slice().sort(function (a, b) {
    return (b.created ? b.created.getTime() : 0) - (a.created ? a.created.getTime() : 0);
  }).slice(0, 6).map(uiRecord_);

  const priority = todos.filter(function (r) { return r.due && r.due < weekEnd; })
    .sort(function (a, b) {
      const ad = a.due ? a.due.getTime() : Number.MAX_SAFE_INTEGER;
      const bd = b.due ? b.due.getTime() : Number.MAX_SAFE_INTEGER;
      return ad - bd;
    }).slice(0, 8).map(uiRecord_);

  return {
    ok: true,
    version: APP.VERSION,
    total: all.length,
    todo: todos.length,
    doing: todos.filter(function (r) { return r.status === STATUS_DOING; }).length,
    overdue: todos.filter(function (r) { return r.due && r.due < today; }).length,
    dueToday: todos.filter(function (r) { return r.due && r.due.getTime() === today.getTime(); }).length,
    tomorrow: todos.filter(function (r) { return r.due && r.due.getTime() === tomorrow.getTime(); }).length,
    upcoming7: todos.filter(function (r) { return r.due && r.due >= today && r.due < weekEnd; }).length,
    files: all.filter(function (r) { return r.type === ARCHIVE_TYPE; }).length,
    trash: allWithTrash.filter(function (r) { return !!r.deletedAt; }).length,
    recent: recent,
    priority: priority,
    sheetUrl: indexSheetUrl_() || '',
    archiveUrl: archiveFolderUrlSafe_() || ''
  };
}

function uiUpcoming(token) {
  uiCheck_(token);
  const today = startOfDay_(new Date());
  const end = addDays_(today, 7);
  const all = indexReadAll_();
  const todos = all.filter(function (r) {
    return r.status === STATUS_TODO || r.status === STATUS_DOING;
  });

  const dated = todos.filter(function (r) { return r.due && r.due < end; })
    .sort(function (a, b) {
      const ad = a.due ? a.due.getTime() : Number.MAX_SAFE_INTEGER;
      const bd = b.due ? b.due.getTime() : Number.MAX_SAFE_INTEGER;
      return ad === bd
        ? ((a.created ? a.created.getTime() : 0) - (b.created ? b.created.getTime() : 0))
        : ad - bd;
    });

  return {
    ok: true,
    items: dated.map(uiRecord_),
    undated: todos.filter(function (r) { return !r.due; }).length,
    overdue: dated.filter(function (r) { return r.due < today; }).length
  };
}

function parseDriveFileId_(url) {
  const s = String(url || '');
  let m = s.match(/\/d\/([A-Za-z0-9_-]{10,})/);
  if (m) return m[1];
  m = s.match(/[?&]id=([A-Za-z0-9_-]{10,})/);
  return m ? m[1] : '';
}

function archiveMetaFromRecord_(r) {
  const content = String(r.content || '').trim();
  let category = ARCHIVE.FALLBACK_CATEGORY;
  let name = content;
  let size = '';
  const m = content.match(/^.*?\[([^\]]+)\]\s*(.*?)(?:（([^）]+)）)?\s*$/);
  if (m) {
    category = m[1] || category;
    name = (m[2] || '').trim();
    size = (m[3] || '').trim();
  }
  const dot = name.lastIndexOf('.');
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
  let fileType = '其他';
  if (/^(pdf)$/.test(ext)) fileType = 'PDF';
  else if (/^(doc|docx|odt|rtf)$/.test(ext)) fileType = 'Word';
  else if (/^(xls|xlsx|csv|ods)$/.test(ext)) fileType = '試算表';
  else if (/^(ppt|pptx|odp)$/.test(ext)) fileType = '簡報';
  else if (/^(jpg|jpeg|png|gif|webp|heic|bmp)$/.test(ext)) fileType = '圖片';
  else if (/^(mp4|mov|avi|mkv|webm)$/.test(ext)) fileType = '影片';
  else if (/^(mp3|m4a|wav|aac|ogg)$/.test(ext)) fileType = '音訊';

  return {
    category: category,
    name: name,
    size: size,
    ext: ext,
    fileType: fileType,
    driveId: parseDriveFileId_(r.attach),
    month: r.created ? Utilities.formatDate(r.created, APP.TZ, 'yyyy-MM') : ''
  };
}

function uiFiles(token, opts) {
  uiCheck_(token);
  const o = opts || {};
  let list = indexReadAll_().filter(function (r) { return r.type === ARCHIVE_TYPE; });
  const q = String(o.q || '').trim().toLowerCase();
  const category = String(o.category || '');
  const month = String(o.month || '');
  const fileType = String(o.fileType || '');

  const rows = list.map(function (r) {
    const meta = archiveMetaFromRecord_(r);
    return { rec: r, meta: meta };
  }).filter(function (x) {
    if (q && (x.meta.name + ' ' + x.meta.category + ' ' + x.rec.content).toLowerCase().indexOf(q) < 0) return false;
    if (category && x.meta.category !== category) return false;
    if (month && x.meta.month !== month) return false;
    if (fileType && x.meta.fileType !== fileType) return false;
    return true;
  });

  rows.sort(function (a, b) {
    return (b.rec.created ? b.rec.created.getTime() : 0) - (a.rec.created ? a.rec.created.getTime() : 0);
  });

  const categories = {};
  const months = {};
  const types = {};
  indexReadAll_().filter(function (r) { return r.type === ARCHIVE_TYPE; }).forEach(function (r) {
    const m = archiveMetaFromRecord_(r);
    categories[m.category] = true;
    if (m.month) months[m.month] = true;
    types[m.fileType] = true;
  });

  return {
    ok: true,
    total: rows.length,
    items: rows.slice(0, 200).map(function (x) {
      const u = uiRecord_(x.rec);
      u.fileName = x.meta.name;
      u.category = x.meta.category;
      u.fileSize = x.meta.size;
      u.fileType = x.meta.fileType;
      u.driveId = x.meta.driveId;
      u.month = x.meta.month;
      u.ocrCapable = x.meta.fileType === 'PDF' || x.meta.fileType === '圖片';
      return u;
    }),
    categories: Object.keys(categories).sort(),
    months: Object.keys(months).sort().reverse(),
    fileTypes: Object.keys(types).sort(),
    moveCategories: archiveCategoryNames_(),
    canMoveCategory: ARCHIVE.LAYOUT === 'category',
    ocrEnabled: !!ARCHIVE.OCR_ENABLED,
    archiveUrl: archiveFolderUrlSafe_() || ''
  };
}

function uiFileRename(token, uid, newName) {
  uiCheck_(token);
  const hit = indexReadAll_().filter(function (r) { return r.uid === uid && r.type === ARCHIVE_TYPE; })[0];
  if (!hit) return { ok: false, message: '找不到這筆檔案紀錄。' };
  const fileId = parseDriveFileId_(hit.attach);
  if (!fileId) return { ok: false, message: '這筆紀錄沒有可辨識的 Google Drive 檔案 ID。' };
  const msg = renameArchivedFile_(fileId, newName);
  return { ok: msg.indexOf('⚠️') < 0, message: msg };
}

function archiveCategoryNames_() {
  const seen = {};
  const out = [];
  function add(name) {
    const n = String(name || '').trim();
    if (!n || seen[n]) return;
    seen[n] = true;
    out.push(n);
  }
  categoryRules_().forEach(function (r) { add(r.name); });
  add(ARCHIVE.PHOTO_CATEGORY);
  add(ARCHIVE.FALLBACK_CATEGORY);
  return out;
}

function uiFileMoveCategory(token, uid, newCategory) {
  uiCheck_(token);
  if (ARCHIVE.LAYOUT !== 'category') {
    return { ok: false, message: '目前 ARCHIVE.LAYOUT 不是 category，無法用分類搬移。' };
  }

  const category = String(newCategory || '').trim();
  const allowed = archiveCategoryNames_();
  if (!category || allowed.indexOf(category) < 0) {
    return { ok: false, message: '分類不存在。請先用 /加類 建立自訂分類，或從現有分類選擇。' };
  }

  const hit = indexReadAll_().filter(function (r) { return r.uid === uid && r.type === ARCHIVE_TYPE; })[0];
  if (!hit) return { ok: false, message: '找不到這筆檔案紀錄。' };
  const fileId = parseDriveFileId_(hit.attach);
  if (!fileId) return { ok: false, message: '這筆紀錄沒有可辨識的 Google Drive 檔案 ID。' };

  let file;
  try { file = DriveApp.getFileById(fileId); }
  catch (err) { return { ok: false, message: 'Drive 檔案無法開啟：' + getErrorMessage_(err) }; }

  const oldParents = [];
  try {
    const it = file.getParents();
    while (it.hasNext()) oldParents.push(it.next());
  } catch (err) {}

  let target;
  try {
    target = archiveTargetFolder_(hit.created || new Date(), MEDIA_KIND.file, category);
    file.moveTo(target);
  } catch (err) {
    return { ok: false, message: '搬移檔案失敗：' + getErrorMessage_(err) };
  }

  const oldContent = String(hit.content || '');
  const newContent = /\[[^\]]+\]/.test(oldContent)
    ? oldContent.replace(/\[[^\]]+\]/, '[' + category + ']')
    : ('📎 [' + category + '] ' + oldContent);
  const sync = updateEntryText_(uid, newContent);
  if (!sync.ok) {
    try { if (oldParents.length) file.moveTo(oldParents[0]); } catch (rollbackErr) {}
    return { ok: false, message: '檔案已嘗試搬移，但紀錄同步失敗，系統已嘗試回復原資料夾：' + sync.message };
  }

  try {
    const desc = String(file.getDescription() || '');
    const nextDesc = /分類：[^｜]*/.test(desc)
      ? desc.replace(/分類：[^｜]*/, '分類：' + category)
      : (desc ? desc + '｜分類：' + category : '分類：' + category);
    file.setDescription(nextDesc);
  } catch (err) { console.warn('檔案說明分類同步失敗：' + getErrorMessage_(err)); }

  return { ok: true, message: '已移到「' + category + '」分類。' };
}

function uiFileOcr(token, uid) {
  uiCheck_(token);
  if (!ARCHIVE.OCR_ENABLED) return { ok: false, message: 'OCR 功能目前已關閉。' };
  const hit = indexReadAll_().filter(function (r) { return r.uid === uid && r.type === ARCHIVE_TYPE; })[0];
  if (!hit) return { ok: false, message: '找不到這筆檔案紀錄。' };
  const fileId = parseDriveFileId_(hit.attach);
  if (!fileId) return { ok: false, message: '這筆紀錄沒有可辨識的 Google Drive 檔案 ID。' };

  let file;
  try { file = DriveApp.getFileById(fileId); }
  catch (err) { return { ok: false, message: 'Drive 檔案無法開啟：' + getErrorMessage_(err) }; }
  if (!ocrCapable_(file.getMimeType())) return { ok: false, message: '只有 PDF 或圖片可做文字辨識。' };

  try {
    const text = ocrDriveFile_(fileId);
    if (!text) return { ok: true, text: '', fileName: file.getName(), message: '沒有辨識到文字。' };
    const cap = 8000;
    return {
      ok: true,
      fileName: file.getName(),
      text: text.slice(0, cap),
      truncated: text.length > cap,
      message: text.length > cap ? '辨識完成；畫面顯示前 ' + cap + ' 字。' : '辨識完成。'
    };
  } catch (err) {
    return { ok: false, message: '文字辨識失敗：' + getErrorMessage_(err) };
  }
}

function scanArchiveOrphans_(maxFiles) {
  const cap = Math.max(50, Math.min(Number(maxFiles) || 500, 1000));
  const known = {};
  indexReadAll_(true).filter(function (r) { return r.type === ARCHIVE_TYPE; }).forEach(function (r) {
    const id = parseDriveFileId_(r.attach);
    if (id) known[id] = true;
  });

  const root = archiveRootFolder_();
  const queue = [root];
  const orphans = [];
  let scanned = 0;

  while (queue.length && scanned < cap) {
    const folder = queue.shift();
    const files = folder.getFiles();
    while (files.hasNext() && scanned < cap) {
      const f = files.next();
      scanned++;
      if (!known[f.getId()]) {
        orphans.push({ id: f.getId(), name: f.getName(), url: f.getUrl(), folder: folder.getName() });
        if (orphans.length >= 50) break;
      }
    }
    if (orphans.length >= 50) break;
    const subs = folder.getFolders();
    while (subs.hasNext() && queue.length < 200) queue.push(subs.next());
  }

  return { scanned: scanned, capped: scanned >= cap, orphans: orphans };
}

function uiFindOrphanFiles(token) {
  uiCheck_(token);
  try {
    const r = scanArchiveOrphans_(500);
    return { ok: true, scanned: r.scanned, capped: r.capped, items: r.orphans };
  } catch (err) {
    return { ok: false, message: getErrorMessage_(err), items: [] };
  }
}

function uiTrashList(token) {
  uiCheck_(token);
  maybeAutoPurgeTrash_();
  const list = indexReadAll_(true).filter(function (r) { return !!r.deletedAt; })
    .sort(function (a, b) { return b.deletedAt - a.deletedAt; });
  return {
    ok: true,
    retentionDays: TRASH.RETENTION_DAYS,
    items: list.slice(0, 200).map(uiRecord_)
  };
}

function uiTrashRestore(token, uid) {
  uiCheck_(token);
  return restoreEntryFromTrash_(uid);
}

function uiTrashPurge(token, uid) {
  uiCheck_(token);
  const row = indexFindRowByUid_(uid, true);
  if (!row) return { ok: false, message: '找不到這一筆。' };
  const deleted = getIndexSheet_().getRange(row, SHEET.COL.DELETED_AT).getValue();
  if (!deleted) return { ok: false, message: '這一筆不在資源回收桶，拒絕永久刪除。' };
  return hardDeleteEntryByUid_(uid);
}

function uiEmptyTrash(token) {
  uiCheck_(token);
  const items = indexReadAll_(true).filter(function (r) { return !!r.deletedAt; }).slice(0, 50);
  if (!items.length) return { ok: true, done: 0, message: '資源回收桶已經是空的。' };
  let done = 0, failed = 0;
  items.forEach(function (r) {
    const res = hardDeleteEntryByUid_(r.uid);
    if (res && res.ok) done++; else failed++;
  });
  return {
    ok: failed === 0,
    done: done,
    failed: failed,
    message: '永久刪除 ' + done + ' 筆' + (failed ? '，失敗 ' + failed + ' 筆' : '') +
      (indexReadAll_(true).filter(function (r) { return !!r.deletedAt; }).length ? '；若仍有資料，請再執行一次。' : '')
  };
}

function healthCheckItem_(key, label, level, detail, action) {
  return { key: key, label: label, level: level, detail: detail || '', action: action || '' };
}

function hasTrashMaintenanceTrigger_() {
  return ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === TRASH.TRIGGER_HANDLER;
  });
}

function ensureTrashMaintenanceTrigger_() {
  if (hasTrashMaintenanceTrigger_()) return false;
  ScriptApp.newTrigger(TRASH.TRIGGER_HANDLER).timeBased().everyDays(1).atHour(3).create();
  return true;
}

function runTrashMaintenance() {
  const r = purgeExpiredTrash_(50);
  console.log('回收桶維護：永久刪除 ' + r.done + ' 筆，失敗 ' + r.failed + ' 筆');
  return r;
}

function setupV40() {
  const lines = ['=== 筆記管理台 4.0 升級 ==='];
  try {
    ensureIndexColumns_(getIndexSheet_());
    lines.push('✅ 索引欄位已確認（含刪除時間／回收桶快照）');
  } catch (err) { lines.push('❌ 索引欄位：' + getErrorMessage_(err)); }

  try {
    const created = ensureTrashMaintenanceTrigger_();
    lines.push('✅ 回收桶每日維護排程：' + (created ? '已建立' : '已存在'));
  } catch (err) { lines.push('❌ 回收桶排程：' + getErrorMessage_(err)); }

  lines.push('版本：' + APP.VERSION);
  const appLinkText = buildNoteAppLinkText_();
  const appLinkLines = String(appLinkText || '').split('\n');
  lines.push('管理台：' + (appLinkLines[1] || appLinkLines[0] || '尚未部署'));
  const msg = lines.join('\n');
  console.log(msg);
  return msg;
}

function uiInstallMaintenance(token) {
  uiCheck_(token);
  const created = ensureTrashMaintenanceTrigger_();
  return { ok: true, message: created ? '已建立每日 03:00 回收桶維護排程。' : '每日維護排程已存在。' };
}

function uiRepairIndex(token) {
  uiCheck_(token);
  return { ok: true, message: repairIndexRows() };
}

function uiHealth(token, deep) {
  uiCheck_(token);
  const p = PropertiesService.getScriptProperties();
  const checks = [];
  let url = '';
  try { url = ScriptApp.getService().getUrl() || ''; } catch (err) {}
  checks.push(healthCheckItem_('deploy', '網頁部署',
    !url ? 'bad' : (isDevUrl_(url) ? 'warn' : 'ok'),
    !url ? '尚未部署為網頁應用程式' : (isDevUrl_(url) ? '目前是 /dev 測試網址' : '正式 /exec 部署可取得')));

  checks.push(healthCheckItem_('lineToken', 'LINE Channel Token',
    p.getProperty('LINE_CHANNEL_ACCESS_TOKEN') ? 'ok' : 'bad',
    p.getProperty('LINE_CHANNEL_ACCESS_TOKEN') ? '已設定' : '缺少 LINE_CHANNEL_ACCESS_TOKEN'));
  checks.push(healthCheckItem_('owner', 'LINE 管理者綁定',
    p.getProperty('OWNER_USER_ID') ? 'ok' : 'warn',
    p.getProperty('OWNER_USER_ID') ? '已綁定' : '尚未綁定 OWNER_USER_ID'));

  try {
    const ss = getIndexSpreadsheet_();
    checks.push(healthCheckItem_('index', '索引試算表', 'ok', '可開啟 · ' + indexReadAll_(true).length + ' 筆（含回收桶）', 'repairIndex'));
  } catch (err) {
    checks.push(healthCheckItem_('index', '索引試算表', 'bad', getErrorMessage_(err), 'repairIndex'));
  }

  try {
    const reg = readRegistry_();
    const key = docKey_(new Date());
    const info = reg[key];
    if (info && info.id) {
      const doc = DocumentApp.openById(info.id);
      checks.push(healthCheckItem_('docs', '本月 Google Docs', 'ok', doc.getName()));
    } else {
      checks.push(healthCheckItem_('docs', '本月 Google Docs', 'warn', '本月尚未建立文件；首次寫入時會自動建立'));
    }
  } catch (err) {
    checks.push(healthCheckItem_('docs', '本月 Google Docs', 'bad', getErrorMessage_(err)));
  }

  try {
    checks.push(healthCheckItem_('calendar', 'Google Calendar', 'ok', getCalendar_().getName()));
  } catch (err) {
    checks.push(healthCheckItem_('calendar', 'Google Calendar', 'bad', getErrorMessage_(err)));
  }

  try {
    const aid = p.getProperty('ARCHIVE_FOLDER_ID') || '';
    if (!aid) checks.push(healthCheckItem_('archive', '檔案歸檔資料夾', 'warn', '尚未建立；首次收檔時會自動建立'));
    else checks.push(healthCheckItem_('archive', '檔案歸檔資料夾', 'ok', DriveApp.getFolderById(aid).getName()));
  } catch (err) {
    checks.push(healthCheckItem_('archive', '檔案歸檔資料夾', 'bad', getErrorMessage_(err)));
  }

  try {
    checks.push(healthCheckItem_('morning', '早晨推播', hasMorningTrigger_() ? 'ok' : 'warn', hasMorningTrigger_() ? '排程已存在' : '未啟用'));
  } catch (err) { checks.push(healthCheckItem_('morning', '早晨推播', 'warn', getErrorMessage_(err))); }
  try {
    checks.push(healthCheckItem_('evening', '晚間回顧', hasEveningTrigger_() ? 'ok' : 'warn', hasEveningTrigger_() ? '排程已存在' : '未啟用'));
  } catch (err) { checks.push(healthCheckItem_('evening', '晚間回顧', 'warn', getErrorMessage_(err))); }
  try {
    checks.push(healthCheckItem_('trashTrigger', '回收桶每日維護', hasTrashMaintenanceTrigger_() ? 'ok' : 'warn',
      hasTrashMaintenanceTrigger_() ? '每日排程已存在' : '尚未建立；開啟管理台仍會做輕量自動維護', 'installMaintenance'));
  } catch (err) { checks.push(healthCheckItem_('trashTrigger', '回收桶每日維護', 'warn', getErrorMessage_(err), 'installMaintenance')); }

  if (deep && p.getProperty('LINE_CHANNEL_ACCESS_TOKEN')) {
    try {
      const info = lineApi_('get', LINE_API + '/channel/webhook/endpoint');
      const mine = webhookUrl_();
      const same = !!info.endpoint && info.endpoint === mine;
      checks.push(healthCheckItem_('webhook', 'LINE Webhook 實際端點',
        (info.active && same && !isDevUrl_(info.endpoint)) ? 'ok' : 'bad',
        'LINE：' + (info.endpoint || '未設定') + '｜本專案：' + mine + '｜' + (info.active ? '啟用' : '停用')));
    } catch (err) {
      checks.push(healthCheckItem_('webhook', 'LINE Webhook 實際端點', 'bad', getErrorMessage_(err)));
    }
  }

  const summary = { ok: 0, warn: 0, bad: 0 };
  checks.forEach(function (c) { summary[c.level] = (summary[c.level] || 0) + 1; });
  return { ok: true, version: APP.VERSION, checkedAt: formatChineseDateTime_(new Date()), checks: checks, summary: summary };
}

/* ------------------------------------------------------------
 * 前端頁面（單檔內嵌）
 *
 * 刻意不用任何框架：這頁的複雜度不需要，而且 Apps Script 專案
 * 多一個檔案就多一次「同事貼漏了」的機會。全部塞在這個字串裡，
 * 複製一份 code.gs 就等於完整搬走整套系統。
 *
 * ⚠️ 一定要用 String.raw。普通的樣板字面值會把 \s、\/、\' 這些
 *    反斜線當成轉義字元吃掉，正則與字串會靜靜地壞掉，
 *    整段 <script> 變成語法錯誤，畫面卻只是「按了沒反應」。
 *    3.3 就是栽在這裡。
 * ------------------------------------------------------------ */

const NOTE_APP_HTML = String.raw`
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>筆記管理台 4.0</title>
<style>
:root{
  --nav:#0d1425;--nav2:#121d35;--nav3:#1a2846;--brand:#5b5cf6;--brand2:#8a5cf6;
  --cyan:#0891b2;--teal:#0f9f8f;--green:#15966d;--amber:#d97706;--red:#dc3f4f;--pink:#c43d8a;
  --ink:#132033;--ink2:#344054;--muted:#667085;--faint:#98a2b3;--bg:#f3f6fb;--card:#fff;--line:#e4e9f2;
  --soft:#f8faff;--shadow:0 10px 30px rgba(30,41,59,.07);--shadow2:0 18px 55px rgba(15,23,42,.16);--r:16px;--sidebar:248px;
}
*{box-sizing:border-box}html,body{margin:0;min-height:100%}body{font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;background:radial-gradient(circle at 98% 0,rgba(91,92,246,.10),transparent 26rem),var(--bg);color:var(--ink);font-size:14px;line-height:1.65}.hide{display:none!important}
a{color:var(--brand);text-decoration:none}a:hover{text-decoration:underline}
button,input,select,textarea{font:inherit}button{border:1px solid var(--line);background:#fff;color:var(--ink2);border-radius:10px;padding:8px 12px;cursor:pointer;transition:.16s}button:hover:not(:disabled){transform:translateY(-1px);border-color:#c7d0df;background:#fafbff}button:disabled{opacity:.48;cursor:not-allowed;transform:none}.primary{border:0;color:#fff;background:linear-gradient(135deg,var(--brand),var(--brand2));box-shadow:0 8px 20px rgba(91,92,246,.24)}.danger{color:var(--red)}.danger:hover{background:#fff1f3}.good{color:var(--green)}.ghost{border-color:transparent;background:transparent;padding:6px 8px}.ghost:hover{background:#f2f4f8}.small{padding:6px 9px;font-size:12px}.row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.grow{flex:1}.sub{font-size:12.5px;color:var(--muted)}input,select,textarea{width:100%;border:1px solid var(--line);background:#fff;color:var(--ink);border-radius:11px;padding:10px 12px;outline:none;transition:.16s}input:focus,select:focus,textarea:focus{border-color:#9aa4ff;box-shadow:0 0 0 4px rgba(91,92,246,.10)}textarea{resize:vertical;min-height:82px;line-height:1.7}
/* login */
.login{min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(145deg,#0b1222,#172344 60%,#4d3e94)}.login-shell{width:min(930px,96vw);display:grid;grid-template-columns:1.18fr .82fr;background:#fff;border-radius:26px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.3)}.login-visual{padding:48px;background:linear-gradient(145deg,#4f59ec,#8358ee);color:#fff;position:relative}.login-visual:after{content:"";position:absolute;width:300px;height:300px;border-radius:50%;right:-110px;bottom:-120px;background:rgba(255,255,255,.08)}.logo-box{width:56px;height:56px;border-radius:17px;display:grid;place-items:center;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.22);font-size:27px;margin-bottom:56px}.login-visual h1{font-size:29px;margin:0 0 12px}.login-visual p{max-width:420px;opacity:.82}.login-card{padding:48px 40px;display:flex;flex-direction:column;justify-content:center}.login-card h2{margin:0;font-size:22px}.field-title{font-size:12.5px;font-weight:800;color:var(--ink2);margin:26px 0 7px}.err{color:var(--red);min-height:20px;margin-top:8px;font-size:13px}
/* shell */
.shell{min-height:100vh;display:grid;grid-template-columns:var(--sidebar) minmax(0,1fr)}.sidebar{position:fixed;inset:0 auto 0 0;width:var(--sidebar);background:linear-gradient(180deg,var(--nav),var(--nav2) 70%,#17223d);color:#dce5f6;padding:18px 13px;z-index:40;display:flex;flex-direction:column;overflow:auto}.brand{display:flex;gap:11px;align-items:center;padding:4px 8px 20px}.brand-logo{width:43px;height:43px;border-radius:13px;background:linear-gradient(135deg,#6672ff,#a05cff);display:grid;place-items:center;font-size:20px;box-shadow:0 10px 24px rgba(91,92,246,.28)}.brand b{display:block;color:#fff;font-size:16px}.brand small{display:block;color:#8fa0bf;font-size:10.5px}.side-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#70809d;padding:18px 10px 7px;font-weight:900}.nav{display:grid;gap:4px}.navbtn{border:0;background:transparent;color:#aebbd1;text-align:left;padding:9px 11px;border-radius:10px;display:flex;align-items:center;gap:10px;width:100%;font-size:13px}.navbtn:hover{background:rgba(255,255,255,.06);color:#fff;transform:none}.navbtn.on{color:#fff;background:linear-gradient(135deg,rgba(91,92,246,.28),rgba(138,92,246,.16));box-shadow:inset 3px 0 0 #7f87ff;font-weight:800}.navico{width:20px;text-align:center}.side-tools{margin-top:auto;display:grid;gap:7px;padding:16px 2px 2px}.side-tools a,.side-tools button{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);color:#c8d2e5;text-align:left;font-size:12.5px}.side-tools a{display:block;padding:8px 11px;border-radius:10px;text-decoration:none}.side-tools a:hover,.side-tools button:hover{background:rgba(255,255,255,.09);color:#fff;transform:none}.workspace{grid-column:2;min-width:0}.topbar{height:68px;position:sticky;top:0;z-index:30;background:rgba(255,255,255,.91);backdrop-filter:blur(15px);border-bottom:1px solid rgba(228,233,242,.95)}.topinner{max-width:1450px;height:100%;margin:auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;gap:14px}.page-title b{font-size:17px;display:block}.page-title span{font-size:11.5px;color:var(--muted);display:block;margin-top:-2px}.top-actions{display:flex;align-items:center;gap:8px}.sync{font-size:11.5px;color:var(--muted)}.wrap{max-width:1450px;margin:auto;padding:24px 28px 80px}
/* common */
.hero{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin-bottom:18px}.hero h1{margin:0;font-size:25px}.hero p{margin:4px 0 0;color:var(--muted)}.date-pill{font-size:12px;color:var(--ink2);border:1px solid var(--line);background:rgba(255,255,255,.9);border-radius:999px;padding:8px 12px;box-shadow:0 4px 16px rgba(15,23,42,.05)}.card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--shadow);margin-bottom:14px}.pad{padding:16px}.card-title{display:flex;align-items:center;gap:8px;font-weight:850;color:var(--ink2);margin-bottom:11px}.dot{width:8px;height:8px;border-radius:50%;background:var(--brand)}.empty{padding:38px 18px;text-align:center;color:var(--muted)}.empty b{display:block;color:var(--ink);font-size:15px;margin-bottom:4px}.loading{opacity:.48}.skel{height:92px;margin:10px;border-radius:13px;background:linear-gradient(90deg,#f1f3f8 25%,#f8f9fc 37%,#f1f3f8 63%);background-size:400% 100%;animation:sh 1.3s infinite}@keyframes sh{0%{background-position:100% 0}100%{background-position:-100% 0}}
.stats{display:grid;grid-template-columns:repeat(6,minmax(125px,1fr));gap:12px;margin-bottom:16px}.stat{position:relative;overflow:hidden;padding:15px;border:1px solid var(--line);background:#fff;border-radius:15px;box-shadow:var(--shadow);cursor:pointer}.stat:after{content:"";position:absolute;width:72px;height:72px;border-radius:50%;right:-25px;top:-25px;background:var(--toneSoft,#eef1ff)}.stat:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(30,41,59,.11)}.stat .ico{width:31px;height:31px;border-radius:9px;display:grid;place-items:center;background:var(--toneSoft,#eef1ff);color:var(--tone,var(--brand));font-weight:900;margin-bottom:10px}.stat b{display:block;font-size:25px;line-height:1.05}.stat span{display:block;color:var(--muted);font-size:11.5px;margin-top:4px}.tone-brand{--tone:var(--brand);--toneSoft:#eef0ff}.tone-cyan{--tone:var(--cyan);--toneSoft:#e9fbff}.tone-red{--tone:var(--red);--toneSoft:#fff0f2}.tone-amber{--tone:var(--amber);--toneSoft:#fff7e8}.tone-green{--tone:var(--green);--toneSoft:#ebfbf4}.tone-pink{--tone:var(--pink);--toneSoft:#fff0f8}
.grid2{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(320px,.8fr);gap:14px}.quick{background:linear-gradient(135deg,#fff,#f8f8ff)}.quick-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:9px}.section-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 16px;border-bottom:1px solid var(--line);background:#fbfcff;border-radius:16px 16px 0 0}.section-head b{font-size:13.5px}.list-wrap{padding:2px 14px 14px}.mini-list{padding:6px 14px 14px}.mini-row{display:grid;grid-template-columns:92px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 4px;border-bottom:1px solid #eef2f7}.mini-row:last-child{border-bottom:0}.mini-date{font-size:12px;font-weight:800;color:var(--muted)}.mini-title{min-width:0}.mini-title b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mini-title small{color:var(--muted)}
/* records */
.filters{display:grid;grid-template-columns:minmax(220px,1.5fr) repeat(4,minmax(120px,.6fr));gap:8px}.datefilters{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.status-chips{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:12px}.status-chip{border-radius:999px;padding:7px 12px;font-size:12.5px}.status-chip.on{background:var(--ink);color:#fff;border-color:var(--ink)}.selbar{position:sticky;top:80px;z-index:20;background:linear-gradient(135deg,#17213b,#273657);color:#fff;border-radius:13px;padding:10px 12px;margin-bottom:12px;display:flex;align-items:center;gap:7px;flex-wrap:wrap;box-shadow:0 12px 28px rgba(15,23,42,.22)}.selbar button{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.13);color:#fff;font-size:12px}.selbar .dangerBatch{background:rgba(220,63,79,.9);border-color:transparent}.record-grid{display:grid;grid-template-columns:1fr;gap:0 16px}@media(min-width:1120px){.record-grid{grid-template-columns:1fr 1fr}.day{grid-column:1/-1}}
.day{font-size:12px;color:var(--muted);font-weight:850;padding:14px 2px 7px}.item{display:grid;grid-template-columns:20px 34px minmax(0,1fr);gap:9px;padding:12px 4px;border-top:1px solid #edf1f6;transition:.14s}.item:hover{background:#fbfcff}.item.sel{background:#f2f4ff}.item.done{opacity:.72}.cb{width:17px;height:17px;accent-color:var(--brand);margin-top:7px}.tick{width:29px;height:29px;border-radius:50%;padding:0;display:grid;place-items:center;margin-top:1px}.tick.on{background:#eaf9f2;border-color:#b9ead3;color:var(--green)}.tick.doing{border-color:#9bdbea;color:var(--cyan);background:#eefcff}.tick.na{opacity:.25;cursor:default}.content{font-weight:650;white-space:pre-wrap;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer}.item.open .content{-webkit-line-clamp:unset;display:block}.meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;color:var(--muted);font-size:11.5px;margin-top:6px}.tag{border-radius:999px;padding:2px 7px;font-size:10.5px;font-weight:800}.todoTag{background:#eef0ff;color:var(--brand)}.doingTag{background:#e8fbff;color:var(--cyan)}.doneTag{background:#ebfaf3;color:var(--green)}.overTag{background:#fff0f2;color:var(--red)}.dueTag{background:#fff7e8;color:var(--amber)}.note{font-size:12px;margin-top:7px;padding:7px 9px;border-left:3px solid #d5daf0;background:#f8f9fc;color:var(--ink2)}.done-note{border-left-color:#a9dfc4;background:#f0fbf6}.more{font-size:11.5px;color:var(--brand);cursor:pointer;margin-top:4px}.acts{display:flex;gap:3px;flex-wrap:wrap;margin-top:6px}
/* upcoming */
.timeline{display:grid;gap:12px}.daycard{background:#fff;border:1px solid var(--line);border-radius:15px;box-shadow:var(--shadow);overflow:hidden}.dayhead{padding:11px 14px;background:#fbfcff;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center}.dayhead strong{font-size:13.5px}.dayhead.over{background:#fff4f5;color:var(--red)}.taskline{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:10px;align-items:start;padding:12px 14px;border-bottom:1px solid #eef2f7}.taskline:last-child{border-bottom:0}.taskline .tmain b{display:block}.taskline .tmain small{color:var(--muted)}
/* files */
.filefilters{display:grid;grid-template-columns:minmax(220px,1.5fr) repeat(3,minmax(140px,.65fr));gap:8px}.files-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:14px}.file-card{border:1px solid var(--line);border-radius:14px;padding:13px;background:#fff;display:grid;grid-template-columns:44px minmax(0,1fr);gap:11px}.file-ico{width:44px;height:44px;border-radius:12px;background:#eef1ff;color:var(--brand);display:grid;place-items:center;font-weight:900}.file-card h3{font-size:13.5px;margin:0;overflow-wrap:anywhere}.file-meta{font-size:11.5px;color:var(--muted);margin-top:4px}.file-actions{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.orphan{border-top:1px dashed var(--line);padding:12px 16px}.orphan-list{display:grid;gap:6px;margin-top:8px}.orphan-row{display:flex;justify-content:space-between;gap:8px;padding:8px 10px;background:#fff8e8;border-radius:9px;font-size:12px}
/* trash */
.trash-note{padding:12px 14px;background:#fff8e8;border:1px solid #f7d99b;border-radius:12px;color:#76530d;margin-bottom:12px}.trash-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;padding:13px 16px;border-bottom:1px solid #eef2f7}.trash-row:last-child{border-bottom:0}.trash-row h3{font-size:13.5px;margin:0}.trash-meta{font-size:11.5px;color:var(--muted);margin-top:5px}.daysleft{display:inline-block;padding:2px 7px;border-radius:999px;background:#fff0f2;color:var(--red);font-size:10.5px;font-weight:850}
/* health */
.health-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}.health-num{padding:14px;border-radius:14px;background:#fff;border:1px solid var(--line);box-shadow:var(--shadow)}.health-num b{font-size:24px;display:block}.health-num.ok b{color:var(--green)}.health-num.warn b{color:var(--amber)}.health-num.bad b{color:var(--red)}.health-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.health-card{border:1px solid var(--line);border-radius:13px;padding:13px;background:#fff;display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:10px}.health-dot{width:10px;height:10px;border-radius:50%;margin-top:6px}.health-dot.ok{background:var(--green)}.health-dot.warn{background:var(--amber)}.health-dot.bad{background:var(--red)}.health-card b{font-size:13px}.health-card p{margin:2px 0 0;color:var(--muted);font-size:11.5px;overflow-wrap:anywhere}
/* drawer/dialog/toast */
.mask{position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:50}.drawer{position:fixed;right:0;top:0;bottom:0;width:min(520px,94vw);background:#fff;z-index:55;box-shadow:-18px 0 60px rgba(15,23,42,.18);display:flex;flex-direction:column}.drawer header{padding:16px 18px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}.drawer .body{padding:18px;overflow:auto;flex:1}.drawer footer{padding:13px 18px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:8px}.field{margin-bottom:15px}.field label{display:block;font-size:12.5px;font-weight:800;color:var(--ink2);margin-bottom:6px}.kv{display:grid;grid-template-columns:90px minmax(0,1fr);gap:8px;padding:5px 0;border-bottom:1px solid #f0f2f6;font-size:12px}.kv span:first-child{color:var(--muted)}.dialog{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:60;width:min(430px,92vw);background:#fff;border-radius:16px;box-shadow:var(--shadow2);overflow:hidden}.dialog header{padding:15px 17px;color:#fff;background:linear-gradient(135deg,var(--green),#28af86);font-weight:850}.dialog .inner{padding:17px}.dialog footer{padding:12px 17px;background:#fbfcfe;border-top:1px solid var(--line);display:flex;justify-content:flex-end;gap:8px}.ocr-dialog{width:min(760px,94vw)}.ocr-dialog header{background:linear-gradient(135deg,var(--brand),var(--cyan))}.ocrbox{white-space:pre-wrap;word-break:break-word;max-height:55vh;overflow:auto;background:#f7f9fc;border:1px solid var(--line);border-radius:12px;padding:13px;font:12.5px/1.75 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ink)}.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(10px);background:#172033;color:#fff;padding:10px 18px;border-radius:999px;font-size:13px;z-index:80;opacity:0;pointer-events:none;transition:.2s;box-shadow:0 10px 30px rgba(0,0,0,.2)}.toast.show{opacity:.98;transform:translateX(-50%)}.toast.err{background:var(--red)}.toast.ok{background:var(--green)}
@media(max-width:1120px){.stats{grid-template-columns:repeat(3,1fr)}.grid2{grid-template-columns:1fr}.files-grid{grid-template-columns:1fr}.filters,.filefilters{grid-template-columns:1fr 1fr}.health-grid{grid-template-columns:1fr}}
@media(max-width:760px){.shell{display:block}.sidebar{position:static;width:100%;height:auto;display:block;padding:10px 12px}.brand{padding-bottom:10px}.brand small,.side-label,.side-tools{display:none}.nav{display:flex;overflow:auto;gap:5px}.navbtn{width:auto;flex:0 0 auto}.workspace{display:block}.topbar{top:0;height:62px}.topinner{padding:0 13px}.wrap{padding:16px 12px 70px}.hero{align-items:flex-start}.date-pill{display:none}.stats{grid-template-columns:repeat(2,1fr)}.filters,.filefilters{grid-template-columns:1fr}.datefilters{grid-template-columns:1fr}.health-summary{grid-template-columns:repeat(3,1fr)}.login-shell{grid-template-columns:1fr}.login-visual{display:none}.login-card{padding:36px 24px}.taskline{grid-template-columns:32px minmax(0,1fr)}.taskline .row{grid-column:2}.trash-row{grid-template-columns:1fr}.page-title b{font-size:15px}.top-actions .sync{display:none}}
</style>
</head>
<body>
<div id="login" class="login">
  <div class="login-shell">
    <section class="login-visual"><div class="logo-box">✦</div><h1>筆記管理台 4.0</h1><p>LINE 負責快速記錄，後台負責追蹤、整理、歸檔與結案。重要資料不因一次誤按就消失。</p></section>
    <section class="login-card"><div class="sub">LUJIANG WORKSPACE</div><h2>管理者登入</h2><div class="sub" id="loginHint">請輸入密碼</div><div class="field-title">管理台密碼</div><input id="pin" type="password" placeholder="輸入密碼" autocomplete="current-password"><div style="height:12px"></div><button class="primary" id="btnLogin">登入管理台</button><div class="err" id="loginMsg"></div></section>
  </div>
</div>

<div id="app" class="hide">
<div class="shell">
  <aside class="sidebar">
    <div class="brand"><div class="brand-logo">✦</div><div><b>筆記管理台</b><small id="ver">v4.0</small></div></div>
    <div class="side-label">工作台</div>
    <div class="nav" id="mainNav">
      <button class="navbtn on" data-view="dashboard"><span class="navico">◈</span>儀表板</button>
      <button class="navbtn" data-view="records" data-status=""><span class="navico">▦</span>全部紀錄</button>
      <button class="navbtn" data-view="records" data-status="todo"><span class="navico">☐</span>未完成</button>
      <button class="navbtn" data-view="records" data-status="doing"><span class="navico">◐</span>進行中</button>
      <button class="navbtn" data-view="records" data-status="overdue"><span class="navico">!</span>逾期事項</button>
      <button class="navbtn" data-view="upcoming"><span class="navico">7</span>未來 7 天</button>
    </div>
    <div class="side-label">管理中心</div>
    <div class="nav">
      <button class="navbtn" data-view="files"><span class="navico">▣</span>檔案中心</button>
      <button class="navbtn" data-view="trash"><span class="navico">♲</span>資源回收桶</button>
      <button class="navbtn" data-view="health"><span class="navico">●</span>系統健康</button>
    </div>
    <div class="side-tools">
      <a id="btnSheet" class="hide" href="#" target="_blank" rel="noopener">▤ 開啟索引試算表</a>
      <a href="https://calendar.google.com/calendar/u/0/r" target="_blank" rel="noopener">◫ 開啟 Google 日曆</a>
      <a id="btnArchive" class="hide" href="#" target="_blank" rel="noopener">▣ 開啟歸檔資料夾</a>
      <button id="btnExport">⇩ 匯出目前紀錄 CSV</button>
    </div>
  </aside>

  <main class="workspace">
    <div class="topbar"><div class="topinner"><div class="page-title"><b id="pageTitle">今日工作總覽</b><span id="lastSync">尚未同步</span></div><div class="top-actions"><span class="sync" id="sync"></span><button id="btnRefresh">重新整理</button><button id="btnLogout">登出</button></div></div></div>
    <div class="wrap">
      <section id="view-dashboard" class="view">
        <div class="hero"><div><h1>今日工作總覽</h1><p>先看必須處理的，再回頭找完整紀錄。後台不應該自己變成另一份工作。</p></div><div class="date-pill" id="todayText"></div></div>
        <div class="stats" id="dashStats"></div>
        <div class="grid2">
          <section class="card pad quick"><div class="card-title"><span class="dot"></span>快速新增</div><textarea id="newText" placeholder="例：週五前完成核銷　／　明天早上9點課發會"></textarea><div class="quick-footer"><span class="sub">寫法與 LINE 相同；日期、期限與行事曆仍沿用既有解析規則。</span><button class="primary" id="btnCreate">新增紀錄</button></div></section>
          <section class="card"><div class="section-head"><b>近期待處理</b><button class="ghost small" data-go="upcoming">查看未來 7 天</button></div><div id="dashPriority" class="mini-list"></div></section>
        </div>
        <section class="card"><div class="section-head"><b>最近紀錄</b><button class="ghost small" data-go="records">查看全部</button></div><div id="dashRecent" class="mini-list"></div></section>
      </section>

      <section id="view-records" class="view hide">
        <div class="hero"><div><h1>工作紀錄</h1><p>搜尋、篩選、批次處理；刪除現在會先進資源回收桶。</p></div></div>
        <div class="status-chips" id="statusChips"><button class="status-chip on" data-st="">全部</button><button class="status-chip" data-st="todo">未完成</button><button class="status-chip" data-st="doing">進行中</button><button class="status-chip" data-st="overdue">逾期</button><button class="status-chip" data-st="dueToday">今天到期</button><button class="status-chip" data-st="done">完成</button><button class="status-chip" data-st="note">純筆記</button></div>
        <section class="card pad"><div class="filters"><input id="q" placeholder="搜尋內容、類型、地點、備註…"><select id="type"></select><select id="sort"><option value="newest">最新在前</option><option value="oldest">最舊在前</option><option value="due">期限優先</option><option value="status">狀態優先</option></select><input id="from" type="date"><input id="to" type="date"></div><div class="row" style="justify-content:flex-end;margin-top:8px"><button class="ghost" id="btnClear">清除條件</button></div></section>
        <div class="selbar hide" id="selbar"><b id="selCount">已選 0 筆</b><span class="grow"></span><button data-batch="done">完成</button><button data-batch="doing">進行中</button><button data-batch="task">轉待辦</button><button data-batch="note">轉筆記</button><button data-batch="del" class="dangerBatch">移到回收桶</button><button id="btnUnsel">取消選取</button></div>
        <section class="card"><div class="section-head"><label class="row" style="font-size:12.5px;color:var(--muted)"><input type="checkbox" id="selAll" class="cb">全選本頁</label><span class="sub" id="countLine"></span></div><div id="list" class="list-wrap record-grid"></div></section>
      </section>

      <section id="view-upcoming" class="view hide">
        <div class="hero"><div><h1>未來 7 天</h1><p>只看有期限且尚未完成的工作；逾期會放在最前面，不讓它悄悄沉底。</p></div><div class="date-pill" id="upcomingUndated"></div></div>
        <div id="upcomingList" class="timeline"></div>
      </section>

      <section id="view-files" class="view hide">
        <div class="hero"><div><h1>檔案中心</h1><p>LINE 收進來的檔案集中管理；大量 Drive 掃描只在你按「孤兒檔案掃描」時執行。</p></div><div class="row"><a id="filesArchiveLink" class="hide" href="#" target="_blank" rel="noopener"><button>開啟歸檔資料夾</button></a><button id="btnOrphans">孤兒檔案掃描</button></div></div>
        <section class="card pad"><div class="filefilters"><input id="fileQ" placeholder="搜尋檔名或分類"><select id="fileMonth"><option value="">所有月份</option></select><select id="fileCategory"><option value="">所有分類</option></select><select id="fileType"><option value="">所有檔案類型</option></select></div></section>
        <section class="card"><div class="section-head"><b>歸檔檔案</b><span class="sub" id="fileCount"></span></div><div id="filesList" class="files-grid"></div><div id="orphanBox" class="orphan hide"></div></section>
      </section>

      <section id="view-trash" class="view hide">
        <div class="hero"><div><h1>資源回收桶</h1><p>30 天內可以還原；永久刪除才會真正移除 Docs 段落與行事曆事件。</p></div><button class="danger" id="btnEmptyTrash">清空回收桶</button></div>
        <div class="trash-note">移到回收桶時，資料會先從一般清單隱藏。若該筆有行事曆事件，系統會暫停事件提醒並加上 🗑️ 標示；還原時恢復原標題與提醒。</div>
        <section class="card"><div class="section-head"><b>已刪除項目</b><span class="sub" id="trashCount"></span></div><div id="trashList"></div></section>
      </section>

      <section id="view-health" class="view hide">
        <div class="hero"><div><h1>系統健康中心</h1><p>先看資料層與排程，再做完整 LINE Webhook 檢查。不要把每次開頁都變成診斷大會。</p></div><div class="row"><button id="btnHealthDeep">完整檢查</button><button id="btnRepairIndex">修復索引</button></div></div>
        <div id="healthSummary" class="health-summary"></div><div id="healthGrid" class="health-grid"></div>
      </section>
    </div>
  </main>
</div>
</div>

<div id="mask" class="mask hide"></div>
<div id="drawer" class="drawer hide"><header><b>編輯紀錄</b><button id="btnCloseDrawer">關閉</button></header><div class="body"><div class="field"><label>內容</label><textarea id="edText" style="min-height:150px"></textarea></div><div class="field"><label>期限</label><input id="edDue" type="date"></div><div class="field"><label>狀態</label><select id="edState"><option value="note">📝 筆記</option><option value="todo">☐ 待辦</option><option value="doing">◐ 進行中</option></select><div class="sub" id="edStateHint"></div></div><div class="field"><label>備註</label><textarea id="edRemark"></textarea></div><div class="field" id="edDoneWrap"><label>完成說明</label><textarea id="edDoneNote"></textarea></div><div class="field"><label>資訊</label><div id="edMeta"></div></div></div><footer><button class="danger" id="btnDelOne">移到回收桶</button><div class="row"><button id="btnCancelEdit">取消</button><button class="primary" id="btnSave">儲存變更</button></div></footer></div>
<div id="dlgMask" class="mask hide"></div><div id="dlg" class="dialog hide"><header id="dlgTitle">標記完成</header><div class="inner"><label class="field-title" style="margin:0 0 6px">完成說明（可留空）</label><textarea id="dlgNote" placeholder="例：主計已收件、已回文給教育局"></textarea></div><footer><button id="dlgCancel">取消</button><button id="dlgSkip">不填說明</button><button class="primary" id="dlgOk">確定完成</button></footer></div>
<div id="ocrMask" class="mask hide"></div><div id="ocrDlg" class="dialog ocr-dialog hide"><header id="ocrTitle">文字辨識結果</header><div class="inner"><div id="ocrText" class="ocrbox"></div><div id="ocrHint" class="sub" style="margin-top:8px"></div></div><footer><button id="ocrCopy">複製文字</button><button class="primary" id="ocrClose">關閉</button></footer></div>
<div id="toast" class="toast"></div>

<script>
var S={token:'',view:'dashboard',status:'',items:[],sel:{},busy:false,editing:null,doneTarget:null,types:[],sheetUrl:'',archiveUrl:'',files:[],fileCategories:[],canMoveCategory:false,ocrText:'',trash:[]};
function $(id){return document.getElementById(id)}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function linkify(s){return esc(s).replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>')}
function toast(msg,kind){var e=$('toast');e.className='toast show'+(kind?' '+kind:'');e.textContent=msg;clearTimeout(e._t);e._t=setTimeout(function(){e.className='toast'},2800)}
window.onerror=function(msg,src,line){toast('頁面錯誤（第 '+line+' 行）：'+msg,'err');return false}
function call(fn,args,retry){return new Promise(function(resolve,reject){var r=google.script.run.withSuccessHandler(resolve).withFailureHandler(function(err){var m=(err&&err.message)||String(err);if(m.indexOf('AUTH')>=0){logoutLocal('連線已逾期，請重新登入');reject(new Error('請重新登入'));return}if(!retry){setTimeout(function(){call(fn,args,true).then(resolve,reject)},700);return}reject(new Error(m))});r[fn].apply(r,args||[])})}
function setBusy(on){var bs=document.querySelectorAll('#app button');for(var i=0;i<bs.length;i++)bs[i].disabled=on;$('sync').textContent=on?'同步中…':''}
function guard(fn){if(S.busy){toast('處理中，請稍候…');return Promise.reject(new Error('busy'))}S.busy=true;setBusy(true);return fn().then(function(r){S.busy=false;setBusy(false);return r},function(e){S.busy=false;setBusy(false);throw e})}
function syncTime(){var n=new Date();$('lastSync').textContent='最後同步 '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')}
function todayText(){var n=new Date(),w=['日','一','二','三','四','五','六'][n.getDay()];return n.getFullYear()+'/'+(n.getMonth()+1)+'/'+n.getDate()+'（'+w+'）'}

function doLogin(){var pin=$('pin').value;if(!pin)return;$('loginMsg').textContent='登入中…';call('uiLogin',[pin]).then(function(r){if(!r.ok){$('loginMsg').textContent=r.message;return}S.token=r.token;try{localStorage.setItem('noteapp_token',S.token)}catch(e){}$('loginMsg').textContent='';showApp()}).catch(function(e){$('loginMsg').textContent=e.message})}
function logoutLocal(msg){S.token='';try{localStorage.removeItem('noteapp_token')}catch(e){}$('app').classList.add('hide');$('login').classList.remove('hide');$('loginMsg').textContent=msg||''}
function showApp(){$('login').classList.add('hide');$('app').classList.remove('hide');$('todayText').textContent=todayText();goView('dashboard')}

var TITLES={dashboard:'今日工作總覽',records:'工作紀錄',upcoming:'未來 7 天',files:'檔案中心',trash:'資源回收桶',health:'系統健康中心'};
function goView(view,status){S.view=view||'dashboard';if(typeof status==='string')S.status=status;var vs=document.querySelectorAll('.view');for(var i=0;i<vs.length;i++)vs[i].classList.add('hide');$('view-'+S.view).classList.remove('hide');var ns=document.querySelectorAll('.navbtn');for(var j=0;j<ns.length;j++){var n=ns[j];var on=n.getAttribute('data-view')===S.view;if(S.view==='records'&&on&&n.hasAttribute('data-status'))on=(n.getAttribute('data-status')||'')===S.status;n.classList.toggle('on',on)}$('pageTitle').textContent=TITLES[S.view]||'筆記管理台';loadCurrent()}
function loadCurrent(){if(S.view==='dashboard')loadDashboard();else if(S.view==='records')loadRecords();else if(S.view==='upcoming')loadUpcoming();else if(S.view==='files')loadFiles();else if(S.view==='trash')loadTrash();else if(S.view==='health')loadHealth(false)}

function loadDashboard(){$('dashPriority').innerHTML='<div class="skel"></div>';$('dashRecent').innerHTML='<div class="skel"></div>';call('uiDashboard',[S.token]).then(function(s){S.sheetUrl=s.sheetUrl||'';S.archiveUrl=s.archiveUrl||'';$('ver').textContent='v'+s.version+' · '+s.total+' 筆';if(S.sheetUrl){$('btnSheet').href=S.sheetUrl;$('btnSheet').classList.remove('hide')}if(S.archiveUrl){$('btnArchive').href=S.archiveUrl;$('btnArchive').classList.remove('hide')}var cs=[['todo',s.todo,'未完成','tone-brand','☐'],['doing',s.doing,'進行中','tone-cyan','◐'],['overdue',s.overdue,'逾期','tone-red','!'],['dueToday',s.dueToday,'今天到期','tone-amber','⌛'],['upcoming',s.upcoming7,'未來7天','tone-green','7'],['trash',s.trash,'回收桶','tone-pink','♲']];var h='';cs.forEach(function(c){h+='<div class="stat '+c[3]+'" data-dash="'+c[0]+'"><div class="ico">'+c[4]+'</div><b>'+c[1]+'</b><span>'+c[2]+'</span></div>'});$('dashStats').innerHTML=h;$('dashPriority').innerHTML=miniRows(s.priority,'目前 7 天內沒有到期工作');$('dashRecent').innerHTML=miniRows(s.recent,'目前沒有紀錄');syncTime()}).catch(function(e){toast(e.message,'err')})}
function miniRows(items,empty){if(!items||!items.length)return '<div class="empty"><b>'+esc(empty)+'</b></div>';var h='';items.forEach(function(it){h+='<div class="mini-row"><div class="mini-date">'+esc(it.due||it.date)+'</div><div class="mini-title"><b>'+esc(it.content)+'</b><small>'+esc(it.type)+' · '+esc(it.state==='doing'?'進行中':it.state==='todo'?'待辦':it.state==='done'?'完成':'筆記')+'</small></div><button class="ghost small" data-open="'+esc(it.uid)+'">查看</button></div>'});return h}

function recordFilters(){return{q:$('q').value,status:S.status,type:$('type').value,sort:$('sort').value,from:$('from').value,to:$('to').value}}
function setStatus(st){S.status=st||'';var bs=document.querySelectorAll('#statusChips .status-chip');for(var i=0;i<bs.length;i++)bs[i].classList.toggle('on',(bs[i].getAttribute('data-st')||'')===S.status)}
function loadRecords(){setStatus(S.status);var box=$('list');if(S.items.length)box.classList.add('loading');else box.innerHTML='<div class="skel"></div><div class="skel"></div>';call('uiStats',[S.token]).then(function(s){var sel=$('type'),cur=sel.value||'';var h='<option value="">所有類型</option>';s.types.forEach(function(t){h+='<option value="'+esc(t)+'">'+esc(t)+'</option>'});sel.innerHTML=h;sel.value=cur;S.sheetUrl=s.sheetUrl||S.sheetUrl;S.archiveUrl=s.archiveUrl||S.archiveUrl;if(S.sheetUrl){$('btnSheet').href=S.sheetUrl;$('btnSheet').classList.remove('hide')}if(S.archiveUrl){$('btnArchive').href=S.archiveUrl;$('btnArchive').classList.remove('hide')}}).catch(function(){});call('uiQuery',[S.token,recordFilters()]).then(function(r){box.classList.remove('loading');S.items=r.items||[];$('countLine').textContent='顯示 '+r.shown+' / '+r.total+' 筆';var alive={};S.items.forEach(function(it){if(S.sel[it.uid])alive[it.uid]=true});S.sel=alive;renderRecords();syncTime()}).catch(function(e){box.classList.remove('loading');box.innerHTML='<div class="empty"><b>載入失敗</b>'+esc(e.message)+'</div>'})}
function typeColor(t){var p=['#4f46e5','#0891b2','#059669','#d97706','#db2777','#7c3aed','#0284c7','#65a30d'];var h=0;for(var i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))%9973;return p[h%p.length]}
function renderRecords(){var box=$('list');if(!S.items.length){box.innerHTML='<div class="empty"><b>沒有符合條件的紀錄</b>換個關鍵字或清除條件</div>';updateSelbar();return}var h='',day='';S.items.forEach(function(it){if(it.date!==day){day=it.date;h+='<div class="day">'+esc(day)+'（'+esc(it.weekday)+'）</div>'}h+=recordHtml(it)});box.innerHTML=h;updateSelbar()}
function recordHtml(it){var st=it.state||'note',done=st==='done',doing=st==='doing',open=st==='todo'||doing,sel=!!S.sel[it.uid],c=typeColor(it.type||'筆記');var meta='<span>'+esc(it.time)+'</span><span class="tag" style="background:'+c+'18;color:'+c+'">'+esc(it.type)+'</span>';if(st==='todo')meta+='<span class="tag todoTag">待辦</span>';if(doing)meta+='<span class="tag doingTag">進行中</span>';if(done)meta+='<span class="tag doneTag">完成</span>';if(it.overdue)meta+='<span class="tag overTag">逾期</span>';else if(it.due&&open)meta+='<span class="tag dueTag">期限 '+esc(it.due)+'</span>';if(it.location)meta+='<span>@'+esc(it.location)+'</span>';if(it.attach)meta+='<a href="'+esc(it.attach)+'" target="_blank" rel="noopener">附件</a>';if(it.docUrl)meta+='<a href="'+esc(it.docUrl)+'" target="_blank" rel="noopener">文件</a>';var tick=done?'<button class="tick on" data-act="reopen" data-uid="'+it.uid+'">✓</button>':open?'<button class="tick '+(doing?'doing':'')+'" data-act="done" data-uid="'+it.uid+'">✓</button>':'<button class="tick na">✓</button>';var acts='<div class="acts"><button class="ghost small" data-act="edit" data-uid="'+it.uid+'">編輯</button>'+(done?'':st==='todo'?'<button class="ghost small" data-act="todoing" data-uid="'+it.uid+'">進行中</button>':doing?'<button class="ghost small" data-act="totask" data-uid="'+it.uid+'">回待辦</button>':open?'':'<button class="ghost small" data-act="totask" data-uid="'+it.uid+'">列入待辦</button>')+(!done&&open?'<button class="ghost small" data-act="tonote" data-uid="'+it.uid+'">轉筆記</button>':'')+'<button class="ghost small danger" data-act="del" data-uid="'+it.uid+'">刪除</button></div>';var notes='';if(String(it.content||'').length>70||String(it.content||'').indexOf('\n')>=0)notes+='<div class="more" data-act="expand" data-uid="'+it.uid+'">展開全文 ▾</div>';if(it.remark)notes+='<div class="note">📌 '+linkify(it.remark)+'</div>';if(done&&it.doneNote)notes+='<div class="note done-note">✓ '+linkify(it.doneNote)+'</div>';return '<div class="item'+(done?' done':'')+(sel?' sel':'')+'" data-row="'+it.uid+'"><input type="checkbox" class="cb" data-sel="'+it.uid+'"'+(sel?' checked':'')+'>'+tick+'<div><div class="content" data-act="expand" data-uid="'+it.uid+'">'+linkify(it.content)+'</div>'+notes+'<div class="meta">'+meta+'</div>'+acts+'</div></div>'}
function selectedUids(){return Object.keys(S.sel)}function updateSelbar(){var n=selectedUids().length;$('selbar').classList.toggle('hide',n===0);$('selCount').textContent='已選 '+n+' 筆';var all=S.items.length&&S.items.every(function(it){return !!S.sel[it.uid]});$('selAll').checked=!!all}
function act(fn,args){var top=window.pageYOffset||0;return guard(function(){return call(fn,args)}).then(function(r){toast(r.message||'完成',r&&r.ok===false?'err':'ok');if(S.view==='records')loadRecords();else loadCurrent();setTimeout(function(){window.scrollTo(0,top)},0)}).catch(function(e){if(e.message!=='busy')toast(e.message,'err')})}
function doBatch(a){var u=selectedUids();if(!u.length)return;if(a==='done'){askDone({batch:true,n:u.length});return}var names={del:'移到資源回收桶',task:'轉為待辦',note:'轉為筆記',doing:'轉為進行中'};if(!confirm('確定把這 '+u.length+' 筆'+names[a]+'？'+(a==='del'?'\n\n30 天內可在資源回收桶還原。':'')))return;guard(function(){return call('uiBatch',[S.token,a,u])}).then(function(r){toast(r.message,r.ok?'ok':'err');S.sel={};loadRecords()}).catch(function(e){if(e.message!=='busy')toast(e.message,'err')})}

function loadUpcoming(){$('upcomingList').innerHTML='<div class="skel"></div>';call('uiUpcoming',[S.token]).then(function(r){$('upcomingUndated').textContent='另有 '+r.undated+' 筆未設定期限';if(!r.items.length){$('upcomingList').innerHTML='<div class="card empty"><b>未來 7 天沒有到期工作</b></div>';return}var groups={};r.items.forEach(function(it){var key=it.overdue?'__over__':it.due;if(!groups[key])groups[key]=[];groups[key].push(it)});var keys=Object.keys(groups).sort(function(a,b){if(a==='__over__')return -1;if(b==='__over__')return 1;return a.localeCompare(b)}),h='';keys.forEach(function(k){var label=k==='__over__'?'逾期未結':dateLabel(k);h+='<div class="daycard"><div class="dayhead '+(k==='__over__'?'over':'')+'"><strong>'+esc(label)+'</strong><span class="sub">'+groups[k].length+' 項</span></div>';groups[k].forEach(function(it){h+='<div class="taskline"><button class="tick '+(it.state==='doing'?'doing':'')+'" data-upact="done" data-uid="'+it.uid+'">✓</button><div class="tmain"><b>'+esc(it.content)+'</b><small>'+esc(it.type)+(it.remark?' · '+esc(it.remark):'')+'</small></div><div class="row"><button class="ghost small" data-upact="edit" data-uid="'+it.uid+'">編輯</button></div></div>'});h+='</div>'});$('upcomingList').innerHTML=h;syncTime()}).catch(function(e){$('upcomingList').innerHTML='<div class="card empty"><b>載入失敗</b>'+esc(e.message)+'</div>'})}
function dateLabel(s){var d=new Date(s+'T00:00:00'),n=new Date();n.setHours(0,0,0,0);var diff=Math.round((d-n)/86400000);var w=['日','一','二','三','四','五','六'][d.getDay()];if(diff===0)return '今天 · '+s+'（'+w+'）';if(diff===1)return '明天 · '+s+'（'+w+'）';return s+'（'+w+'）'}

function fileFilters(){return{q:$('fileQ').value,month:$('fileMonth').value,category:$('fileCategory').value,fileType:$('fileType').value}}
function loadFiles(){$('filesList').innerHTML='<div class="skel"></div>';call('uiFiles',[S.token,fileFilters()]).then(function(r){S.files=r.items||[];S.fileCategories=r.moveCategories||[];S.canMoveCategory=!!r.canMoveCategory;$('fileCount').textContent='共 '+r.total+' 筆';if(r.archiveUrl){$('filesArchiveLink').href=r.archiveUrl;$('filesArchiveLink').classList.remove('hide');$('btnArchive').href=r.archiveUrl;$('btnArchive').classList.remove('hide')}fillSelect('fileMonth',r.months,'所有月份');fillSelect('fileCategory',r.categories,'所有分類');fillSelect('fileType',r.fileTypes,'所有檔案類型');if(!S.files.length){$('filesList').innerHTML='<div class="empty"><b>沒有符合條件的檔案</b></div>';return}var h='';S.files.forEach(function(f){var ico={PDF:'PDF',Word:'W',試算表:'X',簡報:'P',圖片:'IMG',影片:'VID',音訊:'AUD',其他:'FILE'}[f.fileType]||'FILE';h+='<div class="file-card"><div class="file-ico">'+ico+'</div><div><h3>'+esc(f.fileName||f.content)+'</h3><div class="file-meta">'+esc(f.category)+' · '+esc(f.fileType)+(f.fileSize?' · '+esc(f.fileSize):'')+' · '+esc(f.date)+' '+esc(f.time)+'</div><div class="file-actions">'+(f.attach?'<a href="'+esc(f.attach)+'" target="_blank" rel="noopener"><button class="small">開啟檔案</button></a>':'')+'<button class="small" data-fileact="rename" data-uid="'+f.uid+'">改檔名</button>'+(S.canMoveCategory?'<button class="small" data-fileact="move" data-uid="'+f.uid+'">移動分類</button>':'')+(f.ocrCapable?'<button class="small" data-fileact="ocr" data-uid="'+f.uid+'">文字辨識</button>':'')+'</div></div></div>'});$('filesList').innerHTML=h;syncTime()}).catch(function(e){$('filesList').innerHTML='<div class="empty"><b>載入失敗</b>'+esc(e.message)+'</div>'})}
function fillSelect(id,items,first){var s=$(id),cur=s.value,h='<option value="">'+first+'</option>';(items||[]).forEach(function(x){h+='<option value="'+esc(x)+'">'+esc(x)+'</option>'});s.innerHTML=h;s.value=cur}
function scanOrphans(){if(!confirm('孤兒檔案掃描會逐層讀取歸檔資料夾，最多掃描 500 個檔案。現在執行？'))return;$('orphanBox').classList.remove('hide');$('orphanBox').innerHTML='掃描中…';guard(function(){return call('uiFindOrphanFiles',[S.token])}).then(function(r){if(!r.ok){$('orphanBox').innerHTML='<b>掃描失敗：</b>'+esc(r.message);return}var h='<b>孤兒檔案掃描：</b>已掃描 '+r.scanned+' 個檔案'+(r.capped?'（已達本次上限）':'')+'。';if(!r.items.length)h+='<div class="sub">沒有發現缺少索引對應的檔案。</div>';else{h+='<div class="sub">下列檔案存在 Drive，但索引中找不到對應紀錄；請人工確認後再處理。</div><div class="orphan-list">';r.items.forEach(function(x){h+='<div class="orphan-row"><span>'+esc(x.name)+' · '+esc(x.folder)+'</span><a href="'+esc(x.url)+'" target="_blank" rel="noopener">開啟</a></div>'});h+='</div>'}$('orphanBox').innerHTML=h}).catch(function(e){$('orphanBox').innerHTML='<b>掃描失敗：</b>'+esc(e.message)});}

function loadTrash(){$('trashList').innerHTML='<div class="skel"></div>';call('uiTrashList',[S.token]).then(function(r){S.trash=r.items||[];$('trashCount').textContent='共 '+S.trash.length+' 筆 · 保留 '+r.retentionDays+' 天';if(!S.trash.length){$('trashList').innerHTML='<div class="empty"><b>資源回收桶是空的</b></div>';return}var h='';S.trash.forEach(function(it){h+='<div class="trash-row"><div><h3>'+esc(it.content)+'</h3><div class="trash-meta">'+esc(it.type)+' · 刪除於 '+esc(it.deletedAt)+' · <span class="daysleft">約 '+it.trashDaysLeft+' 天後永久清除</span></div></div><div class="row"><button class="good small" data-trashact="restore" data-uid="'+it.uid+'">還原</button><button class="danger small" data-trashact="purge" data-uid="'+it.uid+'">永久刪除</button></div></div>'});$('trashList').innerHTML=h;syncTime()}).catch(function(e){$('trashList').innerHTML='<div class="empty"><b>載入失敗</b>'+esc(e.message)+'</div>'})}

function loadHealth(deep){$('healthGrid').innerHTML='<div class="skel"></div>';call('uiHealth',[S.token,!!deep]).then(function(r){var s=r.summary||{ok:0,warn:0,bad:0};$('healthSummary').innerHTML='<div class="health-num ok"><b>'+s.ok+'</b><span>正常</span></div><div class="health-num warn"><b>'+s.warn+'</b><span>提醒</span></div><div class="health-num bad"><b>'+s.bad+'</b><span>異常</span></div>';var h='';(r.checks||[]).forEach(function(c){h+='<div class="health-card"><span class="health-dot '+c.level+'"></span><div><b>'+esc(c.label)+'</b><p>'+esc(c.detail)+'</p></div><div>'+(c.action==='repairIndex'?'<button class="small" data-healthact="repairIndex">修復</button>':c.action==='installMaintenance'?'<button class="small" data-healthact="installMaintenance">安裝排程</button>':'')+'</div></div>'});$('healthGrid').innerHTML=h;$('ver').textContent='v'+r.version;syncTime()}).catch(function(e){$('healthGrid').innerHTML='<div class="card empty"><b>健檢失敗</b>'+esc(e.message)+'</div>'})}

function doCreate(){var el=$('newText'),t=el.value.trim();if(!t){toast('請先輸入內容');return}guard(function(){return call('uiCreate',[S.token,t])}).then(function(r){toast(r.message||'已新增',r.ok?'ok':'err');if(r.ok){el.value='';loadDashboard()}}).catch(function(e){if(e.message!=='busy')toast(e.message,'err')})}
function askDone(target){S.doneTarget=target;$('dlgNote').value='';$('dlgTitle').textContent=target.batch?'標記完成（'+target.n+' 筆）':'標記完成';$('dlgMask').classList.remove('hide');$('dlg').classList.remove('hide');setTimeout(function(){$('dlgNote').focus()},50)}function closeDone(){S.doneTarget=null;$('dlgMask').classList.add('hide');$('dlg').classList.add('hide')}function submitDone(note){var t=S.doneTarget;closeDone();if(!t)return;if(t.batch){var u=selectedUids();guard(function(){return call('uiBatch',[S.token,'done',u,note])}).then(function(r){toast(r.message,r.ok?'ok':'err');S.sel={};loadRecords()}).catch(function(e){if(e.message!=='busy')toast(e.message,'err')})}else act('uiComplete',[S.token,t.uid,note])}
function findItem(uid){for(var i=0;i<S.items.length;i++)if(S.items[i].uid===uid)return S.items[i];return null}
function openEdit(uid){var it=findItem(uid);if(!it){call('uiGet',[S.token,uid]).then(function(r){if(r&&r.ok){S.items.push(r);openEdit(uid)}});return}S.editing=uid;var st=it.state||'note';$('edText').value=it.content;$('edDue').value=it.due||'';$('edRemark').value=it.remark||'';$('edDoneNote').value=it.doneNote||'';$('edState').value=st==='done'?'todo':st;$('edState').disabled=st==='done';$('edStateHint').textContent=st==='done'?'已完成項目要先還原，才能改狀態。':'進行中仍算未完成。';$('edDoneWrap').classList.toggle('hide',st!=='done');var names={done:'已完成',doing:'進行中',todo:'待辦',note:'筆記'},rows=[['建立時間',it.date+' '+it.time],['類型',it.type],['狀態',names[st]]];if(it.doneAt)rows.push(['完成時間',it.doneAt]);if(it.location)rows.push(['地點',it.location]);var h='';rows.forEach(function(r){h+='<div class="kv"><span>'+esc(r[0])+'</span><span>'+esc(r[1])+'</span></div>'});if(it.docUrl)h+='<div class="kv"><span>來源</span><span><a href="'+esc(it.docUrl)+'" target="_blank" rel="noopener">開啟 Google Docs</a></span></div>';if(it.attach)h+='<div class="kv"><span>附件</span><span><a href="'+esc(it.attach)+'" target="_blank" rel="noopener">開啟檔案</a></span></div>';$('edMeta').innerHTML=h;$('mask').classList.remove('hide');$('drawer').classList.remove('hide')}
function closeEdit(){S.editing=null;$('mask').classList.add('hide');$('drawer').classList.add('hide')}function saveEdit(){if(!S.editing)return;var uid=S.editing,d={text:$('edText').value,due:$('edDue').value,remark:$('edRemark').value,state:$('edState').disabled?undefined:$('edState').value};if(!$('edDoneWrap').classList.contains('hide'))d.doneNote=$('edDoneNote').value;guard(function(){return call('uiSave',[S.token,uid,d])}).then(function(r){toast(r.message||'已儲存',r.ok?'ok':'err');if(r.ok){closeEdit();loadCurrent()}}).catch(function(e){if(e.message!=='busy')toast(e.message,'err')})}
function exportCsv(){if(!S.items.length){toast('請先到「工作紀錄」載入要匯出的資料');return}function c(v){var s=String(v==null?'':v).replace(/"/g,'""');return '"'+s+'"'}var rows=[['日期','時間','類型','狀態','內容','期限','地點','備註','完成說明','附件']],nm={note:'筆記',todo:'待辦',doing:'進行中',done:'已完成'};S.items.forEach(function(it){rows.push([it.date,it.time,it.type,nm[it.state]||it.state,it.content,it.due,it.location,it.remark,it.doneNote,it.attach])});var data='\ufeff'+rows.map(function(r){return r.map(c).join(',')}).join('\r\n'),blob=new Blob([data],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a'),d=new Date();a.href=url;a.download='筆記管理台_'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast('已匯出 '+S.items.length+' 筆','ok')}

$('btnLogin').addEventListener('click',doLogin);$('pin').addEventListener('keydown',function(e){if(e.key==='Enter')doLogin()});$('btnLogout').addEventListener('click',function(){call('uiLogout',[S.token]).catch(function(){});logoutLocal('已登出')});$('btnRefresh').addEventListener('click',loadCurrent);$('btnCreate').addEventListener('click',doCreate);$('newText').addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='Enter')doCreate()});$('btnExport').addEventListener('click',exportCsv);
document.addEventListener('click',function(e){var n=e.target.closest('.navbtn');if(n){goView(n.getAttribute('data-view'),n.hasAttribute('data-status')?(n.getAttribute('data-status')||''):undefined);return}var g=e.target.closest('[data-go]');if(g){goView(g.getAttribute('data-go'));return}var d=e.target.closest('[data-dash]');if(d){var x=d.getAttribute('data-dash');if(x==='upcoming')goView('upcoming');else if(x==='trash')goView('trash');else goView('records',x);return}var o=e.target.closest('[data-open]');if(o){goView('records','');setTimeout(function(){openEdit(o.getAttribute('data-open'))},500);return}});
var rt=null;$('q').addEventListener('input',function(){clearTimeout(rt);rt=setTimeout(loadRecords,350)});['type','sort','from','to'].forEach(function(id){$(id).addEventListener('change',loadRecords)});$('statusChips').addEventListener('click',function(e){var b=e.target.closest('[data-st]');if(b){setStatus(b.getAttribute('data-st')||'');loadRecords()}});$('btnClear').addEventListener('click',function(){$('q').value='';$('type').value='';$('sort').value='newest';$('from').value='';$('to').value='';setStatus('');loadRecords()});$('selAll').addEventListener('change',function(e){S.sel={};if(e.target.checked)S.items.forEach(function(it){S.sel[it.uid]=true});renderRecords()});$('btnUnsel').addEventListener('click',function(){S.sel={};renderRecords()});$('selbar').addEventListener('click',function(e){var b=e.target.closest('[data-batch]');if(b)doBatch(b.getAttribute('data-batch'))});$('list').addEventListener('change',function(e){var c=e.target.closest('[data-sel]');if(c){if(c.checked)S.sel[c.getAttribute('data-sel')]=true;else delete S.sel[c.getAttribute('data-sel')];renderRecords()}});$('list').addEventListener('click',function(e){var b=e.target.closest('[data-act]');if(!b)return;var uid=b.getAttribute('data-uid'),a=b.getAttribute('data-act');if(a==='expand'){if(e.target.tagName==='A')return;var row=e.target.closest('.item');if(row){var op=row.classList.toggle('open'),m=row.querySelector('.more');if(m)m.textContent=op?'收合 ▴':'展開全文 ▾'}return}if(a==='edit')openEdit(uid);else if(a==='done')askDone({uid:uid});else if(a==='reopen')act('uiReopen',[S.token,uid]);else if(a==='tonote')act('uiSetState',[S.token,uid,'note']);else if(a==='totask')act('uiSetState',[S.token,uid,'todo']);else if(a==='todoing')act('uiSetState',[S.token,uid,'doing']);else if(a==='del'&&confirm('移到資源回收桶？\n\n30 天內可還原。'))act('uiDelete',[S.token,uid])});
$('upcomingList').addEventListener('click',function(e){var b=e.target.closest('[data-upact]');if(!b)return;var uid=b.getAttribute('data-uid');if(b.getAttribute('data-upact')==='done')askDone({uid:uid});else{call('uiGet',[S.token,uid]).then(function(r){if(r&&r.ok){S.items=[r];openEdit(uid)}})}});
var ft=null;$('fileQ').addEventListener('input',function(){clearTimeout(ft);ft=setTimeout(loadFiles,350)});['fileMonth','fileCategory','fileType'].forEach(function(id){$(id).addEventListener('change',loadFiles)});$('filesList').addEventListener('click',function(e){var b=e.target.closest('[data-fileact]');if(!b)return;var uid=b.getAttribute('data-uid'),actn=b.getAttribute('data-fileact'),it=S.files.filter(function(x){return x.uid===uid})[0];if(actn==='rename'){var name=prompt('新的檔名：',it?it.fileName:'');if(!name)return;guard(function(){return call('uiFileRename',[S.token,uid,name])}).then(function(r){toast(r.message,r.ok?'ok':'err');if(r.ok)loadFiles()}).catch(function(er){if(er.message!=='busy')toast(er.message,'err')});return}if(actn==='move'){var tip='請輸入要移到的分類：\n'+S.fileCategories.join('、'),cat=prompt(tip,it?it.category:'');if(!cat||cat===(it&&it.category))return;guard(function(){return call('uiFileMoveCategory',[S.token,uid,cat.trim()])}).then(function(r){toast(r.message,r.ok?'ok':'err');if(r.ok)loadFiles()}).catch(function(er){if(er.message!=='busy')toast(er.message,'err')});return}if(actn==='ocr'){guard(function(){return call('uiFileOcr',[S.token,uid])}).then(function(r){if(!r.ok){toast(r.message,'err');return}S.ocrText=r.text||'';$('ocrTitle').textContent='文字辨識｜'+(r.fileName||'檔案');$('ocrText').textContent=S.ocrText||'（沒有辨識到文字）';$('ocrHint').textContent=r.message||'';$('ocrMask').classList.remove('hide');$('ocrDlg').classList.remove('hide')}).catch(function(er){if(er.message!=='busy')toast(er.message,'err')})}});$('btnOrphans').addEventListener('click',scanOrphans);
$('trashList').addEventListener('click',function(e){var b=e.target.closest('[data-trashact]');if(!b)return;var uid=b.getAttribute('data-uid'),a=b.getAttribute('data-trashact');if(a==='restore')act('uiTrashRestore',[S.token,uid]);else if(a==='purge'&&confirm('永久刪除這一筆？\n\n這次無法復原，Docs 段落與行事曆事件也會一併移除。'))act('uiTrashPurge',[S.token,uid])});$('btnEmptyTrash').addEventListener('click',function(){if(!confirm('確定清空資源回收桶？\n\n這是永久刪除，無法復原。'))return;guard(function(){return call('uiEmptyTrash',[S.token])}).then(function(r){toast(r.message,r.ok?'ok':'err');loadTrash()}).catch(function(e){if(e.message!=='busy')toast(e.message,'err')})});
$('btnHealthDeep').addEventListener('click',function(){loadHealth(true)});$('btnRepairIndex').addEventListener('click',function(){if(!confirm('執行索引修復？這個動作會保留期限、完成時間與回收桶資料。'))return;guard(function(){return call('uiRepairIndex',[S.token])}).then(function(r){toast(r.message,'ok');loadHealth(false)}).catch(function(e){if(e.message!=='busy')toast(e.message,'err')})});$('healthGrid').addEventListener('click',function(e){var b=e.target.closest('[data-healthact]');if(!b)return;var a=b.getAttribute('data-healthact');if(a==='repairIndex')$('btnRepairIndex').click();else if(a==='installMaintenance')guard(function(){return call('uiInstallMaintenance',[S.token])}).then(function(r){toast(r.message,'ok');loadHealth(false)}).catch(function(er){if(er.message!=='busy')toast(er.message,'err')})});
$('dlgCancel').addEventListener('click',closeDone);$('dlgMask').addEventListener('click',closeDone);$('dlgSkip').addEventListener('click',function(){submitDone('')});$('dlgOk').addEventListener('click',function(){submitDone($('dlgNote').value.trim())});function closeOcr(){$('ocrMask').classList.add('hide');$('ocrDlg').classList.add('hide')}$('ocrClose').addEventListener('click',closeOcr);$('ocrMask').addEventListener('click',closeOcr);$('ocrCopy').addEventListener('click',function(){if(!S.ocrText)return;var done=function(){toast('辨識文字已複製','ok')};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(S.ocrText).then(done).catch(function(){toast('瀏覽器拒絕剪貼簿權限','err')})}else{var t=document.createElement('textarea');t.value=S.ocrText;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(e){toast('複製失敗','err')}document.body.removeChild(t)}});$('btnCloseDrawer').addEventListener('click',closeEdit);$('btnCancelEdit').addEventListener('click',closeEdit);$('mask').addEventListener('click',closeEdit);$('btnSave').addEventListener('click',saveEdit);$('btnDelOne').addEventListener('click',function(){if(!S.editing)return;if(!confirm('移到資源回收桶？30 天內可還原。'))return;var uid=S.editing;closeEdit();act('uiDelete',[S.token,uid])});document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;if(!$('ocrDlg').classList.contains('hide'))closeOcr();else if(S.doneTarget)closeDone();else if(S.editing)closeEdit()});
call('uiHint',[]).then(function(h){if(h&&h.hint)$('loginHint').textContent=h.hint}).catch(function(e){$('loginMsg').textContent='連不上伺服器：'+e.message});(function(){var saved='';try{saved=localStorage.getItem('noteapp_token')||''}catch(e){}if(!saved)return;S.token=saved;call('uiStats',[S.token]).then(function(){showApp()}).catch(function(){logoutLocal('')})})();
</script>
</body>
</html>
`;

/* ============================================================
 * 4.0 核心邏輯快速測試（不修改資料）
 * ============================================================ */
function testV40Core() {
  const lines = ['=== 4.0 核心邏輯測試 ==='];
  let pass = 0, total = 0;
  function check(name, got, expected) {
    total++;
    const ok = got === expected;
    if (ok) pass++;
    lines.push((ok ? '✅ ' : '❌ ') + name + (ok ? '' : '｜得到：' + got + '｜預期：' + expected));
  }
  check('Drive /d/ URL 解析', parseDriveFileId_('https://drive.google.com/file/d/1ABC_def-XYZ987654321/view'), '1ABC_def-XYZ987654321');
  check('Drive ?id= URL 解析', parseDriveFileId_('https://drive.google.com/open?id=1ABC_def-XYZ987654321'), '1ABC_def-XYZ987654321');
  const meta = archiveMetaFromRecord_({ content: '📎 [研習通知] 20260815-143012_通知.pdf（1.2 MB）', attach: '', created: new Date(2026,7,15) });
  check('檔案分類解析', meta.category, '研習通知');
  check('檔案類型解析', meta.fileType, 'PDF');
  check('檔名解析', meta.name, '20260815-143012_通知.pdf');
  lines.push('', pass + ' / ' + total + ' 通過');
  const out = lines.join('\n');
  console.log(out);
  return out;
}

/* ============================================================
 * 十二、測試工具
 * ============================================================ */

/**
 * [3.1 新] 歸檔檔名規則測試。不碰 Drive、不碰 LINE，可以隨時執行。
 */
function testArchiveNaming() {
  const date = new Date(2026, 7, 15, 14, 30, 12);   // 2026-08-15 14:30:12
  const cases = [
    {
      name: 'file 保留原檔名與副檔名',
      msg: { type: 'file', fileName: '115學年度課程計畫.pdf' },
      kind: MEDIA_KIND.file,
      mime: 'application/pdf',
      expect: '20260815-143012_115學年度課程計畫.pdf'
    },
    {
      name: 'image 依 MIME 補副檔名',
      msg: { type: 'image' },
      kind: MEDIA_KIND.image,
      mime: 'image/jpeg',
      expect: '20260815-143012_圖片.jpg'
    },
    {
      name: 'audio 未知 MIME 時退回型態預設副檔名',
      msg: { type: 'audio' },
      kind: MEDIA_KIND.audio,
      mime: 'application/octet-stream',
      expect: '20260815-143012_語音.m4a'
    },
    {
      name: '檔名中的斜線與冒號會被換掉',
      msg: { type: 'file', fileName: '會議紀錄 8/15: 課發會.docx' },
      kind: MEDIA_KIND.file,
      mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      expect: '20260815-143012_會議紀錄 8_15_ 課發會.docx'
    },
    {
      name: '沒有副檔名的 file 由 MIME 補上',
      msg: { type: 'file', fileName: '無副檔名檔' },
      kind: MEDIA_KIND.file,
      mime: 'application/zip',
      expect: '20260815-143012_無副檔名檔.zip'
    }
  ];

  const lines = ['=== 歸檔檔名測試 ==='];
  let pass = 0;
  cases.forEach(function (c) {
    const fakeBlob = { getContentType: function () { return c.mime; } };
    const got = buildArchiveName_(c.msg, c.kind, date, fakeBlob);
    const ok = got === c.expect;
    if (ok) pass++;
    lines.push((ok ? '✅ ' : '❌ ') + c.name + '\n　　得到：' + got + (ok ? '' : '\n　　預期：' + c.expect));
  });
  lines.push('', pass + ' / ' + cases.length + ' 通過');

  const out = lines.join('\n');
  console.log(out);
  return out;
}

/**
 * [3.2 新] 公務分類與公文抽日期的迴歸測試。
 * 不碰 Drive、不碰 LINE，改規則後隨時可以跑一次確認沒踩到別條。
 */
/**
 * [3.3 新] 待辦判斷的迴歸測試。
 * 例子多半直接取自實際被誤判的內容——規則改動後跑一次，
 * 才不會為了修一個誤判而弄壞另外三個。
 */
function testTaskDetection() {
  const notes = [
    'https://script.google.com/macros/s/AKfycbwUKYLSXsu',
    'https://moocs.moe.edu.tw/moocs/#/course/search?key',
    '白惠綿(0988129562)，鷺江短代。可能8/11日或8/13來考 邱瑾彤(0966792317)',
    '李翊豪(比較有經驗)、王柏勛(帶體育有經驗，班級比較沒經驗)、邱瑾彤(帶童軍很有經驗跟熱情)',
    '這樣可以ㄉ嗎',
    '以下十題適合用於「國小五年級導師代理教師」口試，兼顧數學教學、班級經營、親師溝通及特殊教育需求。',
    '家長入校參觀時間是8/30(日)下午14:00-17:00',
    '0912345678',
    '這場研習很重要',
    '我覺得這個做法比較好'
  ];

  const tasks = [
    '週五前完成核銷',
    '明天整理代理教師資料',
    '記得跟主計核對經費',
    '要影印課發會資料20份',
    '預約9/19新北市政府507會議室辦理頒獎典禮',
    '聯絡邱老師確認代課時間',
    '截止8/20前繳交課程計畫',
    '通知各學年填報教科書選用表',
    '待辦：盤點體育器材'
  ];

  const lines = ['=== 待辦判斷測試 ==='];
  let pass = 0;
  const total = notes.length + tasks.length;

  notes.forEach(function (t) {
    const got = looksLikeTask_(t);
    if (!got) pass++;
    lines.push((got ? '❌ ' : '✅ ') + '筆記　' + t.slice(0, 34));
  });
  tasks.forEach(function (t) {
    const got = looksLikeTask_(t);
    if (got) pass++;
    lines.push((got ? '✅ ' : '❌ ') + '待辦　' + t.slice(0, 34));
  });

  lines.push('', pass + ' / ' + total + ' 通過');
  const out = lines.join('\n');
  console.log(out);
  return out;
}

function testDocParsing() {
  const now = new Date(2026, 7, 15);          // 2026-08-15
  const notice = [
    '新北市政府教育局 函',
    '檔　號：',
    '發文日期：中華民國115年8月10日',
    '發文字號：新北教研字第1150000000號',
    '速別：普通件',
    '主旨：檢送本市115學年度「課程領導人培訓」研習實施計畫1份，請貴校鼓勵教師踴躍報名參加，請查照。',
    '說明：',
    '一、研習時間：115年9月19日（星期六）上午9時至下午4時。',
    '二、地點：新北市政府507會議室。',
    '三、報名截止日期：115年9月10日。'
  ].join('\n');

  const lines = ['=== 分類與公文解析測試 ==='];
  let pass = 0;
  let total = 0;

  function check(label, got, want) {
    total++;
    const ok = String(got) === String(want);
    if (ok) pass++;
    lines.push((ok ? '✅ ' : '❌ ') + label + '　得到：' + got + (ok ? '' : '　應為：' + want));
  }

  // 分類
  check('檔名分類-研習通知',
    classifyArchive_('20260815-143012_課程領導人培訓研習通知.pdf', '', 'application/pdf').name, '研習通知');
  check('內文分類-研習通知',
    classifyArchive_('20260815-143012_圖片.jpg', notice, 'image/jpeg').name, '研習通知');
  check('分類-經費核銷',
    classifyArchive_('115年度校外教學經費核銷單.xlsx', '', 'application/vnd.ms-excel').name, '經費核銷');
  check('分類-教師人事',
    classifyArchive_('代理教師甄選簡章.pdf', '', 'application/pdf').name, '教師人事');
  check('純公文用語才落到公文',
    classifyArchive_('來函.pdf', '受文者：本校\n發文字號：新北教字第115號\n正本：如行文單位', 'application/pdf').name, '公文');
  check('無關鍵字的照片歸照片',
    classifyArchive_('20260815-143012_圖片.jpg', '', 'image/jpeg').name, ARCHIVE.PHOTO_CATEGORY);

  // 公文抽日期
  const ev = extractDocEvent_(notice, '20260815-143012_研習通知.pdf', now);
  check('抓到活動日期而非發文日期', ev && Utilities.formatDate(ev.start, APP.TZ, 'yyyy-MM-dd'), '2026-09-19');
  check('抓到開始時間', ev && Utilities.formatDate(ev.start, APP.TZ, 'HH:mm'), '09:00');
  check('抓到結束時間', ev && Utilities.formatDate(ev.end, APP.TZ, 'HH:mm'), '16:00');
  check('抓到地點', ev && ev.location, '新北市政府507會議室');
  check('標題去掉公文客套話', ev && ev.title.indexOf('請查照') < 0, 'true');
  check('沒有日期時回 null', extractDocEvent_('本文完全沒有任何日期。', 'x.pdf', now), 'null');

  // 全天事件提醒不再落在半夜
  check('全天提醒＝前一天 07:30', formatReminderText_(getAllDayReminder_(), true), '前一天 07:30 通知');

  lines.push('', pass + ' / ' + total + ' 通過');
  const out = lines.join('\n');
  console.log(out);
  return out;
}

function testJournal() {
  appendToJournalDoc_({
    receivedAt: new Date(),
    type: '一般筆記',
    text: '這是一筆測試紀錄。',
    calendarResult: null,
    calendarError: null
  });
  return getOrCreateJournalDoc_().getUrl();
}

function testPush() {
  pushText_('✅ LINE 記事助理 ' + APP.VERSION + ' 測試成功');
}

function diagnoseDoc() {
  const ctx = getJournalContext_(new Date());
  const body = ctx.doc.getBody();
  console.log('文件：' + ctx.doc.getName());
  console.log('偵測表頭長度：' + ctx.entry.header);
  for (let i = 0; i < Math.min(10, body.getNumChildren()); i++) {
    const c = body.getChild(i);
    console.log(i + ' | ' + c.getType() + ' | ' + (c.getText ? c.getText().slice(0, 40) : ''));
  }
}

// [新] 解析器自我測試。改完程式先跑這支，全綠再上線。
function runParserTests() {
  // 固定基準日：2026-08-06（星期四）
  const now = new Date(2026, 7, 6, 9, 0, 0);
  const results = [];

  function check(name, actual, expected) {
    const pass = String(actual) === String(expected);
    results.push((pass ? '✅ ' : '❌ ') + name + '　得到：' + actual + (pass ? '' : '　應為：' + expected));
  }

  function fmt(d) { return Utilities.formatDate(d, APP.TZ, 'yyyy-MM-dd HH:mm'); }
  function ev(text, kind) { return parseCalendarInput_(text, now, kind || '行事曆'); }

  function dt(t) { return Utilities.formatDate(parseDate_(t, now).date, APP.TZ, 'yyyy-MM-dd'); }

  check('下週三', dt('下週三開會'), '2026-08-12');
  check('下星期三', dt('下星期三開會'), '2026-08-12');
  check('下禮拜三', dt('下禮拜三開會'), '2026-08-12');
  check('下下週一', dt('下下週一開會'), '2026-08-17');
  check('本週五', dt('本週五開會'), '2026-08-07');
  check('週三（無修飾詞）', dt('週三開會'), '2026-08-12');
  check('明天', dt('明天開會'), '2026-08-07');
  check('5/10黏著中文', dt('5/10下午2點開會'), '2027-05-10');
  check('民國115年', dt('115年9月1日開學'), '2026-09-01');

  check('8點20分不誤判提醒', ev('明天8點20分提醒我開會', '提醒事項').reminderMinutes, APP.DEFAULT_TODO_REMINDER_MINUTES);
  check('8點20分起始時間', fmt(ev('明天8點20分提醒我開會', '提醒事項').start), '2026-08-07 08:20');
  check('提前1天提醒', ev('明天9點主任會議 提前1天提醒').reminderMinutes, 1440);
  check('不提醒', ev('明天9點主任會議 不提醒').reminderMinutes, 0);
  check('預設提醒不為0', ev('明天9點主任會議').reminderMinutes, APP.DEFAULT_EVENT_REMINDER_MINUTES);

  check('跨午別結束時間', fmt(ev('明天上午11點到1點課發會').end), '2026-08-07 13:00');
  check('14:00-16:00', fmt(ev('下週五14:00-16:00教評會').end), '2026-08-14 16:00');
  check('傍晚6點', fmt(ev('明天傍晚6點聚餐').start), '2026-08-07 18:00');
  check('凌晨1點', fmt(ev('明天凌晨1點集合').start), '2026-08-07 01:00');
  check('晚上7點', fmt(ev('明天晚上7點家長會').start), '2026-08-07 19:00');
  check('中午12點半', fmt(ev('明天中午12點半聚餐').start), '2026-08-07 12:30');
  check('上午九點半', fmt(ev('明天上午九點半研習').start), '2026-08-07 09:30');

  check('第3點不誤判', parseTimeRange_(maskDecoys_('明天處理第3點意見')).hasTime, 'false');
  check('無時間為全天', ev('下週三校慶').allDay, 'true');
  check('標題乾淨', ev('下週三下午2點課發會 地點：會議室').title, '課發會');
  check('地點解析', ev('下週三下午2點課發會 地點：會議室').location, '會議室');
  check('提醒標題', ev('明天上午8點記得打電話給代課老師', '提醒事項').calendarTitle, '提醒｜打電話給代課老師');
  check('句中記得保留', stripIntentWords_('跟主任說記得帶資料'), '跟主任說記得帶資料');
  check('句首記得移除', stripIntentWords_('記得帶資料'), '帶資料');

  // ── 2.6 迴歸測試 ──
  check('[P0-5] 到校不被削頭', ev('明天9點到校服務').title, '到校服務');
  check('[P0-5] 到職不被削頭', ev('明天9點到職報到').title, '到職報到');
  check('[P0-5] 有氧不被削頭', ev('明天7點有氧課程').title, '有氧課程');
  check('[P0-5] 空白後贅詞仍移除', ev('明天9點 要 開會').title, '開會');
  check('[P0-5] 去年不被削頭', ev('明天9點去年度資料盤點').title, '去年度資料盤點');
  check('[P0-5] 重疊span不多刪', removeSpans_('明天9點到校服務', [{ start: 0, len: 2 }, { start: 0, len: 4 }]), '到校服務');
  check('[P0-5] trimSpan去前導空白', JSON.stringify(trimSpan_('  9點', { start: 0, len: 4 })), JSON.stringify({ start: 2, len: 2 }));
  check('[P0-5] 中文時間標題乾淨', ev('明天上午九點半到校研習').title, '到校研習');

  check('[P1-4] 14-16點不當日期', String(parseDateSafely_('14-16點開會', now)), 'null');
  check('[P1-4] 13月不當日期', String(parseDateSafely_('13/45 開會', now)), 'null');
  check('[P1-4] 合法斜線日期仍可解', dt('8/20 開會'), '2026-08-20');

  check('[P1-6] email不當地點', ev('明天9點開會 通知 abc@school.edu').location, '');
  check('[P1-6] @地點仍可解', ev('明天9點開會 @會議室').location, '會議室');

  check('[P1-1] 全天預設提醒', ev('下週三校慶').reminderMinutes, APP.DEFAULT_ALLDAY_REMINDER_MINUTES);
  check('[P1-1] 全天顯式提醒優先', ev('下週三校慶 提前1天提醒').reminderMinutes, 1440);
  check('[P1-1] 全天提醒文案', formatReminderText_(240, true), '前一天 20:00 通知');
  check('[P1-1] 一般提醒文案不變', formatReminderText_(30, false), '提前30分鐘');

  // ── 3.0 迴歸測試：日期規則表（每條規則至少一例 + 誤判防護）──
  check('[3.0] 3天後', dt('3天後交件'), '2026-08-09');
  check('[3.0] 三天後', dt('三天後交件'), '2026-08-09');
  check('[3.0] 兩週後', dt('兩週後複審'), '2026-08-20');
  check('[3.0] 1個月後', dt('1個月後追蹤'), '2026-09-06');
  check('[3.0] 數字週3', dt('週3開會'), '2026-08-12');
  check('[3.0] 星期5', dt('星期5校務會議'), '2026-08-07');
  check('[3.0] 週末', dt('週末辦活動'), '2026-08-08');
  check('[3.0] 民國7碼', dt('1150919頒獎典禮'), '2026-09-19');
  check('[3.0] 西元8碼', dt('20260919頒獎'), '2026-09-19');
  check('[3.0] 9/19括號星期', dt('9/19(五)頒獎'), '2026-09-19');
  check('[3.0] 9/19全形括號週六', dt('9/19（週六）運動會'), '2026-09-19');
  check('[3.0] 日期範圍取開始日', dt('9/19-9/21辦理研習'), '2026-09-19');
  check('[3.0] 日期範圍同月', dt('9/19~21展覽'), '2026-09-19');
  check('[3.0] 九月十九日', dt('九月十九日典禮'), '2026-09-19');
  check('[3.0] 下個月5號', dt('下個月5號繳交'), '2026-09-05');
  check('[3.0] 月底', dt('月底前完成'), '2026-08-31');
  check('[3.0] 下個月底', dt('下個月底結案'), '2026-09-30');
  check('[3.0] 9月上旬', dt('9月上旬辦理'), '2026-09-05');
  check('[3.0] 9月中旬', dt('9月中旬研習'), '2026-09-15');
  check('[3.0] 9月下旬', dt('9月下旬考評'), '2026-09-25');
  check('[3.0] 單獨19號', dt('19號要開會'), '2026-08-19');
  check('[3.0] 單獨5號順延下月', dt('5號繳交'), '2026-09-05');
  check('[3.0] 明早展開日期', dt(expandSynonyms_('明早9點晨會')), '2026-08-07');
  check('[3.0] 明早展開時段', ev('明早9點晨會').start.getHours(), 9);
  check('[3.0] 明晚展開時段', ev('明晚7點聚餐').start.getHours(), 19);
  check('[3.0] 第19號公文不誤判', String(parseDateSafely_(maskDecoys_('處理第19號公文'), now)), 'null');
  check('[3.0] 第二屆不誤判', String(parseDateSafely_(maskDecoys_('第二屆星耀獎'), now)), 'null');
  check('[3.0] 19號教室不誤判', String(parseDateSafely_('19號教室整理', now)), 'null');
  check('[3.0] 規則表提示同步', buildDateFormatHint_().indexOf('115.09.19') >= 0, 'true');

  // ── 2.9 迴歸測試：公文日期格式 ──
  check('[2.9] 民國點分隔', dt('115.09.19頒獎典禮'), '2026-09-19');
  check('[2.9] 民國斜線', dt('115/9/19頒獎典禮'), '2026-09-19');
  check('[2.9] 民國橫線', dt('115-09-19頒獎典禮'), '2026-09-19');
  check('[2.9] 民國跨年', dt('114.12.31尾牙'), '2025-12-31');
  check('[2.9] 西元點分隔不受影響', dt('2026.09.19開會'), '2026-09-19');
  check('[2.9] 全形月日', dt('８月２０日課發會'), '2026-08-20');
  check('[2.9] 全形西元', dt('２０２６／０９／１９開會'), '2026-09-19');
  check('[2.9] 全形時間', ev('明天下午２點開會').start.getHours(), 14);
  check('[2.9] IP不誤判為民國年', String(parseDateSafely_('192.168.1.1 設定路由器', now)), 'null');
  check('[2.9] 分機號不誤判', String(parseDateSafely_('507會議室', now)), 'null');
  check('[2.9] 民國月份越界', String(parseDateSafely_('115.19.19 亂數', now)), 'null');
  check('[2.9] 全形保留於標題', ev('115.09.19 ５０７會議室頒獎').title.indexOf('５０７') >= 0, 'true');

  // ── 2.7 迴歸測試 ──
  function due(t) {
    const d = parseNoteDue_(t, now);
    return d ? Utilities.formatDate(d, APP.TZ, 'yyyy-MM-dd') : 'null';
  }
  check('[2.7] 期限-明天', due('明天整理代理教師資料'), '2026-08-07');
  check('[2.7] 期限-週五前', due('週五前完成核銷'), '2026-08-07');
  check('[2.7] 期限-下週三', due('下週三前繳交課程計畫'), '2026-08-12');
  check('[2.7] 期限-顯式截止', due('核銷資料 截止：8/20'), '2026-08-20');
  check('[2.7] 無日期則無期限', due('整理代理教師資料'), 'null');
  check('[2.7] 第3點不誤判為期限', due('處理第3點意見'), 'null');

  const t0 = startOfDay_(now);
  check('[2.7] 逾期標籤', todoUrgency_({ due: addDays_(t0, -3), date: t0 }, t0).label.indexOf('逾期3天') >= 0, 'true');
  check('[2.7] 逾期旗標', todoUrgency_({ due: addDays_(t0, -1), date: t0 }, t0).overdue, 'true');
  check('[2.7] 今天到期', todoUrgency_({ due: t0, date: t0 }, t0).label.indexOf('今天到期') >= 0, 'true');
  check('[2.7] 明天到期', todoUrgency_({ due: addDays_(t0, 1), date: t0 }, t0).label.indexOf('明天到期') >= 0, 'true');
  check('[2.7] 未逾期不標旗', todoUrgency_({ due: addDays_(t0, 5), date: t0 }, t0).overdue, 'false');
  check('[2.7] 無期限退回天數', todoUrgency_({ due: null, date: addDays_(t0, -9) }, t0).label.indexOf('已 9天') >= 0, 'true');

  // 排序：有期限者依期限由近到遠在前，無期限者依建立時間由舊到新在後
  const sorted = sortTodoItems_([
    { content: 'C', due: null, date: addDays_(t0, -30) },
    { content: 'A', due: addDays_(t0, -2), date: t0 },
    { content: 'D', due: null, date: addDays_(t0, -1) },
    { content: 'B', due: addDays_(t0, 1), date: t0 }
  ]).map(function (x) { return x.content; }).join('');
  check('[2.7] 待辦排序（有期限優先→無期限依舊）', sorted, 'ABCD');

  const text = results.join('\n');
  console.log(text);
  return text;
}

/**
 * [2.6 新] 撤銷結構往返測試（會實際寫入／刪除當月文件，請在非尖峰時段執行）。
 *
 * 這支測試專門守住 P0-1：同一天連寫兩筆再連撤兩次，
 * 文件必須完整回到原始狀態，且日期標題不可被誤刪。
 */
function testUndoRoundTrip() {
  const out = [];
  const stamp = 'ZZ測試' + Utilities.getUuid().slice(0, 6);
  const ctx = getJournalContext_(new Date());
  const before = ctx.doc.getBody().getNumChildren();
  const beforeTop = readRegistry_()[ctx.key] ? (readRegistry_()[ctx.key].topDate || '') : '';

  out.push('起始段落數：' + before);

  appendToJournalDoc_({
    receivedAt: new Date(), type: '一般筆記', text: stamp + '-第一筆',
    isTask: false, calendarResult: null, calendarError: null
  });
  appendToJournalDoc_({
    receivedAt: new Date(), type: '一般筆記', text: stamp + '-第二筆',
    isTask: false, calendarResult: null, calendarError: null
  });

  const mid = DocumentApp.openById(readRegistry_()[ctx.key].id).getBody().getNumChildren();
  out.push('寫入兩筆後段落數：' + mid);

  const u1 = undoLastEntry_();
  const u2 = undoLastEntry_();
  out.push('撤銷1：' + (u1.ok ? 'ok' : 'FAIL - ' + u1.message));
  out.push('撤銷2：' + (u2.ok ? 'ok' : 'FAIL - ' + u2.message));

  const body = DocumentApp.openById(readRegistry_()[ctx.key].id).getBody();
  const after = body.getNumChildren();
  const afterTop = readRegistry_()[ctx.key].topDate || '';
  const residue = body.getText().indexOf(stamp) >= 0;

  out.push('撤銷後段落數：' + after);
  out.push((after === before ? '✅' : '❌') + ' 段落數還原（應為 ' + before + '）');
  out.push((residue ? '❌ 文件仍殘留測試字串' : '✅ 無殘留'));
  out.push((afterTop === beforeTop ? '✅' : '❌') + ' topDate 還原（前「' + beforeTop + '」後「' + afterTop + '」）');

  const text = out.join('\n');
  console.log(text);
  return text;
}

/* ============================================================
 * 十三、共用工具
 * ============================================================ */

function getRequiredProperty_(name) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error('缺少指令碼屬性：' + name);
  return value;
}

function escapeRegExp_(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pad2_(n) {
  return (n < 10 ? '0' : '') + n;
}

// [2.6 修] 全天事件的提醒基準是「當天 00:00」，直接寫「提前4小時」使用者會看不懂，
//          改成換算為實際通知時刻。
function formatReminderText_(minutes, allDay) {
  if (!minutes) return '不另外通知';

  const base = minutes % 1440 === 0 ? '提前' + (minutes / 1440) + '天'
    : minutes % 60 === 0 ? '提前' + (minutes / 60) + '小時'
      : '提前' + minutes + '分鐘';

  if (!allDay) return base;
  if (minutes < 1440) {
    const before = 1440 - minutes;
    return '前一天 ' + pad2_(Math.floor(before / 60)) + ':' + pad2_(before % 60) + ' 通知';
  }
  return base + '（自當天 00:00 起算）';
}

function formatChineseDate_(date) {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return Utilities.formatDate(date, APP.TZ, 'yyyy年M月d日') + ' 星期' + weekdays[date.getDay()];
}

function formatChineseDateTime_(date) {
  return formatChineseDate_(date) + ' ' + Utilities.formatDate(date, APP.TZ, 'HH:mm');
}

function startOfDay_(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function startOfWeek_(date, weekOffset) {
  const d = startOfDay_(date);
  const dow = d.getDay();               // 0=日
  const backToMonday = dow === 0 ? 6 : dow - 1;
  return addDays_(d, -backToMonday + (Number(weekOffset) || 0) * 7);
}

function addDays_(date, days) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

function getErrorMessage_(err) {
  return String(err && err.message ? err.message : err || '未知錯誤');
}
