import AdminHeader from "../../Components/AdminHeader"
import HallManagement from "./HallManagement/HallManagement"
import HallConfig from "./HallConfig/HallConfig"
import './HallManagement/HallManagement.css'
import AdminDataProvider from "../../Api/AdminDataProvider"
import PriceConfig from "./PriceConfig/PriceConfig"
import './PriceConfig/PriceConfig.css'
import SessionGrid from "./SessionGrid/SessionGrid"
import './SessionGrid/SessionGrid.css'
import OpenSales from "./OpenSales/OpenSales"
import './OpenSales/OpenSales.css'

export default function AdminDashboardPage() {
    return (
        <>
        < AdminDataProvider>
            <div className="adminWrap">
                <AdminHeader />
                <div className="dashboard-wrap">
                  <div className="line-wrap"><HallManagement /></div>
                  <div className="line-wrap"><HallConfig /></div>
                  <div className="line-wrap"><PriceConfig /></div>
                  <div className="line-wrap"><SessionGrid /></div>
                  <div className="line-wrap"><OpenSales /></div>
                </div>
            </div>
        </AdminDataProvider>
        </>
    )
}