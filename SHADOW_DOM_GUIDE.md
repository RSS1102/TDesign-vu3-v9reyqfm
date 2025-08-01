# TDesign-vue-next Shadow DOM 使用指南

## 概述
本指南详细说明了如何在Shadow DOM环境中正确使用TDesign-vue-next组件，解决样式丢失问题。

## Shadow DOM中的样式问题

### 问题根源
Shadow DOM的样式隔离特性导致：
1. 外部CSS无法穿透Shadow边界
2. TDesign的组件样式无法自动应用到Shadow DOM内部
3. 字体图标等外部资源需要手动引入

### 解决方案

#### 1. 样式复制策略
将外部样式表复制到Shadow DOM内部：

```javascript
const copyStylesToShadowDOM = (shadowRoot) => {
  // 复制TDesign样式
  const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
  styles.forEach(style => {
    if (style.tagName === 'STYLE') {
      const newStyle = document.createElement('style');
      newStyle.textContent = style.textContent;
      shadowRoot.appendChild(newStyle);
    } else if (style.href && style.href.includes('tdesign')) {
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = style.href;
      shadowRoot.appendChild(newLink);
    }
  });
};
```

#### 2. 字体图标处理
确保TDesign的字体图标在Shadow DOM中可用：

```javascript
const loadFontIcons = (shadowRoot) => {
  // 加载TDesign图标字体
  const iconFont = document.createElement('link');
  iconFont.rel = 'stylesheet';
  iconFont.href = 'https://tdesign.gtimg.com/icon/0.0.3/fonts/index.css';
  shadowRoot.appendChild(iconFont);
};
```

#### 3. 完整示例代码

```javascript
import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';

// 创建Shadow DOM应用
const createShadowApp = (shadowHost) => {
  const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
  
  // 创建容器
  const appContainer = document.createElement('div');
  appContainer.id = 'shadow-app';
  shadowRoot.appendChild(appContainer);
  
  // 复制所有必要样式
  copyStylesToShadowDOM(shadowRoot);
  
  // 创建Vue应用
  const app = createApp({
    template: `
      <t-button theme="primary">Shadow DOM按钮</t-button>
    `
  });
  
  app.use(TDesign);
  app.mount(appContainer);
};
```

## 最佳实践

### 1. 样式管理
- 在Shadow DOM创建后立即复制样式
- 使用`mode: 'open'`便于调试
- 考虑使用CSS-in-JS方案避免样式冲突

### 2. 性能优化
- 缓存已复制的样式，避免重复操作
- 使用CSS变量实现主题定制
- 按需加载组件样式

### 3. 调试技巧
- 使用Chrome DevTools的Shadow DOM检查功能
- 检查网络面板确认字体图标是否加载
- 验证样式是否正确应用到组件

## 常见问题解决

### Q: 按钮样式不生效
A: 检查是否复制了完整的TDesign样式表，包括组件特定样式

### Q: 图标显示为方块
A: 确认字体图标CSS已正确加载到Shadow DOM

### Q: 主题样式异常
A: 确保CSS变量和主题样式也被复制到Shadow DOM

## 进阶用法

### 使用CSS-in-JS
```javascript
import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import { createTDesignTheme } from 'tdesign-vue-next/es/theme';

// 创建主题配置
const theme = createTDesignTheme({
  primaryColor: '#0052d9',
  successColor: '#00a870',
  // ...其他主题配置
});
```

### 动态样式更新
```javascript
// 监听主题变化并更新Shadow DOM样式
const updateShadowStyles = (shadowRoot, newTheme) => {
  const styleElement = shadowRoot.querySelector('#dynamic-theme');
  if (styleElement) {
    styleElement.textContent = generateThemeCSS(newTheme);
  }
};
```