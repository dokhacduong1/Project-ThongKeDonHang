import { Button, Card, Form, Input, InputNumber, Select, message } from "antd";
import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { useEffect, useState } from "react";
import "./AddOders.scss"
import { getDataTime, validateDate } from "../../Helpers/dataTime";
function AddOders() {
    const customerCollectionRef = collection(db, "customer");
    const productsCollectionRef = collection(db, "products");
    const [optionsSelectCustomers, setOptionsSelectCustomers] = useState([]);
    const [optionsSelectProducts, setOptionsSelectProducts] = useState([]);
    const [products, setProdcuts] = useState([]);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
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
        setProdcuts(dataDocAllProducts);
        const optionsConvertCategorys = dataDocAllCustomers.map(dataMap => {
            return {
                value: dataMap.id,
                label: dataMap.nameCustomers
            }
        });
        const optionsConvertProducts = dataDocAllProducts.map(dataMap => {
            return {
                value: dataMap.id,
                label: dataMap.nameProducts
            }
        });
        setProdcuts(dataDocAllProducts);
        setOptionsSelectCustomers(optionsConvertCategorys);
        setOptionsSelectProducts(optionsConvertProducts)
    };
    useEffect(() => {
        fetchApi();
    }, [])
    const handleFinish = async (valueForm) => {
        const getProductId = products.filter(dataFilter => dataFilter.id === valueForm.idProducts)[0];
        const customerDoc = doc(db, "customer", valueForm.idCustomers);
        const customerDocGet = await getDoc(customerDoc);
        const customerFullDocData = customerDocGet.data();
        const checkIndex = customerFullDocData?.oderProducts.findIndex(dataMap => dataMap.date === valueForm.dateCompletedOder);
        //Ở đây có hai trường hợp nếu check dc cái ngày đã hoàn thành chưa tồn tại thì phải tạo ra nó thêm data vào còn khi check được rồi ta lấy cái checkIndex kia là vị chí của mảng r thao tác ddataa trong mảng thôi
        if (checkIndex === -1) {
            const objectNew = {
                date: valueForm?.dateCompletedOder,
                oders: [
                    {
                        profit: getProductId?.profitProduct * valueForm.count,
                        nameProducts: getProductId?.nameProducts,
                        idProducts: getProductId?.id
                    }
                ]
            }
            customerFullDocData?.oderProducts?.push(objectNew);
          
            try {
                await updateDoc(customerDoc, customerFullDocData)
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
            const objectNew = {
                profit: getProductId?.profitProduct * valueForm.count,
                nameProducts: getProductId?.nameProducts,
                idProducts: getProductId?.id
            }
            customerFullDocData?.oderProducts[checkIndex].oders.push(objectNew)
            try {
                await updateDoc(customerDoc, customerFullDocData)
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
      
    }
    return (
        <>
         {contextHolder}
            <Card className="addOder">
                <Form onFinish={handleFinish}
                 form={form}
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
                                (option?.label ?? "").includes(input)
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
                        name="idProducts"
                        label="Tên Sản Phẩm"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Chọn Tên Sản Phẩm!",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Vui Lòng Chọn Sản Phẩm"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                    .toLowerCase()
                                    .localeCompare((optionB?.label ?? "").toLowerCase())
                            }
                            options={optionsSelectProducts}
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
                        name="count"
                        label="Số Lượng"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Nhập Số Lượng Sản Phẩm!",
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
            </Card>

        </>
    );
}
export default AddOders