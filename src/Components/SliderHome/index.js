import "./SliderHome.scss"
import {  Menu } from 'antd';
import { ShoppingCartOutlined,HomeOutlined,ConsoleSqlOutlined,ShopOutlined,UserOutlined,StockOutlined} from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";
function SliderHome(){
  const location =useLocation()

    function getItem(key,label, icon, children) {
        return {
          key,
          icon,
          label,
          children,
          
        };
      }
    const items = [
        getItem('/',<Link to="home">Trang Chủ</Link> , <HomeOutlined />),
        getItem('category',<span className="layout__slider-item">Danh Mục</span>, <span className="layout__slider-item"><ConsoleSqlOutlined /></span>,[
          getItem('/add-category',<Link to="add-category">Thêm Danh Mục</Link>,null),
          getItem('/category-management',<Link to="category-management">Quản Lý Danh Mục</Link>,null)
        ]),
        getItem('shop',<span className="layout__slider-item">Shop Nguồn</span>, <span className="layout__slider-item"><ShopOutlined /></span>,[
          getItem('/source-shop',<Link to="add-source-shop">Thêm Shop Nguồn</Link>,null),
          getItem('/source-shop-management',<Link to="source-shop-management">Quản Lý Shop Nguồn</Link>,null)
        ]),
        getItem('products',<span className="layout__slider-item">Sản Phẩm</span>, <span className="layout__slider-item"><ShoppingCartOutlined /></span>,[
          getItem('/add-products',<Link to="add-products">Thêm Sản Phẩm</Link>,null),
          getItem('/product-management',<Link to="product-management">Quản Lý Sản Phẩm</Link>,null)
        ]),
        getItem('customers',<span className="layout__slider-item">Khách Hàng</span>, <span className="layout__slider-item"><UserOutlined /></span>,[
          getItem('/add-customers',<Link to="add-customers">Thêm Khách Hàng</Link>,null),
          getItem('/add-oders',<Link to="add-oders">Thêm Đơn Hàng</Link>,null),
          getItem('/add-customers-management',<Link to="add-customers-management">Quản Lý Khách Hàng</Link>,null)
        ]),
        getItem('statistical',<span className="layout__slider-item">Thống Kê</span>, <span className="layout__slider-item"><StockOutlined /></span>,[
          getItem('/statistical-management',<Link to="statistical-management">Quản Lý Thống Kê</Link>,null),
         
        ]),
      ];
    return(
        <>
             <Menu className="layout__slider-menu"
               
                defaultSelectedKeys={location.pathname}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
            />
        </>
    )
}
export default SliderHome