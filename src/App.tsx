import React from "react";
import "./App.css";
import AutoComplete from "./components/AutoComplete/AutoComplete";
import { Header } from "./components/Layout/Header";

export const  App = () => {
  return (
    <div className="parent-div">
      <Header/>
      <div>
        <AutoComplete />
      </div>
    </div>
  );
}

