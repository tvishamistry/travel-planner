import { useState, useEffect } from 'react';

const BASE = "https://didactic-zebra-r4vvqrpw6vjxfpjrq-8000.app.github.dev";

function Friends({ currentUser }) {
    const [tab, setTab] = useState("friends"); // friends | pending | search
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [searchStatus, setSearchStatus] = useState(""); // message to show after search
    const [sentUsernames, setSentUsernames] = useState(new Set());
    const [loading, setLoading] = useState(false);

    const fetchFriends = async () => {
        const res = await fetch(`${BASE}/friends/${currentUser.username}`);
        const data = await res.json();
        setFriends(data);
    };

    const fetchPending = async () => {
        const res = await fetch(`${BASE}/friends/${currentUser.username}/pending`);
        const data = await res.json();
        setPending(data);
    };

    const fetchSent = async () => {
        const res = await fetch(`${BASE}/friends/${currentUser.username}/sent`);
        const data = await res.json();
        setSentUsernames(new Set(data.map(r => r.receiver_username)));
    };

    useEffect(() => {
        fetchFriends();
        fetchPending();
        fetchSent();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearchStatus("");
        setSearchResult(null);
        try {
            const res = await fetch(`${BASE}/newuser/${searchQuery.trim()}`);
            if (!res.ok) { setSearchStatus("User not found."); return; }
            const data = await res.json();
            if (data.username === currentUser.username) {
                setSearchStatus("That's you!");
                return;
            }
            setSearchResult(data);
        } catch {
            setSearchStatus("Error searching for user.");
        }
    };

    const handleSendRequest = async (receiverUsername) => {
        setLoading(true);
        const res = await fetch(`${BASE}/friends/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderUsername: currentUser.username, receiverUsername })
        });
        const data = await res.json();
        if (res.ok) {
            setSentUsernames(prev => new Set([...prev, receiverUsername]));
            setSearchStatus("Friend request sent!");
        } else {
            setSearchStatus(data.error || "Failed to send request");
        }
        setLoading(false);
    };

    const handleRespond = async (requestId, status) => {
        await fetch(`${BASE}/friends/request/${requestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });
        fetchPending();
        fetchFriends();
    };

    const isFriend = (username) => friends.some(f => f.friend_username === username);
    const hasSent = (username) => sentUsernames.has(username);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Friends</h1>

            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { key: "friends", label: "My Friends" },
                    { key: "pending", label: `Requests${pending.length ? ` (${pending.length})` : ""}` },
                    { key: "search", label: "Find Friends" },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            tab === t.key
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === "friends" && (
                <div className="space-y-2">
                    {friends.length === 0 ? (
                        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
                            <p className="text-sm font-medium text-gray-700 mb-1">No friends yet</p>
                            <p className="text-xs text-gray-400">Use "Find Friends" to search by username</p>
                        </div>
                    ) : friends.map(f => (
                        <div key={f.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700">
                                    {f.friend_username[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{f.friend_username}</span>
                            </div>
                            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Friends</span>
                        </div>
                    ))}
                </div>
            )}

            {tab === "pending" && (
                <div className="space-y-2">
                    {pending.length === 0 ? (
                        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
                            <p className="text-sm text-gray-400">No pending requests</p>
                        </div>
                    ) : pending.map(r => (
                        <div key={r.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                                    {r.sender_username[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{r.sender_username}</p>
                                    <p className="text-xs text-gray-400">wants to be friends</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleRespond(r.id, 'accepted')}
                                    className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleRespond(r.id, 'rejected')}
                                    className="text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === "search" && (
                <div>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search by username..."
                            className="flex-1 text-gray-900 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {searchStatus && (
                        <p className="text-sm text-gray-500 mb-3">{searchStatus}</p>
                    )}

                    {searchResult && (
                        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
                                    {searchResult.username[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{searchResult.username}</span>
                            </div>
                            {isFriend(searchResult.username) ? (
                                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Already friends</span>
                            ) : hasSent(searchResult.username) ? (
                                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Request sent</span>
                            ) : (
                                <button
                                    onClick={() => handleSendRequest(searchResult.username)}
                                    disabled={loading}
                                    className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                                >
                                    + Add Friend
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Friends;