import React, { useState } from 'react';
import ProfileBar from '../../components/profileBar/profileBar'
import { 
  Avatar, 
  Button, 
  Flex,
} from 'antd';

function Trastero() {

  return (
    <>          
      <Flex wrap justify="space-between" align="flex-start">
        <div className="title-box">
          <h1 className='title'>Este es el título de la página</h1>
          <h2 className='subtitle'>Este es el subtítulo de la página</h2>
        </div>
        <ProfileBar />
      </Flex> 
    </>
  );
}

export default Trastero;