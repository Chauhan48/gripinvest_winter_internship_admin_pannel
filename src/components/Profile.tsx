import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { updateProfile } from '../services/apiService';

const Profile = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [suggestion, setSuggestion] = useState<string[] | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        password: '',
        risk_appetite: 'moderate',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };



    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const response = async () => {
            const { message, suggestions, warning, error } = await updateProfile(formData);

            setSuggestion(suggestions || null);
            setWarning(warning || null);

            if (error) {
                setError(error);
                setSuccess(null);
            } else {
                setError(null);
                setSuccess(message || "Profile updated successfully");
            }

            setOpenSnackbar(true);
        }
        response();
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 4,
                p: 3,
                border: '1px solid #ccc',
                borderRadius: 2,
                boxShadow: 1,
            }}
            component="form"
            onSubmit={handleSubmit}
        >
            <Typography variant="h5" mb={3} textAlign="center">
                Update Profile
            </Typography>

            <TextField
                fullWidth
                required
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                margin="normal"
            />

            <TextField
                fullWidth
                required
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                margin="normal"
            />

            <TextField
                fullWidth
                required
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                inputProps={{ minLength: 6 }}
            />

            <FormControl fullWidth margin="normal">
                <InputLabel id="risk-appetite-label">Risk Appetite</InputLabel>
                <Select
                    labelId="risk-appetite-label"
                    name="risk_appetite"
                    value={formData.risk_appetite}
                    label="Risk Appetite"
                    onChange={handleChange}
                >
                    <MenuItem value="low">low</MenuItem>
                    <MenuItem value="moderate">moderate</MenuItem>
                    <MenuItem value="high">high</MenuItem>
                </Select>
            </FormControl>

            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 3 }}
            >
                Update Profile
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
                    {error ? error : success} <br />
                    {suggestion && <><span style={{ color: '#0288d1' }}>Suggestion: {suggestion ? suggestion : ''} </span> <br /></>}
                    {warning && <><span style={{ color: '#fa9304ff' }}>Warning: {warning ? warning : ''}</span></>}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;
