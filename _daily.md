12/21
- 增加自定義積木從 blockConfig.json 載入 /static/blocks/blockConfig.json
- 切換語系
   http://localhost:8602/index.html?locale=zh-tw
stage.jsx:  吃 url 參數 stage 載入指定關卡 , 沒有就不載入
blocks.jsx: 吃 url 參數 stage 載入指定關卡 , 沒有就載入預設積木組
blocks-config.js: 改完動態載入積木組
1-2_blocks.json: 關卡積木
default_blocks.json: 預設積木組

- 這組積木有問題
```json

        {
          "type": "sensing_of",
          "values": {
            "PROPERTY": {
              "type": "field_dropdown",
              "name": "PROPERTY",
              "options": [
                ["x position","x position"],
                ["y position","y position"],
                ["direction","direction"],
                ["size","size"],
                ["volume","volume"],
                ["backdrop #","backdrop #"]
              ]
            },
            "OBJECT": {
              "type": "field_dropdown",
              "name": "OBJECT",
              "options": [
                ["Stage", "_stage_"],
                ["Sprite1", "Sprite1"]
              ]
            }
          }
        },
```
  



12/18
- 增加 .sb3 檔案上傳功能
以下是依據程式碼片段中可觀察到的近期新增或修改之功能摘要（假設這些為你在過去五天內所做的更動）：
	1.	新增教學（Validation）功能與按鈕：
	•	在選單列中加入了一個「教學」按鈕（validateButton），並在 handleValidateClick() 中使用 Runner 類別對工作區（Blockly Workspace）進行積木的自動拖曳與排列。
	•	透過 Runner 的非同步操作，示範如何自動將「重複（control_repeat）」與「移動（motion_movesteps）」積木拖放至編輯區，實現教學自動化操作。
	2.	從 URL 載入特定場景檔案(Stage)的功能：
	•	在 componentDidMount() 中呼叫 loadStageFromUrl()，根據網址參數 (stage query param) 動態載入對應的 .sb3 專案檔與 _info.js 場景資訊檔。
	•	成功載入後，將相關資訊儲存至 window.stageInfo，並以此動態呈現專案場景。


# 06/05 修改圖片 logo egame
圖片位址
/src/components/menu-bar/scratch-logo.svg
width: 66.1 , height: 24.7
[修改 Logo](https://boxy-svg.com/app/disk:vF7kdb0VO0)