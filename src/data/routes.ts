const publicRoutes = {
  auth: {
    login: "/signin",
  },
};

const protectedRoutes = {

  dashboard: '/',
  perks: '/perks',
  listings: '/listings',
  courses: '/courses',
  resources: '/resources',
  purchaseRequests: '/purchase-requests',
  subscriptions: '/subscriptions',
  analytics: '/analytics',
  invoices: '/invoices',
  
};

export { publicRoutes, protectedRoutes };
