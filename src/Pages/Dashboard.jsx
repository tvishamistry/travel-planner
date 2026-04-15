import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
function Dashboard() {

const[user,setUser] = useState(null);
const navigate = useNavigate();
  const navItems = [
    {  label: "Dashboard", active: true },
    {   label: "My trips" },
    {  label: "Explore" },
    {  label: "Itinerary" },
  ];

  const toolItems = [
    {  label: "Budget" },
    {  label: "Packing lists" },
    { label: "Documents" },
  ];

  useEffect(()=>{
        const userData = sessionStorage.getItem("currentUser");
    
            if(userData){
                setUser(JSON.parse(userData));
            }
            else{
            navigate("/login");
             }
    },[])

const handleLogout = () => {
  sessionStorage.removeItem("currentUser");
  navigate("/login");
};

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
        //sidebar
      <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col px-3 py-6 flex-shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-lg font-semibold text-gray-900 tracking-tight">Travel Planner</span>
          
        </div>

        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-2 mb-2">Main</p>
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 cursor-pointer ${
              item.active
                ? "bg-emerald-50 text-emerald-700 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {item.label}
          </div>
        ))}

        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-2 mb-2 mt-6">Tools</p>
        {toolItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          >
            {item.label}
          </div>
        ))}

        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-2 mb-2 mt-6">Account</p>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-gray-800">
          <span>⚙</span> Settings

           
        </div>

        <button onClick = {handleLogout}>
                Logout
            </button>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-400">
              ?
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">My Account</p>
              <p className="text-xs text-gray-400">Free plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-8">
          <div>
           
            <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user ? user.username : ""}</h1>
            <p className="text-sm text-gray-500 mt-1">Start by planning your first trip</p>

          </div>
          <button className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            + New trip
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Trips planned", value: "0" },
            { label: "Countries visited", value: "0" },
            { label: "Next trip in", value: "—" },
            { label: "Total budget", value: "—" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-2xl font-semibold text-gray-300">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-4">My trips</h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">No trips yet</p>
              <p className="text-xs text-gray-400 mb-5 max-w-xs">
                Create your first trip and start building your itinerary, budget, and packing list all in one place.
              </p>
              <button className="bg-emerald-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                + Plan a trip
              </button>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-4">
            {/* Budget empty */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Budget tracker</h2>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-xs text-gray-400">Budget details will appear once you create a trip.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Recent activity</h2>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-xs text-gray-400">Your activity will show up here as you plan.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900">Destinations on your list</h2>
            <span className="text-xs text-emerald-600 cursor-pointer">+ Add destination</span>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Where do you want to go?</p>
            <p className="text-xs text-gray-400 mb-5">
              Add destinations to your wishlist and start dreaming about your next adventure.
            </p>
            <button className="border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              + Add a destination
            </button>
           
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;