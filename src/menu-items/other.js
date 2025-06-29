// assets
import { IconBrandChrome, IconHelp, IconBook, IconFile } from '@tabler/icons-react';

// constant
const icons = { IconFile, IconHelp, IconBook };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'billCreation-docs-roadmap',
    type: 'group',
    children: [
        // {
        //   id: 'billCreation-page',
        //   title: 'Bill Creation Page',
        //   type: 'item',
        //   url: '/billCreation-page',
        //   icon: icons.IconBrandChrome,
        //   breadcrumbs: false
        // },
        // {
        //   id: 'bookings',
        //   title: 'Bookings',
        //   type: 'item',
        //   url: '/',
        //   icon: icons.IconBook,
        //   breadcrumbs: false
        // }
        // ,
        {
            id: 'generateBillManual',
            title: 'GenerateBillManual',
            type: 'item',
            url: '/manual',
            icon: icons.IconFile,
            breadcrumbs: false
        }
        // {
        //   id: 'documentation',
        //   title: 'Documentation',
        //   type: 'item',
        //   url: 'https://codedthemes.gitbook.io/berry/',
        //   icon: icons.IconHelp,
        //   external: true,
        //   target: true
        // }
    ]
};

export default other;
