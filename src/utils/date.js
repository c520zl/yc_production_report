/**
 * 格式化日期为YYYY-MM-DD格式
 * @param {Date|string|number} date - 日期对象、字符串或时间戳
 * @returns {string} 格式化后的日期字符串，若日期无效则返回空字符串
 */
export function formatDate(date) {
  if (!date) return '';

  // 处理不同类型的日期输入
  let targetDate;
  if (date instanceof Date) {
    targetDate = date;
  } else if (typeof date === 'string') {
    // 尝试解析字符串日期
    targetDate = new Date(date);
  } else if (typeof date === 'number') {
    // 处理时间戳（支持秒级和毫秒级）
    targetDate = new Date(date.toString().length === 10 ? date * 1000 : date);
  } else {
    return '';
  }

  // 检查日期是否有效
  if (isNaN(targetDate.getTime())) return '';

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期时间为YYYY-MM-DD HH:MM:SS格式
 * @param {Date|string|number} date - 日期对象、字符串或时间戳
 * @returns {string} 格式化后的日期时间字符串，若日期无效则返回空字符串
 */
export function formatDateTime(date) {
  if (!date) return '';

  // 处理不同类型的日期输入
  let targetDate;
  if (date instanceof Date) {
    targetDate = date;
  } else if (typeof date === 'string') {
    targetDate = new Date(date);
  } else if (typeof date === 'number') {
    targetDate = new Date(date.toString().length === 10 ? date * 1000 : date);
  } else {
    return '';
  }

  // 检查日期是否有效
  if (isNaN(targetDate.getTime())) return '';

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const hours = String(targetDate.getHours()).padStart(2, '0');
  const minutes = String(targetDate.getMinutes()).padStart(2, '0');
  const seconds = String(targetDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 计算日期与当前日期的相对时间（如：3天前，2小时前）
 * @param {Date|string|number} date - 日期对象、字符串或时间戳
 * @returns {string} 相对时间描述，若日期无效则返回空字符串
 */
export function formatRelativeTime(date) {
  if (!date) return '';

  // 处理不同类型的日期输入
  let targetDate;
  if (date instanceof Date) {
    targetDate = date;
  } else if (typeof date === 'string') {
    targetDate = new Date(date);
  } else if (typeof date === 'number') {
    targetDate = new Date(date.toString().length === 10 ? date * 1000 : date);
  } else {
    return '';
  }

  // 检查日期是否有效
  if (isNaN(targetDate.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now - targetDate) / 1000);

  if (diffInSeconds < 60) {
    return '刚刚';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}分钟前`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}小时前`;
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)}天前`;
  } else if (diffInSeconds < 31536000) {
    return `${Math.floor(diffInSeconds / 2592000)}个月前`;
  } else {
    return `${Math.floor(diffInSeconds / 31536000)}年前`;
  }
}