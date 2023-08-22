export default [
  { path: '/user', layout: false,
    routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/', redirect: '/add_chart_async' },
  { path: '/add_chart', name: 'Create Chart', icon: 'barChart', component: './AddChart' },
  // { path: '/add_chart_async', name: 'Create New Chart', icon: 'barChart', component: './AddChartAsync' },
  { path: '/my_chart', name: 'My Charts', icon: 'pieChart', component: './MyChart',
    routes: [{ path: 'edit_chart', component: './EditChart' }] },

  {
    path: '/admin', icon: 'crown', access: 'canAdmin',
    routes: [
      { path: '/admin', name: '管理页面', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '管理页面2', component: './Admin' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
