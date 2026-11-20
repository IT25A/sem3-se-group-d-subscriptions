import { useState } from "react";
import logoImg from "../assets/logo.png";
import { CogIcon, LogoutIcon, DashboardIcon, CurrencyIcon, ChartIcon, CompareIcon, NotificationIcon } from "../assets/icons.jsx";
import Modal from "./Modal.jsx";
import Settings from "../pages/Settings.jsx";

function HamburgerIcon({ open }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
                <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </>
            ) : (
                <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </>
            )}
        </svg>
    );
}

function Sidebar({ user, onLogout, activePage, onNavigate, notificationCount = 0 }) {
    const [showSettings, setShowSettings] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { icon: DashboardIcon, label: "Dashboard" },
        { icon: CurrencyIcon, label: "Subscriptions" },
        { icon: ChartIcon, label: "Analytics" },
        { icon: CompareIcon, label: "Compare" },
        { icon: NotificationIcon, label: "Notifications" },
    ];

    const handleNavigate = (label) => {
        onNavigate?.(label);
        setMobileOpen(false);
    };

    return (
        <>
            <button
                className="sidebar-hamburger"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
                <HamburgerIcon open={mobileOpen} />
            </button>

            {mobileOpen && (
                <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
            )}

            <aside className={`sidebar${mobileOpen ? " sidebar--open" : ""}`}>
                <div className="sidebar-logo">
                    <img src={logoImg} alt="PENNYwise" className="sidebar-logo-img" />
                    <span className="sidebar-logo-text">PENNYwise</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleNavigate(item.label)}
                            className={activePage === item.label ? "sidebar-nav-item active" : "sidebar-nav-item"}
                        >
                            <span className="relative inline-flex">
                                <item.icon className="icon icon-white" />
                                {item.label === "Notifications" && notificationCount > 0 && (
                                    <span className="absolute top-px right-px w-1.5 h-1.5 rounded-full bg-red-500" />
                                )}
                            </span>
                            <span className="sidebar-nav-label">{item.label}</span>
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
                    <div className="sidebar-options flex gap-2">
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
        </>
    );
}

export default Sidebar;