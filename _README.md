Egame Scratch 客製化說明
====
1. 左上角增加 Logo
   
2. 工具列增加按鈕 (控制積木)
   - 程式碼位置 src/components/menu-bar/
   - svg圖片 src/components/menu-bar/scratch-logo.svg
3. 取代背包功能，改為過關條件說明
   - 程式碼位置 src/components/backpack/
   - 
4. 增加模擬自動拖拉機木
   - 程式碼位置 src/extends/Runner


部署上線
====
1. 將專案打包
   ```bash
   npm run build
   ```
2. 將打包後的檔案上傳到伺服器