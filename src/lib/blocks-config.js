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

const loadBlocksConfig = async configUrl => {
  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();
    return config;
  } catch (error) {
    console.warn('無法載入積木配置，使用預設配置', error);
    return defaultBlocksConfig;
  }
};

export {
  defaultBlocksConfig,
  loadBlocksConfig
}; 