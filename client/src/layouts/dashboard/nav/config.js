// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics')
  },
  {
    title: 'Deals',
    path: '/dashboard/deals',
    icon: icon('ic_user')
  },
  {
    title: 'Pay',
    path: '/dashboard/pay',
    icon: icon('ic_user')
  },
  // {
  //   title: 'Users',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user')
  // },
  // {
  //   title: 'Listings',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart')
  // },
  {
    title: 'Resources',
    path: '/dashboard/blog',
    icon: icon('ic_blog')
  },
  {
    title: 'Log Out',
    path: '/login',
    icon: icon('ic_lock')
  },
  // {
  //   title: 'Leads',
  //   path: '/dashboard/leads',
  //   icon: icon('ic_blog')
  // },
  // {
  //   title: 'Dynamic-Leads',
  //   path: '/dashboard/dynamic-leads',
  //   icon: icon('ic_analytics')
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled')
  // }
];

export default navConfig;