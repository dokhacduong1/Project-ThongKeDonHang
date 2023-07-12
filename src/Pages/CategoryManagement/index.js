import { Button, Card, Form, Input, Popconfirm, Table, Select } from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../Config/Firebase";
import {
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import FormEditCategory from "../../Components/FormEditCategory";
import "./CategoryManagement.scss";
function CategoryManagement() {
  const categorysCollectionRef = collection(db, "categorys");
  const [dataSource, setDataSource] = useState([]);
  const [tempDataSource, setTempDataSource] = useState([]);
  const fetchApi = async () => {
    const data = await getDocs(categorysCollectionRef);
    const dataDocAllCategorys = data.docs
      .filter(
        (dataFilter) => dataFilter.data().uidUser === auth?.currentUser?.uid
      )
      .map((dataMap) => dataMap.data());
    setDataSource(dataDocAllCategorys);
    setTempDataSource(dataDocAllCategorys);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handeleDelete = async (idRecord) => {
    const categoryDoc = doc(db, "categorys", idRecord);
    await deleteDoc(categoryDoc);
    fetchApi();
  };
  //Hàm này search dùng biến temDataSource để tìm cái này cho phép ta lấy dữ liệu lưu chữ tạm thời để tìm kiếm xong set vào DataSource Chính
  const handleForm = async (valueForm) => {
    if (valueForm.select !== "all") {
       //Hàm này convert hai cái về chữ thường xong check
      const dataDocAllCategorys = tempDataSource.filter((dataFilter) =>
        dataFilter[valueForm.select].toLowerCase().includes((valueForm.keyword).toLowerCase())
      );
      setDataSource(dataDocAllCategorys);
    } else {
      setDataSource(tempDataSource);
    }
  };
  const optionsSelect = [
    {
      value: "nameCategory",
      label: "Tên Danh Mục",
    },
  ];
  const columns = [
    {
      title: "Tên Danh Mục",
      dataIndex: "nameCategory",
      key: "nameCategory",
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
              <FormEditCategory record={record} fetchApiLoad={fetchApi} />
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
                description="Bạn Có Muốn Xóa Danh Mục Này Không ?"
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
      <Card>
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
          <Form.Item name="keyword"  className="search__welcome-item">
            <Input
              style={{ width: 230 }}
              className="search__welcome-form-input"
              placeholder="Nhập Từ Khóa..."
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
        <Table rowKey="id" dataSource={dataSource} columns={columns} />;
      </Card>
    </>
  );
}
export default CategoryManagement;
