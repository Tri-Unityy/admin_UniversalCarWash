// assets
import { IconKey, IconReceipt2, IconFileInvoice } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconReceipt2,
  IconFileInvoice
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'bills',
      title: 'Bills',
      type: 'item',
      url: '/bills',
      icon: icons.IconReceipt2,
      target: false
    },
    {
      id: 'manual-bill',
      title: 'Generate Manual Bill',
      type: 'item',
      url: '/manual',
      icon: icons.IconFileInvoice,
      target: false
    },
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'login3',
          title: 'Login',
          type: 'item',
          url: '/pages/login/login3',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        }
      ]
    }
  ]
};

export default pages;
