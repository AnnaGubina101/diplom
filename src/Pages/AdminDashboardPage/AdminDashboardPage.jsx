import AdminHeader from "../../Components/AdminHeader"
import HallManagement from "./HallManagement/HallManagement"
import HallConfig from "./HallConfig/HallConfig"
import './HallManagement/HallManagement.css'

export default function AdminDashboardPage() {
    return (
        <>
            <div className="adminWrap">
                <AdminHeader />
                <div className="dashboard-wrap">
                  <HallManagement />
                  <HallConfig />
                </div>
            </div>
        </>
    )
}