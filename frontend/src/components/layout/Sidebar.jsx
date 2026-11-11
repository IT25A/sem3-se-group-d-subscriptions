import { useState } from "react";
import logoImg from "../../assets/logo.png";
import settingsIcon from "../../assets/cog.svg";
import logoutIcon from "../../assets/logout.svg";
import dashboardIcon from "../../assets/dashboard.svg";
import subscriptionIcon from "../../assets/currency.svg";
import analyticsIcon from "../../assets/chart.svg";
import compareIcon from "../../assets/compare.svg";
import notificationIcon from "../../assets/notification.svg";
import Modal from "../ui/Modal.jsx";

function Sidebar({ user, onLogout, activePage, onNavigate }) {
    const [showSettings, setShowSettings] = useState(false);
    const navItems = [
        { icon: dashboardIcon, label: "Dashboard" },
        { icon: subscriptionIcon, label: "Subscriptions" },
        { icon: analyticsIcon, label: "Analytics" },
        { icon: compareIcon, label: "Compare" },
        { icon: notificationIcon, label: "Notifications" },
    ];

    return (
        <div>
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <img src={logoImg} alt="PENNYwise" className="sidebar-logo-img" />
                    <span className="sidebar-logo-text">PENNYwise</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => onNavigate?.(item.label)}
                            className={activePage === item.label ? "sidebar-nav-item active" : "sidebar-nav-item"}
                        >
                            <img src={item.icon} alt={item.label} className="icon icon-white"/>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {user?.username?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <span className="sidebar-username">{user?.username}</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn-secondary" title="Settings" onClick={() => setShowSettings(true)}>
                            <img src={settingsIcon} alt="Settings" className="icon icon-white" />
                        </button>
                        <button className="btn-secondary" onClick={onLogout} title="Logout">
                            <img src={logoutIcon} alt="Logout" className="icon icon-white" />
                        </button>
                    </div>
                </div>
            </aside>
            <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
                <p className="t-secondary text-sm">No settings available yet.</p>
            </Modal>
        </div>
    );
}

export default Sidebar;