import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteProduct, productListing, updateProduct } from '../services/apiService';
import AddProduct from './AddProduct';

const riskLevels = ['low', 'moderate', 'high'];
const investmentTypes = ['bond', 'fd', 'mf', 'etf', 'other'];

interface Product {
  id: string;
  name: string;
  description: string;
  min_investment: number;
  max_investment: number;
  investment_type: string;
  tenure_months: number;
  risk_level: string;
  annual_yield?: number;
}

const ProductCard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ risk_level: string; investment_type: string }>({ risk_level: '', investment_type: '' });
  const [productList, setProductList] = useState<Product[]>([]);
  const [dialogData, setDialogData] = useState<Partial<Product>>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const limit = 6;

  useEffect(() => {
    const fetchProduct = async () => {
      const { products, total, error } = await productListing(page, limit, filters);
      if (error === 'Unauthorized') navigate('/login');
      setTotalProducts(total ?? 0);
      setProductList(products ?? []);
    };
    fetchProduct();
  }, [page, filters, navigate]);

  const [selectedRisk, setSelectedRisk] = useState(filters.risk_level);
  const [selectedInvestType, setSelectedInvestType] = useState(filters.investment_type);

  const handleApplyFilters = () => {
    setFilters({
      risk_level: selectedRisk,
      investment_type: selectedInvestType,
    });
    setPage(1);
  };

  const handleRemoveFilters = () => {
    setSelectedRisk('');
    setSelectedInvestType('');
    setFilters({ risk_level: '', investment_type: '' });
    setPage(1);
  };

  const handleAddProduct = () => {
    setDialogData({});
    setIsUpdating(false);
    setOpenDialog(true);
  };

  const handleUpdateProduct = (product: Product) => {
    setDialogData({
      id: product.id,
      name: product.name,
      investment_type: product.investment_type,
      tenure_months: product.tenure_months,
      annual_yield: product.annual_yield ?? 0,
      risk_level: product.risk_level,
      min_investment: product.min_investment,
      max_investment: product.max_investment
    });
    setIsUpdating(true);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogData({});
    setIsUpdating(false);
  };

  const handleProductUpdate = async (updatedProductData: Product) => {
    try {
      const { message, error } = await updateProduct({
        ...updatedProductData,
        annual_yield: updatedProductData.annual_yield ?? 0
      });
      
      if (error) {
        alert(`Failed to update product: ${error}`);
        return;
      }

      // Update the product list with the updated product data
      setProductList(prevProducts => 
        prevProducts.map(product => 
          product.id === updatedProductData.id 
            ? { ...product, ...updatedProductData }
            : product
        )
      );

      alert(message || 'Product updated successfully!');
      handleDialogClose();
    } catch (err) {
      alert('An error occurred while updating the product.');
      console.error(err);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete the product: ${product.name}?`)) {
      return;
    }

    try {
      const { error } = await deleteProduct(product.id);
      if (error) {
        alert('Failed to delete product. Please try again.');
        return;
      }
      // Refresh product list after deletion
      const { products, total, error: listError } = await productListing(page, limit, filters);
      if (listError === 'Unauthorized') navigate('/login');
      setTotalProducts(total ?? 0);
      setProductList(products ?? []);
    } catch (err) {
      alert('An error occurred while deleting the product.');
      console.error(err);
    }
  };

  return (
    <>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <AddProduct
          initialData={dialogData}
          onClose={handleDialogClose}
          onUpdate={isUpdating ? (handleProductUpdate as any) : undefined}
          isUpdateMode={isUpdating}
        />
      </Dialog>
      <br />
      <Card sx={{ bgcolor: "#e3f2fd", textAlign: "center" }}>
        <CardContent>
          <Typography variant="h6">Total Products</Typography>
          <Typography variant="h4">{totalProducts}</Typography>
        </CardContent>
      </Card>
      <br />
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 125 }} size="small">
          <InputLabel>Risk Level</InputLabel>
          <Select
            value={selectedRisk}
            label="Risk Level"
            onChange={(e) => setSelectedRisk(e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {riskLevels.map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 165 }} size="small">
          <InputLabel>Investment Type</InputLabel>
          <Select
            value={selectedInvestType}
            label="Investment Type"
            onChange={(e) => setSelectedInvestType(e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {investmentTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleApplyFilters}>Apply Filters</Button>
        <Button variant="outlined" onClick={handleRemoveFilters}>Clear Filters</Button>
        <Button variant="contained" onClick={handleAddProduct}>Add Product</Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {productList.length > 0 ? (
          productList.map((product) => (
            <Card
              key={product.id}
              sx={{ flex: '1 1 350px', minWidth: '350px', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>{product.description}</Typography>
                <Typography variant="body2" paragraph><strong>Minimum Investment:</strong> ${product.min_investment}</Typography>
                <Typography variant="body2" paragraph><strong>Maximum Investment:</strong> ${product.max_investment}</Typography>
                <Typography variant="body2" paragraph><strong>Investment Type:</strong> {product.investment_type}</Typography>
                <Typography variant="body2" paragraph><strong>Tenure (months):</strong> {product.tenure_months}</Typography>
                <Typography variant="body2" paragraph><strong>Risk Level:</strong> {product.risk_level}</Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleUpdateProduct(product)}
                >
                  Update Product
                </Button> 
                <br /> <br />
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleDeleteProduct(product)}
                >
                  Delete Product
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Typography>No products found.</Typography>
        )}
      </Box>
    </>
  );
};

export default ProductCard;
