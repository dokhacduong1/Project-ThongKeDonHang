import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Space, Table, Tag } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../Config/Firebase';


function TestA() {
    const customerCollectionRef = collection(db, "customer");
    const [data, setDataSource] = useState([]);
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
    const expandedRowRender = (record) => {
        const dataConvert = record.oderProducts.map(dataMap=>{
            const dataLite = dataMap.oders.map(dataMapLite=>(dataMapLite.nameProducts));
           return({
                date:dataMap.date,
                nameProducts:dataLite
           })
        })
       console.log(record)
        const liteColums =[
            {
                title: 'Ngày Giao Hàng',
                dataIndex: 'date',
                key: "date",
            },
            {
                title: 'Tên Sản Phẩm',
                dataIndex: 'nameProducts',
                key: "nameProducts",
                render:(_,record)=>(
                    <>
                        {
                            record.nameProducts.map((dataMap,index)=>(
                                <div key={index} style={{padding:"5px 0"}}>
                                     <Tag color="#108ee9">{dataMap}</Tag>
                                </div>
                               
                            ))
                        }
                    </>
                )
            },
        ];
        return (<>
             <Table
                rowKey="date"
                columns={liteColums}
               
                dataSource={dataConvert}
            />
        </>)
    };
    
    const columns = [
        {
            title: 'Tên Khách Hàng',
            dataIndex: 'nameCustomers',
            key: "nameCustomers",
        },
        {
            title: 'Tổng Tiền Lời 1 Khách Hàng',
            dataIndex: 'sumProfit',
            key: "sumProfit",
        },

    ];

    return (
        <>
            <Table
                rowKey="id"
                columns={columns}
                expandable={{
                    expandedRowRender,

                }}
                dataSource={data}
            />

        </>
    )
}
export default TestA