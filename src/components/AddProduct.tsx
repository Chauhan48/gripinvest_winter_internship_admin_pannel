import { useEffect, useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { addProduct, updateProduct } from '../services/apiService';
import type { SelectChangeEvent } from '@mui/material/Select';

const investmentTypes = ['bond', 'fd', 'mf', 'etf', 'other'];
const riskLevels = ['low', 'moderate', 'high'];

interface AddProductProps {
  initialData?: Partial<ProductData>;
  onClose: () => void;
  isUpdateMode?: boolean;
  onUpdate?: (product: ProductData) => void;
}

interface ProductData {
  id: string;
  name: string;
  investment_type: string;
  tenure_months: number;
  annual_yield: number;
  risk_level: string;
  min_investment: number;
  max_investment: number;
}

const AddProduct = ({ initialData = {}, onClose, isUpdateMode = false, onUpdate }: AddProductProps) => {
  const [formData, setFormData] = useState<ProductData>({
    id: '',
    name: '',
    investment_type: '',
    tenure_months: 12,
    risk_level: '',
    min_investment: 500.00,
    max_investment: 1000.00,
    annual_yield: 0
  });


  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...initialData
    }));
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const productData: ProductData = {
      id: formData.id,
      name: formData.name,
      investment_type: formData.investment_type,
      tenure_months: Number(formData.tenure_months),
      annual_yield: Number(formData.annual_yield),
      risk_level: formData.risk_level,
      min_investment: Number(formData.min_investment),
      max_investment: Number(formData.max_investment),
    };

    try {
      if (isUpdateMode) {
        if (typeof onUpdate === 'function') {
          onUpdate(productData);
          return;
        }
        const { message, error } = await updateProduct(productData);
        if (message) {
          setAlertMessage('Product updated successfully!');
          setAlertSeverity('success');
          setAlertOpen(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        } else if (error) {
          setAlertMessage(error);
          setAlertSeverity('error');
          setAlertOpen(true);
        }
      } else {
        // Add product logic
        const { message, error } = await addProduct({
          name: productData.name,
          investment_type: productData.investment_type,
          tenure_months: productData.tenure_months,
          annual_yield: productData.annual_yield,
          risk_level: productData.risk_level,
          min_investment: productData.min_investment,
          max_investment: productData.max_investment
        });
        if (message) {
          setAlertMessage('Product added successfully!');
          setAlertSeverity('success');
          setAlertOpen(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        } else if (error) {
          setAlertMessage(error);
          setAlertSeverity('error');
          setAlertOpen(true);
        }
      }
    } catch (err) {
      setAlertMessage(isUpdateMode ? 'Failed to update product. Please try again.' : 'Failed to add product. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, p: 2 }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {/* Hidden field for id in update mode */}
        {isUpdateMode && (
          <input type="hidden" name="id" value={formData.id} />
        )}
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 255 }}
        />
        <FormControl required>
          <InputLabel>Investment Type</InputLabel>
          <Select
            label="Investment Type"
            name="investment_type"
            value={formData.investment_type}
            onChange={handleChange}
          >
            {investmentTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Tenure (months)"
          name="tenure_months"
          type="number"
          value={formData.tenure_months}
          onChange={handleChange}
          required
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Annual Yield (%)"
          name="annual_yield"
          type="number"
          value={formData.annual_yield}
          onChange={handleChange}
          required
          inputProps={{ min: 0, max: 999.99, step: '0.01' }}
        />
        <FormControl required>
          <InputLabel>Risk Level</InputLabel>
          <Select
            label="Risk Level"
            name="risk_level"
            value={formData.risk_level}
            onChange={handleChange}
          >
            {riskLevels.map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Min Investment"
          name="min_investment"
          type="number"
          value={formData.min_investment}
          onChange={handleChange}
          inputProps={{ min: 1000, step: '0.01' }}
        />
        <TextField
          label="Max Investment"
          name="max_investment"
          type="number"
          value={formData.max_investment}
          onChange={handleChange}
          inputProps={{ min: 0, step: '0.01' }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit">
            Submit
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AddProduct;
