import React from "react";
import "./App.css";
import AutoComplete from "./components/AutoComplete";

export const  App = () => {
  return (
    <div className="parent-div">
      <div><h2>Deel Auto Complete App</h2></div>
      <div>
        <AutoComplete />
      </div>
    </div>
  );
}

