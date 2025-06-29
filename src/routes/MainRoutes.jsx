import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
// const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
// const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
// const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// billCreation page routing
const BillCreation = Loadable(lazy(() => import('views/billCreation-page')));
const Bookings = Loadable(lazy(() => import('views/bookings')));
const BookingDetails = Loadable(lazy(() => import('views/bookingDetails')));
const GenerateBill = Loadable(lazy(() => import('views/generateBill')));
const GenerateBillManual = Loadable(lazy(() => import('views/generateBillManual')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/manual',
            // element: <Bookings />
            element: <GenerateBillManual />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        // {
        //   path: 'utils',
        //   children: [
        //     {
        //       path: 'util-typography',
        //       element: <UtilsTypography />
        //     }
        //   ]
        // },
        // {
        //   path: 'utils',
        //   children: [
        //     {
        //       path: 'util-color',
        //       element: <UtilsColor />
        //     }
        //   ]
        // },
        // {
        //   path: 'utils',
        //   children: [
        //     {
        //       path: 'util-shadow',
        //       element: <UtilsShadow />
        //     }
        //   ]
        // },
        // {
        //   path: 'icons',
        //   children: [
        //     {
        //       path: 'tabler-icons',
        //       element: <UtilsTablerIcons />
        //     }
        //   ]
        // },
        // {
        //   path: 'icons',
        //   children: [
        //     {
        //       path: 'material-icons',
        //       element: <UtilsMaterialIcons />
        //     }
        //   ]
        // },
        {
            path: 'billCreation-page',
            element: <BillCreation />
        },
        // {
        //   path: '/bookings',
        //   element: <Bookings />
        // },
        {
            path: 'bookingDetails/:id',
            element: <BookingDetails />
        },
        {
            path: 'generateBill/:id',
            element: <GenerateBill />
        },
        {
            path: '/manual',
            element: <GenerateBillManual />
        }
    ]
};

export default MainRoutes;
