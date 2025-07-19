import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router';
import App from './App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 使用插件
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.mount('#app');

// 添加应用启动成功提示
console.log('生产报表管理系统启动成功');
// 登录成功后的欢迎提示
router.afterEach((to) => {
  if (to.path === '/dashboard') {
    setTimeout(() => {
      window.$message?.success('欢迎使用生产报表管理系统');
    }, 500);
  }
});
