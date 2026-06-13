# 好食點餐 OrderFood 🍜

一個簡潔、可直接執行的線上點餐網站，使用純 HTML / CSS / JavaScript 製作，無需任何建置工具或後端環境。

## 功能

- 📋 **菜單瀏覽**：依分類（主餐、輕食、飲料、甜點）篩選餐點
- 🛒 **購物車**：加入餐點、調整數量、即時計算金額
- 💾 **自動保存**：購物車內容以 `localStorage` 保存，重新整理不會遺失
- ✅ **結帳流程**：填寫外送資訊並送出訂單（前端示範）
- 📱 **響應式設計**：支援電腦與手機瀏覽

## 如何使用

直接用瀏覽器開啟 `index.html` 即可：

```bash
# 方式一：直接開啟
open index.html        # macOS
xdg-open index.html    # Linux

# 方式二：用簡易伺服器（建議）
python3 -m http.server 8000
# 然後瀏覽 http://localhost:8000
```

## 檔案結構

| 檔案 | 說明 |
| --- | --- |
| `index.html` | 網站主結構 |
| `styles.css` | 樣式設計 |
| `menu-data.js` | 菜單資料（可自行增修品項） |
| `app.js` | 點餐 / 購物車 / 結帳邏輯 |

## 自訂菜單

編輯 `menu-data.js` 中的 `MENU` 陣列即可新增或修改餐點：

```js
{ id: 13, category: "甜點", emoji: "🍪", name: "巧克力餅乾", desc: "現烤酥脆", price: 40 }
```

## 後續可擴充方向

- 串接真實後端 API 處理訂單與付款
- 加入會員登入與訂單歷史
- 餐點圖片改用實際照片
