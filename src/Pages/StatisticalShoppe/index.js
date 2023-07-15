import { useEffect, useState } from "react";
import { getDataShoppe } from "../../services/shoppeApi";
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "../../Config/Firebase";
import "./StatisticalShoppe.scss"
import {

    SearchOutlined,

} from "@ant-design/icons";
function StatisticShoppe() {
    const [dataShoppe, setDataShoppe] = useState([]);
    const getProductsList = async(keyword,newest=1)=>{
        const arrayData = []
        for(let i = 0;i<=newest-1;i++){
            const apiUrl = `https://hello-world-purple-mountain-2148.dokhacduong3.workers.dev/api/v4/search/search_items?by=sales&keyword=${keyword}&limit=60&newest=${i*60}`;
            const respone = await fetch(apiUrl);
            const result = await respone.json()
            
            result?.items.map(dataMap=>arrayData.push(dataMap?.item_basic))
        }
        return arrayData
    }
   
    useEffect(() => {
      
        
    }, []);
    const handleForm  = async (valueForm)=>{
        const data = await getProductsList(valueForm.keyword,valueForm.numberPage)
        setDataShoppe(data)

    }

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
                    <Form.Item name="numberPage" className="search__welcome-item" >
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
                            placeholder="Nhập Từ Khóa..."
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
                {
                    dataShoppe &&(<>
                        <Card>
                            <Row gutter={[15,15]}>
                                {
                                    dataShoppe.map(dataMap=>(
                                        <Col span={8}>
                                             <img className="ctatisticShoppe__imageShoppe" src={`https://down-vn.img.susercontent.com/file/${dataMap.image}`} alt={dataMap.image}></img>
                                            <p>Gía Sản Phẩm: <strong>{dataMap.price/100000}</strong></p>
                                        </Col>
                                       
                                    ))
                                }
                            </Row>

                        </Card>
                    </>)
                }

        </>
    )
}
export default StatisticShoppe