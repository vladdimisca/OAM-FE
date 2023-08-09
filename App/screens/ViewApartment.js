/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { CommonActions } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";
import { GeneralButton } from "../components/GeneralButton";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { ApartmentService } from "../services/ApartmentService";
import { UserService } from "../services/UserService";

const styles = StyleSheet.create({
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export default ({ route, navigation }) => {
  const [currentApartment, setCurrentApartment] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { userId } = await UserStorage.retrieveUserIdAndToken();
      await UserService.getUserById(userId).then(setCurrentUser);
      ApartmentService.getApartmentById(route.params.apartment.id)
        .then(setCurrentApartment)
        .finally(() => setIsLoading(false));
    })();
  }, [route]);

  return (
    <View>
      <Spinner
        overlayColor={colors.white}
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView>
        <ScrollView>
          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Number:</Text>}
            text={currentApartment.number}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={styles.addressText}>Number of persons:</Text>
            }
            text={currentApartment.numberOfPersons}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>
                Surface:
              </Text>
            }
            text={`${currentApartment.surface} ㎡`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Code:</Text>}
            text={
              <View style={{ ...styles.detailText, flexDirection: "row" }}>
                <Text style={{ fontSize: 18 }}>
                  {showCode
                    ? currentApartment?.code
                    : currentApartment?.code?.replace(/./g, "*")}
                </Text>
                {(currentApartment.admins
                  ?.map((user) => user.id)
                  .includes(currentUser?.id) ||
                  currentApartment.members
                    ?.map((user) => user.id)
                    .includes(currentUser?.id)) && (
                  <TouchableOpacity
                    style={{ marginLeft: 4, marginTop: showCode ? 2 : 0 }}
                    onPress={() => setShowCode(!showCode)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showCode ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color={colors.lightText}
                    />
                  </TouchableOpacity>
                )}
              </View>
            }
          />

          {currentApartment.admins
            ?.map((admin) => admin.id)
            .includes(currentUser?.id) && (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: 5,
                backgroundColor: colors.white,
                zIndex: 2,
              }}
            >
              <View style={{ flex: 1, marginRight: -12 }}>
                <GeneralButton
                  text="Update"
                  onPress={() => {
                    navigation.push("UpdateApartment", {
                      apartment: currentApartment,
                    });
                  }}
                />
              </View>

              <View style={{ flex: 1, marginLeft: -12 }}>
                <GeneralButton
                  text="Delete"
                  backgroundColor={colors.red}
                  onPress={() => {
                    Alert.alert(
                      "Do you really want to remove this apartment?",
                      "This action is not reversible!",
                      [
                        {
                          text: "Delete",
                          onPress: async () => {
                            setIsLoading(true);
                            ApartmentService.deleteApartmentById(
                              currentApartment.id
                            )
                              .then((apartment) => {
                                navigation.dispatch((state) => {
                                  const newRoutes = [...state.routes];
                                  if (
                                    newRoutes[newRoutes.length - 1].name ===
                                    "ViewApartment"
                                  ) {
                                    newRoutes.splice(newRoutes.length - 1, 1);
                                  }
                                  if (
                                    newRoutes[newRoutes.length - 1].name ===
                                    "Apartments"
                                  ) {
                                    newRoutes.splice(newRoutes.length - 1, 1);
                                  }
                                  newRoutes.push({
                                    name: "Apartments",
                                    params: {
                                      association: apartment.association,
                                    },
                                  });

                                  return CommonActions.reset({
                                    ...state,
                                    routes: newRoutes,
                                    index: newRoutes.length - 1,
                                  });
                                });
                              })
                              .catch((err) => {
                                let alertMessage =
                                  "Oops, something went wrong!";
                                if (err?.response?.request?._response) {
                                  alertMessage = `${
                                    JSON.parse(err.response.request._response)
                                      .errorMessages[0].errorMessage
                                  }`;
                                }
                                Alert.alert(
                                  "Could not delete this apartment!",
                                  alertMessage,
                                  [
                                    {
                                      text: "Ok",
                                      style: "cancel",
                                    },
                                  ]
                                );
                              })
                              .finally(() => setIsLoading(false));
                          },
                        },
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                      ]
                    );
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
