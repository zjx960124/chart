/**
 * 跳转到登录页面
 */
export function login() {
  window.location.href =
      process.env.VUE_APP_BASE_API +
      '/rest/report/login/redirect?url=' +
      encodeURIComponent(window.location.href)
}
