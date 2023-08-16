import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Switch,
    Tag,
    message,
} from "antd";
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { useEffect, useState } from "react";
import "./AddOders.scss";
import { getDataTime, validateDate } from "../../Helpers/dataTime";
import { generateRandomID } from "../../Helpers/randomId";
import { DeleteOutlined } from "@ant-design/icons";
import FormEditSourceShop from "../../Components/FormEditSourceShop";
import FormAddOders from "../../Components/FormAddOders";
function AddOders() {
    const customerCollectionRef = collection(db, "customer");
    const productsCollectionRef = collection(db, "products");
    const [optionsSelectCustomers, setOptionsSelectCustomers] = useState([]);
    const [optionsSelectProducts, setOptionsSelectProducts] = useState([]);
    const [defaultCheck, setDefaultCheck] = useState(false);
    const [products, setProdcuts] = useState([]);
    const [addProductStore, setAddProductStore] = useState([]);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const initialValues = {
        typePrices: false,
        dataProduct: [],
    };
    const fetchApi = async () => {
        const responseCustomers = await getDocs(customerCollectionRef);
        const responseProducts = await getDocs(productsCollectionRef);
        const dataDocAllCustomers = responseCustomers.docs
            .filter(
                (dataFilter) => dataFilter.data().uidUser === auth?.currentUser?.uid
            )
            .map((dataMap) => dataMap.data());
        const dataDocAllProducts = responseProducts.docs
            .filter(
                (dataFilter) => dataFilter.data().uidUser === auth?.currentUser?.uid
            )
            .map((dataMap) => dataMap.data());

        const optionsConvertCategorys = dataDocAllCustomers.map((dataMap) => {
            return {
                value: dataMap.id,
                label: dataMap.nameCustomers,
            };
        });
        const optionsConvertProducts = dataDocAllProducts.map((dataMap) => {
            return {
                value: dataMap.id,
                label: dataMap.nameProducts,
            };
        });
        setProdcuts(dataDocAllProducts);
        setOptionsSelectCustomers(optionsConvertCategorys);
        setOptionsSelectProducts(optionsConvertProducts);
    };
    useEffect(() => {
        fetchApi();
    }, []);

    const handleFinish = async (valueForm) => {
        if (addProductStore.length <= 0) {
            messageApi.open({
                type: "error",
                content: `Vui Lòng Sản Phẩm`,
            });
            return;
        }

        const customerDoc = doc(db, "customer", valueForm.idCustomers);

        const customerDocGet = await getDoc(customerDoc);
        const customerFullDocData = customerDocGet.data();
        const checkIndex = customerFullDocData?.oderProducts.findIndex(
            (dataMap) => dataMap.date === valueForm.dateCompletedOder
        );
        //Ở đây có hai trường hợp nếu check dc cái ngày đã hoàn thành chưa tồn tại thì phải tạo ra nó thêm data vào còn khi check được rồi ta lấy cái checkIndex kia là vị chí của mảng r thao tác ddataa trong mảng thôi

        let profitAll = 0;
        if (valueForm.typePrices) {
            const sumPrice = addProductStore.reduce((a, dataReduce) => {
                const getProductId = products.filter(
                    (dataFilter) => dataFilter?.id === dataReduce?.idProducts
                )[0];

                return a + getProductId?.initialPriceProducts * dataReduce?.count;
            }, 0);
            profitAll = valueForm?.revenue - sumPrice;
        } else {
            const sumPrice = addProductStore.reduce((a, dataReduce) => {
                const getProductId = products.filter(
                    (dataFilter) => dataFilter?.id === dataReduce?.idProducts
                )[0];

                return (
                    a +
                    (getProductId?.priceProducts - getProductId?.initialPriceProducts) *
                    dataReduce?.count
                );
            }, 0);
          
            profitAll = sumPrice;
        }

        if (checkIndex === -1) {
            const objectNew = {
                date: valueForm?.dateCompletedOder,
                oders: addProductStore.map((dataMaMap) => ({
                    profit: Math.round(profitAll / addProductStore.length),
                    nameProducts: dataMaMap?.nameProduct,
                    idProducts: dataMaMap?.idProducts,
                    id: generateRandomID(50),
                })),

                id: generateRandomID(100),
            };

            customerFullDocData?.oderProducts?.push(objectNew);

            try {
                await updateDoc(customerDoc, customerFullDocData);

                form.resetFields();
                messageApi.open({
                    type: "success",
                    content: `Thêm Thành Công Đơn Hàng`,
                });
            } catch {
                messageApi.open({
                    type: "error",
                    content: `Vui Lòng Thêm Lại`,
                });
            }
        } else {
            addProductStore.map((dataMaMap) =>
                customerFullDocData?.oderProducts[checkIndex].oders.push({
                    profit: Math.round(profitAll / addProductStore.length),
                    nameProducts: dataMaMap?.nameProduct,
                    idProducts: dataMaMap?.idProducts,
                    id: generateRandomID(50),
                })
            );

              try {
                await updateDoc(customerDoc, customerFullDocData);

                form.resetFields();
                messageApi.open({
                  type: "success",
                  content: `Thêm Thành Công Đơn Hàng`,
                });
              } catch {
                messageApi.open({
                  type: "error",
                  content: `Vui Lòng Thêm Lại`,
                });
              }
        }
    };
    const onChangeSwitch = async (value) => {
        setDefaultCheck(value);
    };

    const deleteProductStore = (indexProduct) => {
        const dataNew = addProductStore.filter(
            (_, index) => indexProduct !== index
        );
        setAddProductStore(dataNew);
    };
    return (
        <>
            {contextHolder}
            <Card className="addOder">
                <div style={{ paddingBottom: "10px" }}>
                    <FormAddOders
                        record={optionsSelectProducts}
                        setAddProductStore={setAddProductStore}
                    />
                </div>
                <Form
                    className="addOder__form"
                    onFinish={handleFinish}
                    form={form}
                    initialValues={initialValues}
                >
                    <Form.Item
                        name="idCustomers"
                        label="Tên Khách Hàng"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Chọn Tên Khách Hàng!",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Vui Lòng Chọn Khách Hàng"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                    .toLowerCase()
                                    .localeCompare((optionB?.label ?? "").toLowerCase())
                            }
                            options={optionsSelectCustomers}
                        />
                    </Form.Item>

                 
                    <Form.Item
                        name="dateCompletedOder"
                        label="Ngày Giao Hoàn Thành"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Nhập Ngày Giao Hoàn Thành!",
                            },
                            {
                                validator: validateDate,
                            },
                        ]}
                    >
                        <Input
                            placeholder="Ngày Giao Hoàn Thành"
                            className="addOder__form-input"
                        />
                    </Form.Item>
                   

                    <Form.Item
                        name="typePrices"
                        label="Loại Khách Hàng"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Loại Khách Hàng!",
                            },
                        ]}
                    >
                        <Switch
                            defaultChecked={defaultCheck}
                            onChange={onChangeSwitch}
                            checkedChildren="Giao Shoppe"
                            unCheckedChildren="Giao Ngoài"
                        />
                    </Form.Item>
                    {defaultCheck && (
                        <>
                            <Form.Item
                                name="revenue"
                                label="Doanh Thu VNĐ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui Lòng Nhập Giá Gốc Sản Phẩm!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    formatter={(value) =>
                                        `${value.toLocaleString()}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login__form-button"
                        >
                            Thêm Đơn Hàng
                        </Button>
                    </Form.Item>
                </Form>
                <Row className="addOder__div">
                    {addProductStore.length > 0 && (
                        <>
                            {addProductStore.map((dataMap, index) => (
                                <Col span={24} className="addOder__div-box" key={index} >
                                    <p style={{marginRight:"8px",color:"white",backgroundColor:"#108ee9",padding:"2px",borderRadius:"5px"}}>
                                        {dataMap.nameProduct}---
                                        <strong style={{ color: "rgb(255 251 0)" }}>
                                            Số Lượng: {dataMap.count}
                                        </strong>
                                    </p>
                                    <Button
                                        style={{ color: "red" }}
                                        onClick={() => {
                                            deleteProductStore(index);
                                        }}
                                        icon={<DeleteOutlined />}
                                    ></Button>
                                </Col>
                            ))}
                        </>
                    )}
                </Row>
            </Card>
        </>
    );
}
export default AddOders;
