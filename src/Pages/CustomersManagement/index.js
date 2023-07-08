import {
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Table,
  Select,
  Steps,
  Badge,
  Tag,
  Popover,
} from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../Config/Firebase";
import {
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import "./CustomersManagement.scss";
import logo1 from "./image/1.png";
import logo2 from "./image/2.png";
import FormEditCustomers from "../../Components/FormEditCustomers";
function CustomersManagement() {
  const customerCollectionRef = collection(db, "customer");
  const [dataSource, setDataSource] = useState([]);
  const [tempDataSource, setTempDataSource] = useState([]);
  const fetchApi = async () => {
    const data = await getDocs(customerCollectionRef);
    const dataDocAllCustomer = data.docs
      .filter(
        (dataFilter) => dataFilter.data().uidUser === auth?.currentUser?.uid
      )
      .map((dataMap) => dataMap.data());
    dataDocAllCustomer.map((dataMap) => {
      const sumProfit = dataMap?.oderProducts.reduce(
        (x, y) => x + y.oders.reduce((x1, y1) => x1 + y1?.profit, 0),
        0
      );
      dataMap.sumProfit = sumProfit;
    });
    setDataSource(dataDocAllCustomer);

    setTempDataSource(dataDocAllCustomer);
  };

  useEffect(() => {
    fetchApi();
  }, []);
  const sumPriceProfit = dataSource.reduce((x, y) => x + y.sumProfit, 0);

  const handeleDelete = async (idRecord) => {
    const categoryDoc = doc(db, "customer", idRecord);
    await deleteDoc(categoryDoc);
    fetchApi();
  };
  //Hàm này search dùng biến temDataSource để tìm cái này cho phép ta lấy dữ liệu lưu chữ tạm thời để tìm kiếm xong set vào DataSource Chính
  const handleForm = async (valueForm) => {
    if (valueForm.select !== "all") {
      //Hàm này convert hai cái về chữ thường xong check
      const dataDocAllCategorys = tempDataSource.filter((dataFilter) =>
        dataFilter[valueForm.select]
          .toLowerCase()
          .includes(valueForm.keyword.toLowerCase())
      );
      setDataSource(dataDocAllCategorys);
    } else {
      setDataSource(tempDataSource);
    }
  };

  const optionsSelect = [
    {
      value: "nameCustomers",
      label: "Tên Khách Hàng",
    },
  ];
  const columns = [
    {
      title: "Tên Khách Hàng",
      dataIndex: "nameCustomers",
      key: "nameCustomers",
      align: "center",
    },
    {
      title: "Tổng Tiền Lời 1 Khách Hàng",
      dataIndex: "sumProfit",
      key: "sumProfit",
      align: "center",
    },
    {
      title: "Loại Khách Hàng",
      dataIndex: "typeCustomers",
      key: "typeCustomers",
      render: (_, record) => (
        <>
          {record.typeCustomers ? (
            <a
              href={`https://shopee.vn/${record.nameCustomers}`}
              target="blank"
            >
              <img
                className="customersManagement__image"
                src={logo1}
                alt={logo1}
              />
            </a>
          ) : (
            <Popover
              content={
                <p style={{ textAlign: "center" }}>{record.phoneCustomers}</p>
              }
              title={<p style={{ textAlign: "center" }}>Số Điện Thoại</p>}
              trigger="click"
            >
              <img
                className="customersManagement__image"
                src={logo2}
                alt={logo2}
              />
            </Popover>
          )}
        </>
      ),
      align: "center",
    },
    {
      title: "Hành Động",
      dataIndex: "ok",
      key: "ok",
      render: (_, record) => (
        <>
          <div className="categoryManagement__table-iconAction">
            <span
              style={{
                color: "rgb(0, 150, 45)",
                border: "1px solid rgb(0, 150, 45)",
                borderRadius: "4px",
              }}
            >
              <FormEditCustomers record={record} fetchApiLoad={fetchApi} />
            </span>

            <span
              style={{
                color: "red",
                border: "1px solid red",
                borderRadius: "4px",
              }}
            >
              <Popconfirm
                title="Xóa Danh Mục"
                description="Bạn Có Muốn Xóa Khách Hàng Này Không ?"
                okText="Ok"
                cancelText="No"
                onConfirm={() => {
                  handeleDelete(record.id);
                }}
              >
                <DeleteOutlined />
              </Popconfirm>
            </span>
          </div>
        </>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <Card className="customersManagement">
        <Form
          style={{ textAlign: "center" }}
          className="search__welcome-form"
          layout="inline"
          rules={{
            remember: true,
          }}
          onFinish={handleForm}
        >
          <Form.Item
            name="select"
            rules={[
              {
                required: true,
                message: "Vui Lòng Chọn ",
              },
            ]}
          >
            <Select
              options={optionsSelect}
              style={{ width: 170 }}
              placeholder="Tìm Kiếm"
              className="search__welcome-form-select"
            />
          </Form.Item>
          <Form.Item name="keyword">
            <Input
              style={{ width: 230 }}
              className="search__welcome-form-input"
              placeholder="Nhập Từ Khóa..."
            />
          </Form.Item>

          <Form.Item>
            <Button
              className="search__welcome-form-button"
              type="primary"
              htmlType="submit"
            >
              <SearchOutlined /> Search
            </Button>
          </Form.Item>
          <Button
            className="search__welcome-form-button"
            type="primary"
            onClick={() => {
              handleForm({ select: "all" });
            }}
          >
            <ReloadOutlined /> Reset
          </Button>
        </Form>
        <div className="customersManagement__tag">
          <Tag color="rgb(16, 82, 136)">
            <span>
              Tổng Số Khách Hàng:{" "}
              <strong style={{ color: "rgb(240 220 163)" }}>
                {dataSource.length}
              </strong>
            </span>
          </Tag>
          <Tag color="rgb(16, 82, 136)">
            <span>
              Tổng Tiền Lời Là:{" "}
              <strong style={{ color: "rgb(240 220 163)" }}>
                {sumPriceProfit}
              </strong>
            </span>
          </Tag>
        </div>
        <Table rowKey="id" dataSource={dataSource} columns={columns} />;
      </Card>
    </>
  );
}
export default CustomersManagement;
