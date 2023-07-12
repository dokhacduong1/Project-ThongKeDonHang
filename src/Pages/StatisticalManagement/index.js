import { Line } from "@ant-design/plots";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../Config/Firebase";
import { sumArrayDate } from "../../Helpers/dataTime";
import { Button, Card, Col, Empty, Form, Input, Row, Select, Statistic } from "antd";
import { SearchOutlined, ArrowUpOutlined } from "@ant-design/icons";

function StatisticalManagement() {
    const customerCollectionRef = collection(db, "customer");
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [text, setText] = useState("Tất Cả Các Tháng")
    const fetchApi = async () => {
       
        const responseCustomer = await getDocs(customerCollectionRef);
        const dataDocAllCustomer = responseCustomer.docs
            .filter(
                (dataFilter) => dataFilter.data().uidUser === auth?.currentUser?.uid
            )
            .map((dataMap) => dataMap.data());
        const convertDateAll = sumArrayDate(dataDocAllCustomer);
        setData(convertDateAll);
        setTempData(convertDateAll)
    };
    useEffect(() => {
        
        fetchApi();
    }, []);
    const handleForm = async (valueForm) => {
            let textOne="Tất Cả Các Tháng";
            const checkDate = tempData.filter(function (item) {
                const date = new Date(item.year);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                if(valueForm.month !== "all"){
                    textOne = `Tháng ${valueForm.month}`
                    return year === parseInt(valueForm.year) && month === parseInt(valueForm.month)
                   
                }else{
                    return year === parseInt(valueForm.year)
                }

            });
            setText(textOne)
            setData(checkDate)
    }
    

    let optionsSelectYear = [

    ];
    for (let i = 2022; i <= 2024; i++) {
        optionsSelectYear.push({
            value: `${i}`,
            label: `Năm ${i}`
        })
    }
    let optionsSelectMonth = [
        {
            value: "all",
            label: "Tất Cả"
        }
    ];
    for (let i = 1; i <= 12; i++) {

        optionsSelectMonth.push({
            value: i,
            label: `Tháng ${i}`
        })
    }
    const sumPrice = data.reduce((x, y) => x + y.value, 0)
    const config = {
        data,
        xField: "year",
        yField: "value",
        label: {},
        meta: {
            value: {
                alias: "Lợi Nhuận Trên Một Ngày",
            },
        },
        slider: {
            start: 0.1,
            end: 0.6,
        },
        point: {
            size: 5,
            shape: "diamond",
            style: {
                fill: "white",
                stroke: "#5B8FF9",
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: false,
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: "#000",
                    fill: "red",
                },
            },
        },
        interactions: [
            {
                type: "marker-active",
            },
        ],
    };

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
                <Form.Item  className="search__welcome-item"
                    name="month"
                    rules={[
                        {
                            required: true,
                            message: "Vui Lòng Chọn ",
                        },
                    ]}
                >
                    <Select 
                        options={optionsSelectMonth}
                        style={{ width: 170 }}
                        placeholder="Tìm Kiếm"
                        className="search__welcome-form-select"
                    />
                </Form.Item>
                <Form.Item name="year"  className="search__welcome-item">
                    <Select
                        options={optionsSelectYear}
                        style={{ width: 170 }}
                        placeholder="Tìm Kiếm"
                        className="search__welcome-form-select"
                    />
                </Form.Item>

                <Form.Item  className="search__welcome-item">
                    <Button
                        className="search__welcome-form-button"
                        type="primary"
                        htmlType="submit"
                    >
                        <SearchOutlined /> Search
                    </Button>
                </Form.Item>
            </Form>
            <Row >
                <Col span={24} xs={24}>
                    <Card bordered={false} style={{ textAlign: "center" }}>
                        <Statistic
                            title={(<>Tổng Tiền Lời {text}</>)}
                            value={sumPrice}

                            valueStyle={{
                                color: "rgb(16, 82, 136)",
                            }}

                            prefix={<ArrowUpOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Card>
                <h2>Biểu Đồ Thống Kê</h2>
                {data.length > 0 ? <Line {...config} /> : <Empty />}
            </Card>
        </>
    );
}
export default StatisticalManagement;
