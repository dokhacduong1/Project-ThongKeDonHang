import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    notification,
} from "antd";
import { useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";

function FormAddOders(props) {
    const { record, setAddProductStore } = props;

    const [isModal, setIsModalOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const handleShowModal = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleAddOders = async (valueForm) => {
        const nameProduct = record.find(dataFind => dataFind.value === valueForm.idProducts)
        valueForm = {
            ...valueForm,
            nameProduct: nameProduct.label
        }
        
        setAddProductStore((data) => [...data, valueForm])
        setIsModalOpen(false);
    };

    return (
        <>
            {contextHolder}
            <Button onClick={() => {
                handleShowModal();
            }} icon={<PlusCircleOutlined />}>
                Thêm Sản Phẩm

            </Button>

            <Modal
                title="Thêm Sản Phẩm"
                open={isModal}
                onCancel={handleCancel}
                footer={null}
            >
                <Card className="editSourceShop">
                    <Row gutter={20}>
                        <Col className="editSourceShop__form" span={24}>
                            {record && (
                                <>
                                    <Form
                                        form={form}
                                        className="editSourceShop__form"
                                        rules={{
                                            remember: true,
                                        }}
                                        layout="vertical"
                                        onFinish={handleAddOders}

                                    >
                                        <h3 style={{ textAlign: "center" }}>
                                            {" "}
                                            Thêm Sản Phẩm Đơn Hàng
                                        </h3>

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
                                                    (option?.label ?? "")
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase())
                                                }
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? "")
                                                        .toLowerCase()
                                                        .localeCompare((optionB?.label ?? "").toLowerCase())
                                                }
                                                options={record}
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
                                                Thêm Sản Phẩm
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
    );
}
export default FormAddOders;
