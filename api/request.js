// api/request.js
export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: process.env.VUE_APP_BASE_API + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
          uni.showToast({
            title: '请求失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        reject(err);
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  });
};