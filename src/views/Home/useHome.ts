import axios from 'axios'
import { notification, theme } from 'antd';
import { useState, FormEvent } from 'react'

interface IParams {
  limit?: string | number;
  offset?: string | number;
  search?: string;
  startDate?: string,
  endDate?: string,
}

const useHome = () => {
  const [sold, setSold] = useState(0)
  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [stock, setStock] = useState(0)
  const [editingKey, setEditingKey] = useState('');

  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState<string[]>([])
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('products')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const openNotificationWithIcon = (message: string) => {
    notification.success({
      message
    })
  };

  const getProducts = async ({limit, offset, search, startDate, endDate }: IParams) => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_BE_BASE_URL}/items`,
        params: {
          limit: limit || 5,
          offset: offset || 0,
          search: search || '',
          startDate: startDate || '',
          endDate: endDate || ''
        }
      })

      setProducts(data.data.items)
      setIsLoading(false)
    } catch (error: any) {
      setErrors(error.response.data.messages)
      setIsLoading(false)
    }
  }

  const handleCreateProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_BE_BASE_URL}/item`,
        data: {
          name,
          stock,
          sold: sold || 0,
          itemType: type,
        }
      })

      getProducts({ limit: 100 })

      setSold(0)
      setType('')
      setName('')
      setStock(0)

      openNotificationWithIcon('Product created!')
    } catch (error: any) {
      setErrors(error.response.data.messages)
      setTimeout(() => {
        setErrors([])
      }, 5000);
      console.log(error.response.data.messages)
    }
  }

  const deleteProduct = async (e: any, id: number) => {
    e.preventDefault()
    try {
      await axios({
        method: 'DELETE',
        url: `${import.meta.env.VITE_BE_BASE_URL}/item/${id}`,
      })
      getProducts({ limit: 100 })
      openNotificationWithIcon('Product deleted!')
    } catch (error: any) {
      setErrors(error.response.data.messages)
      setTimeout(() => {
        setErrors([])
      }, 5000);
      console.log(error.response.data.messages)
    }
  }

  const updateProduct = async ({ id, name, itemType, stock, sold }: any) => {
    
    try {
      await axios({
        method: 'PUT',
        url: `${import.meta.env.VITE_BE_BASE_URL}/item/${id}`,
        data: {
          name, itemType, stock, sold
        }
      })
      getProducts({ limit: 100 })
      setEditingKey('')
      openNotificationWithIcon('Product updated!')
    } catch (error: any) {
      setErrors(error.response.data.messages)
      setTimeout(() => {
        setErrors([])
      }, 5000);
      console.log(error.response.data.messages)
    }
  }

  return {
    state: {
      name,
      type,
      stock,
      errors,
      products,
      collapsed,
      editingKey,
      isLoading,
      activeMenu,
      successMessage,
      colorBgContainer,
    },
    methods: {
      setType,
      setSold,
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
  }
}

export default useHome