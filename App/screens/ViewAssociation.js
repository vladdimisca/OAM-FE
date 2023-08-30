/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Avatar } from "react-native-elements";
import { CommonActions } from "@react-navigation/native";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";
import { GeneralButton } from "../components/GeneralButton";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { AssociationService } from "../services/AssociationService";
import { UserService } from "../services/UserService";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export default ({ route, navigation }) => {
  const [currentAssociation, setCurrentAssociation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { userId } = await UserStorage.retrieveUserIdAndToken();
      await UserService.getUserById(userId).then(setCurrentUser);

      AssociationService.getAssociationById(route.params.associationId)
        .then(setCurrentAssociation)
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
            leftIcon={
              <Avatar
                activeOpacity={0.7}
                size={screen.width * 0.09}
                rounded
                source={require("../assets/images/pin.png")}
              />
            }
            text="See on maps"
            onPress={() =>
              navigation.push("ShowLocation", {
                location: {
                  latitude: currentAssociation.latitude,
                  longitude: currentAssociation.longitude,
                },
              })
            }
            active
            customTextColor={colors.midBlue}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Country:</Text>}
            text={currentAssociation.country}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Locality:</Text>}
            text={currentAssociation.locality}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Adm. area:</Text>}
            text={currentAssociation.administrativeArea}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Zip code:</Text>}
            text={currentAssociation.zipCode}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Street:</Text>}
            text={currentAssociation.street}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Number:</Text>}
            text={currentAssociation.number}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Block:</Text>}
            text={currentAssociation.block}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Staircase:</Text>}
            text={currentAssociation.staircase}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Iban:</Text>}
            text={currentAssociation.iban}
          />

          <ItemSeparator />

          {currentAssociation.admins
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
                    navigation.push("UpdateAssociation", {
                      associationDetails: currentAssociation,
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
                      "Do you really want to remove this association?",
                      "This action is not reversible!",
                      [
                        {
                          text: "Delete",
                          onPress: async () => {
                            setIsLoading(true);
                            AssociationService.deleteAssociationById(
                              currentAssociation.id
                            )
                              .then(() => {
                                navigation.dispatch(
                                  CommonActions.reset({
                                    index: 0,
                                    key: null,
                                    routes: [
                                      {
                                        name: "App",
                                        state: {
                                          routes: [{ name: "Associations" }],
                                        },
                                      },
                                    ],
                                  })
                                );
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
                                  "Could not delete this association!",
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
