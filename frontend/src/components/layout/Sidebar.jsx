import logoImg from "../../assets/logo.png";
import settingsIcon from "../../assets/cog.svg";
import logoutIcon from "../../assets/logout.svg";
import dashboardIcon from "../../assets/dashboard.svg";
import subscriptionIcon from "../../assets/currency.svg";
import budgetIcon from "../../assets/wallet.svg";
import analyticsIcon from "../../assets/chart.svg";
import notificationIcon from "../../assets/notification.svg";

function Sidebar({ user, onLogout }) {
    const navItems = [
        { icon: dashboardIcon, label: "Dashboard", active: true },
        { icon: subscriptionIcon, label: "Subscriptions", active: false },
        { icon: budgetIcon, label: "Budget", active: false },
        { icon: analyticsIcon, label: "Analytics", active: false },
        { icon: notificationIcon, label: "Notifications", active: false },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src={logoImg} alt="PENNYwise" className="sidebar-logo-img" />
                <span className="sidebar-logo-text">PENNYwise</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={item.active ? "sidebar-nav-item active" : "sidebar-nav-item"}
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
                    <button className="btn-secondary" title="Settings">
                        <img src={settingsIcon} alt="Settings" className="icon icon-white" />
                    </button>
                    <button className="btn-secondary" onClick={onLogout} title="Logout">
                        <img src={logoutIcon} alt="Logout" className="icon icon-white" />
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;