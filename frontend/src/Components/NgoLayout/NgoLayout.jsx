import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";

export default function NgoLayout() {
    const userType = "ngo";
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <SideBar userType={userType} />
            <main style={{ flex: 1, padding: "2rem" }}>
                <Outlet />
            </main>
        </div>
    );
}