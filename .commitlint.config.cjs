module.exports = {
  // 继承默认配置
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 提交类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档
        'style', // 样式
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试
        'chore' // 其他
      ]
    ],
    // 提交信息长度限制
    'header-max-length': [2, 'always', 72],
    'subject-max-length': [2, 'always', 20],
    // 提交信息格式
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case']
  }
};
