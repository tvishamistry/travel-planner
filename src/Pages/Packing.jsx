import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Packing({ tripId, currentUser }) {

    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const BASE = "https://didactic-zebra-r4vvqrpw6vjxfpjrq-8000.app.github.dev";
    const [loading, setLoading] = useState(false);
    const [packingItems, setPackingItems] = useState([]);
    const [selectedPackingItemId, setSelectedPackingItemId] = useState(null);
    const [selectedPersonalPackingItemId, setSelectedPersonalPackingItemId] = useState(null);
    const [onlyCurrentUser, setOnlyCurrentUser] = useState(false);
    const [onlyPersonalPackingItems, setOnlyPersonalPackingItems] = useState(false);
    const [personalPackingItems, setPersonalPackingItems] = useState([]);
    const [newItemName, setNewItemName] = useState("");
    const [newPersonalItemName, setNewPersonalItemName] = useState("");
    const [error, setError] = useState("");

    const fetchTrip = async () => {
        const res = await fetch(`${BASE}/trips/${tripId}`);
        const data = await res.json();
        setTrip(data);
        setLoading(false);
    };

   const fetchPackingItems = async () => {
    const res = await fetch(`${BASE}/trips/packingItems/${tripId}`);
    const data = await res.json();
    setPackingItems(
        (data.packingItems ?? []).map(item => ({ ...item, checked: item.checked === 1 || item.checked === true }))
    );
    setLoading(false);
};

    const fetchPersonalPackingItems = async () => {
        const res = await fetch(`${BASE}/trips/${tripId}/packingItems/${currentUser.username}`);
        const data = await res.json();
        setPersonalPackingItems(data.packingItems ?? []);
        setLoading(false);
    };

    const handleAddPackingItem = async () => {
        if (!newItemName.trim()) return;
        const response = await fetch(`${BASE}/trips/addPackingItems/${tripId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newItemName, username: currentUser.username })
        });
        if (!response.ok) { setError("Failed to add the packing item"); return; }
        setNewItemName("");
        fetchPackingItems();
    };

    const handleAddPersonalPackingItem = async () => {
        if (!newPersonalItemName.trim()) return;
        const response = await fetch(`${BASE}/trips/addPersonalPackingItem/${tripId}/${currentUser.username}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newPersonalItemName })
        });
        if (!response.ok) { setError("Failed to add the personal packing item"); return; }
        setNewPersonalItemName("");
        fetchPersonalPackingItems();
    };

    const handleDeletePackingItem = async (itemId) => {
        const response = await fetch(`${BASE}/trips/deletePackingItem/${tripId}/${itemId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) { setError("Failed to delete the packing item"); return; }
        fetchPackingItems();
    };

    const handleToggleChecked = async (itemId, currentChecked) => {
        // Optimistically update UI instantly
        setPackingItems(prev =>
            prev.map(item => item.id === itemId ? { ...item, checked: !currentChecked } : item)
        );

        const response = await fetch(`${BASE}/trips/packingItems/${itemId}/checked`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checked: !currentChecked })
        });

        if (!response.ok) {
            // Revert if request failed
            setPackingItems(prev =>
                prev.map(item => item.id === itemId ? { ...item, checked: currentChecked } : item)
            );
            setError("Failed to update item");
        }
    };

    useEffect(() => {
        if (!currentUser) { navigate("/login"); return; }
        fetchTrip();
        fetchPackingItems();
        fetchPersonalPackingItems();
    }, [tripId]);

    if (!trip) return (
        <div className="flex items-center justify-center h-40">
            <p className="text-sm text-gray-400">Loading...</p>
        </div>
    );

    const visiblePackingItems = onlyCurrentUser
        ? packingItems.filter(i => i.bringer === currentUser.username)
        : packingItems;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Packing List</h1>
                    <p className="text-sm text-gray-500 mt-1">for {trip.name}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setOnlyCurrentUser(!onlyCurrentUser)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                            onlyCurrentUser
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {onlyCurrentUser ? "Showing my items" : "My items only"}
                    </button>
                    <button
                        onClick={() => setOnlyPersonalPackingItems(!onlyPersonalPackingItems)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                            onlyPersonalPackingItems
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {onlyPersonalPackingItems ? "Showing personal" : "Personal only"}
                    </button>
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>
            )}

            <div className="grid grid-cols-2 gap-6">

                {/* Trip Packing Items */}
                {!onlyPersonalPackingItems && (
                    <div className="bg-white border border-gray-100 rounded-xl p-5">
                        <h2 className="text-sm font-medium text-gray-900 mb-4">Trip Items</h2>

                        <div className="flex gap-2 mb-4">
                            <input
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddPackingItem()}
                                placeholder="Add an item..."
                                className="flex-1 text-gray-900 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                            />
                            <button
                                onClick={handleAddPackingItem}
                                className="bg-emerald-600 text-white text-xs px-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                            >
                                + Add
                            </button>
                        </div>

                        {visiblePackingItems.length === 0 ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <p className="text-sm text-gray-400">No items yet</p>
                                <p className="text-xs text-gray-300 mt-1">Add something to pack above</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {visiblePackingItems.map(packingItem => (
                                    <div
                                        key={packingItem.id}
                                        className="flex items-center justify-between group border border-gray-100 rounded-xl px-4 py-3 hover:border-emerald-200 hover:shadow-sm transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleToggleChecked(packingItem.id, packingItem.checked)}
                                                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                                    packingItem.checked
                                                        ? "bg-emerald-500 border-emerald-500"
                                                        : "border-gray-300 hover:border-emerald-400"
                                                }`}
                                            >
                                                {packingItem.checked && (
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                            <div>
                                                <p className={`text-sm font-medium transition-colors ${
                                                    packingItem.checked ? "line-through text-gray-300" : "text-gray-800"
                                                }`}>
                                                    {packingItem.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">Packed by {packingItem.bringer}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeletePackingItem(packingItem.id)}
                                            className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs ml-3"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Personal Packing Items */}
                {!onlyCurrentUser && (
                    <div className="bg-white border border-gray-100 rounded-xl p-5">
                        <h2 className="text-sm font-medium text-gray-900 mb-4">My Personal Items</h2>

                        <div className="flex gap-2 mb-4">
                            <input
                                value={newPersonalItemName}
                                onChange={(e) => setNewPersonalItemName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddPersonalPackingItem()}
                                placeholder="Add a personal item..."
                                className="flex-1 text-gray-900 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                            />
                            <button
                                onClick={handleAddPersonalPackingItem}
                                className="bg-emerald-600 text-white text-xs px-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                            >
                                + Add
                            </button>
                        </div>

                        {personalPackingItems.length === 0 ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <p className="text-sm text-gray-400">No personal items yet</p>
                                <p className="text-xs text-gray-300 mt-1">These are only visible to you</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {personalPackingItems.map(personalPackingItem => (
                                    <div
                                        key={personalPackingItem.id}
                                        onClick={() => setSelectedPersonalPackingItemId(personalPackingItem.id)}
                                        className="flex items-center justify-between group border border-gray-100 rounded-xl px-4 py-3 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer"
                                    >
                                        <p className="text-sm font-medium text-gray-800">{personalPackingItem.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Packing;