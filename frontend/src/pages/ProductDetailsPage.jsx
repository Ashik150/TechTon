import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import ProductDetails from '../components/Products/ProductDetails'
import Footer from '../components/Layout/Footer'
import { useParams,useSearchParams } from 'react-router-dom'
import { productData } from '../static/data'
import { useSelector } from 'react-redux'
import SuggestedProduct from '../components/Products/SuggestedProduct'
import { useDispatch } from 'react-redux'
import { getAllProducts } from '../redux/actions/product'
import { getAllEvents } from '../redux/actions/event'

const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  //console.log("Products are", allProducts);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    if(eventData!==null){
      dispatch(getAllEvents());
    }else{
    dispatch(getAllProducts());
    }
  }, [dispatch,eventData]);

  useEffect(() => {
    if (eventData !== null) {
      const event = allEvents && allEvents.find((i) => i._id === id);
      setData(event);
    } else {
      const product = allProducts && allProducts.find((i) => i._id === id);
      setData(product);
    }
  }, [allProducts, allEvents, id, eventData]);
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {
        data && <SuggestedProduct data={data} />
      }
      <Footer />
    </div>
  )
}

export default ProductDetailsPage