export const Constants = {
    ROLES: {
      ADMIN_ROLE: 'admin',
      SUPERADMIN_ROLE: 'superadmin',
      NORMAL_ROLE: 'user',
    },
    BY_PASS_URLS: ['/auth/signup', '/auth/signin'],
    BY_PASS_URLS_SUBSCRIBED: ['/auth/signup', '/auth/signin', '/user/currentuser','/auth/updatepassword', '/auth/subscribe', '/auth/forgot-password', '/auth/reset-password'],
    BY_PASS_URLS_ROLE: ['/auth/signup', '/auth/signin', '/user/currentuser'],
  };