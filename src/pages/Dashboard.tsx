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

const Dashboard = () => {
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalInvestments, setTotalInvestments] = useState<number>(0);
    const [mostSellingProducts, setMostSellingProducts] = useState();
    useEffect(() => {
        const dashboardApi = async () => {
            const { data } = await dashboard();
            setTotalProducts(data.totalProducts.totalProducts);
            setTotalUsers(data.totalUsers.totalUsers);
            setTotalInvestments(data.totalInvestments.totalInvestments);
            setMostSellingProducts(data.mostSellingProducts);
            console.log(mostSellingProducts)
        }
        dashboardApi();
    }, [totalProducts, totalUsers, totalInvestments]);

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: "#e3f2fd", textAlign: "center" }}>
                        <CardContent>
                            <Typography variant="h6">Total Users</Typography>
                            <Typography variant="h4">{totalUsers}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: "#f1f8e9", textAlign: "center" }}>
                        <CardContent>
                            <Typography variant="h6">Total Investments</Typography>
                            <Typography variant="h4">{totalInvestments}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: "#fff3e0", textAlign: "center" }}>
                        <CardContent>
                            <Typography variant="h6">Total Products</Typography>
                            <Typography variant="h4">{totalProducts}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
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
