import { Button, Card, Form, Input, InputNumber, Select, message } from "antd";
import "./AddProduct.scss";
import { useState } from "react";
import { percentageToDecimal } from "../../Helpers/convertNumber";
import { useEffect } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { getDataTime, validateDate } from "../../Helpers/dataTime";
import { priceOutProduct } from "../../Helpers/products";
function AddProducts() {
  const categorysCollectionRef = collection(db, "categorys");
  const productsCollectionRef = collection(db, "products");
  const sourceShopCollectionRef = collection(db, "sourceShop");
  const [form] = Form.useForm();
  const [priceProducts, setPriceProducts] = useState(1300); //idProducts nameProducts priceProducts initialPriceProducts revenuePercentageProducts taxProducts
  const [initialPriceProducts, setInitialPriceProducts] = useState(1000);
  const [okProfitProducts, setOkProfitProducts] = useState(15);
  //Hai thằng này thực ra là voucher và đóng gói lỡ up lên database lên ta vẫn để nguyên tên như này
  const [revenuePercentageProducts, setRevenuePercentageProducts] = useState(5000);
  const [taxProducts, setTaxProducts] = useState(5000);

  
  const [optionsSelectCategorys, setOptionsSelectCategorys] = useState([]);
  const [optionsSelectSourceShop, setOptionsSelectSourceShop] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { TextArea } = Input;

  useEffect(() => {
    const fetchApi = async () => {

      const responseCateogys = await getDocs(categorysCollectionRef);
      const responseSourceShop = await getDocs(sourceShopCollectionRef);
      const dataDocAllCategorys = responseCateogys.docs.filter(dataFilter => dataFilter.data().uidUser === auth?.currentUser?.uid).map(dataMap => dataMap.data())
      const dataDocAllSourceShop = responseSourceShop.docs.filter(dataFilter => dataFilter.data().uidUser === auth?.currentUser?.uid).map(dataMap => dataMap.data())
      const optionsConvertCategorys = dataDocAllCategorys.map(dataMap => {
        return {
          value: dataMap.id,
          label: dataMap.nameCategory
        }
      });
      const optionsConvertSourceShop = dataDocAllSourceShop.map(dataMap => {
        return {
          value: dataMap.id,
          label: dataMap.nameShop
        }
      });

      setOptionsSelectCategorys(optionsConvertCategorys);
      setOptionsSelectSourceShop(optionsConvertSourceShop);
    }
    fetchApi()
  }, [])
  const handleFinish = async (infoForm) => {
    const newDocRef = doc(productsCollectionRef);
    const objectNew = {
      ...infoForm,
      uidUser: auth?.currentUser?.uid,
      id: newDocRef.id,
      priceProducts: Math.round(priceProducts),
      creatAtProduct: getDataTime(),
      profitProduct: percentageToDecimal(okProfitProducts) * Math.round(priceProducts),
      profitProduct2: Math.round(priceProducts) - infoForm.initialPriceProducts
    };
 
    try {
      await setDoc(newDocRef, objectNew);
      form.resetFields();
      setPriceProducts(1300);
      messageApi.open({
        type: "success",
        content: `Thêm Thành Công ${infoForm.nameProducts}`,
      });
    } catch {
      messageApi.open({
        type: "error",
        content: `Vui Lòng Thêm Lại`,
      });
    }
  };
  const valueInit = {
    revenuePercentageProducts: 5000,
    taxProducts: 5000,
    initialPriceProducts: 1000,
    okProfitProducts:15,
    descriptionProducts: `Khách nhớ áp mã giảm của shop ->Trợ Ship cho Đơn <50K 
    Quý khách có thắc mắc khác về sản phẩm ib trực tiếp mình để hỗ trợ thêm ạ
    👉🏼Bên mình có hỗ trợ gói quà theo yêu cầu tặng người thân thương 
    👉🏼 Hỗ trợ mua sỉ, giảm giá mua số lượng nhiều 
    👉🏼Liên hệ shop mình qua: 
    Hotline /Zalo: 0945191056
    Facebook (Fanpage):  Đói Meo Shop 
    👉🏼Mã hàng: 
    `
  };


  const onChangeInitialPriceProducts = (value) => {
    const totalPrice = priceOutProduct(okProfitProducts,taxProducts,revenuePercentageProducts,value);
    setInitialPriceProducts(value)
    setPriceProducts(totalPrice);
  };
  const onChangeRevenuePercentageProducts = (value) => {
    const totalPrice = priceOutProduct(okProfitProducts,taxProducts,value,initialPriceProducts);
    setRevenuePercentageProducts(value);
    setPriceProducts(totalPrice);
  };
  const onChangeTaxProducts = (value) => {
    const totalPrice = priceOutProduct(okProfitProducts,value,revenuePercentageProducts,initialPriceProducts);
  
    setTaxProducts(value);
    setPriceProducts(totalPrice);
  };
  const onChangeOkProfitProducts = (value) => {
  
      const totalPrice = priceOutProduct(value,taxProducts,revenuePercentageProducts,initialPriceProducts);
      setOkProfitProducts(value);
      setPriceProducts(totalPrice);
  
   
  };
  return (
    <>
      {contextHolder}
      <Card className="productManagement">
        <Input style={{ textAlign: "center", marginBottom: "20px", color: "white", backgroundColor: "rgb(16, 82, 136)" }} disabled={true} value={`Giá Bán Là: ${Math.round(priceProducts).toLocaleString()} vnđ`}></Input>
        <Form form={form} initialValues={valueInit} onFinish={handleFinish}>
          <Form.Item
            name="idSourceShop"
            label="Tên Shop Nguồn"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập Id Sản Phẩm!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Vui Lòng Chọn Shop"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }

              options={optionsSelectSourceShop}
            />
          </Form.Item>
          <Form.Item
            name="idCategory"
            label="Danh Mục Sản Phẩm"
            rules={[
              {
                required: true,
                message: "Vui Lòng Chọn Danh Mục Sản Phẩm!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Vui Lòng Chọn Danh Mục"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }

              options={optionsSelectCategorys}
            />
          </Form.Item>

          <Form.Item
            name="nameProducts"
            label="Tên Sản Phẩm"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập Tên Sản Phẩm!",
              },
            ]}
          >
            <Input
              placeholder="Tên Sản Phẩm"
              className="productManagement__form-input"
            />
          </Form.Item>

          <Form.Item
            name="cycleProducts"
            label="Chu Kỳ Sản Phẩm"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập Chu Kỳ Sản Phẩm!",
              },
              {
                validator: validateDate,
              },
            ]}
          >
            <Input
              placeholder="Chu Kỳ Sản Phẩm"
              className="productManagement__form-input"
            />
          </Form.Item>

          <Form.Item
            name="initialPriceProducts"
            label="Giá Gốc VNĐ"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập Giá Gốc Sản Phẩm!",
              },
            ]}
          >
            <InputNumber
              onChange={onChangeInitialPriceProducts}
              formatter={(value) =>
                `${value.toLocaleString()}`.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="revenuePercentageProducts"
            label="Voucher"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập Tiền Voucher!",
              },
            ]}
          >
            <InputNumber
              onChange={onChangeRevenuePercentageProducts}
              formatter={(value) =>
                `${value.toLocaleString()}`.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="taxProducts"
            label="Đóng Gói"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập Tiền Đóng Gói!",
              },
            ]}
          >
            <InputNumber
              onChange={onChangeTaxProducts}
              formatter={(value) =>
                `${value.toLocaleString()}`.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="okProfitProducts"
            label="Tiền Lời Mong Muốn"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập Tiền Lời!",
              },
            ]}
          >
            <InputNumber
              onChange={onChangeOkProfitProducts}
              min={0}
              max={99}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace("%", "")}
            />
          </Form.Item>
          <Form.Item
            name="descriptionProducts"
            label="Mô Tả Sản Phẩm"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập Mô Tả Sản Phẩm!",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login__form-button"
            >
              Thêm Sản Phẩm
            </Button>
          </Form.Item>

        </Form>
      </Card>
    </>
  );
}
export default AddProducts;
