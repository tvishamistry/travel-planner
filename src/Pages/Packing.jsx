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
    const [personalPackingItems, setPersonalPackingItems] = useState(null);

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

            <div>{(!setOnlyCurrentUser&&
                <button onClick = {changeWhatToShow}>Show only my Items</button>
            )}
            </div>

            <div>{(setOnlyCurrentUser&&
                <button onClick = {changeWhatToShow}>Show All Items</button>
            )}
            </div>

            <button>Add Item +</button>

            <div>
                {packingItems.map(packingItem =>{
                    <div key = {packingItem.id} onClick = {()=> setSelectedPackingItemId(packingItem.id)} className = "bg-white border border-gray-100 rounded-xl p-5 cursor-pointer hover:border-emerald-200 hover:shadow-sm transition-all">
                        {!onlyCurrentUser &&(
                        <div className = "flex items-start justify-between mb-2">
                            <h3>Item name: {packingItem.name}</h3>
                            <h3>Item owner: {packingItem.owner}</h3>
                            <button onClick = {handleDeleteItem}>Delete Item</button>
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