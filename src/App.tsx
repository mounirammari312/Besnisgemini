import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout'; // تم تصحيح حرف l
import { DashboardLayout } from '@/components/layout/DashboardLayout'; // تم تصحيح حرف l
import { HomePage } from '@/pages/HomePage';
import { AuthPage } from '@/pages/AuthPage';
import { SearchPage } from '@/pages/SearchPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage';
import { SupplierProfilePage } from '@/pages/SupplierProfilePage';
import { CartPage } from '@/pages/CartPage';
import { ComparisonPage } from '@/pages/ComparisonPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SupplierOverview } from '@/pages/dashboard/SupplierOverview';
import { SupplierProductsPage } from '@/pages/dashboard/SupplierProductsPage';
import { SupplierReviewsPage } from '@/pages/dashboard/SupplierReviewsPage';
import { SupplierGrowthPage } from '@/pages/dashboard/SupplierGrowthPage';
import { BuyerOverview } from '@/pages/dashboard/BuyerOverview';
import { AdminOverview } from '@/pages/dashboard/AdminOverview';
import { MessagesPage } from '@/pages/dashboard/MessagesPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import RequestQuotePage from '@/pages/RequestQuotePage'; // إضافة الصفحة الجديدة
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/product/:id/quote" element={<RequestQuotePage />} /> 
          <Route path="/supplier/:id" element={<SupplierProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/dashboard/supplier" element={<DashboardLayout role="supplier"><SupplierOverview /></DashboardLayout>} />
        <Route path="/dashboard/supplier/products" element={<DashboardLayout role="supplier"><SupplierProductsPage /></DashboardLayout>} />
        <Route path="/dashboard/supplier/reviews" element={<DashboardLayout role="supplier"><SupplierReviewsPage /></DashboardLayout>} />
        <Route path="/dashboard/supplier/growth" element={<DashboardLayout role="supplier"><SupplierGrowthPage /></DashboardLayout>} />
        <Route path="/dashboard/supplier/messages" element={<DashboardLayout role="supplier"><MessagesPage /></DashboardLayout>} />
        <Route path="/dashboard/buyer" element={<DashboardLayout role="buyer"><BuyerOverview /></DashboardLayout>} />
        <Route path="/dashboard/buyer/messages" element={<DashboardLayout role="buyer"><MessagesPage /></DashboardLayout>} />
        <Route path="/admin" element={<DashboardLayout role="admin"><AdminOverview /></DashboardLayout>} />
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
