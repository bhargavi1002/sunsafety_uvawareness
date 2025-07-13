import "./App.css";
import { useState } from "react";
import SunsafeMap from "./components/SunsafeMap";
import Tips from "./components/Tips";

function App() {
   const [uvIndex, setUvIndex] = useState(null);
  return (
    <div className="App">
      <main>
        <SunsafeMap setUvIndex={setUvIndex}  />
        <Tips uvIndex={uvIndex} />
      </main>
    </div>
  );
}

export default App;
