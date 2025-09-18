import { useEffect, useState } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import { dashboard } from "../services/apiService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalInvestments, setTotalInvestments] = useState<number>(0);
    interface Product {
        id: number;
        name: string;
        totalInvestments: number;
    }
    const [mostSellingProducts, setMostSellingProducts] = useState<Product[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const dashboardApi = async () => {
            const { data, error } = await dashboard();
            if(error){
                navigate('/login');
            }
            if (typeof data === 'object' && data !== null) {
                const d = data as {
                    totalProducts: { totalProducts: number };
                    totalUsers: { totalUsers: number };
                    totalInvestments: { totalInvestments: number };
                    mostSellingProducts: Product[];
                };
                setTotalProducts(d.totalProducts.totalProducts);
                setTotalUsers(d.totalUsers.totalUsers);
                setTotalInvestments(d.totalInvestments.totalInvestments);
                setMostSellingProducts(d.mostSellingProducts);
            }
        }
        dashboardApi();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                    <Card sx={{ bgcolor: "#e3f2fd", textAlign: "center" }}>
                        <CardContent>
                            <Typography variant="h6">Total Users</Typography>
                            <Typography variant="h4">{totalUsers}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ bgcolor: "#f1f8e9", textAlign: "center" }}>
                        <CardContent>
                            <Typography variant="h6">Total Investments</Typography>
                            <Typography variant="h4">{totalInvestments}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ bgcolor: "#fff3e0", textAlign: "center" }}>
                        <CardContent>
                            <Typography variant="h6">Total Products</Typography>
                            <Typography variant="h4">{totalProducts}</Typography>
                        </CardContent>
                    </Card>
            </Grid>

            <Typography variant="h5" gutterBottom>
                Most Selling Products
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: "#eeeeee" }}>
                        <TableRow>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Sales</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mostSellingProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.totalInvestments}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Dashboard;
