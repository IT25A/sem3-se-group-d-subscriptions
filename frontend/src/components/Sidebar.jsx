import { useState } from "react";
import logoImg from "../assets/logo.png";
import { CogIcon, LogoutIcon, DashboardIcon, CurrencyIcon, ChartIcon, CompareIcon, NotificationIcon } from "../assets/icons.jsx";
import Modal from "./Modal.jsx";
import Settings from "../pages/Settings.jsx";

function Sidebar({ user, onLogout, activePage, onNavigate, notificationCount = 0 }) {
    const [showSettings, setShowSettings] = useState(false);
    const navItems = [
        { icon: DashboardIcon, label: "Dashboard" },
        { icon: CurrencyIcon, label: "Subscriptions" },
        { icon: ChartIcon, label: "Analytics" },
        { icon: CompareIcon, label: "Compare" },
        { icon: NotificationIcon, label: "Notifications" },
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
                            <span className="relative inline-flex">
                                <item.icon className="icon icon-white" />
                                {item.label === "Notifications" && notificationCount > 0 && (
                                    <span className="absolute top-px right-px w-1.5 h-1.5 rounded-full bg-red-500" />
                                )}
                            </span>
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
                        <button className="btn btn-secondary" title="Settings" onClick={() => setShowSettings(true)}>
                            <CogIcon className="icon icon-white" />
                        </button>
                        <button className="btn btn-secondary" onClick={onLogout} title="Logout">
                            <LogoutIcon className="icon icon-white" />
                        </button>
                    </div>
                </div>
            </aside>
            <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
                <Settings onAccountDeleted={onLogout} />
            </Modal>
        </div>
    );
}

export default Sidebar;