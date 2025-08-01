<template>
  <div>
    <h2>Shadow DOM TDesign Button 示例</h2>
    <div ref="shadowHost" class="shadow-container">
      <div class="loading">正在加载 Shadow DOM...</div>
    </div>
    <div v-if="error" class="error">
      <h3>错误信息：</h3>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, h } from 'vue';
import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import { Button as TButton } from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';

export default {
  name: 'ShadowDOMExample',
  components: {
    TButton
  },
  setup() {
    const shadowHost = ref(null);
    const error = ref(null);

    onMounted(async () => {
      try {
        await nextTick();
        console.log('开始创建 Shadow DOM...');
        
        if (!shadowHost.value) {
          throw new Error('shadowHost 未找到');
        }

        // 清空loading内容
        shadowHost.value.innerHTML = '';
        
        // 创建Shadow DOM
        const shadowRoot = shadowHost.value.attachShadow({ mode: 'open' });
        console.log('Shadow DOM 创建成功');
        
        // 创建Shadow DOM内部的容器
        const shadowContainer = document.createElement('div');
        shadowContainer.id = 'shadow-app';
        shadowRoot.appendChild(shadowContainer);
        console.log('容器创建成功');
        
        // 复制所有必要的样式到Shadow DOM
        await copyStylesToShadowDOM(shadowRoot);
        console.log('样式复制完成');
        
        // 创建Shadow DOM内部的Vue组件
        const ShadowApp = {
          setup() {
            const clickCount = ref(0);
            
            const handleClick = () => {
              clickCount.value++;
              console.log('Shadow DOM 按钮被点击了！当前次数：', clickCount.value);
            };
            
            return () => h('div', {
              style: {
                padding: '20px',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }
            }, [
              h('h3', { style: { color: '#333', marginBottom: '16px' } }, '✅ Shadow DOM 中的 TDesign 按钮'),
              h('div', { style: { marginBottom: '12px' } }, [
                h(TButton, {
                  theme: 'primary',
                  size: 'medium',
                  onClick: handleClick
                }, () => '主要按钮'),
                h(TButton, {
                  theme: 'success',
                  size: 'medium',
                  style: { marginLeft: '10px' }
                }, () => '成功按钮'),
                h(TButton, {
                  theme: 'warning',
                  size: 'medium',
                  style: { marginLeft: '10px' }
                }, () => '警告按钮'),
                h(TButton, {
                  theme: 'danger',
                  size: 'medium',
                  style: { marginLeft: '10px' }
                }, () => '危险按钮')
              ]),
              h('p', { 
                style: { 
                  marginTop: '15px', 
                  color: '#666', 
                  fontSize: '14px' 
                } 
              }, `点击次数: ${clickCount.value}`),
              h('div', { 
                style: { 
                  marginTop: '10px', 
                  padding: '10px', 
                  background: '#e8f4fd', 
                  borderRadius: '4px', 
                  fontSize: '12px', 
                  color: '#666' 
                } 
              }, '💡 提示：这些按钮运行在完全隔离的 Shadow DOM 环境中')
            ]);
          }
        };
        
        // 在Shadow DOM中创建并挂载Vue应用
        console.log('开始创建 Vue 应用...');
        const shadowApp = createApp(ShadowApp);
        
        // 使用TDesign
        shadowApp.use(TDesign);
        
        // 延迟挂载，确保样式加载完成
        setTimeout(() => {
          try {
            shadowApp.mount(shadowContainer);
            console.log('✅ Vue 应用挂载成功！');
          } catch (mountError) {
            console.error('❌ Vue 应用挂载失败：', mountError);
            error.value = `Vue 应用挂载失败：${mountError.message}`;
          }
        }, 100);
        
      } catch (err) {
        console.error('❌ Shadow DOM 创建失败：', err);
        error.value = `错误：${err.message}\n${err.stack}`;
      }
    });

    // 改进的样式复制函数
    const copyStylesToShadowDOM = async (shadowRoot) => {
      return new Promise((resolve) => {
        let stylesCopied = 0;
        
        console.log('开始复制样式...');
        
        // 复制内联样式
        const inlineStyles = document.querySelectorAll('style');
        inlineStyles.forEach((style, index) => {
          try {
            const newStyle = document.createElement('style');
            newStyle.textContent = style.textContent;
            newStyle.setAttribute('data-source', `inline-style-${index}`);
            shadowRoot.appendChild(newStyle);
            stylesCopied++;
          } catch (e) {
            console.warn(`复制内联样式 ${index + 1} 失败：`, e);
          }
        });

        // 复制外部样式表
        const externalStyles = document.querySelectorAll('link[rel="stylesheet"]');
        externalStyles.forEach((link, index) => {
          try {
            const newLink = document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = link.href;
            newLink.setAttribute('data-source', `external-style-${index}`);
            shadowRoot.appendChild(newLink);
            stylesCopied++;
          } catch (e) {
            console.warn(`复制外部样式 ${index + 1} 失败：`, e);
          }
        });

        // 添加调试样式
        const debugStyle = document.createElement('style');
        debugStyle.textContent = `
          #shadow-app {
            display: block !important;
            visibility: visible !important;
          }
        `;
        shadowRoot.appendChild(debugStyle);

        console.log(`✅ 样式复制完成，共复制 ${stylesCopied} 个样式`);
        resolve();
      });
    };

    return {
      shadowHost,
      error
    };
  }
};
</script>

<style scoped>
.shadow-container {
  border: 2px solid #007bff;
  border-radius: 8px;
  margin: 20px 0;
  min-height: 200px;
  position: relative;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.error {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 15px;
  margin: 10px 0;
  color: #c33;
}

.error pre {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>