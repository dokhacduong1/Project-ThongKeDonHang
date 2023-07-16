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
  Row,
  Col,
  Statistic,
} from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../Config/Firebase";
import {
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./CustomersManagement.scss";
import logo1 from "./image/1.png";
import logo2 from "./image/2.png";
import FormEditCustomers from "../../Components/FormEditCustomers";
function CustomersManagement() {
  const customerCollectionRef = collection(db, "customer");
  const [dataSource, setDataSource] = useState([]);
  const [tempDataSource, setTempDataSource] = useState([]);
  const [deleteId, setDeleteId] = useState([])
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

  const handeleDelete = async () => {
    if(deleteId.length>0){
      deleteId.map(async (dataMap)=>{
        const categoryDoc = doc(db, "customer", dataMap.id);
        await deleteDoc(categoryDoc);
        setDeleteId([]);
        fetchApi();
      })
      
    }
   
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
      render: (_, record) => (
        <>{Math.round(record.sumProfit)}</>
      ),
      align: "center",
    },
    {
      title: "Loại Khách Hàng",
      dataIndex: "typeCustomers",
      key: "typeCustomers",
      render: (_, record) => (
        <>
          {record.typeCustomers ? (
            <a href={record.linkCustomers} target="blank">
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
      title: <>Hành Động</>,
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

           
          </div>
        </>
      ),
      align: "center",
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setDeleteId(selectedRows);
    },

  };
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
            className="search__welcome-item"
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
        <Row gutter={16}>
          <Col lg={12} md={12} xs={24}>
            <Card bordered={false} style={{ textAlign: "center" }}>
              <Statistic
                title="Số Khách Hàng"
                value={dataSource.length}

                valueStyle={{
                  color: "rgb(16, 82, 136)",
                }}
                prefix={<UserOutlined />}

              />
            </Card>
          </Col>
          <Col lg={12} md={12} xs={24}>
            <Card bordered={false} style={{ textAlign: "center" }}>
              <Statistic
                title="Tổng Tiền Lời"
                value={sumPriceProfit}

                valueStyle={{
                  color: "rgb(16, 82, 136)",
                }}

                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
        </Row>
        {
          deleteId.length > 0 && (<>
           
            <span
              style={{
                color: "red",
               
                borderRadius: "4px",
                padding:"5px"
              }}
            >
              <Popconfirm
                title="Xóa Khách Hàng"
                description="Bạn Có Muốn Xóa Khách Hàng Này Không ?"
                okText="Ok"
                cancelText="No"
                onConfirm={() => {
                  handeleDelete();
                }}
              >
                <span style={{fontSize:"20px",cursor:"pointer"}}>Xóa</span>
              </Popconfirm>
              </span>
            
          </>)
        }
        <Table rowSelection={{
          type: "checkbox",
          ...rowSelection,

        }} rowKey="id" dataSource={dataSource} columns={columns} scroll={{
          x: 300,
        }} />;
      </Card>
    </>
  );
}
export default CustomersManagement;
