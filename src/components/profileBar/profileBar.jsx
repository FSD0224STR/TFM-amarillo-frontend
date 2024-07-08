import {useNavigate} from 'react-router-dom'
import { useAuth } from "../../contexts/authContext"

import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { 
  Avatar, 
  Button, 
  Flex,
  Dropdown,
  Badge,
} from 'antd';
import './profileBar.scss'


const items = [
  {    
    key: '/perfil',
    label: 'Editar mi Perfil',
  },
  {    
    key: '/expenses',
    label: 'Ver mis Gastos',
  },
  {    
    key: '/calendario',
    label: 'Ver mi Calendario',
  },
];

const ProfileBar = () => {
  const navigate = useNavigate()
  const { setLogOut } = useAuth()

  const handleDropdownItemClick = (key) => {    
    if (key === '/logout') {
      setLogOut()
      navigate('/login')}
      else navigate(key)
  };

  return (  
    <div className='profile-bar'>
      <Flex gap={15} wrap justify="flex-end" align="center">
        <Button type="primary">Añadir gasto</Button>
        <Button icon={<SearchOutlined />}/>
        <Badge count={2}>          
          <Button icon={<BellOutlined />} />
        </Badge>
        <p><b>Nombrer Apellidos</b></p>
        <Dropdown
          menu={{
            onClick: handleDropdownItemClick,
            items: items,
          }}
          trigger={['click']}
        >
          <Avatar size={30} icon={<UserOutlined />} /> 
        </Dropdown>           
      </Flex> 
    </div>
  );
};
export default ProfileBar;