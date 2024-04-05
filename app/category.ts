import { type CascaderProps } from "antd";


export const categories: CascaderProps['options'] = [
  {
    label: '前端',
    value: '前端',
    children: [
      {
        label: 'Library',
        value: 'Library',
      },
      {
        label: 'Css',
        value: 'Css',
      },
      {
        label: 'React',
        value: 'React',
      },
      {
        label: 'Vue',
        value: 'Vue',
      },
    ],
  },
  {
    label: '后端',
    value: '后端',
    children: [
      {
        label: 'Node.js',
        value: 'Node.js',
      },
      {
        label: 'Java',
        value: 'Java',
      },
    ],
  },
  {
    label: '运动',
    value: '运动',
    children: [
      {
        label: '徒步',
        value: '徒步',
      },
      {
        label: '篮球',
        value: '篮球',
      },
      {
        label: '足球',
        value: '足球',
      },
    ]
  }
]

export function createMockCategores() {
  const primaryCategories = [  
    '美食',  
    '旅游',  
    '科技',  
    '健康',  
    '影视',  
    '教育',  
    '时尚',  
    '体育',  
    '家居',  
    '金融',  
    '汽车',  
    '游戏',  
    '动漫',  
    '读书',  
    '摄影',  
    '户外',  
    '音乐',  
    '美妆',  
    '母婴',  
    '宠物',  
    '数码',  
    '房产',  
    '职场',  
    '法律',  
    '艺术',  
    '历史',  
    '天文',  
    '地理',  
    '哲学',  
    '文化',  
    '美食探店',  
    '旅游攻略',  
    '科技新品',  
    '健康生活',  
    '影视资讯',  
    '在线教育',  
    '时尚穿搭',  
    '体育赛事',  
    '智能家居',  
    '金融理财',  
    // 可以继续添加更多的一级分类...  
  ];  
    
  // 名词示例数据  
  const nouns = [  
    '蛋糕',  
    '旅行团',  
    '手机',  
    '健身',  
    '电影',  
    '课程',  
    '服装',  
    '篮球',  
    '沙发',  
    '投资',  
    '餐厅',  
    '度假胜地',  
    '笔记本电脑',  
    '运动',  
    '音乐会',  
    '培训',  
    '鞋子',  
    '足球',  
    '床',  
    '保险',  
    // ... 更多名词  
  ];  
    
  // 形容词示例数据  
  const adjectives = [  
    '美味的',  
    '梦幻的',  
    '智能的',  
    '健康的',  
    '精彩的',  
    '有趣的',  
    '时尚的',  
    '激烈的',  
    '舒适的',  
    '安全的',  
    '新鲜的',  
    '豪华的',  
    '高效的',  
    '活力的',  
    '悦耳的',  
    '专业的',  
    '精致的',  
    '刺激的',  
    '坚固的',  
    '可靠的',  
    // ... 更多形容词  
  ];
    
  // 生成二级分类  
  try {  
    const treeData = generateRandomSecondaryCategories(primaryCategories, nouns, adjectives); 
    
    return treeData
  } catch (error) {  
    console.error('An error occurred:', error);  
  }

  return []
}

function generateRandomSecondaryCategories(primaryCategories: string[], nouns: string[], adjectives: string[]) {  
  return primaryCategories.map(primaryCategory => {  
    // 根据一级分类筛选出相关的二级分类名词  
    const relatedNouns = nouns.filter(noun => primaryCategory.includes(noun) || noun.includes(primaryCategory));  
      
    // 如果没有找到相关的名词，则使用所有名词  
    if (relatedNouns.length === 0) {  
      console.warn(`No related nouns found for primary category: ${primaryCategory}. Using all nouns as alternatives.`);  
      relatedNouns.push(...nouns);  
    }  
      
    // 用于存储生成的二级分类，确保不重复  
    const generatedSecondaryCategories = new Set();  
      
    // 生成不重复的五个随机的二级分类  
    while (generatedSecondaryCategories.size < 5) {  
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];  
      const randomNoun = relatedNouns[Math.floor(Math.random() * relatedNouns.length)];  
      const secondaryCategory = `${randomAdjective}${randomNoun}`;  
        
      // 如果二级分类是唯一的，则添加到集合中  
      if (!generatedSecondaryCategories.has(secondaryCategory)) {  
        generatedSecondaryCategories.add(secondaryCategory);  
      }  
    }  
      
    // 将集合转换为数组，并映射为所需的格式  
    const secondaryCategories = Array.from(generatedSecondaryCategories).map(secondaryCategory => ({  
      value: secondaryCategory,  
      label: secondaryCategory  
    }));  
      
    // 返回格式化后的一级分类和对应的二级分类列表  
    return {  
      value: primaryCategory,  
      label: primaryCategory,  
      children: secondaryCategories  
    };  
  });  
}  
  
// 使用示例...
  
export function getRandomCategoryPair(treeData: CascaderProps['options'] = []) {  
  // 随机选择一个一级分类  
  const randomPrimaryCategory = treeData[Math.floor(Math.random() * treeData.length)];  
    
  // 随机选择该一级分类下的一个二级分类  
  const randomSecondaryCategory = randomPrimaryCategory.children[Math.floor(Math.random() * randomPrimaryCategory.children.length)];  
    
  // 返回一级分类和二级分类的对象  
  return {  
    primaryCategory: randomPrimaryCategory.value,  
    secondaryCategory: randomSecondaryCategory.value  
  };  
}  
