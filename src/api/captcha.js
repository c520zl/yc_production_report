/**
 * 验证码API封装
 */
import axios from 'axios';

/**
 * 获取验证码图片URL
 * @returns {Promise<string>} 验证码图片URL
 */
export function getCaptchaUrl() {
  return axios({withCredentials: true,
    url: '/api/captcha',
    method: 'get',
    params: {
      timestamp: new Date().getTime()
    },
    responseType: 'blob'
  }).then(response => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(response.data);
    });
  });
}