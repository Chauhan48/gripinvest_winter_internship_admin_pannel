import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
} from '@mui/material';

interface InvestmentFormData {
  id?: string;
  userId: string;
  productId: string;
  amount: string;
  investedAt?: string;
  status: 'active' | 'matured' | 'cancelled';
  expectedReturn?: string;
  maturityDate?: string;
}

const AddProduct = () => {
  const [formData, setFormData] = useState<InvestmentFormData>({
    userId: '',
    productId: '',
    amount: '',
    status: 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = () => {
    // Handle form submit logic here
    console.log(formData);
  };

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <TextField
        label="User ID"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        required
      />
      <TextField
        label="Product ID"
        name="productId"
        value={formData.productId}
        onChange={handleChange}
        required
      />
      <TextField
        label="Amount"
        name="amount"
        type="number"
        inputProps={{ step: '0.01' }}
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <FormControl>
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="matured">Matured</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Expected Return"
        name="expectedReturn"
        type="number"
        inputProps={{ step: '0.01' }}
        value={formData.expectedReturn || ''}
        onChange={handleChange}
      />
      <TextField
        label="Maturity Date"
        name="maturityDate"
        type="date"
        value={formData.maturityDate || ''}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Box>
  )
}

export default AddProduct;
