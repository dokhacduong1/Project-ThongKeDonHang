import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { Button, Card, Form, Input, message } from "antd";
import "./AddSourceShop.scss"
function AddSourceShop() {
    const sourceShopCollectionRef = collection(db, "sourceShop");
    const [messageApi, contextHolder] = message.useMessage();

    const handleFinish = async (infoForm) => {
        const newDocRef = doc(sourceShopCollectionRef);
        const objectNew = {
            ...infoForm,
            uidUser: auth?.currentUser?.uid,
            id: newDocRef.id,
        };
        try {
            await setDoc(newDocRef, objectNew);
            messageApi.open({
                type: "success",
                content: `Thêm Thành Công ${infoForm.nameShop}`,
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
            <Card className="addSourceShop">
                <Form onFinish={handleFinish}>
                    <Form.Item
                        name="nameShop"
                        label="Tên Shop Nguồn"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Nhập Tên Shop Nguồn!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Tên Shop Nguồn"
                            className="addCategory__form-input"
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
                            className="addCategory__form-input"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login__form-button"
                        >
                            Thêm Shop Nguồn
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}
export default AddSourceShop