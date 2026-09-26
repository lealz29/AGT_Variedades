import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import RequireAdmin from './components/RequireAdmin'
import { AuthProvider } from './contexts/AuthContext'
import { SelectionProvider } from './contexts/SelectionContext'

import Home from './pages/Home'
import Category from './pages/Category'
import ProductDetail from './pages/ProductDetail'
import Search from './pages/Search'
import Selection from './pages/Selection'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductForm from './pages/admin/AdminProductForm'

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SelectionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/categoria/:slug" element={<PublicLayout><Category /></PublicLayout>} />
            <Route path="/produto/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
            <Route path="/buscar" element={<PublicLayout><Search /></PublicLayout>} />
            <Route path="/selecao" element={<PublicLayout><Selection /></PublicLayout>} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/produtos/:id" element={<RequireAdmin><AdminProductForm /></RequireAdmin>} />
          </Routes>
        </BrowserRouter>
      </SelectionProvider>
    </AuthProvider>
  )
}
