import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/store/modules/user';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    // 添加token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    // 处理HTTP错误状态码
    if (error.response && [401, 403].includes(error.response.status)) {
      const userStore = useUserStore();
      userStore.logout();
      window.location.href = '/login';
      ElMessage.error(error.response.data.message || '登录状态已过期，请重新登录');
    } else {
      ElMessage.error(error.message || '网络异常，请稍后重试');
    }
    return Promise.reject(error);
  }
);

export default service;