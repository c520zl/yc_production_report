import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';

/**
 * 将JSON数据导出为Excel文件
 * @param {Object} options - 导出选项
 * @param {Array} options.header - Excel表头
 * @param {Array} options.data - 导出数据
 * @param {string} options.filename - 文件名
 * @param {string} options.sheetName - 工作表名称
 */
export const exportJsonToExcel = ({ header, data, filename = 'export', sheetName = 'Sheet1' }) => {
  try {
    // 检查数据
    if (!data || !data.length) {
      ElMessage.warning('没有可导出的数据');
      return;
    }

    // 处理表头和数据
    const headerData = [header];
    const excelData = data.map(item => header.map(key => item[key]));
    const wsData = [...headerData, ...excelData];

    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // 创建工作簿并添加工作表
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // 导出文件
    XLSX.writeFile(wb, `${filename}.xlsx`);
    // ElMessage.success('导出成功');
  } catch (error) {
    console.error('Excel导出失败:', error);
    ElMessage.error('导出失败，请重试');
  }
};

/**
 * 格式化导出数据中的日期字段
 * @param {Date} date - 日期对象
 * @param {string} format - 日期格式，如'yyyy-MM-dd'或'yyyy-MM-dd HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDateForExport = (date, format = 'yyyy-MM-dd') => {
  if (!date) return '';
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
};

/**
 * 处理大数据量导出，避免页面卡顿
 * @param {Object} options - 导出选项（同exportJsonToExcel）
 * @param {number} batchSize - 每批处理数据量
 */
export const exportLargeDataToExcel = async ({ header, data, filename = 'export', sheetName = 'Sheet1' }, batchSize = 1000) => {
  try {
    if (!data || !data.length) {
      ElMessage.warning('没有可导出的数据');
      return;
    }

    // 创建表头
    const headerData = [header];
    let wsData = [...headerData];

    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // 分批处理数据
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const excelBatch = batch.map(item => header.map(key => item[key]));
      // 将批次数据追加到工作表
      XLSX.utils.sheet_add_aoa(ws, excelBatch, { origin: -1 });
      // 让出主线程，避免卡顿
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // 导出文件
    XLSX.writeFile(wb, `${filename}.xlsx`);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('大数据量导出失败:', error);
    ElMessage.error('导出失败，请重试');
  }
};