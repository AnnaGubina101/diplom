import AdminHeader from "../../Components/AdminHeader"
import HallManagement from "./HallManagement/HallManagement"
import HallConfig from "./HallConfig/HallConfig"
import './HallManagement/HallManagement.css'
import AdminDataProvider from "../../Api/AdminDataProvider"
import PriceConfig from "./PriceConfig/PriceConfig"
import './PriceConfig/PriceConfig.css'
import SessionGrid from "./SessionGrid/SessionGrid"
import './SessionGrid/SessionGrid.css'

export default function AdminDashboardPage() {
    return (
        <>
        < AdminDataProvider>
            <div className="adminWrap">
                <AdminHeader />
                <div className="dashboard-wrap">
                  <HallManagement />
                  <HallConfig />
                  <PriceConfig />
                  <SessionGrid />
                </div>
            </div>
        </AdminDataProvider>
        </>
    )
}