/**
 * 认证工具类，用于处理token的存储和获取
 */

/**
 * 设置token到localStorage
 * @param {string} token - 认证token
 */
export const setToken = (token) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('token', token);
  }
};

/**
 * 从localStorage获取token
 * @returns {string|null} - 存储的token或null
 */
export const getToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * 从localStorage移除token
 */
export const removeToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('token');
  }
};

/**
 * 设置用户信息到localStorage
 * @param {Object} userInfo - 用户信息对象
 */
export const setUserInfo = (userInfo) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }
};

/**
 * 从localStorage获取用户信息
 * @returns {Object|null} - 用户信息对象或null
 */
export const getUserInfo = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }
  return null;
};

/**
 * 从localStorage移除用户信息
 */
export const removeUserInfo = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('userInfo');
  }
};

/**
 * 清除所有认证相关数据
 */
export const clearAuthData = () => {
  removeToken();
  removeUserInfo();
};

/**
 * 检查是否已登录
 * @returns {boolean} - 是否已登录
 */
export const isLoggedIn = () => {
  return !!getToken();
};