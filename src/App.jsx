import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Friends from "./Pages/Friends";
import Trips from "./Pages/Trips";

function App(){

  return(
    <BrowserRouter>
        <Routes>
          <Route path = "/login" element = {<Login/>} />
          <Route path = "/" element = {<Signup/>} />
          <Route path = "/dashboard" element = {<Dashboard/>}/>
          <Route path = "/friends" element = {<Friends/>}/>
          <Route path = "/trips" element = {<Trips/>}/>


        </Routes>
      </BrowserRouter>
  );

}

export default App
