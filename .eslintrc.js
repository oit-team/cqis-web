module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],

  parserOptions: {
    parser: '@babel/eslint-parser',
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 不需要分号
    semi: ['error', 'never'],
    // 允许使用一元运算符
    'no-plusplus': 'off',
    // 设置单行最大长度
    'max-len': ['error', 200, 2, {
      // 忽略含有链接的行
      ignoreUrls: true,
      // 忽略包含模板字面量的行
      ignoreTemplateLiterals: true,
      // 忽略含有字符串的行
      ignoreStrings: true,
    }],
    // 不强制箭头函数是否使用括号
    'arrow-parens': 'off',
    // 警告未使用的变量
    'no-unused-vars': 'warn',
    // 关闭函数命名检测
    'func-names': 'off',
    // 允许未使用过的表达式
    'no-unused-expressions': 'off',
    // 不同运算符必须添加括号
    'no-mixed-operators': ['error', {
      // 允许同级
      allowSamePrecedence: true,
    }],
    // 允许下划线命名
    'no-underscore-dangle': 'off',
    // 允许使用continue
    'no-continue': 'off',
    // 关闭换行符检测
    'linebreak-style': 'off',
    // 允许对函数参数重新赋值
    'no-param-reassign': 'off',
    // 不强制要求箭头函数体是否使用大括号
    'arrow-body-style': 'off',
    // 允许按位运算符
    'no-bitwise': 'off',
    // 不强制提供默认case
    'default-case': 'off',
    // 允许返回包裹在括号中的赋值语句
    'no-return-assign': 'error',
    // 限制代码行数（如果超过了这个数，应考虑抽离逻辑
    'max-lines': ['error', 2000],
    // 限制嵌套层数
    'max-depth': ['error', 5],
    // 限制函数嵌套层数
    'max-nested-callbacks': ['error', 5],
    // 允许使用全局变量
    'no-restricted-globals': 'off',
    // 强制对象解构，不强制数组解构
    'prefer-destructuring': ['error', {
      object: true,
      array: false,
    }],
    // 关闭单个模块使用默认导出
    'import/prefer-default-export': 'off',
    'global-require': 0,
    // 导入时不需要.vue后缀
    'import/extensions': ['error', 'never', {
      vue: 'never',
    }],
  },

  overrides: [
    {
      files: '**/*.{vue,js}',
      rules: {
        // 不需要自闭和标签空格
        'vue/html-closing-bracket-spacing': ['warn', {
          selfClosingTag: 'never',
        }],
        // 自闭和标签
        'vue/html-self-closing': ['warn', {
          html: {
            normal: 'never',
            void: 'always',
          },
        }],
        // 限制html属性单行最大数量
        'vue/max-attributes-per-line': ['error', {
          singleline: {
            max: 5,
          },
          multiline: {
            max: 1,
          },
        }],
        // 关闭组件名称必须多词
        'vue/multi-word-component-names': 'off',
        // 组件属性排序
        'vue/order-in-components': ['warn', {
          order: [
            'el',
            'name',
            'key',
            'parent',
            'functional',
            ['components', 'directives', 'filters'],
            'extends',
            'mixins',
            ['provide', 'inject'],
            'inheritAttrs',
            'model',
            ['props', 'propsData'],
            'data',
            'computed',
            'watch',
            'ROUTER_GUARDS',
            // 'LIFECYCLE_HOOKS',
            'beforeCreate',
            'created',
            'beforeMount',
            'mounted',
            'beforeUpdate',
            'updated',
            'activated',
            'deactivated',
            'beforeDestroy',
            'destroyed',
            'methods',
            ['template', 'render'],
            'renderError',
          ],
        }],
        // 警告未使用的组件
        'vue/no-unused-components': 'warn',
        // 不强制单行元素换行
        'vue/singleline-html-element-content-newline': 'off',
        // 不强制组件prop提供默认值
        'vue/require-default-prop': 'off',
        // 允许单个文件存在多个组件
        'vue/one-component-per-file': 'off',
      },
    },
  ],
}
