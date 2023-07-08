
import { Button, Card, Col, Form, Input, Modal, Row, Switch, notification } from "antd";
import { useState } from "react";
import { EditOutlined } from '@ant-design/icons';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Config/Firebase";
import { checkPhoneNumber } from "../../Helpers/phone";
function FormEditCustomers(props) {
    const { record, fetchApiLoad } = props;
    const [checkSwitch, setCheckWitch] = useState(record.typeCustomers);
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
    const handleStudents = async (valueForm) => {
        const categoryDoc = doc(db, "customer", record.id);
        try {
            await updateDoc(categoryDoc, valueForm);
            fetchApiLoad();
            setIsModalOpen(false);
            api.success({
                message: `Cập Nhật Thành Công`,
                description: (
                    <>
                        Bạn Đã Sửa Thành Công Khách Hàng <strong>{valueForm.nameCustomers}</strong>
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

    const handeleChangeSwitch = async (valueChange) => {
        setCheckWitch(valueChange)
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
                title="Chỉnh Sửa Danh Mục"
                open={isModal}
                onCancel={handleCancel}
                footer={null}
            >
                <Card className="editCustomers">
                    <Row gutter={20}>
                        <Col className="editCustomers__form" span={24}>
                            {record && (
                                <>
                                    <Form
                                        form={form}
                                        className="editCustomers__form"
                                        rules={{
                                            remember: true,
                                        }}
                                        layout="vertical"
                                        onFinish={handleStudents}
                                        initialValues={record}
                                    >
                                        <h3 style={{ textAlign: "center" }}> Chỉnh Sửa Danh Mục</h3>
                                        <Form.Item
                                            label="Tên Khách Hàng"
                                            name="nameCustomers"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập Tên Danh Mục!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Tên Danh Mục"
                                                className="editCustomers__form-input"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="typeCustomers"
                                            label="Loại Khách Hàng"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Loại Khách Hàng!",
                                                },
                                            ]}
                                        >
                                            <Switch onChange={handeleChangeSwitch} checkedChildren="Shoppe" unCheckedChildren="Khác" defaultChecked={record.typeCustomers} />
                                        </Form.Item>
                                        {
                                            !checkSwitch && (<>
                                                <Form.Item
                                                    name="phoneCustomers"
                                                    label="Số Điện Thoại"
                                                    rules={[
                                                        {
                                                            validator: checkPhoneNumber,
                                                        },
                                                    ]}

                                                >
                                                    <Input
                                                        placeholder="Số Điện Thoại Khách Hàng"
                                                        className="addCategory__form-input"
                                                    />
                                                </Form.Item>
                                            </>)
                                        }
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="login__form-button"
                                            >
                                                Sửa Khách Hàng
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
export default FormEditCustomers