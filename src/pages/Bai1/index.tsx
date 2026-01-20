import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';


interface Product {
  key: string;
  name: string;
  price: number;
  quantity: number;
}


interface ProductFormValues {
  name: string;
  price: number;
  quantity: number;
}

const ProductManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<Product[]>([
    { key: '1', name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { key: '2', name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { key: '3', name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { key: '4', name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { key: '5', name: 'MacBook Air M3', price: 28000000, quantity: 8 },
  ]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [form] = Form.useForm<ProductFormValues>();


  const filteredData: Product[] = dataSource.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

 
  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleOk = (): void => {
    form.validateFields().then((values: ProductFormValues) => {
      const newProduct: Product = {
        key: String(dataSource.length + 1),
        name: values.name,
        price: values.price,
        quantity: values.quantity,
      };
      
      setDataSource([...dataSource, newProduct]);
      message.success('Thêm sản phẩm thành công!');
      form.resetFields();
      setIsModalVisible(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };


  const handleDelete = (key: string): void => {
    const newData = dataSource.filter(item => item.key !== key);
    setDataSource(newData);
    message.success('Xóa sản phẩm thành công!');
  };

 
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };

 
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      render: (text, record, index) => {
        const currentIndex = filteredData.findIndex(item => item.key === record.key);
        return currentIndex + 1;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatPrice(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Xóa sản phẩm"
          onConfirm={() => handleDelete(record.key)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px' }}>
        <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
          Quản lý Sản phẩm
        </h1>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm..."
              prefix={<SearchOutlined />}
              onChange={handleSearch}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm sản phẩm
            </Button>
          </Space>

          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} sản phẩm`,
            }}
            bordered
          />
        </Space>

        <Modal
          title="Thêm sản phẩm mới"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Thêm"
          cancelText="Hủy"
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: '24px' }}
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                { whitespace: true, message: 'Tên sản phẩm không được chỉ chứa khoảng trắng!' }
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
                { type: 'number', min: 1, message: 'Giá phải là số dương!' }
              ]}
            >
              <InputNumber
                placeholder="Nhập giá"
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                addonAfter="VNĐ"
              />
            </Form.Item>

            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng!' },
                { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương!' }
              ]}
            >
              <InputNumber
                placeholder="Nhập số lượng"
                style={{ width: '100%' }}
                min={1}
                precision={0}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProductManagement;