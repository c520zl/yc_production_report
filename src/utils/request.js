import axios from 'axios';
import Cookies from 'js-cookie';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/store/modules/user';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 5000,
  withCredentials: true
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    // 添加token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    // 添加CSRF令牌
    const xsrfToken = Cookies.get('XSRF-TOKEN');
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = xsrfToken;
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
    if (error.response && error.response.status === 401) {
  // 对用户信息接口的401错误特殊处理，避免自动登出
  if (error.config.url.includes('/admin/info')) {
    ElMessage.error('获取用户信息失败，请重新登录');
    return Promise.reject(error);
  }
  const userStore = useUserStore();
  userStore.logout();
  window.location.href = '/login';
  ElMessage.error(error.response.data.message || '登录状态已过期，请重新登录');
} else if (error.response && error.response.status === 403) {
  ElMessage.error(error.response.data.message || '权限不足，无法执行此操作');
} else {
  ElMessage.error(error.message || '网络异常，请稍后重试');
}
    return Promise.reject(error);
  }
);

export default service;