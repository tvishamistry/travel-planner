import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Friends from './Friends';
import Trips from './Trips';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [activePage, setActivePage] = useState("dashboard");
    const navigate = useNavigate();

    const navItems = [
        { key: "dashboard", label: "Dashboard" },
        { key: "trips",     label: "My trips" },
        { key: "friends",   label: "Friends" },
        { key: "explore",   label: "Explore" },
        { key: "itinerary", label: "Itinerary" },
    ];

    const toolItems = [
        { key: "budget",   label: "Budget" },
        { key: "packing",  label: "Packing lists" },
        { key: "docs",     label: "Documents" },
    ];

    useEffect(() => {
        const userData = sessionStorage.getItem("currentUser");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("currentUser");
        navigate("/login");
    };

    const renderMain = () => {
        if (!user) return null;
        
        // Dynamic content based on sidebar selection
        if (activePage === "friends") return <Friends currentUser={user} />;
        if (activePage === "trips")   return <Trips currentUser={user} />;
        
        // Default Dashboard Home View
        return (
            <>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user.username}</h1>
                        <p className="text-sm text-gray-500 mt-1">Start by planning your first trip</p>
                    </div>
                    <button
                        onClick={() => setActivePage("trips")}
                        className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        + New trip
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* You can add dashboard overview cards here later */}
                    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <h3 className="font-medium text-gray-800">Quick Stats</h3>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">0</p>
                        <p className="text-xs text-gray-400">Upcoming trips</p>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col px-4 py-6 flex-shrink-0">
                <div className="flex items-center gap-2 px-2 mb-10">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xl font-bold tracking-tight">Travel Planner</span>
                </div>

                <nav className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 mb-4">Main Menu</p>
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActivePage(item.key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all ${
                                activePage === item.key
                                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}

                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 mb-4 mt-8">Tools</p>
                    {toolItems.map((item) => (
                        <button
                            key={item.key}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
                        >
                            {item.label}
                        </button>
                    ))}

                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 mb-4 mt-8">Account</p>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
                        <span>⚙</span> Settings
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all mt-1"
                    >
                        <span>Logout</span> 
                    </button>
                </nav>

                {/* User Profile Footer */}
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                            {user ? user.username[0].toUpperCase() : "?"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user?.username || "Guest"}</p>
                            <p className="text-xs text-gray-400">Free Account</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {renderMain()}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
