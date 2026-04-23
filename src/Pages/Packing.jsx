import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
function Packing({tripId, currentUser}){

    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const BASE = "https://didactic-zebra-r4vvqrpw6vjxfpjrq-8000.app.github.dev";
    const [loading, setLoading] = useState(false);
    const [packingItems, setPackingItems] = useState(null);
    const [selectedPackingItemId, setSelectedPackingItemId] = useState(null);
    const [selectedPersonalPackingItemId, setSelectedPersonalPackingItemId] = useState(null);
    const [onlyCurrentUser, setOnlyCurrentUser] = useState(false);
    const [onlyPersonalPackingItems, setOnlyPersonalPackingItems] = useState(false);
    const [personalPackingItems, setPersonalPackingItems] = useState(null);
    const [checked, setCheckedItem] = useState(false);
    const [error, setError] = useState("");

    const fetchTrip = async()=>{
        const res = await fetch(`${BASE}/trips/${trip.id}`);
        const data = await res.json();
        setTrip(data);
        setLoading(false);
    };

    const fetchCurrentUser = () =>{
        const user = sessionStorage.getItem("currentUser");
        if (user) setCurrentUser(JSON.parse(user));
        else{
            navigate("/login");
        }
    };

    const fetchPackingItems = async()=>{
        const res = await fetch(`${BASE}/trips/packingItems/${trip.id}`);
        const data = await res.json();
        setPackingItems(data);
        setLoading(false);
    };

    const fetchPersonalPackingItems = async()=>{
        const res = await fetch(`${BASE}/trips/${tripId}/packingItems/${currentUser.username}`);
        const data = await res.json();
        setPersonalPackingItems(json.parse(data));
        setLoading(false);
    }
    
    const changeWhatToShow = () =>{
        setOnlyCurrentUser(!onlyCurrentUser);
    }

    const changeWhatToShowOther = () =>{
        setOnlyPersonalPackingItems(!onlyPersonalPackingItems);
    }

    const handleAddPackingItem = async()=>{
        const response = await fetch(`${BASE}/trips/addPackingItems/:tripId`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trip, packingItems, checked })
        });

        const data = await response.json();

        if(!response.ok){
            setError("Failed to add the packing item");
            throw new Error("Error to create packing item");  
        }
    };

    const handleAddPersonalPackingItem = async()=>{
        const response = await fetch(`${BASE}/trips/addPersonalPackingItem/:tripId/:username`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({personalPackingItems})
        });

        const data = await response.json();
        if(!response.ok){
            setError("Failed to add the personal packing item");
            throw new Error("Error to create the personal packing item");
        }
    };
    

    const handleDeletePackingItem = async() =>{
        const response = await fetch(`${BASE}/trips/deletePackingItem/:tripId`,{
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        });
        if(!response.ok){
            setError("Failed to delete the packing item");
            throw new Error("Error in deleteing the packing item");
        }
    };

    useEffect(()=>{
        fetchTrip(); 
        fetchCurrentUser(); 
        fetchPackingItems();
        fetchPersonalPackingItems();
    },[tripId]
    );

    return(
        <div>
            <h3>What to pack for {trip.name}!</h3>

            <div>{(!onlyCurrentUser&&
                <button onClick = {changeWhatToShow}>Show only my items</button>
            )}
            </div>

            <div>{(!onlyPersonalPackingItems&&
                <button onClick = {changeWhatToShowOther}>Show only personal items</button>
            )}
            </div>

            <div>{(onlyCurrentUser&&
                <button onClick = {changeWhatToShow}>Show All Items</button>
            )}
            </div>

            <div>{(onlyPersonalPackingItems&&
                <button onClick = {changeWhatToShowOther}>Show all items</button>
            )}
            </div>

            <button onClick = {handleAddPackingItem}>Add Item +</button>

            <div>
                {packingItems.map(packingItem =>{
                    <div key = {packingItem.id} onClick = {()=> setSelectedPackingItemId(packingItem.id)} className = "bg-white border border-gray-100 rounded-xl p-5 cursor-pointer hover:border-emerald-200 hover:shadow-sm transition-all">
                        {!onlyCurrentUser &&(
                        <div className = "flex items-start justify-between mb-2">
                            <h3>Item name: {packingItem.name}</h3>
                            <h3>Item owner: {packingItem.owner}</h3>
                            <button onClick = {handleDeletePackingItem}>Delete Item</button>
                        </div>
                        )}
                        {(onlyCurrentUser &&
                            <div>
                                <h3>My List:</h3>
                                <h2>Item name: {packingItem.name}</h2>
                            </div>
                        )}
                    </div>
                })}
            </div>
            <h3>My Personal Trip Items: </h3>
            <button onClick = {handleAddPersonalPackingItem}>Add Item +</button>

            <div> {personalPackingItems.map(personalPackingItem=>{
                <div key = {personalPackingItem.id} onClick = {()=> setSelectedPersonalPackingItemId(personalPackingItem.id)} className = "bg-white border border-gray-100 rounded-xl p-5 cursor-pointer hover:border-emerald-200 hover:shadow-sm transition-all">
                    <div className = "flex items-start justify-between mb-2">
                        <h3>Item name: {personalPackingItem.name}</h3>
                    </div>
                </div>
                })}
            </div>
            
        </div>
    );



}
export default Packing;