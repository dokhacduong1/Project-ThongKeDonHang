import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined } from '@ant-design/icons';
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "../../Config/Firebase";
import TextArea from "antd/es/input/TextArea";
import { validateDate } from "../../Helpers/dataTime";
import { percentageToDecimal } from "../../Helpers/convertNumber";
function FormEditProducts(props) {
    const { record, fetchApiLoad } = props;
   
    const categorysCollectionRef = collection(db, "categorys");
    const sourceShopCollectionRef = collection(db, "sourceShop");
    const [optionsSelectCategorys, setOptionsSelectCategorys] = useState([]);
    const [optionsSelectSourceShop, setOptionsSelectSourceShop] = useState([]);
    const [priceProducts, setPriceProducts] = useState(record.priceProducts); //idProducts nameProducts priceProducts initialPriceProducts revenuePercentageProducts taxProducts
    const [initialPriceProducts, setInitialPriceProducts] = useState(record.initialPriceProducts);
    const [revenuePercentageProducts, setRevenuePercentageProducts] = useState(record.revenuePercentageProducts);
    const [taxProducts, setTaxProducts] = useState(record.taxProducts);
    const [isModal, setIsModalOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const fetchApi = async () => {
        const responseCateogys = await getDocs(categorysCollectionRef);
        const responseSourceShop = await getDocs(sourceShopCollectionRef);
        const dataDocAllCategorys = responseCateogys.docs.filter(dataFilter => dataFilter.data().uidUser === auth?.currentUser?.uid).map(dataMap => dataMap.data())
        const dataDocAllSourceShop = responseSourceShop.docs.filter(dataFilter => dataFilter.data().uidUser === auth?.currentUser?.uid).map(dataMap => dataMap.data())
        
        const optionsConvertCategorys = dataDocAllCategorys.map(dataMap => {
            return {
                value: dataMap.id,
                label: dataMap.nameCategory
            }
        });
        const optionsConvertSourceShop = dataDocAllSourceShop.map(dataMap => {
            return {
                value: dataMap.id,
                label: dataMap.nameShop
            }
        });
        setOptionsSelectCategorys(optionsConvertCategorys);
        setOptionsSelectSourceShop(optionsConvertSourceShop);
    }
    useEffect(() => {
        fetchApi();
    }, [])
    const onChangeInitialPriceProducts = (value) => {

        const totalPrice = value +
          value * percentageToDecimal(taxProducts) +
          value * percentageToDecimal(revenuePercentageProducts);
        setInitialPriceProducts(value)
        setPriceProducts(totalPrice);
      };
      const onChangeRevenuePercentageProducts = (value) => {
    
        const totalPrice = initialPriceProducts +
          initialPriceProducts * percentageToDecimal(taxProducts) +
          initialPriceProducts * percentageToDecimal(value);
        setRevenuePercentageProducts(value);
        setPriceProducts(totalPrice);
      };
      const onChangeTaxProducts = (value) => {
        const totalPrice = initialPriceProducts +
          initialPriceProducts * percentageToDecimal(value) +
          initialPriceProducts * percentageToDecimal(revenuePercentageProducts);
        setTaxProducts(value);
        setPriceProducts(totalPrice);
      };






    const handleShowModal = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };
    const handleStudents = async (valueForm) => {
        const categoryDoc = doc(db, "products", record.id);
        try {
            await updateDoc(categoryDoc, valueForm);
            fetchApiLoad();
            setIsModalOpen(false);
            api.success({
                message: `Cập Nhật Thành Công`,
                description: (
                    <>
                        Bạn Đã Sửa Thành Công Sản Phẩm <strong>{valueForm.nameCategory}</strong>
                    </>
                ),
            });
            form.resetFields();

        } catch {
            api.error({
                message: `Cập Nhật Thất Bại`,
                description: (
                    <>
                        Vui Lòng Cập Nhật Lại
                    </>
                ),
            })
        }


    }
    return (

        <>
            {contextHolder}
            <EditOutlined
                onClick={() => {
                    handleShowModal();
                }}
            />
            <Modal
                title="Chỉnh Sửa Sản Phẩm"
                open={isModal}
                onCancel={handleCancel}
                footer={null}
            >
                <Card className="editProducts">
                   
                    <Row gutter={20}>
                        <Col className="editProducts__form" span={24}>
                            {record && (
                                <>
                                    <Form
                                        form={form}
                                        className="editProducts__form"
                                        rules={{
                                            remember: true,
                                        }}
                                        layout="vertical"
                                        onFinish={handleStudents}
                                        initialValues={record}
                                    >
                                         <Input style={{ textAlign: "center", marginBottom: "20px", color: "white", backgroundColor: "rgb(16, 82, 136)" }} disabled={true} value={`Giá Bán Là: ${priceProducts} vnđ`}></Input>
                                        <Form.Item
                                            name="idSourceShop"
                                            label="Tên Shop Nguồn"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập Id Sản Phẩm!",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Vui Lòng Chọn Shop"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                                filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }

                                                options={optionsSelectSourceShop}
                                            />
                                        </Form.Item>


                                        <Form.Item
                                            name="idCategory"
                                            label="Danh Mục Sản Phẩm"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Chọn Danh Mục Sản Phẩm!",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Vui Lòng Chọn Danh Mục"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                                filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }

                                                options={optionsSelectCategorys}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="nameProducts"
                                            label="Tên Sản Phẩm"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập Tên Sản Phẩm!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Tên Sản Phẩm"
                                                className="productManagement__form-input"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="cycleProducts"
                                            label="Chu Kỳ Sản Phẩm"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập Chu Kỳ Sản Phẩm!",
                                                },
                                                {
                                                    validator: validateDate,
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Chu Kỳ Sản Phẩm"
                                                className="productManagement__form-input"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="initialPriceProducts"
                                            label="Giá Gốc VNĐ"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập Giá Gốc Sản Phẩm!",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                onChange={onChangeInitialPriceProducts}
                                                formatter={(value) =>
                                                    `${value.toLocaleString()}`.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ","
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="revenuePercentageProducts"
                                            label="Phần Trăm Lời"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập % Lời Bán Sản Phẩm!",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                onChange={onChangeRevenuePercentageProducts}
                                                min={0}
                                                max={100}
                                                formatter={(value) => `${value}%`}
                                                parser={(value) => value.replace("%", "")}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="taxProducts"
                                            label="Phần Trăm Thuế"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập % Thuế Bán Sản Phẩm!",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                onChange={onChangeTaxProducts}
                                                min={0}
                                                max={100}
                                                formatter={(value) => `${value}%`}
                                                parser={(value) => value.replace("%", "")}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="quantitySold"
                                            label="Số Lượn Bán"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập % Thuế Bán Sản Phẩm!",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                    
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="descriptionProducts"
                                            label="Mô Tả Sản Phẩm"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập Mô Tả Sản Phẩm!",
                                                },
                                            ]}
                                        >
                                            <TextArea rows={4} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="login__form-button"
                                            >
                                                Sửa Sản Phẩm
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </>
                            )}
                        </Col>
                    </Row>
                </Card>
            </Modal>
        </>
    )
}
export default FormEditProducts