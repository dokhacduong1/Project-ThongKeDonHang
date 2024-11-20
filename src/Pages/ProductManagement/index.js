import {
    Button,
    Card,
    Form,
    Input,
    Popconfirm,
    Select,
    Table,
    Tag,
} from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../Config/Firebase";
import {
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

import { getDataTime } from "../../Helpers/dataTime";
import { Link } from "react-router-dom";
import "../Search/Search.scss";
import FormEditProducts from "../../Components/FormEditProducts";
function ProductManagement() {
    const productsCollectionRef = collection(db, "products");
    const categorysCollectionRef = collection(db, "categorys");
    const sourceShopCollectionRef = collection(db, "sourceShop");
    const [dataSource, setDataSource] = useState([]);
    const [tempDataSource, setTempDataSource] = useState([]);
    const [deleteId, setDeleteId] = useState([])
    const fetchApi = async () => {
        const dataProducts = await getDocs(productsCollectionRef);
        const dataCategorys = await getDocs(categorysCollectionRef);
        const dataSourceShop = await getDocs(sourceShopCollectionRef);
        const dataDocAllProducts = dataProducts.docs
            .filter(
                (dataFilter) => dataFilter.data().uidUser === auth?.currentUser?.uid
            )
            .map((dataMap) => dataMap.data());

        dataDocAllProducts.map((dataMap) => {
            const checkLinkCategorys = dataCategorys.docs
                .filter(
                    (dataFilter) =>
                        dataFilter.data().uidUser === auth?.currentUser?.uid &&
                        dataFilter.data().id === dataMap.idCategory
                )
                .map((dataMap) => dataMap.data());

            const checkLinkSourceShop = dataSourceShop.docs
                .filter(
                    (dataFilter) =>
                        dataFilter.data().uidUser === auth?.currentUser?.uid &&
                        dataFilter.data().id === dataMap.idSourceShop
                )
                .map((dataMap) => dataMap.data());
           
            dataMap.nameCategorys = checkLinkCategorys[0].nameCategory;
            dataMap.nameShop = checkLinkSourceShop[0]?.nameShop 
        });

        setTempDataSource(dataDocAllProducts);
        setDataSource(dataDocAllProducts);
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const handeleDelete = async () => {
        if (deleteId.length > 0) {
            deleteId.map(async (dataMap) => {
                const categoryDoc = doc(db, "products", dataMap.id);
                await deleteDoc(categoryDoc);
                setDeleteId([]);
                fetchApi();
            })
        };
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setDeleteId(selectedRows);
        },

    };
    //Hàm này search dùng biến temDataSource để tìm cái này cho phép ta lấy dữ liệu lưu chữ tạm thời để tìm kiếm xong set vào DataSource Chính
    const handleForm = async (valueForm) => {
        console.log(valueForm);
        if (
            valueForm.select !== "all" &&
            valueForm.select !== "expiredProduct" &&
            valueForm.select !== "quantitySold" &&
            valueForm.select !== "productisExpired"
        ) {
            
            // Convert both to lowercase and check
            const dataDocAllProducts = tempDataSource.filter((dataFilter) => {
                
                return dataFilter[valueForm.select]?.toLowerCase().includes(valueForm.keyword.toLowerCase());
            });
        
            setDataSource(dataDocAllProducts);
        } else if (valueForm.select === "expiredProduct") {
            const dataDocAllProducts = tempDataSource.filter((dataFilter) => {
               
                const isExpired = new Date(dataFilter.cycleProducts) < new Date(getDataTime());
                if(valueForm.keyword){
                    const matchesKeyword = dataFilter["nameProducts"]?.toLowerCase().includes(valueForm.keyword?.toLowerCase()) || "";
                    return isExpired && matchesKeyword;
                }
                
                return isExpired;
            });
            setDataSource(dataDocAllProducts);
        } else if (valueForm.select === "productisExpired") {
            const dataDocAllProducts = tempDataSource.filter((dataFilter) => {
                const isNotExpired = new Date(dataFilter.cycleProducts) > new Date(getDataTime());
                if(valueForm.keyword){
                    const matchesKeyword = dataFilter["nameProducts"]?.toLowerCase().includes(valueForm.keyword.toLowerCase()) || "";
                    return isNotExpired && matchesKeyword;
                }
                
                return isNotExpired;
            });
            setDataSource(dataDocAllProducts);
        } else {
            setDataSource(tempDataSource);
        }
    };
    const optionsSelect = [
        {
            value: "nameProducts",
            label: "Tên Sản Phẩm",
        },
        {
            value: "nameCategorys",
            label: "Tên Danh Mục",
        },
        {
            value: "nameShop",
            label: "Tên Shop",
        },
        {
            value: "expiredProduct",
            label: "Sản Phẩm Hết Hạn",
        },
        {
            value: "productisExpired",
            label: "Sản Phẩm Còn Hạn",
        },
    ];
    const columns = [
        {
            title: "Tên Sản Phẩm",
            dataIndex: "nameProducts",
            key: "nameProducts",
            align: "center",
        },
        {
            title: "Tên Danh Mục",
            dataIndex: "nameCategorys",
            key: "nameCategorys",
            align: "center",
        },
        {
            title: "Tên Shop Nguồn",
            dataIndex: "nameShop",
            key: "nameShop",
            align: "center",
        },
        {
            title: "Giá Gốc Sản Phẩm",
            dataIndex: "initialPriceProducts",
            key: "initialPriceProducts",
            render: (_, record) => (
                <>{Math.round(record.initialPriceProducts).toLocaleString()}</>
            ),
            align: "center",
        },
        {
            title: "Giá Bán Sản Phẩm",
            dataIndex: "priceProducts",
            key: "priceProducts",
            render: (_, record) => (
                <>{Math.round(record.priceProducts).toLocaleString()}</>
            ),
            align: "center",
        },
        {
            title: "Chu Kỳ Sản Phẩm",
            dataIndex: "cycleProducts1",
            key: "cycleProducts1",
            render: (_, record) => (
                <>
                    {new Date(getDataTime()) <= new Date(record.cycleProducts) ? (
                        <Tag color="success">Còn Hạn</Tag>
                    ) : (
                        <Tag color="error">Hết Hạn</Tag>
                    )}
                </>
            ),
            align: "center",
        },
        {
            title: "Hành Động",
            dataIndex: "ok",
            key: "ok",
            render: (_, record) => (
                <>
                    <div className="categoryManagement__table-iconAction">
                        <span
                            style={{
                                color: "#1677ff",
                                border: "1px solid #1677ff",
                                borderRadius: "4px",
                            }}
                        >
                            <Link to={`/view-products/${record.id}`}>
                                <EyeOutlined />
                            </Link>
                        </span>
                        <span
                            style={{
                                color: "rgb(0, 150, 45)",
                                border: "1px solid rgb(0, 150, 45)",
                                borderRadius: "4px",
                            }}
                        >
                            <FormEditProducts record={record} fetchApiLoad={fetchApi} />
                        </span>


                    </div>
                </>
            ),
            align: "center",
        },
    ];

    return (
        <>
            <Card>
                <Form
                    style={{ textAlign: "center" }}
                    className="search__welcome-form"
                    layout="inline"
                    rules={{
                        remember: true,
                    }}
                    onFinish={handleForm}
                >
                    <Form.Item
                        className="search__welcome-item"
                        name="select"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Chọn ",
                            },
                        ]}
                    >
                        <Select
                            options={optionsSelect}
                            style={{ width: 170 }}
                            placeholder="Tìm Kiếm"
                            className="search__welcome-form-select"
                        />
                    </Form.Item>
                    <Form.Item name="keyword" className="search__welcome-item">
                        <Input
                            style={{ width: 230 }}
                            className="search__welcome-form-input"
                            placeholder="Nhập Từ Khóa..."
                        />
                    </Form.Item>

                    <Form.Item className="search__welcome-item">
                        <Button
                            className="search__welcome-form-button"
                            type="primary"
                            htmlType="submit"
                        >
                            <SearchOutlined /> Search
                        </Button>
                    </Form.Item>
                    <Button
                        className="search__welcome-form-button"
                        type="primary"
                        onClick={() => {
                            handleForm({ select: "all" });
                        }}
                    >
                        <ReloadOutlined /> Reset
                    </Button>
                </Form>
                {
                    deleteId.length > 0 && (<>

                        <span
                            style={{
                                color: "red",

                                borderRadius: "4px",
                                padding: "5px"
                            }}
                        >
                            <Popconfirm
                                title="Xóa Sản Phẩm"
                                description="Bạn Có Muốn Xóa Sản Phẩm Này Không ?"
                                okText="Ok"
                                cancelText="No"
                                onConfirm={() => {
                                    handeleDelete();
                                }}
                            >
                                <span style={{ fontSize: "20px", cursor: "pointer" }}>Xóa</span>
                            </Popconfirm>
                        </span>

                    </>)
                }
                <Table
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,

                    }}
                    rowKey="id"
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{
                        x: 300,
                    }}
                />
            </Card>
        </>
    );
}
export default ProductManagement;
