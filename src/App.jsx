import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import './Pages/SeatsPage/Hall.css'
import './Pages/MoviesPage/indexNav.css'
import './Pages/PaymentPage/Payment.css'
import './Pages/TicketPage/TicketPage.css'
import './Pages/AdminLoginPage/AdminLoginPage.css'
import './Pages/AdminDashboardPage/AdminDashboardPage.css'
import AdminDataProvider from './Api/AdminDataProvider'
import MoviesPage from './Pages/MoviesPage/MoviesPage'
import SeatsPage from './Pages/SeatsPage/SeatsPage'
import Payment from './Pages/PaymentPage/Payment'
import AdminLoginPage from './Pages/AdminLoginPage/AdminLoginPage'
import AdminDashboardPage from './Pages/AdminDashboardPage/AdminDashboardPage'
import { SelectedSeatsProvider } from './Api/SelectedSeatsContext';
import TicketPage from './Pages/TicketPage/TicketPage'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
    <SelectedSeatsProvider>
      <AdminDataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/movies" replace />} />
            <Route path='/movies' element={<MoviesPage/>}/>
            <Route path="/seats/:seanceId" element={<SeatsPage />} />
            <Route path="/payment/:seanceId" element={<Payment />} />
            <Route path='/ticket/:seanceId' element={<TicketPage />} />
            <Route path="/login" element={<AdminLoginPage setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/dashboard" element={isLoggedIn ? <AdminDashboardPage /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/movies" replace />} />
          </Routes>
        </Router>
      </AdminDataProvider>
    </SelectedSeatsProvider>
    </>
  )
}

export default App
