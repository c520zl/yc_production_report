import { defineStore } from 'pinia';
import { login as loginApi } from '@/api/user';
import { setToken, removeToken } from '@/utils/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  }),
  getters: {
    isLogin: (state) => !!state.token
  },
  actions: {
    // 用户登录
    async login(loginForm) {
      try {
        const response = await loginApi(loginForm);
        console.log('登录响应数据:', response);
        
        // 检查后端返回的状态码
        if (response.code !== 0) {
          throw new Error(response.message || '登录失败，请检查用户名和密码');
        }
        
        // 从response.data中提取token和userInfo，适配后端非嵌套数据结构
        const { token, userInfo } = response.data;

        if (!token || !userInfo) {
          throw new Error('登录响应数据不完整，缺少token或userInfo');
        }

        // 存储token和用户信息
        this.token = token;
        this.userInfo = userInfo;
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setToken(token);

        return Promise.resolve(response.data);
      } catch (error) {
        console.error('登录响应错误:', error);
        return Promise.reject(error);
      }
    },

    // 用户登出
    logout() {
      this.token = '';
      this.userInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      removeToken();
    }
  }
});