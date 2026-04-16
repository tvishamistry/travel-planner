import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("All fields must be filled out");
            return;
        }
        try {
            await loginToAccount();
        } catch (error) {
            console.error("Error logging into account: ", error.message);
        }
    };

    const loginToAccount = async () => {
        setLoading(true);
        const response = await fetch('https://didactic-zebra-r4vvqrpw6vjxfpjrq-8000.app.github.dev/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
    const userToSave = data.user || data; 
    sessionStorage.setItem("currentUser", JSON.stringify(userToSave));
    navigate("/dashboard");
}
        else {
            setError(data.error || "Login failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xl font-semibold text-gray-900 tracking-tight">Travel Planner</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h2>
                    <p className="text-sm text-gray-500 mb-8">
                        Don't have an account?{" "}
                        <Link to="/" className="text-emerald-600 hover:underline font-medium">Sign up</Link>
                    </p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">Username</label>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                type="text"
                                className="w-full text-gray-900 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                type="password"
                                className="w-full text-gray-900 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;