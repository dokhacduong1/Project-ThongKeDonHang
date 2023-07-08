import { Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import PrivateRoutes from "../Components/PrivateRoutes";

import Register from "../Pages/Register";
import LayoutMain from "../Layout";
import Home from "../Pages/Home";
import AddProducts from "../Pages/AddProduct";
import ProductManagement from "../Pages/ProductManagement";
import AddCategory from "../Pages/AddCategory";
import CategoryManagement from "../Pages/CategoryManagement";

import SourceShopManagement from "../Pages/SourceShopManagement";
import AddSourceShop from "../Pages/AddSourceShop";
import ViewProducts from "../Pages/ViewProducts";
import AddCustomers from "../Pages/AddCustomers";
import CustomersManagement from "../Pages/CustomersManagement";
import AddOders from "../Pages/AddOrders";
import StatisticalManagement from "../Pages/StatisticalManagement";

export const routes = [
  {
    path: "/",
    element: <LayoutMain />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "add-category",
            element: <AddCategory/>,
          },
          {
            path: "add-products",
            element: <AddProducts/>,
          },
          {
            path: "product-management",
            element: <ProductManagement/>,
          },
          {
            path: "category-management",
            element: <CategoryManagement/>,
          },
          {
            path: "add-source-shop",
            element: <AddSourceShop/>,
          },
          {
            path: "source-shop-management",
            element: <SourceShopManagement/>,
          },
          {
            path: "add-customers",
            element: <AddCustomers/>,
          },
          {
            path: "add-oders",
            element: <AddOders/>,
          },
          {
            path: "add-customers-management",
            element: <CustomersManagement/>,
          },
          {
            path: "view-products/:id",
            element: <ViewProducts/>,
          },
          {
            path:"statistical-management",
            element:<StatisticalManagement/>
          }
        ],
      },
    ],
  },
];
