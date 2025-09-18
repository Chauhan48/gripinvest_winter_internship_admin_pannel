// ...existing code...
import ProductCard from './ProductCard'
import { Container } from '@mui/material';

const Products = () => {

    return (
        <div>
            <Container maxWidth="lg">
                <ProductCard />
            </Container>
        </div>
    )
}

export default Products
