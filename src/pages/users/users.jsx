import { useState, useEffect } from "react"
import { getUsers } from '../../apiService/userApi'
import { getDepartments } from '../../apiService/departmentApi'
import { Form, Table, Typography, Button, Space, Input, Spin } from 'antd'
import TokenModal from '../../components/modals/modalToken'
import UserFormModal from '../../components/modals/modalUserForm'
import DepartmentModal from '../../components/modals/modalDepartments'

const Users = () => {
  const [isModalTokenVisible, setIsModalTokenVisible] = useState(false)
  const [isModalUserVisible, setIsModalUserVisible] = useState(false)
  const [isModalDeparmentVisible, setIsModalDepartmentVisible] = useState(false)

  const [allUsers, setAllUsers] = useState([])
  const [company, setCompany] = useState()
  const [departments, setDepartments] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  const [filtering, setFiltering] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const [loading, setLoading] = useState(false)

  const checkTokenValidity = () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      setIsModalTokenVisible(true)
      return false
    }
    return true
  }

  const getDepartmentsData = async () => {
    try {
      const data = await getDepartments()
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true)
      } else {
        setDepartments(data)
        console.log(data)
      }
    } catch (error) {
      console.error("Failed to fetch departments data", error)
    }
  }

  const getAllUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true)
      } else {
        const usersWithDefaultPic = data.map(user => ({
          ...user,
          profilePic: user.profilePic || "/noProfilePic.jpg",
          key: user._id,
        }))
        setAllUsers(usersWithDefaultPic)
        const companyName = data[0]?.companyId?._id || null
        setCompany(companyName)
        setLoading(false)
      }
    } catch (error) {
      console.error("Failed to fetch company data", error)
    }
  }

  useEffect(() => {
    if (!isModalUserVisible || !isModalDeparmentVisible) {
      getAllUsers()
    }
  }, [isModalUserVisible, isModalDeparmentVisible])


  useEffect(() => {
    if(filtering) {
      onSearch(searchValue)
    }
  }, [allUsers])

  useEffect(() => {
    getDepartmentsData()
  }, [isModalDeparmentVisible])

  const [form] = Form.useForm()

  const handleEdit = (record) => {
    if (checkTokenValidity()) {
      setSelectedUser(record)
      setIsModalUserVisible(true)
    }
  }

  const handleAddUser = () => {
    if (checkTokenValidity()) {
      setSelectedUser(null)
      setIsModalUserVisible(true)
    }
  }

  const handleCancelUser = () => {
    setIsModalUserVisible(false)
    setSelectedUser(null)
  }

  const { Search } = Input

  const onSearch = (value) => {
    setSearchValue(value)
    const filteredData = allUsers.filter(user => {
      const nameMatch = user.name?.toLowerCase().includes(value.toLowerCase())
      const positionMatch = user.position?.toLowerCase().includes(value.toLowerCase())
      const phoneExtMatch = user.phoneExt?.toLowerCase().includes(value.toLowerCase())
      const departmentMatch = user.departmentId?.departmentName?.toLowerCase().includes(value.toLowerCase())
      const statusMatch = user.status?.toLowerCase().includes(value.toLowerCase())
      const dniMatch = user.dni?.toLowerCase().includes(value.toLowerCase())
      return nameMatch || positionMatch || phoneExtMatch || departmentMatch || statusMatch || dniMatch
    })
    setFiltering(filteredData)
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: '15%',
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={record.profilePic} 
            alt="profile" 
            draggable="false"
            style={{ 
              aspectRatio: '1/1', 
              objectFit: 'cover', 
              borderRadius: 100,
              width: 40,
              marginRight: 8 
            }} 
          />
          {record.name} {record.surname}
        </div>
      ),
    },
    {
      title: 'Departamento',
      dataIndex: ['departmentId', 'departmentName'],
      width: '12%',
      sorter: (a, b) => (a.departmentId?.departmentName || "").localeCompare(b.departmentId?.departmentName || ""),
    },

    {
      title: 'Email',
      dataIndex: 'email',
      width: '17%',
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: 'Extensión',
      dataIndex: 'phoneExt',
      width: '5%',
      sorter: (a, b) => (a.phoneExt || "").localeCompare(b.phoneExt || ""),
    },
    {
      title: 'Posición',
      dataIndex: 'position',
      width: '15%',
      sorter: (a, b) => (a.position || "").localeCompare(b.position || ""),
    },
    {
      title: 'Situación',
      dataIndex: 'status',
      width: '10%',
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    },
    {
      title: 'DNI',
      dataIndex: 'dni',
      width: '10%',
    },
    {
      title: 'Editar',
      dataIndex: 'operation',
      width: '10%',
      render: (_, record) => (
        <Typography.Link onClick={() => handleEdit(record)}>
          Editar
        </Typography.Link>
      ),
    },
  ]

  return (
    <>
      <div>
        <h2 className="text-xl font-bold">Lista de Empleados</h2>
      </div>
      
      <div className="flex justify-between my-5">  
        <div>
          <Button className="mr-5" type="primary" onClick={handleAddUser}>
              Añadir Usuario
          </Button>
          <Button className="" type="primary" onClick={() => setIsModalDepartmentVisible('true')}>
              Editar Departamentos
          </Button>
        </div>
        <Space direction="vertical">
          <Search
              placeholder="Buscar texto..."
              allowClear
              enterButton="Buscar"
              size="large"
              onSearch={onSearch}
          />
        </Space> 
      </div>

      <TokenModal visible={isModalTokenVisible} />
      <UserFormModal
        visible={isModalUserVisible}
        user={selectedUser}
        onCancel={handleCancelUser}
        departments={departments}
        companyId={company}
      />
      <DepartmentModal
        visible={isModalDeparmentVisible}
        onCancel={() => setIsModalDepartmentVisible(false)}
        departments={departments}
        allUsers={allUsers}
        companyId={company}
      />
      <Form form={form} component={false}>
      <Table
          dataSource={filtering.length > 0 ? filtering : allUsers}
          columns={columns}
          loading={loading}
        />
      </Form>
    </>
  )
}

export default Users
