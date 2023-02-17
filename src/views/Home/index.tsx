import dayjs from "dayjs";
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import {
  Form,
  Menu,
  Input,
  Table,
  Button,
  Layout,
  Popconfirm,
  Typography,
  InputNumber,
  DatePicker,
} from 'antd';

import useHome from "./useHome"
import CreateProduct from "../../components/CreateProduct";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: any;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


const Home = () => {
  const navigateTo = useNavigate()
  const [form] = Form.useForm();
  const [search, setSearch] = useState('')
  const { RangePicker } = DatePicker;

  const { 
    state: {
      name,
      type,
      stock,
      errors,
      products,
      collapsed,
      editingKey,
      activeMenu,
      successMessage,
      colorBgContainer,
    },
    methods : {
      setType,
      setName,
      setStock,
      getProducts,
      setCollapsed,
      updateProduct,
      setEditingKey,
      setActiveMenu,
      deleteProduct,
      handleCreateProduct,
    }
  } = useHome()

  const { Header, Sider, Content } = Layout;
  const isEditing = (record: any) => record.id === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue({ name: '', stock: 0, sold: 0, itemType: '', ...record });
    setEditingKey(record.id)
  }
  const save = async (item: any) => {
    const row = await form.validateFields()
    const data = {
      ...row,
      id: item.id
    }

    updateProduct(data)
  }

  const menus = [
    {
      key: 'products',
      icon: <OrderedListOutlined />,
      label: 'Products',
    },
    {
      key: 'createProduct',
      icon: <UserOutlined />,
      label: 'Create Product',
    },
  ]
  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      sortDirections: ['descend', 'ascend'],
      sorter: (a: any, b: any) => a.name.localeCompare(b.name)
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      editable: true,
      sortDirections: ['descend', 'ascend'],
      sorter: (a: any, b: any) => a.stock - b.stock
    },
    {
      title: 'Sold',
      dataIndex: 'sold',
      key: 'sold',
      editable: true,
      sortDirections: ['descend', 'ascend'],
      sorter: (a: any, b: any) => a.stock - b.stock
    },
    {
      title: 'Total Transaction',
      dataIndex: 'Transactions',
      key: 'Transactions',
      editable: true,
      sortDirections: ['descend', 'ascend'],
      sorter: (a: any, b: any) => a.Transactions.length - b.Transactions.length,
      render: (transactions: any[]) => <span>{transactions.length}</span>
    },
    {
      title: 'Date Transaction',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      editable: false,
      sortDirections: ['descend', 'ascend'],
      sorter: (a: any, b: any) => a.updatedAt.localeCompare(b.updatedAt),
      render: (time: string) => <span>{dayjs(time).format('DD-MM-YYYY')}</span>
    },
    {
      title: 'Product Type',
      dataIndex: 'itemType',
      key: 'itemType',
      editable: true,
    },
    {
      title: 'Edit',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link style={{ marginRight: 8 }} onClick={() => save(record)}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={() => setEditingKey('')}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: 'Delete',
      render: (item: any) => <div onClick={(e) => deleteProduct(e, item.id)}><DeleteOutlined className="text-red-500"/></div>
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === 'stock' || col.dataIndex === 'sold' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


  const renderBody = (key: string) => {
    switch (key) {
      case 'products':
        return <Form form={form} component={false}>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex gap-3">
                <Input placeholder="search name" className="max-w-[200px]" onChange={(e) => setSearch(e.target.value)}/> <Button className="" onClick={() => getProducts({ limit: 100, search })}>search</Button>
              </div>
              <RangePicker
                className="max-w-[200px]"
                format='YYYY-MM-DD'
                onChange={(_, formatstring) => getProducts({ limit: 100, search, startDate: formatstring[0],endDate: formatstring[1] })}
              />
            </div>
            <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            rowClassName="editable-row"
            dataSource={products}
            // @ts-ignore
            columns={mergedColumns}
          />
        </Form>
      case 'createProduct':
        return <CreateProduct
          errors={errors}
          name={name}
          type={type}
          stock={stock}
          setType={setType}
          setName={setName}
          setStock={setStock}
          handleCreateProduct={handleCreateProduct}          
        />
      default:
        return null
    }
  }

  useEffect(() => {
    getProducts({ limit: 100 })
  }, [])

  return (
    <Layout className="h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className='p-2'>
        <div className="text-white font-bold text-lg mb-4">Product Dashboard</div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(e) => {
            if (e.key == 'logout') {
              sessionStorage.clear()
              return navigateTo('/auth')
            }
            setActiveMenu(e.key)
          }}
          defaultSelectedKeys={[activeMenu]}
          items={menus}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          style={{
            overflow: 'auto',
            margin: '24px 16px',
            width: '100%',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {renderBody(activeMenu)}
          {!!successMessage && <span className="text-green-500 mt-3">{successMessage}</span>}
        </Content>
      </Layout>
    </Layout>
  )
}

export default Home