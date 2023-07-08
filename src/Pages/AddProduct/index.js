import { Button, Card, Form, Input, InputNumber, Select, message } from "antd";
import "./AddProduct.scss";
import { useState } from "react";
import { percentageToDecimal } from "../../Helpers/convertNumber";
import { useEffect } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { getDataTime, validateDate } from "../../Helpers/dataTime";
function AddProducts() {
  const categorysCollectionRef = collection(db, "categorys");
  const productsCollectionRef = collection(db, "products");
  const sourceShopCollectionRef = collection(db, "sourceShop");
  const [form] = Form.useForm();
  const [priceProducts, setPriceProducts] = useState(1300); //idProducts nameProducts priceProducts initialPriceProducts revenuePercentageProducts taxProducts
  const [initialPriceProducts, setInitialPriceProducts] = useState(1000);
  const [revenuePercentageProducts, setRevenuePercentageProducts] = useState(20);
  const [taxProducts, setTaxProducts] = useState(10);
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
            priceProducts:priceProducts,
            creatAtProduct:getDataTime(),
            profitProduct:infoForm.initialPriceProducts*percentageToDecimal(revenuePercentageProducts)
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
    revenuePercentageProducts: 20,
    taxProducts: 10,
    initialPriceProducts: 1000,
    descriptionProducts:`Quý khách có thắc mắc khác về sản phẩm ib trực tiếp mình để hỗ trợ thêm ạ
    👉🏼Bên mình có hỗ trợ gói quà theo yêu cầu tặng người thân thương 
    👉🏼 Hỗ trợ mua sỉ, giảm giá mua số lượng nhiều 
    👉🏼Liên hệ shop mình qua: 
    Hotline /Zalo: 0945191056
    Facebook (Fanpage):  Đói Meo Shop
    `
  };


  const onChangeInitialPriceProducts = (value) => {

    const totalPrice = value +
      value * percentageToDecimal(taxProducts) +
      value * percentageToDecimal(revenuePercentageProducts);
    setInitialPriceProducts(value)
    setPriceProducts(totalPrice);
  };
  const onChangeRevenuePercentageProducts = (value) => {

    const totalPrice = initialPriceProducts +
      initialPriceProducts * percentageToDecimal(taxProducts) +
      initialPriceProducts * percentageToDecimal(value);
    setRevenuePercentageProducts(value);
    setPriceProducts(totalPrice);
  };
  const onChangeTaxProducts = (value) => {
    const totalPrice = initialPriceProducts +
      initialPriceProducts * percentageToDecimal(value) +
      initialPriceProducts * percentageToDecimal(revenuePercentageProducts);
    setTaxProducts(value);
    setPriceProducts(totalPrice);
  };
  return (
    <>
     {contextHolder}
      <Card className="productManagement">
        <Input style={{ textAlign: "center", marginBottom: "20px", color: "white", backgroundColor: "rgb(16, 82, 136)" }} disabled={true} value={`Giá Bán Là: ${priceProducts} vnđ`}></Input>
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
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
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
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
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
            label="Phần Trăm Lời"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập % Lời Bán Sản Phẩm!",
              },
            ]}
          >
            <InputNumber
              onChange={onChangeRevenuePercentageProducts}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace("%", "")}
            />
          </Form.Item>
          <Form.Item
            name="taxProducts"
            label="Phần Trăm Thuế"
            rules={[
              {
                required: true,
                message: "Vui Lòng Nhập % Thuế Bán Sản Phẩm!",
              },
            ]}
          >
            <InputNumber
              onChange={onChangeTaxProducts}
              min={0}
              max={100}
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
