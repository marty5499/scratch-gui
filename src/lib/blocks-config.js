const defaultBlocksConfig = {
  categories: [
    {
      id: 'motion',
      blocks: [
        {
          type: 'motion_movesteps',
          values: {
            STEPS: {
              type: 'math_number',
              field: {name: 'NUM', value: '1'}
            }
          }
        },
        {
          type: 'motion_turnright',
          values: {
            DEGREES: {
              type: 'math_number',
              field: {name: 'NUM', value: '15'}
            }
          }
        }
      ]
    }
    // 可以添加更多類別...
  ]
};

const loadBlocksConfig = async (configUrl, locale = 'en') => {
  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();
    
    // 載入對應語系的訊息檔
    const messagesResponse = await fetch(`/static/blocks/messages/${locale}.json`);
    const messages = messagesResponse.ok ? await messagesResponse.json() : {};

    // 處理多語系名稱
    const localizedConfig = {
      ...config,
      categories: config.categories.map(category => ({
        ...category,
        name: messages[`category.${category.id}`] || category.name,
        blocks: category.blocks.map(block => ({
          ...block,
          message: messages[`block.${block.type}`] || block.message
        }))
      }))
    };

    return localizedConfig;
  } catch (error) {
    console.warn('無法載入積木配置，使用預設配置', error);
    return defaultBlocksConfig;
  }
};

export {
  defaultBlocksConfig,
  loadBlocksConfig
}; 