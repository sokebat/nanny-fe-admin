const publicRoutes = {
  auth: {
    login: "/signin",
    adminLogin: "/admin/login",
    onboarding: "/admin/onboarding",
    completeInvite: "/admin/complete-invite",
  },
};

const protectedRoutes = {

  dashboard: '/',
  users: '/users',
  perks: '/perks',
  listings: '/listings',
  courses: '/courses',
  resources: '/resources',
  purchaseRequests: '/purchase-requests',
  subscriptions: '/subscriptions',
  analytics: '/analytics',
  invoices: '/invoices',
  team: '/team',

};

export { publicRoutes, protectedRoutes };
