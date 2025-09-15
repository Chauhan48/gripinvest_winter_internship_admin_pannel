import React, { useEffect } from 'react'
import ProductCard from './ProductCard'
import {Container} from '@mui/material';

const Products = () => {

  return (
    <div>
        <Container maxWidth="lg">

      <h1>Products</h1>
      <ProductCard />
        </Container>
    </div>
  )
}

export default Products
