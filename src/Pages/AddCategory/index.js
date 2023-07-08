import { Button, Card, Form, Input, message } from "antd";
import "./AddCategory.scss";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";

function AddCategory() {
    const categorysCollectionRef = collection(db, "categorys");
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const handleFinish = async (infoForm) => {
        const newDocRef = doc(categorysCollectionRef);
        const objectNew = {
            ...infoForm,
            uidUser: auth?.currentUser?.uid,
            id: newDocRef.id,
        };
        try {
            await setDoc(newDocRef, objectNew);
            form.resetFields();
            messageApi.open({
                type: "success",
                content: `Thêm Thành Công ${infoForm.nameCategory}`,
            });
        } catch {
            messageApi.open({
                type: "error",
                content: `Vui Lòng Thêm Lại`,
            });
        }
    };
    return (
        <>
            {contextHolder}
            <Card className="addCategory">
                <Form onFinish={handleFinish}
                 form={form}>
                    <Form.Item
                        name="nameCategory"
                        label="Tên Danh Mục"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Nhập Id Sản Phẩm!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Tên Danh Mục"
                            className="addCategory__form-input"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login__form-button"
                        >
                            Thêm Danh Mục
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}
export default AddCategory;
