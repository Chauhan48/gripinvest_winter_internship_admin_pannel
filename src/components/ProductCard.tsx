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
import { productListing } from '../services/apiService';
import AddProduct from './AddProduct';

const riskLevels = ['low', 'moderate', 'high'];
const investmentTypes = ['bond', 'fd', 'mf', 'etf', 'other'];

const ProductCard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ risk_level: null, investment_type: null });
  const [productList, setProductList] = useState([]);
  const [dialogData, setDialogData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
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

  
  const [selectedRisk, setSelectedRisk] = useState(filters.risk_level ?? '');
  const [selectedInvestType, setSelectedInvestType] = useState(filters.investment_type ?? '');

  const handleApplyFilters = () => {
    setFilters({
      risk_level: selectedRisk || null,
      investment_type: selectedInvestType || null,
    });
    setPage(1);
  };

  const handleRemoveFilters = () => {
    setSelectedRisk('');
    setSelectedInvestType('');
    setFilters({ risk_level: null, investment_type: null });
    setPage(1);
  };

  const handleAddProduct = () => {
    setDialogData({
      userId: '',
      productId: '',
      amount: '',
      status: 'active',
    });
    setOpenDialog(true);
  };

  const handleUpdateProduct = (product) => {
    setDialogData({
      userId: '',
      productId: product.id,
      amount: '',
      status: 'active',
      ...product
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogData({});
  };

  return (
    <>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <AddProduct
          initialData={dialogData}
          onClose={handleDialogClose}
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
                  variant="contained"
                  fullWidth
                  onClick={() => handleUpdateProduct(product)}
                >
                  Update Product
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
