import { Button, Card, Col, Form, Input, Modal, Row, notification } from "antd";
import { useState } from "react";
import { EditOutlined } from '@ant-design/icons';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Config/Firebase";
function FormEditCategory(props) {
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
        const categoryDoc = doc(db,"categorys",record.id);
        try{
            await updateDoc(categoryDoc,valueForm);
            fetchApiLoad();
            setIsModalOpen(false);
            api.success({
                message: `Cập Nhật Thành Công`,
                description: (
                    <>
                        Bạn Đã Sửa Thành Công Danh Mục <strong>{valueForm.nameCategory}</strong>
                    </>
                ),
            });
            form.resetFields();
    
        }catch{
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
                <Card className="editCategory">
                    <Row gutter={20}>
                        <Col className="editCategory__form" span={24}>
                            {record && (
                                <>
                                    <Form
                                        form={form}
                                        className="editCategory__form"
                                        rules={{
                                            remember: true,
                                        }}
                                        layout="vertical"
                                        onFinish={handleStudents}
                                        initialValues={record}
                                    >
                                        <h3 style={{textAlign:"center"}}> Chỉnh Sửa Danh Mục</h3>
                                        <Form.Item
                                            label="Tên Danh Mục"
                                            name="nameCategory"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui Lòng Nhập Tên Danh Mục!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Tên Danh Mục"
                                                className="editCategory__form-input"
                                            />
                                        </Form.Item>
                                       

                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="login__form-button"
                                            >
                                                Sửa Danh Mục
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
export default FormEditCategory