import { Button, Card, Col, Form, Input, Modal, Row, notification } from "antd";
import { useState } from "react";
import { EditOutlined } from '@ant-design/icons';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Config/Firebase";
function FormEditSourceShop(props) {
    const { record, fetchApiLoad } = props;

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
        const categoryDoc = doc(db, "sourceShop", record.id);
        try {
            await updateDoc(categoryDoc, valueForm);
            fetchApiLoad();
            setIsModalOpen(false);
            api.success({
                message: `Cập Nhật Thành Công`,
                description: (
                    <>
                        Bạn Đã Sửa Thành Công Danh Mục <strong>{valueForm.nameShop}</strong>
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
                title="Chỉnh Sửa Danh Mục"
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
                                        onFinish={handleStudents}
                                        initialValues={record}
                                    >
                                        <h3 style={{ textAlign: "center" }}> Chỉnh Sửa Shop Nguồn</h3>
                                        <Form.Item
                                            label="Tên Shop Nguồn"
                                            name="nameShop"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập Tên Danh Mục!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Tên Shop Nguồn"
                                                className="editSourceShop__form-input"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="linkShop"
                                            label="Link Shop Nguồn"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập Link Shop Nguồn!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Link Shop Nguồn"
                                                className="editSourceShop__form-input"
                                            />
                                        </Form.Item>



                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="login__form-button"
                                            >
                                                Sửa Shop Nguồn
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
export default FormEditSourceShop