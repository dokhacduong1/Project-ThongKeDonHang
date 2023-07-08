import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card } from "antd";
import { getDataTime } from "../../Helpers/dataTime";
import "./ViewProducts.scss"
function ViewProducts() {
    const params = useParams();
    const [product, setProduct] = useState([]);
    const { id } = params;
   
    const productsCollectionRef = collection(db, "products");
    const fetchApi = async () => {
        const dataProducts = await getDocs(productsCollectionRef);
        const dataDocAllProducts = dataProducts.docs
            .filter(
                (dataFilter) =>
                    dataFilter.data().uidUser === auth?.currentUser?.uid &&
                    dataFilter.data().id === id
            )
            .map((dataMap) => dataMap.data());
        setProduct(dataDocAllProducts[0]);
    };

    useEffect(() => {
        fetchApi();
    }, []);
    const date1 = new Date(getDataTime());
    const date2 = new Date(product.cycleProducts);
    const timeDiff = date2.getTime() - date1.getTime();
   
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
   
    return (
        <>
            <Card className="viewProducts">
                <Button className="button-back" onClick={() => window.history.back()}>
                    Quay Lại
                </Button>
                <h2>{product.nameProducts}</h2>
                <p>
                    <i>
                        Giá Gốc: {product.initialPriceProducts} + {"("}
                        {product.initialPriceProducts}+{product.taxProducts}% Thuế{")"} +{" "}
                        {"("}
                        {product.initialPriceProducts}+{product.revenuePercentageProducts}%
                        Lời{")"}
                    </i>{" "}
                    ---{">"} <strong>Giá Bán {product.priceProducts} </strong>
                </p>
                <p>
                    Ngày Tạo Sản Phẩm : <strong>{product.creatAtProduct}</strong>
                </p>
                <p>
                    Chủ Kỳ Sản Phẩm : <strong>{daysDiff} Ngày</strong>
                </p>
                <p>Mô Tả Sản Phẩm</p>
                <p>
                    <strong>{product.descriptionProducts} </strong>
                </p>
            </Card>
        </>
    );
}
export default ViewProducts;
