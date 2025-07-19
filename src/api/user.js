import request from '@/utils/request';

/**
 * 用户登录
 * @param {Object} data - 登录表单数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export const login = (data) => {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  });
};

/**
 * 用户注册（管理员）
 * @param {Object} data - 注册表单数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @returns {Promise}
 */
export const register = (data) => {
  return request({
    url: '/api/admin/register',
    method: 'post',
    data
  });
};

/**
 * 获取用户信息
 * @returns {Promise}
 */
export const getUserInfo = () => {
  return request({
    url: '/api/admin/info',
    method: 'get'
  });
};

/**
 * 用户登出
 * @returns {Promise}
 */
export const logout = () => {
  return request({
    url: '/api/admin/logout',
    method: 'post'
  });
};

/**
 * 修改密码
 * @param {Object} data - 密码修改数据
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise}
 */
export const changePassword = (data) => {
  return request({
    url: '/api/admin/change-password',
    method: 'post',
    data
  });
};