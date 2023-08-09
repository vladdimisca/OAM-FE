import React from "react";
import { MenuProvider } from "react-native-popup-menu";
import "intl";
import "intl/locale-data/jsonp/en";

// navigation
import Navigation from "./config/Navigation";

export default function App() {
  return (
    <MenuProvider>
      <Navigation />
    </MenuProvider>
  );
}
