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
import Calendar from '../../pages/Calendar'
import ProductTable from '../../pages/Tables/product/ProductTable.tsx'
import StrategyProductTable from '../../pages/Tables/product/StrategyProductTable.tsx'
import FormElements from '../../pages/Forms/FormElements'
import Blank from '../../pages/Blank'
import ProductDetail from '../../pages/Products/product-detail/ProductDetail.tsx'
import AddProduct from '../../pages/Products/add-product/AddProduct.tsx'
import SupplierTable from '../../pages/Tables/supplier/SupplierTable.tsx'
import PatternTable from '../../pages/Tables/pattern/PatternTable.tsx'
import ColorTable from '../../pages/Tables/color/ColorTable.tsx'
import BodyColorTable from '../../pages/Tables/body-color/BodyColorTable.tsx'
import MaterialTable from '../../pages/Tables/material/MaterialTable.tsx'
import SizeTable from '../../pages/Tables/size/SizeTable.tsx'
import OriginTable from '../../pages/Tables/origin/OriginTable.tsx'
import StorageTable from '../../pages/Tables/storage/StorageTable.tsx'
import SurfaceTable from '../../pages/Tables/surface/SurfaceTable.tsx'
import WaterAbsorptionTable from '../../pages/Tables/water-absorption/WaterAbsorptionTable.tsx'
import AntiSlipperyTable from '../../pages/Tables/anti-slippery/AntiSlipperyTable.tsx'
import ProcessingTable from '../../pages/Tables/processing/ProcessingTable.tsx'
import CompanyCodeTable from '../../pages/Tables/company-code/CompanyCodeTable.tsx'
import FactoryTable from '../../pages/Tables/factory/FactoryTable.tsx'
import { ProtectedRoute } from './protectedRoute.tsx'
import UserTable from '../../pages/Users/user-table/UserTable.tsx'
import ForgotPassword from '../../pages/AuthPages/ForgotPassword.tsx'
import ResetPassword from '../../pages/AuthPages/ResetPassword.tsx'
import VerifyEmail from '../../pages/AuthPages/VerifyEmail.tsx'
import StrategyProductDetail from '../../pages/StrategyProducts/StrategyProductDetail.tsx'
import SupplierDetail from '../../pages/Suppliers/SupplierDetail.tsx'
import CalculatedUnitTable from '../../pages/Tables/calculated-unit/CalculatedUnitTable.tsx'
import Pricing from '../../pages/Products/Pricing.tsx'
import Setting from '../../pages/Setting.tsx'
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

      // Tables - Products
      { path: 'products', element: <ProductTable /> },
      { path: 'add-product', element: <AddProduct />},
      { path: 'strategy-products', element: <StrategyProductTable /> },
      { path: 'products/detail/:id', element: <ProductDetail/>},
      { path: 'strategy-products/detail/:id', element: <StrategyProductDetail/>},
      // Tables - Suppliers
      { path: 'suppliers', element: <SupplierTable /> },
      // { path: 'add-supplier', element: <AddProduct />},

      // Tables - Patterns
      { path: 'patterns', element: <PatternTable /> },

      // Tables - Color
      { path: 'colors', element: <ColorTable /> },

      // Tables - Body Color
      { path: 'body-colors', element: <BodyColorTable /> },

      // Tables - Material
      { path: 'materials', element: <MaterialTable /> },

      // Tables - Size
      { path: 'sizes', element: <SizeTable /> },

      // Tables - Origin
      { path: 'origins', element: <OriginTable /> },

      // Tables - Storage
      { path: 'storages', element: <StorageTable /> },

      // Tables - Surface
      { path: 'surfaces', element: <SurfaceTable /> },

      // Tables - Water Absorption
      { path: 'water-absorptions', element: <WaterAbsorptionTable /> },

      // Tables - Anti Slippery
      { path: 'anti-slipperys', element: <AntiSlipperyTable /> },

      // Tables - Processing
      { path: 'processings', element: <ProcessingTable /> },

      // Tables - Company Code
      { path: 'company-codes', element: <CompanyCodeTable /> },

      // Tables - Factory
      { path: 'factories', element: <FactoryTable /> },

      // Tables - Calculated Unit
      { path: 'calculated-units', element: <CalculatedUnitTable /> },
      
      // UI Elements
      { path: 'alerts', element: <Alerts /> },
      { path: 'avatars', element: <Avatars /> },
      { path: 'badge', element: <Badges /> },
      { path: 'buttons', element: <Buttons /> },
      { path: 'images', element: <Images /> },
      { path: 'videos', element: <Videos /> },

      { path: 'pricing', element: <Pricing /> },

      // Protected route
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={["Admin"]} />,
        children: [
          {
            index: true,
            path: 'users',
            element: (
              <UserTable/>
            ),
          },
          {
            path: 'settings',
            element: (
              <Setting/>
            ),
          },
        ]
      },

      {
        path: "/",
        element: <ProtectedRoute allowedRoles={["Admin", "Strategist"]} />,
        children: [
          {
            index: true,
            path: 'strategy-products',
            element: (
              <StrategyProductTable/>
            ),
          }
        ]
      },

      {
        path: "/",
        element: <ProtectedRoute allowedRoles={["Admin", "Strategist"]} />,
        children: [
          {
            index: true,
            path: 'suppliers/detail/:id',
            element: (
              <SupplierDetail/>
            ),
          }
        ]
      },
    ]
  },

// Auth Routes
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },

// Catch all
  { path: '*', element: <NotFound /> }
]

export const router = createBrowserRouter(routes)
