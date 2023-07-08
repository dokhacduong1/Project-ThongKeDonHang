import { Button, Card, Form, Input, Switch, message } from "antd";

import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import "./AddCustomers.scss"
import { useState } from "react";
import { checkPhoneNumber } from "../../Helpers/phone";
function AddCustomers() {
    const customerCollectionRef = collection(db, "customer");
    const [messageApi, contextHolder] = message.useMessage();
    const [checkSwitch, setCheckWitch] = useState(true);
    const handleFinish = async (infoForm) => {
        const newDocRef = doc(customerCollectionRef);
        const objectNew = {
            ...infoForm,
            uidUser: auth?.currentUser?.uid,
            id: newDocRef.id,
            oderProducts: []
        };
        try {
            await setDoc(newDocRef, objectNew);
            messageApi.open({
                type: "success",
                content: `Thêm Thành Công ${infoForm.nameCustomers}`,
            });
        } catch {
            messageApi.open({
                type: "error",
                content: `Vui Lòng Thêm Lại`,
            });
        }
    };
    const handeleChangeSwitch = async (valueChange) => {
        setCheckWitch(valueChange)
    }
    const tempObject = {
        typeCustomers:true
    }
    return (
        <>
            {contextHolder}
            <Card className="addCustomers">
                <Form 
                    onFinish={handleFinish}
                    initialValues={tempObject}
                >
                    <Form.Item
                        name="nameCustomers"
                        label="Tên Khách Hàng"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Nhập Tên Khách Hàng!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Tên Khách Hàng"
                            className="addCategory__form-input"
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
                        <Switch defaultChecked ={checkSwitch}  onChange={handeleChangeSwitch} checkedChildren="Shoppe" unCheckedChildren="Khác" />
                    </Form.Item>

                    {
                        !checkSwitch ? (<>
                            <Form.Item
                                name="phoneCustomers"
                                label="Số Điện Thoại"
                                rules={[
                                    {
                                        required: true,
                                        validator: checkPhoneNumber,
                                    },
                                ]}

                            >
                                <Input
                                    placeholder="Số Điện Thoại Khách Hàng"
                                    className="addCategory__form-input"
                                />
                            </Form.Item>
                        </>) :
                            (<>
                                <Form.Item
                                    name="linkCustomers"
                                    label="Link Shoppe"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui Lòng Nhập Link Khách Hàng!",
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Link Shoppe Khách Hàng"
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
                            Thêm Khách Hàng
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}
export default AddCustomers