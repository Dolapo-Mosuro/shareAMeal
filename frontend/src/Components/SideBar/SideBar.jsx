import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./SideBar.module.css";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const menuConfig = {
	ngo: [
		{ label: "Dashboard", icon: "🏠", path: "/ngo" },
		{ label: "Browse Food", icon: "🔍", path: "/ngo/browse" },
		{ label: "Reserve", icon: "📝", path: "/ngo/reserve" },
		{ label: "Pickup", icon: "🚚", path: "/ngo/pickup" },
		{ label: "Messages", icon: "💬", path: "/ngo/messages", badge: 3 },
		{ label: "Settings", icon: "⚙️", path: "/ngo/settings" },
	],
	sme: [
		{ label: "Dashboard", icon: "🏠", path: "/sme" },
		{ label: "Meals", icon: "🍽️", path: "/sme/meals" },
		{ label: "Messages", icon: "💬", path: "/sme/messages" },
		{ label: "Settings", icon: "⚙️", path: "/sme/settings" },
	],
};

export default function SideBar({ userType, isMobileOpen, closeSidebar }) {
	const [collapsed, setCollapsed] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		localStorage.clear();
		navigate("/login");
	};

	const menu = menuConfig[userType] || [];

	return (
		<aside
			className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${isMobileOpen ? styles.mobileOpen : ""}`}
		>
			<div className={styles.top}>
				<button
					className={styles.collapseBtn}
					onClick={() => setCollapsed((c) => !c)}
				>
					{collapsed ? <FaBars /> : <FaTimes />}
				</button>
				<span className={styles.logo}>{!collapsed && "Share A Meal"}</span>
			</div>
			<nav className={styles.menu}>
				{menu.map((item) => (
					<div
						key={item.label}
						className={`${styles.menuItem} ${location.pathname.startsWith(item.path) ? styles.active : ""}`}
						onClick={() => {
							navigate(item.path);
							if (isMobileOpen) closeSidebar();
						}}
					>
						<span className={styles.icon}>{item.icon}</span>
						{!collapsed && (
							<>
								<span>{item.label}</span>
								{item.badge && (
									<span className={styles.badge}>{item.badge}</span>
								)}
							</>
						)}
					</div>
				))}
			</nav>
			<div className={styles.logoutSection}>
				<button className={styles.logoutBtn} onClick={handleLogout}>
					<FaSignOutAlt />
					{!collapsed && "Logout"}
				</button>
			</div>
		</aside>
	);
}
