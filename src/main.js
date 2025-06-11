
  import { createApp } from 'vue';
  import TDesign from 'tdesign-vue-next';
  import Demo from './demo.vue';

  // 引入组件库全局样式资源
  import 'tdesign-vue-next/es/style/index.css';
  import './index.css';

  const app = createApp(Demo);

  app.use(TDesign).mount('#app');
