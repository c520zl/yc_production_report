import request from '@/utils/request';

/**
 * 更新用户信息
 * @param {Object} data - 用户信息数据
 * @returns {Promise}
 */
export const updateUserInfo = (data) => {
  return request({
    url: '/api/admin/update-info',
    method: 'post',
    data
  });
};

export function updateAdminPassword(data) {
  return request({
    url: '/api/admin/change-password',
    method: 'post',
    data
  });
}

/**
 * 获取管理员列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getAdminList = (params) => {
  return request({
    url: '/api/admin/list',
    method: 'get',
    params
  });
};

/**
 * 删除管理员
 * @param {number} id - 管理员ID
 * @returns {Promise}
 */
export const deleteAdmin = (id) => {
  return request({
    url: `/api/admin/${id}`,
    method: 'delete'
  });
};

/**
 * 更新管理员状态
 * @param {Object} data - 状态数据
 * @returns {Promise}
 */
export const updateAdminStatus = (data) => {
  return request({
    url: '/api/admin/update-status',
    method: 'post',
    data
  });
};