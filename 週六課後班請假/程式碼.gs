/* * 後端程式碼 - Code.gs
 * 功能：處理前端請求、讀取設定、過濾過期日期、寫入請假資料、自動查表寄送通知信(含累計名單)
 * 安全性優化：LockService、HTML Sanitization、電話遮碼
 * 極致效能優化：加入 CacheService (後端快取)，大幅縮短選單載入時間
 */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('鷺江國小週六才藝班 - 請假系統')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ---------------------------------------------------
// 工具函式
// ---------------------------------------------------
function escapeHtml(text) {
  if (text == null) return "";
  return text.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function maskPhone(phone) {
  if (!phone) return "";
  let p = phone.toString().replace(/'/g, "");
  return p.replace(/(\d{4})\d+(\d{3})/, '$1***$2');
}

// 取得課程與日期設定 (加入快取機制)
function getCourseConfig() {
  // 1. 嘗試從快取讀取
  var cache = CacheService.getScriptCache();
  var cachedData = cache.get("course_config_v2"); // v2 為版本號，若結構變更可改名強制刷新
  
  if (cachedData != null) {
    // 如果快取有資料，直接回傳，不讀試算表 (速度快)
    return JSON.parse(cachedData);
  }

  // 2. 快取沒資料，才去讀試算表 (速度慢)
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('設定');
  
  // 若讀不到設定，回傳空物件
  if (!sheet) return { courses: [], dates: [] };
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { courses: [], dates: [] };
  
  const range = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  
  const courses = [];
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  range.forEach(row => {
    if (row[0]) {
      courses.push({
        courseName: row[0],
        teacher: row[1],
        location: row[3] || '未指定地點'
      });
    }
    
    if (row[2]) {
      let dateVal = row[2];
      if (Object.prototype.toString.call(dateVal) === '[object Date]') {
         if (dateVal < today) return; 
         let dateStr = Utilities.formatDate(dateVal, Session.getScriptTimeZone(), "yyyy/MM/dd");
         if (!dates.includes(dateStr)) dates.push(dateStr);
      } else {
        if (dateVal && !dates.includes(dateVal)) dates.push(dateVal);
      }
    }
  });
  
  dates.sort();
  
  const result = { courses: courses, dates: dates };
  
  // 3. 寫入快取，保存 20 分鐘 (1200秒)
  // 這樣接下來 20 分鐘內的使用者都會感覺很快
  cache.put("course_config_v2", JSON.stringify(result), 1200);

  return result;
}

// 接收前端表單資料並寫入
function submitLeaveRequest(formData) {
  var lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(10000); 
  } catch (e) {
    return { success: false, message: "系統忙碌中，請稍後再試。" };
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('請假紀錄');
    
    const headers = ['時間戳記', '學生校別', '班級座號姓名', '填寫人姓名', '聯絡電話', '請假課程', '指導老師', '上課地點', '請假日期', '請假事由'];

    if (!sheet) {
      sheet = ss.insertSheet('請假紀錄');
      sheet.appendRow(headers);
    } 
    
    // 1. 資料清理 (Trim)
    const cleanSeatNo = formData.classSeatNo.toString().trim();
    const cleanFiller = formData.fillerName.toString().trim();
    const cleanPhone = formData.phone.toString().trim();
    const cleanReason = formData.reason.toString().trim();
    const targetDate = formData.leaveDate;
    const targetCourse = formData.course;

    // 2. 讀取現有資料
    const allData = sheet.getDataRange().getValues();

    // 3. 防止重複提交檢查
    const isDuplicate = allData.some((row, index) => {
      if (index === 0) return false; 
      
      if (row[5] !== targetCourse) return false;

      let sheetSeat = String(row[2]).replace(/^'/, '').trim();
      if (sheetSeat !== cleanSeatNo) return false;

      let sheetDate = row[8];
      let formattedSheetDate = "";
      if (Object.prototype.toString.call(sheetDate) === '[object Date]') {
        formattedSheetDate = Utilities.formatDate(sheetDate, Session.getScriptTimeZone(), "yyyy/MM/dd");
      } else {
        formattedSheetDate = String(sheetDate);
      }
      
      return formattedSheetDate === targetDate;
    });

    if (isDuplicate) {
      return { success: false, message: "⚠️ 重複申請！系統中已有該學生當日此課程的請假紀錄。" };
    }
    
    // 4. 寫入資料
    const timestamp = new Date();
    const newRow = [
      timestamp,
      formData.schoolType,
      "'" + cleanSeatNo, 
      cleanFiller,
      "'" + cleanPhone,  
      targetCourse,
      formData.teacher,
      formData.location,
      targetDate,
      cleanReason
    ];

    sheet.appendRow(newRow);
    SpreadsheetApp.flush();

    // 5. 更新記憶體中的 allData
    allData.push([
      timestamp,
      formData.schoolType,
      cleanSeatNo,
      cleanFiller,
      cleanPhone,
      targetCourse,
      formData.teacher,
      formData.location,
      targetDate,
      cleanReason
    ]);

    // ==========================================
    // 6. 自動查表 Email
    // ==========================================
    
    let recipientEmail = "admin@example.com"; 
    
    const settingSheet = ss.getSheetByName('設定');
    if (settingSheet) {
      const lastRow = settingSheet.getLastRow();
      const settingData = settingSheet.getRange(2, 1, lastRow - 1, 5).getValues();
      const courseConfig = settingData.find(row => row[0] === targetCourse);
      
      if (courseConfig && courseConfig[4]) {
        recipientEmail = String(courseConfig[4]).replace(/，/g, ',').trim();
      }
    }

    // ==========================================
    // 7. 產生累計名單
    // ==========================================
    
    let cumulativeListHTML = "";
    let count = 0;

    const sameClassAbsences = allData.filter((row, index) => {
      if (index === 0) return false;
      if (row[5] !== targetCourse) return false;

      let sheetDate = row[8];
      let formattedSheetDate = "";
      if (Object.prototype.toString.call(sheetDate) === '[object Date]') {
        formattedSheetDate = Utilities.formatDate(sheetDate, Session.getScriptTimeZone(), "yyyy/MM/dd");
      } else {
        formattedSheetDate = String(sheetDate);
      }
      return formattedSheetDate === targetDate;
    });

    sameClassAbsences.forEach(row => {
      count++;
      const studentInfo = row[1] === '本校生' ? `本校 (${escapeHtml(row[2])})` : `他校 (${escapeHtml(row[2])})`;
      
      let submitTime = "";
      if (row[0] && Object.prototype.toString.call(row[0]) === '[object Date]') {
        submitTime = Utilities.formatDate(row[0], Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm");
      } else {
        submitTime = String(row[0]);
      }

      cumulativeListHTML += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${count}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">${submitTime}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${studentInfo}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(row[3])}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${maskPhone(row[4])}</td> 
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(row[9])}</td>
        </tr>
      `;
    });

    // ==========================================
    // 8. 寄送 Email
    // ==========================================

    const safeSeatNo = escapeHtml(cleanSeatNo);
    const safeDate = escapeHtml(targetDate);
    const safeCourse = escapeHtml(targetCourse);
    const safeSchoolType = escapeHtml(formData.schoolType);
    const safeFillerName = escapeHtml(cleanFiller);
    const safeReason = escapeHtml(cleanReason);
    const safeTeacher = escapeHtml(formData.teacher);

    const emailSubject = `[請假通知] ${safeSeatNo} - ${safeDate} (${safeCourse})`;
    const emailBody = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 650px;">
        <h2 style="color: #2c3e50;">鷺江國小才藝班 - 新增請假申請</h2>
        
        <div style="background-color: #e8f6f3; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 5px solid #1abc9c;">
          <h3 style="margin-top: 0; color: #16a085;">本次新增請假資料</h3>
          <p style="margin: 5px 0;"><strong>學生校別：</strong>${safeSchoolType}</p>
          <p style="margin: 5px 0;"><strong>班級座號姓名：</strong>${safeSeatNo}</p>
          <p style="margin: 5px 0;"><strong>填寫人：</strong>${safeFillerName}</p>
          <p style="margin: 5px 0;"><strong>請假日期：</strong>${safeDate}</p>
          <p style="margin: 5px 0;"><strong>請假事由：</strong>${safeReason}</p>
        </div>

        <hr style="border: 0; border-top: 2px dashed #eee; margin: 20px 0;">

        <h3 style="color: #e67e22;">📅 當日累計請假名單 (${safeDate} - ${safeCourse})</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd; width: 40px;">序號</th>
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd; width: 120px;">送出時間</th>
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">校別/座號姓名</th>
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">填寫人</th>
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">電話 (已遮碼)</th>
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">事由</th>
            </tr>
          </thead>
          <tbody>
            ${cumulativeListHTML}
          </tbody>
        </table>

        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; text-align: right;">此信件由系統自動發送給 ${safeTeacher} 老師。</p>
      </div>
    `;

    MailApp.sendEmail({
      to: recipientEmail,
      subject: emailSubject,
      htmlBody: emailBody
    });

    return { success: true, message: "請假成功！老師已收到通知。" };
    
  } catch (e) {
    return { success: false, message: "系統發生錯誤：" + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function checkEmailPermission() {
  var quota = MailApp.getRemainingDailyQuota(); 
  console.log("您的剩餘寄信額度：" + quota);
}