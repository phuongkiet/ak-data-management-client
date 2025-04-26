import { createBrowserRouter, RouteObject } from 'react-router-dom'
import App from '../layout/App'
import Home from '../../pages/Dashboard/Home'
import SignIn from '../../pages/AuthPages/SignIn'
import SignUp from '../../pages/AuthPages/SignUp'
import NotFound from '../../pages/OtherPage/NotFound'
import UserProfiles from '../../pages/UserProfiles'
import Videos from '../../pages/UiElements/Videos'
import Images from '../../pages/UiElements/Images'
import Alerts from '../../pages/UiElements/Alerts'
import Badges from '../../pages/UiElements/Badges'
import Avatars from '../../pages/UiElements/Avatars'
import Buttons from '../../pages/UiElements/Buttons'
import LineChart from '../../pages/Charts/LineChart'
import BarChart from '../../pages/Charts/BarChart'
import Calendar from '../../pages/Calendar'
import ProductTable from '../../pages/Tables/product/ProductTable.tsx'
import StrategyProductTable from '../../pages/Tables/product/StrategyProductTable.tsx'
import FormElements from '../../pages/Forms/FormElements'
import Blank from '../../pages/Blank'
import ProductDetail from '../../pages/Tables/product/product-detail/ProductDetail.tsx'
// import { ProtectedRoute } from './protectedRoute.tsx'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      // Others Page
      { path: 'profile', element: <UserProfiles /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'blank', element: <Blank /> },

      // Forms
      { path: 'form-elements', element: <FormElements /> },

      // Tables
      { path: 'products', element: <ProductTable /> },
      { path: 'strategy-products', element: <StrategyProductTable /> },

      { path: 'products/detail/:id', element: <ProductDetail/>},

      // UI Elements
      { path: 'alerts', element: <Alerts /> },
      { path: 'avatars', element: <Avatars /> },
      { path: 'badge', element: <Badges /> },
      { path: 'buttons', element: <Buttons /> },
      { path: 'images', element: <Images /> },
      { path: 'videos', element: <Videos /> },

      // Charts
      { path: 'line-chart', element: <LineChart /> },
      { path: 'bar-chart', element: <BarChart /> },

      // // Protected route
      // {
      //   path: "admin",
      //   element: <ProtectedRoute allowedRoles={["Admin"]} />,
      //   children: [
      //     {
      //       index: true,
      //       element: (
      //         <Home/>
      //       ),
      //     }
      //   ]
      // }
    ]
  },

// Auth Routes
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },

// Catch all
  { path: '*', element: <NotFound /> }
]

export const router = createBrowserRouter(routes)
