import React, { useState, useEffect } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, TablePagination, TextField, Box, Chip
} from '@mui/material';
import { transactions } from '../services/apiService';

interface TransactionLog {
  id: number;
  user_id: string;
  email: string | null;
  endpoint: string;
  http_method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status_code: number;
  error_message?: string | null;
  created_at: string;
}

const Transactions: React.FC = () => {
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ user_id: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  setLoading(true);
  const params = new URLSearchParams({
    page: String(page + 1),
    limit: String(rowsPerPage),
    ...(filters.user_id && { user_id: filters.user_id }),
    ...(filters.email && { email: filters.email }),
  });
  const transactionLogs = async () => {
      const response = await transactions(params);
      setTotal(response.data.total);
      setLogs(response.data.transactions);
      setLoading(false);
      console.log(response.data);
  };
  transactionLogs();
}, [page, rowsPerPage, filters]);

  const handlePageChange = (_event: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
    setPage(0);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="User ID"
          name="user_id"
          value={filters.user_id}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          label="Email"
          name="email"
          value={filters.email}
          onChange={handleFilterChange}
          size="small"
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Endpoint</TableCell>
              <TableCell>HTTP Method</TableCell>
              <TableCell>Status Code</TableCell>
              <TableCell>Error Message</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Loading...</TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No logs found</TableCell>
              </TableRow>
            ) : logs.map(tx => (
              <TableRow key={tx.id}>
                <TableCell>{tx.id}</TableCell>
                <TableCell>{tx.user_id}</TableCell>
                <TableCell>{tx.email ?? '-'}</TableCell>
                <TableCell>{tx.endpoint}</TableCell>
                <TableCell>
                  <Chip label={tx.http_method} size="small" />
                </TableCell>
                <TableCell>{tx.status_code}</TableCell>
                <TableCell>{tx.error_message ?? '-'}</TableCell>
                <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </TableContainer>
    </Paper>
  );
};

export default Transactions;