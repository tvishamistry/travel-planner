import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
function Packing({tripId, currentUser}){

    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const BASE = "https://didactic-zebra-r4vvqrpw6vjxfpjrq-8000.app.github.dev";
    const [loading, setLoading] = useState(false);
    const [packingItems, setPackingItems] = useState(null);

    const fetchTrip = async()=>{
        const res = await fetch(`${BASE}/trips/${tripId}`);
        const data = await res.json();
        setTrip(data);
        setLoading(false);
    };

    useEffect(()=>{fetchTrip();},[tripId])

    return(
        <div>
            <h3>What to pack for {trip.name}!</h3>
        </div>
    );



}
export default Packing;