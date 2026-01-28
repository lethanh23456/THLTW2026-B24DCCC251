import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Space,
  Select,
  Tag,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import rules from '@/utils/rules';

const { Option } = Select;


interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface ProductFormValues {
  name: string;
  category: string;
  price: number;
  quantity: number;
}


const STORAGE_KEY = 'products';

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];


const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm<ProductFormValues>();

 
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setProducts(saved ? JSON.parse(saved) : initialProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [products, searchText]);

  const getStatus = (quantity: number) => {
    if (quantity === 0) return <Tag color="red">Hết hàng</Tag>;
    if (quantity <= 10) return <Tag color="orange">Sắp hết</Tag>;
    return <Tag color="green">Còn hàng</Tag>;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

 
  const openAddModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (editingProduct) {
      setProducts(prev =>
        prev.map(p => (p.id === editingProduct.id ? { ...p, ...values } : p))
      );
      message.success('Cập nhật sản phẩm thành công');
    } else {
      setProducts(prev => [
        ...prev,
        { id: Date.now(), ...values },
      ]);
      message.success('Thêm sản phẩm thành công');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

 
  const columns: ColumnsType<Product> = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: formatPrice,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      render: (_, record) => getStatus(record.quantity),
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="link" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Input
          placeholder="Tìm theo tên sản phẩm"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          allowClear
          onChange={e => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm sản phẩm
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />

      <Modal
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        visible={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
            <Select>
              <Option value="Laptop">Laptop</Option>
              <Option value="Điện thoại">Điện thoại</Option>
              <Option value="Máy tính bảng">Máy tính bảng</Option>
              <Option value="Phụ kiện">Phụ kiện</Option>
            </Select>
          </Form.Item>

          {/* <Form.Item name="price" label="Giá" rules={[{ required: true, min: 1 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item> */}

           <Form.Item
              name="price"
              label="Giá"
              rules={[
                ...rules.required,
                ...rules.number(10000, 0, false),
              ]}
            >
            <Input type="number" />
          </Form.Item>

          <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[
                ...rules.required,
                ...rules.number(10000, 0, false),
              ]}
            >
            <Input type="number" />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
