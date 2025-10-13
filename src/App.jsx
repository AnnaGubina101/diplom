import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './Pages/SeatsPage/Hall.css'
import './Pages/MoviesPage/indexNav.css'
import './Pages/PaymentPage/Payment.css'
import MoviesPage from './Pages/MoviesPage/MoviesPage'
import SeatsPage from './Pages/SeatsPage/SeatsPage'
import Payment from './Pages/PaymentPage/Payment'
import AdminHeader from './Components/AdminHeader'
import AdminLoginPage from './Pages/AdminLoginPage/AdminLoginPage'
import './Pages/AdminLoginPage/AdminLoginPage.css'
import AdminDashboardPage from './Pages/AdminDashboardPage/AdminDashboardPage'
import './Pages/AdminDashboardPage/AdminDashboardPage.css'

function App() {

  return (
    <>
    <Router>
      <Routes>
        {/* <Route path='/' element={<AdminLoginPage />} /> */}
        <Route path='/' element={<AdminDashboardPage />} />
      </Routes>
      
      {/* <div className="wrap"> */}
        <Routes>
          {/* <Route path='/' element={<MoviesPage />} /> */}
          {/* <Route path='/seats/:sessionId' element={<SeatsPage />}/>
          <Route path='/payment' element={<Payment />}/> */}
        </Routes>
      {/* </div> */}
    </Router>
    </>
  )
}

export default App
