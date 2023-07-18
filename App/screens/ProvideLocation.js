import React, { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, SafeAreaView } from "react-native";
import * as Location from "expo-location";

// google autocomplete
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// geocoder
import Geocoder from "react-native-geocoding";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { NextButton } from "../components/NextButton";

// config
import config from "../../config";

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
    top: 85,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    zIndex: 3,
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
  },
  textInput: {
    padding: 15,
    height: 50,
    borderRadius: 15,
    fontSize: 18,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  nextButton: {
    bottom: 5,
    position: "absolute",
    zIndex: 2,
  },
});

export default ({ navigation }) => {
  // initialize the geocoder
  Geocoder.init(config.GOOGLE_API_KEY, { language: "en" });
  navigator.geolocation = require("react-native-geolocation-service");

  // refs
  const mapRef = useRef(null);
  const locationRef = useRef(null);

  // states
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [associationDetails, setAssociationDetails] = useState({
    country: "",
    locality: "",
    administrativeArea: "",
    zipCode: "",
    street: "",
    number: "",
    latitude: 0.0,
    longitude: 0.0,
  });

  const fitToMarkers = () => {
    setTimeout(() => {
      mapRef.current?.fitToSuppliedMarkers(["location_marker"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }, 200);
  };

  const getComponentValueByName = (components, componentName) => {
    const filteredComponents = components.filter((component) =>
      component.types.includes(componentName)
    );
    if (filteredComponents.length > 0) {
      return filteredComponents[0].long_name;
    }
    return "";
  };

  const extractAddressDetails = useCallback((components) => {
    const country = getComponentValueByName(components, "country");
    const locality = getComponentValueByName(components, "locality");
    let administrativeArea = getComponentValueByName(
      components,
      "sublocality_level_1"
    );
    if (administrativeArea === "") {
      administrativeArea = getComponentValueByName(
        components,
        "administrative_area_level_1"
      );
    }
    const zipCode = getComponentValueByName(components, "postal_code");
    const street = getComponentValueByName(components, "route");
    const number = getComponentValueByName(components, "street_number");

    setAssociationDetails((details) => {
      return {
        ...details,
        country,
        locality,
        administrativeArea,
        zipCode,
        street,
        number,
      };
    });
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const userLocation = await Location.getLastKnownPositionAsync();
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });

      Geocoder.from({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      }).then((json) => {
        locationRef.current?.setAddressText(json.results[0].formatted_address);
        extractAddressDetails(json.results[0].address_components);
      });

      fitToMarkers();
    })();
  }, [extractAddressDetails]);

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={styles.safeArea}>
        <GooglePlacesAutocomplete
          enablePoweredByContainer={false}
          ref={locationRef}
          fetchDetails
          onPress={async (_, details = null) => {
            setLocation({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });

            Geocoder.from({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            }).then((json) => {
              extractAddressDetails(json.results[0].address_components);
            });
          }}
          query={{
            key: config.GOOGLE_API_KEY,
            language: "en",
          }}
          styles={{
            container: styles.inputContainer,
            textInput: styles.textInput,
          }}
        />

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
            draggable
            coordinate={location}
            title="Start"
            description="Starting point"
            onDragEnd={async (event) => {
              const latitude = event.nativeEvent.coordinate.latitude;
              const longitude = event.nativeEvent.coordinate.longitude;

              setLocation({ latitude, longitude });

              Geocoder.from({ latitude, longitude }).then((json) => {
                locationRef.current?.setAddressText(
                  json.results[0].formatted_address
                );
                extractAddressDetails(json.results[0].address_components);

                fitToMarkers();
              });
            }}
          />
        </MapView>

        <NextButton
          active={location != null}
          onPress={() => {
            if (!location) {
              return;
            }
            setAssociationDetails((details) => {
              return {
                ...details,
                latitude: location.latitude,
                longitude: location.longitude,
              };
            });
            console.log(associationDetails);
            navigation.push("CreateAssociation", {
              associationDetails,
            });
          }}
          customStyle={styles.nextButton}
        />
      </SafeAreaView>
    </View>
  );
};
