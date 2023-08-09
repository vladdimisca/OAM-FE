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
  Alert,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
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
import { IndexService } from "../services/IndexService";
import { UserService } from "../services/UserService";

const types = [
  {
    value: "NATURAL_GASES",
    label: "Natural gases",
  },
  {
    value: "ELECTRICITY",
    label: "Electricity",
  },
  {
    value: "COLD_WATER",
    label: "Cold water",
  },
  {
    value: "HOT_WATER",
    label: "Hot water",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

const styles = StyleSheet.create({
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export default ({ route, navigation }) => {
  const [currentIndex, setCurrentIndex] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", { month: "short" });
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { userId } = await UserStorage.retrieveUserIdAndToken();
      await UserService.getUserById(userId).then(setCurrentUser);
      IndexService.getIndexById(route.params.index.id)
        .then(setCurrentIndex)
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
            leftIcon={<Text style={styles.addressText}>Old index:</Text>}
            text={currentIndex.oldIndex}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>New index:</Text>}
            text={currentIndex.newIndex}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>Type:</Text>
            }
            text={`${
              types.filter((t) => t.value === currentIndex?.type)[0]?.label
            }`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Date:</Text>}
            text={`${getMonthName(currentIndex.month)} ${currentIndex.year}`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Apartment number:</Text>}
            text={currentIndex.apartment?.number}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>
                Association:
              </Text>
            }
            text={`Str. ${currentIndex.apartment?.association?.street}, no. ${currentIndex.apartment?.association?.number}, bl. ${currentIndex.apartment?.association?.block}, ${currentIndex.apartment?.association?.locality}, ${currentIndex.apartment?.association?.country}`}
          />

          {currentIndex?.apartment?.association?.admins
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
              <View style={{ flex: 1, marginHorizontal: 80 }}>
                <GeneralButton
                  text="Delete"
                  backgroundColor={colors.red}
                  onPress={() => {
                    Alert.alert(
                      "Do you really want to remove this index?",
                      "This action is not reversible!",
                      [
                        {
                          text: "Delete",
                          onPress: async () => {
                            setIsLoading(true);
                            IndexService.deleteIndexById(currentIndex.id)
                              .then(() => {
                                navigation.dispatch(
                                  CommonActions.reset({
                                    index: 0,
                                    key: null,
                                    routes: [
                                      {
                                        name: "App",
                                        state: {
                                          routes: [
                                            {
                                              name: "Indexes",
                                            },
                                          ],
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
                                  "Could not delete this index!",
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
