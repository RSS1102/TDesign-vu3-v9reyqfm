<template>
  <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
    <h1>TDesign Vue Next Shadow DOM 完整示例</h1>
    
    <!-- 调试工具 -->
    <div style="margin-bottom: 30px; padding: 15px; border: 1px solid #007bff; border-radius: 8px; background: #f8f9fa;">
      <h2 style="color: #007bff; margin-top: 0;">🔧 调试工具</h2>
      <ShadowDOMDebugger />
    </div>

    <!-- 普通环境下的TDesign按钮 -->
    <div style="margin-bottom: 30px;">
      <h2>普通环境下的 TDesign 按钮</h2>
      <t-button theme="primary" @click="showAlert">普通按钮</t-button>
    </div>

    <!-- Shadow DOM中的TDesign按钮 -->
    <div style="margin-bottom: 30px;">
      <h2>Shadow DOM 中的 TDesign 按钮</h2>
      <ShadowDOMExample />
    </div>

    <!-- 使用说明 -->
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
      <h3>💡 使用说明</h3>
      <ol style="line-height: 1.6;">
        <li>打开浏览器控制台查看详细日志</li>
        <li>使用调试工具检查 Shadow DOM 状态</li>
        <li>如果 Shadow DOM 为空，点击"强制重新挂载"按钮</li>
        <li>检查网络面板确认所有样式文件已加载</li>
      </ol>
    </div>
  </div>
</template>

<script>
import ShadowDOMExample from './ShadowDOMExample.vue';
import ShadowDOMDebugger from './ShadowDOMDebugger.vue';

export default {
  name: 'Demo',
  components: {
    ShadowDOMExample,
    ShadowDOMDebugger
  },
  methods: {
    showAlert() {
      alert('这是普通环境下的按钮点击！');
    }
  }
};
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fafafa;
  margin: 0;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #555;
  border-bottom: 2px solid #eee;
  padding-bottom: 5px;
}
</style>
