import request from '@/utils/request';

// 生产数据分页查询
export function getProductionData(params) {
  return request({
    url: '/api/production-report/page',
    method: 'get',
    params
  })
}

// 创建生产数据
export function createProduction(data) {
  return request({
    url: '/api/production-report',
    method: 'post',
    data
  })
}

// 更新生产数据
export function updateProduction(id, data, config = {}) {
  return request({
    url: `/api/production-report/${id}`,
    method: 'put',
    data,
    ...config
  })
}

// 删除生产数据
export function deleteProduction(id, config = {}) {
  return request({
    url: `/api/production-report/${id}`,
    method: 'delete',
    ...config
  })
}

/**
 * 获取生产汇总数据
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @returns {Promise}
 */
export const getProductionSummary = (params) => request({
  url: '/api/production-report/summary',
  method: 'get',
  params
});
