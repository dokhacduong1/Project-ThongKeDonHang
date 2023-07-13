import { useEffect, useState } from "react";
import { getDataShoppe } from "../../services/shoppeApi";
import { Card, Col, Row } from "antd";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "../../Config/Firebase";
import "./StatisticalShoppe.scss"
function StatisticShoppe() {
    const [dataShoppe, setDataShoppe] = useState([]);
    const productsCollectionRef = collection(db, "products");
    const fetchApi = async () => {
        // const responeShoppe = await getDataShoppe();
        // //self trong đây nó sẽ là biến lưu cái mảng ra mảng tên selsf rồi chạy so sánh vs cái item id console.log(sẽ thấy nó sẽ là một mảng tempResponeShoppe chạy liên tục so sánh với item)
        // //đây là check trong mảng có phần tử trùng nhau ta lấy itemId để check
        // const uniqueObjects = responeShoppe.filter((item, index, self) => {
        //     return index === self.findIndex((t) => (
        //       t.itemid === item.itemid
        //     ));
        //   });
       
        // uniqueObjects.sort((a, b) => b.sold -a.sold);
        // setDataShoppe(uniqueObjects)

        const responseProducts = await getDocs(productsCollectionRef);
        const dataDocAllProducts = responseProducts.docs.filter(dataFilter => dataFilter.data().uidUser === auth?.currentUser?.uid).map(dataMap => dataMap.data())
        dataDocAllProducts.map(async (dataMap)=>{
            const productsDoc = doc(db, "products", dataMap.id);
            const objectNew = {
                profitProduct:Math.round(dataMap.priceProducts*0.15)
            }
            console.log(objectNew)
            try {
                // await updateDoc(productsDoc, objectNew);
                console.log("ok")
            }
            catch{

            }
        })
    }
    useEffect(() => {

        fetchApi();
    }, []);
    console.log(dataShoppe)
    return (
        <>
            {/* {
                dataShoppe && (<>
                    <Card className="ctatisticShoppe">
                        <Row className="ctatisticShoppe__row" gutter={[15, 15]}>
                            {
                                dataShoppe.map((dataMap, index) => (

                                    <Col className="ctatisticShoppe__col" span={8} key={index}>
                                        <div className="ctatisticShoppe__image">
                                            <img className="ctatisticShoppe__imageShoppe" src={`https://down-vn.img.susercontent.com/file/${dataMap.image}`} alt={dataMap.image} />
                                        </div>
                                        <p>Tên Sản Phẩm: <strong>{dataMap.name}</strong></p>
                                        <p>Giá: <strong>{dataMap.price / 100000}</strong></p>
                                        <p>Số Lượng Bán: <strong>{dataMap.sold}</strong></p>
                                        <p>Địa Chỉ Shop: <strong>{dataMap.shop_location}</strong></p>
                                        <p>Voucher: <strong>{dataMap?.voucher_info?.voucher_code}  {dataMap?.voucher_info?.label}</strong></p>
                                    </Col>

                                ))

                            }
                        </Row>
                    </Card>
                </>)
            } */}

        </>
    )
}
export default StatisticShoppe