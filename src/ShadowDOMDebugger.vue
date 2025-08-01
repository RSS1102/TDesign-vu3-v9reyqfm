<template>
  <div>
    <h3>Shadow DOM 调试工具</h3>
    <button @click="checkShadowDOM" style="margin-right: 10px;">检查 Shadow DOM 状态</button>
    <button @click="forceRemount">强制重新挂载</button>
    
    <div v-if="debugInfo" style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
      <h4>调试信息：</h4>
      <pre style="background: white; padding: 10px; border-radius: 4px; font-size: 12px; overflow-x: auto;">{{ debugInfo }}</pre>
    </div>
    
    <div ref="debugShadowHost" style="margin-top: 20px; border: 1px solid #ccc; padding: 10px;">
      <div class="debug-shadow-container"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, h } from 'vue';
import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import { Button as TButton } from 'tdesign-vue-next';

export default {
  name: 'ShadowDOMDebugger',
  components: {
    TButton
  },
  setup() {
    const debugShadowHost = ref(null);
    const debugInfo = ref('');
    
    const checkShadowDOM = () => {
      const host = debugShadowHost.value?.querySelector('.debug-shadow-container');
      if (!host) {
        debugInfo.value = '错误：找不到调试容器';
        return;
      }
      
      const info = {
        hostExists: !!host,
        shadowRoot: host.shadowRoot ? '存在' : '不存在',
        childNodes: host.shadowRoot ? host.shadowRoot.childNodes.length : 0,
        innerHTML: host.shadowRoot ? host.shadowRoot.innerHTML.substring(0, 200) + '...' : 'N/A',
        styles: host.shadowRoot ? host.shadowRoot.querySelectorAll('style, link').length : 0,
        vueApp: host.shadowRoot?.querySelector('#debug-shadow-app') ? '已挂载' : '未挂载'
      };
      
      debugInfo.value = JSON.stringify(info, null, 2);
    };
    
    const forceRemount = async () => {
      const host = debugShadowHost.value?.querySelector('.debug-shadow-container');
      if (!host) return;
      
      // 清理现有内容
      if (host.shadowRoot) {
        host.shadowRoot.innerHTML = '';
      } else {
        host.innerHTML = '';
      }
      
      // 创建新的Shadow DOM
      const shadowRoot = host.shadowRoot || host.attachShadow({ mode: 'open' });
      
      // 创建容器
      const container = document.createElement('div');
      container.id = 'debug-shadow-app';
      shadowRoot.appendChild(container);
      
      // 创建简单的Vue组件
      const DebugApp = {
        setup() {
          return () => h('div', {
            style: {
              padding: '15px',
              background: '#e8f4fd',
              borderRadius: '4px',
              fontFamily: 'Arial, sans-serif'
            }
          }, [
            h('h4', {}, '✅ Shadow DOM 调试成功！'),
            h('p', {}, '这是一个在 Shadow DOM 中运行的 TDesign 按钮：'),
            h(TButton, {
              theme: 'primary',
              size: 'small'
            }, () => '测试按钮'),
            h('p', {
              style: {
                marginTop: '10px',
                fontSize: '12px',
                color: '#666'
              }
            }, '如果看到这个按钮，说明 Shadow DOM 工作正常')
          ]);
        }
      };
      
      try {
        const app = createApp(DebugApp);
        app.use(TDesign);
        app.mount(container);
        debugInfo.value = '重新挂载成功！';
        
        // 延迟检查状态
        setTimeout(checkShadowDOM, 500);
      } catch (error) {
        debugInfo.value = `挂载失败: ${error.message}`;
      }
    };
    
    onMounted(() => {
      setTimeout(forceRemount, 100);
    });
    
    return {
      debugShadowHost,
      debugInfo,
      checkShadowDOM,
      forceRemount
    };
  }
};
</script>