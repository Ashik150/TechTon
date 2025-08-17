import React, {useEffect} from 'react'
import ShopLogin from '../components/Shop/ShopLogin'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller,isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if(isSeller === true){
      navigate(`/shopdashboard`);
    }
  }, [isLoading,isSeller])
  return (
    <div><ShopLogin/></div>
  )
}

export default ShopLoginPage
