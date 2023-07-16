import { Button, Card, Form, Input, Popconfirm, Select, Table } from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../Config/Firebase";
import { DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';

import "./SourceShopManagement.scss"
import FormEditSourceShop from "../../Components/FormEditSourceShop";
function SourceShopManagement() {
  const sourceShopCollectionRef = collection(db, "sourceShop");
  const [dataSource, setDataSource] = useState([]);
  const [tempDataSource, setTempDataSource] = useState([]);
  const [deleteId, setDeleteId] = useState([])
  const fetchApi = async () => {
    const data = await getDocs(sourceShopCollectionRef);
    const dataDocAllSourceShop = data.docs.filter(dataFilter => dataFilter.data().uidUser === auth?.currentUser?.uid).map(dataMap => dataMap.data());
    setDataSource(dataDocAllSourceShop)
    setTempDataSource(dataDocAllSourceShop)
  };
  const optionsSelect = [
    {
      value: "nameShop",
      label: "Tên Shop",
    },
  ];
  useEffect(() => {
    fetchApi();
  }, []);

  const handeleDelete = async () => {
    if (deleteId.length > 0) {
      deleteId.map(async (dataMap) => {
        const categoryDoc = doc(db, "sourceShop", dataMap.id);
        await deleteDoc(categoryDoc);
        setDeleteId([]);
        fetchApi();
      })
    };
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setDeleteId(selectedRows);
    },

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
  }
  const columns = [
    {
      title: 'Tên Shop Nguồn',
      dataIndex: 'nameShop',
      key: 'nameShop',
      align: 'center'
    }
    ,
    {
      title: "Link Shop",
      dataIndex: "linkShop",
      key: "linkShop",
      render: (_, record) => (
        <Button target="blank" type="dashed" href={record.linkShop}>
          Link Shop
        </Button>
      ),
      align: "center"
    }
    ,
    {
      title: "Hành Động",
      dataIndex: "ok",
      key: "ok",
      render: (_, record) => (
        <>
          <div className="sourceShopManagement__table-iconAction">
            <span
              style={{
                color: "rgb(0, 150, 45)",
                border: "1px solid rgb(0, 150, 45)",
                borderRadius: "4px",
              }}
            >
              <FormEditSourceShop record={record} fetchApiLoad={fetchApi} />
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
        {
          deleteId.length > 0 && (<>

            <span
              style={{
                color: "red",

                borderRadius: "4px",
                padding: "5px"
              }}
            >
              <Popconfirm
                title="Xóa Shop Nguồn"
                description="Bạn Có Muốn Xóa Shop Nguồn Này Không ?"
                okText="Ok"
                cancelText="No"
                onConfirm={() => {
                  handeleDelete();
                }}
              >
                <span style={{ fontSize: "20px", cursor: "pointer" }}>Xóa</span>
              </Popconfirm>
            </span>

          </>)
        }
        <Table rowSelection={{
          type: "checkbox",
          ...rowSelection,

        }} rowKey='id' dataSource={dataSource} columns={columns} />;
      </Card>

    </>
  )
}
export default SourceShopManagement