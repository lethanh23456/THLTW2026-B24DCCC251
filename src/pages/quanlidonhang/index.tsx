import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tag,
  message,
  DatePicker,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { RangePicker } = DatePicker;


interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

type OrderStatus = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

const PRODUCT_KEY = 'products';
const ORDER_KEY = 'orders';


const DonHangManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

 
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCT_KEY) || '[]'));
    setOrders(JSON.parse(localStorage.getItem(ORDER_KEY) || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  }, [orders, products]);


  const selectedProducts = Form.useWatch('products', form);

  const totalAmount = useMemo(() => {
    if (!Array.isArray(selectedProducts)) return 0;

    return selectedProducts.reduce((sum: number, item: any) => {
        if (!item || !item.productId || !item.quantity) return sum;

        const product = products.find(p => p.id === item.productId);
        if (!product) return sum;

        return sum + product.price * item.quantity;
    }, 0);
    }, [selectedProducts, products]);


 
  const handleCreateOrder = async () => {
    const values = await form.validateFields();

    const orderProducts: OrderProduct[] = values.products.map((p: any) => {
      const product = products.find(item => item.id === p.productId)!;
      return {
        productId: product.id,
        productName: product.name,
        quantity: p.quantity,
        price: product.price,
      };
    });

    const newOrder: Order = {
      id: `DH${Date.now()}`,
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: orderProducts,
      totalAmount,
      status: 'Chờ xử lý',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setOrders(prev => [...prev, newOrder]);
    message.success('Tạo đơn hàng thành công');
    form.resetFields();
    setIsModalOpen(false);
  };

 
  const updateStatus = (order: Order, newStatus: OrderStatus) => {
    if (order.status === newStatus) return;

    let updatedProducts = [...products];

   
    if (newStatus === 'Hoàn thành') {
      order.products.forEach(p => {
        const prod = updatedProducts.find(i => i.id === p.productId);
        if (prod) prod.quantity -= p.quantity;
      });
    }

  
    if (order.status === 'Hoàn thành' && newStatus === 'Đã hủy') {
      order.products.forEach(p => {
        const prod = updatedProducts.find(i => i.id === p.productId);
        if (prod) prod.quantity += p.quantity;
      });
    }

    setProducts(updatedProducts);
    setOrders(prev =>
      prev.map(o => (o.id === order.id ? { ...o, status: newStatus } : o))
    );
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
    },
    {
      title: 'Số SP',
      render: (_, r) => r.products.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      render: v => v.toLocaleString('vi-VN') + ' ₫',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={value => updateStatus(record, value)}
          style={{ width: 140 }}
        >
          <Option value="Chờ xử lý">Chờ xử lý</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Đã hủy">Đã hủy</Option>
        </Select>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Button type="link" onClick={() => setDetailOrder(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

 
  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Tạo đơn hàng
      </Button>

      <Table
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />

    
      <Modal
        title="Tạo đơn hàng"
        visible={isModalOpen}
        onOk={handleCreateOrder}
        onCancel={() => setIsModalOpen(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true },
              { pattern: /^\d{10,11}$/, message: 'SĐT không hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space key={key} align="baseline">
                    <Form.Item
                      name={[name, 'productId']}
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Sản phẩm" style={{ width: 200 }}>
                        {products.map(p => (
                            <Option key={p.id} value={p.id} disabled={p.quantity === 0}>
                            {p.name} (còn {p.quantity})
                            </Option>
                        ))}
                        </Select>

                    </Form.Item>

                    <Form.Item
                        name={[name, 'quantity']}
                        rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                            validator(_, value) {
                                const productId = getFieldValue(['products', name, 'productId']);
                                const product = products.find(p => p.id === productId);

                                if (!product || value <= product.quantity) {
                                return Promise.resolve();
                                }
                                return Promise.reject(new Error('Số lượng vượt quá tồn kho'));
                            },
                            }),
                        ]}
                        >
                        <InputNumber min={1} placeholder="SL" />
                        </Form.Item>


                    <Button danger onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button onClick={() => add()} type="dashed">
                  Thêm sản phẩm
                </Button>
              </>
            )}
          </Form.List>

          <h3 style={{ marginTop: 16 }}>
            Tổng tiền: {totalAmount.toLocaleString('vi-VN')} ₫
          </h3>
        </Form>
      </Modal>

   
      <Modal
        title="Chi tiết đơn hàng"
        visible={!!detailOrder}
        onCancel={() => setDetailOrder(null)}
        footer={null}
      >
        {detailOrder && (
          <>
            <p><b>Khách:</b> {detailOrder.customerName}</p>
            <p><b>SĐT:</b> {detailOrder.phone}</p>
            <p><b>Địa chỉ:</b> {detailOrder.address}</p>

            <Table
              size="small"
              pagination={false}
              dataSource={detailOrder.products}
              rowKey="productId"
              columns={[
                { title: 'Sản phẩm', dataIndex: 'productName' },
                { title: 'SL', dataIndex: 'quantity' },
                {
                  title: 'Giá',
                  dataIndex: 'price',
                  render: v => v.toLocaleString('vi-VN') + ' ₫',
                },
              ]}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default DonHangManagement;
