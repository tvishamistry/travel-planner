import { useState, useEffect } from 'react';

const BASE = "https://didactic-zebra-r4vvqrpw6vjxfpjrq-8000.app.github.dev";

// ── helpers ───────────────────────────────────────────────────
const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Night", "All day"];

function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function tripDays(start, end) {
    if (!start || !end) return 1;
    const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff) + 1);
}

// ── Sub-components ────────────────────────────────────────────

function CreateTripModal({ currentUser, onClose, onCreated }) {
    const [form, setForm] = useState({ name: "", description: "", destination: "", startDate: "", endDate: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async () => {
        if (!form.name.trim()) { setError("Trip name is required"); return; }
        setLoading(true);
        const res = await fetch(`${BASE}/trips`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, ownerUsername: currentUser.username })
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) { onCreated(data.tripId); onClose(); }
        else setError(data.error || "Failed to create trip");
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Plan a new trip</h2>

                <div className="space-y-3">
                    {[
                        { label: "Trip name *", key: "name", placeholder: "e.g. Europe Summer 2025" },
                        { label: "Destination", key: "destination", placeholder: "e.g. Paris, France" },
                        { label: "Description", key: "description", placeholder: "What's this trip about?" },
                    ].map(({ label, key, placeholder }) => (
                        <div key={key} className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">{label}</label>
                            {key === "description" ? (
                                <textarea
                                    value={form[key]}
                                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                    placeholder={placeholder}
                                    rows={2}
                                    className="text-gray-900 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={form[key]}
                                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                    placeholder={placeholder}
                                    className="text-gray-900 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                                />
                            )}
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Start date", key: "startDate" },
                            { label: "End date", key: "endDate" },
                        ].map(({ label, key }) => (
                            <div key={key} className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-600">{label}</label>
                                <input
                                    type="date"
                                    value={form[key]}
                                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                    className="text-gray-900 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-3 text-center">{error}</p>}

                <div className="flex gap-2 mt-5">
                    <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleCreate} disabled={loading} className="flex-1 bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                        {loading ? "Creating..." : "Create trip"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function AddItineraryModal({ tripId, maxDay, currentUser, onClose, onAdded }) {
    const [form, setForm] = useState({ dayNumber: "1", timeOfDay: "Morning", title: "", description: "", location: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAdd = async () => {
        if (!form.title.trim()) { setError("Title is required"); return; }
        setLoading(true);
        const res = await fetch(`${BASE}/trips/${tripId}/itinerary`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, dayNumber: parseInt(form.dayNumber), createdBy: currentUser.username })
        });
        setLoading(false);
        if (res.ok) { onAdded(); onClose(); }
        else setError("Failed to add item");
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Add itinerary item</h2>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">Day</label>
                            <select
                                value={form.dayNumber}
                                onChange={e => setForm(p => ({ ...p, dayNumber: e.target.value }))}
                                className="text-gray-900 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                            >
                                {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
                                    <option key={d} value={d}>Day {d}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">Time</label>
                            <select
                                value={form.timeOfDay}
                                onChange={e => setForm(p => ({ ...p, timeOfDay: e.target.value }))}
                                className="text-gray-900 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                            >
                                {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    {[
                        { label: "Title *", key: "title", placeholder: "e.g. Visit Eiffel Tower" },
                        { label: "Location", key: "location", placeholder: "e.g. Champ de Mars, Paris" },
                        { label: "Notes", key: "description", placeholder: "Any details..." },
                    ].map(({ label, key, placeholder }) => (
                        <div key={key} className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">{label}</label>
                            <input
                                type="text"
                                value={form[key]}
                                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                placeholder={placeholder}
                                className="text-gray-900 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                            />
                        </div>
                    ))}
                </div>
                {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
                <div className="flex gap-2 mt-5">
                    <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleAdd} disabled={loading} className="flex-1 bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                        {loading ? "Adding..." : "Add item"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function TripDetail({ tripId, currentUser, onBack }) {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddItem, setShowAddItem] = useState(false);
    const [addCollabInput, setAddCollabInput] = useState("");
    const [collabMsg, setCollabMsg] = useState("");
    const [activeDay, setActiveDay] = useState(1);

    const fetchTrip = async () => {
        const res = await fetch(`${BASE}/trips/${tripId}`);
        const data = await res.json();
        setTrip(data);
        setLoading(false);
    };

    useEffect(() => { fetchTrip(); }, [tripId]);

    const handleAddCollaborator = async () => {
        if (!addCollabInput.trim()) return;
        const res = await fetch(`${BASE}/trips/${tripId}/collaborators`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: addCollabInput.trim() })
        });
        const data = await res.json();
        if (res.ok) { setCollabMsg("Collaborator added!"); setAddCollabInput(""); fetchTrip(); }
        else setCollabMsg(data.error || "Failed to add");
        setTimeout(() => setCollabMsg(""), 3000);
    };

    const handleRemoveCollab = async (username) => {
        await fetch(`${BASE}/trips/${tripId}/collaborators/${username}`, { method: "DELETE" });
        fetchTrip();
    };

    const handleDeleteItem = async (itemId) => {
        await fetch(`${BASE}/trips/${tripId}/itinerary/${itemId}`, { method: "DELETE" });
        fetchTrip();
    };

    if (loading) return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400">Loading...</p></div>;
    if (!trip) return null;

    const numDays = tripDays(trip.start_date, trip.end_date);
    const isOwner = trip.owner_username === currentUser.username;
    const itemsByDay = {};
    (trip.itinerary || []).forEach(item => {
        if (!itemsByDay[item.day_number]) itemsByDay[item.day_number] = [];
        itemsByDay[item.day_number].push(item);
    });

    return (
        <div>
            {showAddItem && (
                <AddItineraryModal
                    tripId={tripId}
                    maxDay={numDays}
                    currentUser={currentUser}
                    onClose={() => setShowAddItem(false)}
                    onAdded={fetchTrip}
                />
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 transition-colors">
                        ← Back to trips
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">{trip.name}</h1>
                    {trip.destination && <p className="text-sm text-gray-500 mt-0.5">📍 {trip.destination}</p>}
                    {trip.start_date && (
                        <p className="text-xs text-gray-400 mt-1">
                            {formatDate(trip.start_date)} → {formatDate(trip.end_date)} · {numDays} day{numDays !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setShowAddItem(true)}
                    className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    + Add to itinerary
                </button>
            </div>

            {trip.description && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600">{trip.description}</p>
                </div>
            )}

            <div className="grid grid-cols-3 gap-4">
                {/* Itinerary */}
                <div className="col-span-2">
                    <div className="bg-white border border-gray-100 rounded-xl p-5">
                        <h2 className="text-sm font-medium text-gray-900 mb-4">Itinerary</h2>

                        {/* Day tabs */}
                        {numDays > 1 && (
                            <div className="flex gap-1 mb-4 flex-wrap">
                                {Array.from({ length: numDays }, (_, i) => i + 1).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setActiveDay(d)}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                            activeDay === d ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}
                                    >
                                        Day {d}
                                    </button>
                                ))}
                            </div>
                        )}

                        {(itemsByDay[activeDay] || []).length === 0 ? (
                            <div className="flex flex-col items-center py-10 text-center">
                                <p className="text-sm text-gray-400 mb-3">Nothing planned for Day {activeDay} yet</p>
                                <button
                                    onClick={() => setShowAddItem(true)}
                                    className="text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    + Add activity
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {(itemsByDay[activeDay] || []).map(item => (
                                    <div key={item.id} className="flex items-start justify-between group border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 transition-colors">
                                        <div className="flex gap-3">
                                            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full h-fit mt-0.5 whitespace-nowrap">
                                                {item.time_of_day}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                                                {item.location && <p className="text-xs text-gray-400 mt-0.5">📍 {item.location}</p>}
                                                {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs ml-3 mt-0.5"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Collaborators */}
                <div className="space-y-4">
                    <div className="bg-white border border-gray-100 rounded-xl p-5">
                        <h2 className="text-sm font-medium text-gray-900 mb-4">Travelers</h2>
                        <div className="space-y-2 mb-4">
                            {(trip.collaborators || []).map(c => (
                                <div key={c.username} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
                                            {c.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-700">{c.username}</p>
                                            <p className="text-xs text-gray-400">{c.role}</p>
                                        </div>
                                    </div>
                                    {isOwner && c.role !== "owner" && (
                                        <button
                                            onClick={() => handleRemoveCollab(c.username)}
                                            className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {isOwner && (
                            <div>
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        value={addCollabInput}
                                        onChange={e => setAddCollabInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleAddCollaborator()}
                                        placeholder="Add by username"
                                        className="flex-1 text-gray-900 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                                    />
                                    <button
                                        onClick={handleAddCollaborator}
                                        className="bg-emerald-600 text-white text-xs px-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                {collabMsg && <p className="text-xs text-gray-500 mt-1">{collabMsg}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Trips page ───────────────────────────────────────────

function Trips({ currentUser }) {
    const [trips, setTrips] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTrips = async () => {
        const res = await fetch(`${BASE}/trips/user/${currentUser.username}`);
        const data = await res.json();
        setTrips(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchTrips(); }, []);

    const handleTripCreated = (newId) => {
        fetchTrips();
        setSelectedTripId(newId);
    };

    if (selectedTripId) {
        return (
            <TripDetail
                tripId={selectedTripId}
                currentUser={currentUser}
                onBack={() => { setSelectedTripId(null); fetchTrips(); }}
            />
        );
    }

    return (
        <div>
            {showCreate && (
                <CreateTripModal
                    currentUser={currentUser}
                    onClose={() => setShowCreate(false)}
                    onCreated={handleTripCreated}
                />
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">My Trips</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    + Plan a trip
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40"><p className="text-sm text-gray-400">Loading...</p></div>
            ) : trips.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
                    <p className="text-sm font-medium text-gray-700 mb-1">No trips yet</p>
                    <p className="text-xs text-gray-400 mb-5 max-w-xs mx-auto">Create your first trip and start building your itinerary</p>
                    <button onClick={() => setShowCreate(true)} className="bg-emerald-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                        + Plan a trip
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {trips.map(trip => (
                        <div
                            key={trip.id}
                            onClick={() => setSelectedTripId(trip.id)}
                            className="bg-white border border-gray-100 rounded-xl p-5 cursor-pointer hover:border-emerald-200 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-900">{trip.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${trip.role === "owner" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                                    {trip.role}
                                </span>
                            </div>
                            {trip.destination && <p className="text-xs text-gray-500 mb-1">📍 {trip.destination}</p>}
                            {trip.start_date && (
                                <p className="text-xs text-gray-400">
                                    {formatDate(trip.start_date)} → {formatDate(trip.end_date)}
                                </p>
                            )}
                            {trip.description && (
                                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{trip.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Trips;