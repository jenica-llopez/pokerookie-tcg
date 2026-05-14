import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import StockPage from './pages/StockPage';
import SalesPage from './pages/SalesPage';
import ShipmentsPage from './pages/ShipmentsPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter basename="/pokerookie-tcg">
      <Layout>
        <Routes>
          <Route path="/" element={<StockPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/shipments" element={<ShipmentsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
