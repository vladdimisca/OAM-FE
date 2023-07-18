import React from "react";
import { MenuProvider } from "react-native-popup-menu";
import Navigation from "./config/Navigation";

export default function App() {
  return (
    <MenuProvider>
      <Navigation />
    </MenuProvider>
  );
}
