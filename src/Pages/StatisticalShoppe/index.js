import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Statistic } from "antd";
import { Area } from "@ant-design/plots";
import "./StatisticalShoppe.scss";
import { SearchOutlined,UserOutlined } from "@ant-design/icons";
function StatisticShoppe() {
    const [dataShoppe, setDataShoppe] = useState([]);

    const getProductsList = async (keyword, newest = 1) => {
        const arrayData = [];
        for (let i = 0; i <= newest - 1; i++) {
            const apiUrl = `https://hello-world-purple-mountain-2148.dokhacduong3.workers.dev/api/v4/search/search_items?by=sales&keyword=${keyword}&limit=60&newest=${i * 60
                }`;
            const respone = await fetch(apiUrl);
            const result = await respone.json();

            result?.items.map((dataMap) => arrayData.push(dataMap?.item_basic));
        }
        return arrayData;
    };

    useEffect(() => { 
      
    }, []);
    const handleForm = async (valueForm) => {
        if(valueForm.keyword !== ""){
            const data = await getProductsList(valueForm.keyword, valueForm.numberPage);
            data.sort((a, b) => a.price - b.price);
            const newData = data.map((dataMap) => {
                const objectNew = {
                    nameProduct: dataMap.name,
                    price: dataMap.price / 100000,
                    sold: dataMap.sold,
                    image: `https://down-vn.img.susercontent.com/file/${dataMap.image}`,
                };
                console.log(objectNew);
                return objectNew;
            });
    
            setDataShoppe(newData)
        }
      
    };
   
    const config = {
        data: dataShoppe.map((item) => ({
            ...item,
            x: item.price,
            y: item.sold,
        })),
        xAxis: {
            range: [0, 1],
        },
        xField: "price",
        yField: "sold",

        slider: {
            start: 0.1,
            end: 0.6,
        },
        tooltip: {
            customContent: (_, data) => {

                return (
                    <div className="sctatisticShoppe__customContent">
                        <p>
                            Tên Sp: <strong>{data[0]?.data?.nameProduct}</strong>
                        </p>
                        <p>
                            Giá Sp: <strong>{data[0]?.data?.price}</strong>
                        </p>
                        <p>
                            Đã Bán: <strong>{data[0]?.data?.sold} / 1 Tháng</strong>
                        </p>
                        <img
                            style={{ width: "100px", height: "100px" }}
                            src={data[0]?.data?.image}
                            alt="ok"
                        ></img>
                    </div>
                );
            },
        },
    };
    const sum = dataShoppe.reduce((x, y) => x + y.price, 0)
    const textSum = `Giá Trung Bình ${dataShoppe.length} Sản Phẩm`;
    return (
        <>
            <Form
                style={{ textAlign: "center" }}
                className="search__welcome-form"
                layout="inline"
                rules={{
                    remember: true,
                }}
                onFinish={handleForm}
            >
                <Form.Item name="numberPage" className="search__welcome-item">
                    <InputNumber
                        min={0}
                        max={17}
                        className="search__welcome-form-input"
                        placeholder="Số Trang Shoppe"
                    />
                </Form.Item>

                <Form.Item name="keyword" className="search__welcome-item">
                    <Input
                        style={{ width: 230 }}
                        className="search__welcome-form-input"
                        placeholder="Nhập Từ Tên Sản Phẩm..."
                    />
                </Form.Item>

                <Form.Item className="search__welcome-item">
                    <Button
                        className="search__welcome-form-button"
                        type="primary"
                        htmlType="submit"
                    >
                        <SearchOutlined /> Search
                    </Button>
                </Form.Item>
            </Form>
            {dataShoppe.length > 0 && (
                <>
                    <Card style={{ textAlign: "center" }}>
                        <Statistic
                            title={textSum}
                            value={Math.round(sum / dataShoppe.length)}

                            valueStyle={{
                                color: "rgb(16, 82, 136)",
                            }}
                            prefix={<UserOutlined />}

                        />
                      
                        <Area {...config} />
                    </Card>
                </>
            )}
        </>
    );
}
export default StatisticShoppe;
