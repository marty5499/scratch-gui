import {defaultColors} from './themes';

const categorySeparator = '<sep gap="36"/>';

const xmlEscape = function (unsafe) {
    return unsafe.replace(/[<>&'"]/g, c => {
        switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        }
    });
};

// 將外部配置轉換為 XML 的輔助函數
const convertConfigToCategoriesXML = (blockConfigData, colors) => {
    if (!blockConfigData || !blockConfigData.categories) {
        console.warn('無效的積木配置數據');
        return [];
    }
    
    return blockConfigData.categories.map(category => {
        // 防護：確保 category 物件存在且具有必要屬性
        if (!category || !category.id) {
            console.warn('發現無效的類別配置');
            return null;
        }

        const categoryId = category.id;
        const categoryName = category.name || categoryId; // 使用 id 作為後備名稱
        const categoryColors = colors[categoryId] || colors.extension;
        
        // 防護：確保 blocks 陣列存在
        const blocks = category.blocks || [];
        
        const blocksXML = blocks.map(block => {
            if (!block || !block.type) return '';
            
            // 處理積木的值
            let valuesXML = '';
            if (block.values) {
                valuesXML = Object.entries(block.values).map(([name, valConf]) => {
                    if (!valConf || !valConf.type || !valConf.field) return '';
    return `
                        <value name="${name}">
                            <shadow type="${valConf.type}">
                                <field name="${valConf.field.name}">${valConf.field.value}</field>
                </shadow>
            </value>
                    `;
                }).join('\n');
            }

            // 處理積木的欄位
            let fieldsXML = '';
            if (block.fields) {
                fieldsXML = Object.entries(block.fields).map(([name, value]) => {
                    return `<field name="${name}">${value}</field>`;
                }).join('\n');
            }

    return `
                <block type="${block.type}">
                    ${fieldsXML}
                    ${valuesXML}
                </block>
            `;
        }).filter(Boolean).join('\n');

        return {
            id: categoryId,
            xml: `
                <category
                    name="${xmlEscape(categoryName)}"
                    id="${xmlEscape(categoryId)}"
                    colour="${categoryColors.primary}"
                    secondaryColour="${categoryColors.tertiary}"
                >
            ${blocksXML}
        </category>
            `
        };
    }).filter(Boolean); // 過濾掉無效的類別
};

/**
 * @param {!boolean} isInitialSetup - Whether the toolbox is for initial setup.
 * @param {?boolean} isStage - Whether the toolbox is for a stage-type target.
 * @param {?string} targetId - The current editing target
 * @param {?Array.<object>} categoriesXML - optional array of `{id,xml}` for categories.
 * @param {?string} costumeName - The name of the default selected costume dropdown.
 * @param {?string} backdropName - The name of the default selected backdrop dropdown.
 * @param {?string} soundName -  The name of the default selected sound dropdown.
 * @param {?object} colors - The colors for the theme.
 * @returns {string} - a ScratchBlocks-style XML document for the contents of the toolbox.
 */
const makeToolboxXML = function (
    isInitialSetup,
    isStage = true,
    targetId,
    categoriesXML = [],
    costumeName = '',
    backdropName = '',
    soundName = '',
    colors = defaultColors,
    customBlocksXML = null
) {
    // 確保有效的顏色設定
    colors = colors || defaultColors;
    
    try {
        // 確保至少有一個有效的類別
        if (!customBlocksXML || !Array.isArray(customBlocksXML.categories)) {
            return '<xml style="display: none"><category name="Loading..." id="loading"></category></xml>';
        }

        // 轉換自定義積木配置
        const customCategories = convertConfigToCategoriesXML(customBlocksXML, colors);
        
        // 檢查是否有有效的類別
        if (!customCategories || customCategories.length === 0) {
            return '<xml style="display: none"><category name="Error" id="error"></category></xml>';
        }

        // 生成完整的 XML
        const everything = ['<xml style="display: none">'];
        
        customCategories.forEach(category => {
            if (category && category.xml) {
                everything.push(categorySeparator);
                everything.push(category.xml);
            }
        });

    everything.push('</xml>');
    return everything.join('\n');
    } catch (error) {
        console.error('轉換自定義積木配置失敗:', error);
        return '<xml style="display: none"><category name="Error" id="error"></category></xml>';
    }
};

export default makeToolboxXML;
