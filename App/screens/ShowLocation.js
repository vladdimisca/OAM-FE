import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, SafeAreaView } from "react-native";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: colors.lightWhite,
  },
  safeArea: {
    height: "100%",
  },
  map: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default ({ route }) => {
  // refs
  const mapRef = useRef(null);

  // states
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const fitToMarkers = () => {
    setTimeout(() => {
      mapRef.current?.fitToSuppliedMarkers(["location_marker"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }, 200);
  };

  useEffect(() => {
    (async () => {
      setLocation({
        latitude: route.params.location.latitude,
        longitude: route.params.location.longitude,
      });

      fitToMarkers();
    })();
  }, [route]);

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={styles.safeArea}>
        <MapView
          maxZoomLevel={19}
          onLayout={fitToMarkers}
          loadingEnabled
          provider={MapView.PROVIDER_GOOGLE}
          ref={mapRef}
          style={styles.map}
        >
          <Marker
            identifier="location_marker"
            coordinate={location}
            title="Association location"
            description="The location of the selected association"
          />
        </MapView>
      </SafeAreaView>
    </View>
  );
};
