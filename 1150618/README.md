# 鷺江國小 教務處整合服務平台 — Supabase 部署說明

一套可實際上線的後端：**Supabase（PostgreSQL 資料庫 ＋ 帳號驗證 ＋ 自動 API ＋ 列級安全 RLS）**，搭配單一檔案前端 `index.html`。不需要架伺服器、不需要 build 工具。

```
lujiang-supabase/
├─ index.html              ← 前端（編輯最上方設定區即可）
├─ README.md               ← 本說明
└─ supabase/
   ├─ schema.sql           ← 資料表 + RLS 安全政策 + 觸發器（先執行）
   └─ seed.sql             ← 示範資料 + 教職員身分對照（後執行）
```

---

## 一、建立 Supabase 專案

1. 前往 https://supabase.com 註冊並登入（免費方案即可起步）。
2. 點 **New project**，輸入專案名稱與資料庫密碼（請自行保存），選擇離台灣較近的區域（如 Singapore），按建立，等待約 1–2 分鐘。

## 二、建立資料庫結構

1. 左側選 **SQL Editor → New query**。
2. 貼上 `supabase/schema.sql` 全部內容，按 **Run**。應顯示 Success。
3. 再開一個 New query，貼上 `supabase/seed.sql`，按 **Run**（載入示範公告、行事曆、教學資源與教職員身分對照）。

> 之後若想清空重來，可在 SQL Editor 重新執行 `schema.sql`（已設計成可重複執行），再執行 `seed.sql`。

## 三、建立登入帳號

身分對照表 `role_assignments` 已內含 8 組示範 email。只要用**相同 email** 建立帳號，登入後就會自動套到對應角色與組別。

1. 左側 **Authentication → Users → Add user → Create new user**。
2. 逐一建立以下帳號（email 用 seed.sql 內的，密碼自訂）：

| Email | 姓名 | 角色 | 組別 |
|---|---|---|---|
| director@lujiang.edu.tw | 王培德 | 教務主任 | 主任 |
| teach@lujiang.edu.tw | 林思齊 | 教學組長 | 教學組 |
| info@lujiang.edu.tw | 陳維安 | 資訊組長 | 資訊組 |
| curri@lujiang.edu.tw | 黃郁文 | 課程組長 | 課程組 |
| reg@lujiang.edu.tw | 張瑞玲 | 註冊組長 | 註冊組 |
| bili@lujiang.edu.tw | 吳依潔 | 雙語組長 | 雙語組 |
| teacher@lujiang.edu.tw | 張曉雯 | 教師 | 教師 |
| parent@lujiang.edu.tw | 李家瑜 | 學生／家長 | 學生／家長 |

3. 建立時請勾選 **Auto Confirm User**（或在 Authentication → Providers → Email 關閉 *Confirm email*），測試階段才能直接登入。

> 正式啟用後，新進教師只要：先在 `role_assignments` 加一列（email、姓名、role、unit），再到 Authentication 建立同 email 帳號即可——角色自動生效。

## 四、把前端接上 Supabase

1. 左側 **Settings（齒輪）→ API**，複製兩個值：**Project URL** 與 **Project API keys 的 `anon` `public` 金鑰**。
2. 用文字編輯器打開 `index.html`，找到最上方「設定區」，填入：

```js
const SUPABASE_URL      = "https://你的專案.supabase.co";
const SUPABASE_ANON_KEY = "貼上 anon public 金鑰";
```

> `anon` 金鑰本來就是設計給前端公開使用的——真正的存取控制由資料庫端的 RLS 把關，**請勿**改用 `service_role` 金鑰。

## 五、發布網站

`index.html` 是單一靜態檔，放到任何能放網頁的地方都能用：

- **最簡單**：直接用瀏覽器開啟本機 `index.html` 即可使用。
- **給全校用**，擇一部署：
  - GitHub Pages（免費）／Netlify／Vercel：把檔案拖上去即可。
  - Supabase Storage：建立 public bucket 上傳，取得公開網址。
  - 校內網站伺服器：放進網頁目錄。
- 部署後，到 Supabase **Authentication → URL Configuration**，把你的網址加入 **Site URL / Redirect URLs**。

完成。用上面任一帳號登入，即可看到對應權限的介面。

---

## 資料表與安全機制

| 資料表 | 用途 |
|---|---|
| `profiles` | 使用者資料（姓名、角色、組別），對應登入帳號 |
| `role_assignments` | email → 角色／組別 對照，控管誰是哪一組 |
| `announcements` | 公告 |
| `events` | 全校行事曆 |
| `resources` | 教學資源 |
| `requests` | 線上申請與審核紀錄（含 jsonb 表單欄位） |

**列級安全（RLS）已全面啟用**，權限在資料庫端強制執行，不靠前端：

- 公告／行事曆／資源：所有登入者可讀；**只有主任或該組承辦**能新增、修改、刪除自己組的內容。
- 線上申請：申請人只看得到自己的；承辦組別與主任看得到路由給該組的；**審核（核准／退回）僅限該組或主任**。
- 個人資料：只能讀自己的（主任／承辦可讀全部以顯示姓名）。

## 正式上線前的建議

這套後端足以承接一所國小的日常運作。若要處理真實學籍、成績等個資，建議再加上：

- **開啟 Email 驗證**，或改接學校 **單一登入（SSO，如 Google Workspace / OIDC）**——Supabase Auth 支援。
- **定期備份**：Supabase 內建每日備份（付費方案保留更久），亦可自行匯出。
- **稽核紀錄**：可在各表加 `updated_by / updated_at` 欄位與觸發器，記錄誰改了什麼。
- **檔案上傳**：教學資源若要存實體檔案，改用 Supabase Storage 並以 RLS 控管下載權限。
- 上線前用各角色帳號實測一輪權限，確認越權操作會被資料庫擋下。

需要我接著幫你加上「檔案上傳」「SSO 登入」或「稽核紀錄」其中一項，再說一聲即可。
