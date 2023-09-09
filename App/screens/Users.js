import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { AntDesign } from "@expo/vector-icons";
import similarity from "similarity";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { CustomInput } from "../components/CustomInput";
import { AppUserCard } from "../components/AppUserCard";

// service
import { UserService } from "../services/UserService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);

  const fetchUsers = useCallback(async (overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }
    setSearchText("");
    setDisplayedUsers([]);
    UserService.getAllUsers()
      .then(setUsers)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <ScrollView
      refreshControl={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            setSearchText("");
            setDisplayedUsers([]);
            fetchUsers(false).finally(() => setIsRefreshing(false));
          }}
        />
      }
      style={{ flex: 1 }}
    >
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

      <SafeAreaView style={styles.container}>
        <CustomInput
          value={searchText}
          icon={<AntDesign name="search1" size={28} color={colors.text} />}
          placeholder="Search..."
          onTextChange={(value) => {
            setSearchText(value);
            setDisplayedUsers(
              users.filter((user) => {
                const fullName = `${user.firstName} ${user.lastName}`;

                if (value === "") {
                  return false;
                }

                if (
                  fullName
                    .toLocaleLowerCase()
                    .includes(value.toLocaleLowerCase())
                ) {
                  return true;
                }

                return similarity(fullName, value) > 0.3;
              })
            );
          }}
        />

        {displayedUsers.map((user) => {
          return (
            <AppUserCard
              key={user.id}
              user={user}
              onPress={() => navigation.push("Profile", { userId: user.id })}
              onBan={() => {
                Alert.alert(
                  "Do you really want to ban this user?",
                  "This action can be reverted later!",
                  [
                    {
                      text: "Ban",
                      onPress: async () => {
                        setIsLoading(true);
                        UserService.banUserById(user.id)
                          .then(fetchUsers)
                          .catch((err) => {
                            let alertMessage = "Oops, something went wrong!";
                            if (err?.response?.request?._response) {
                              alertMessage = `${
                                JSON.parse(err.response.request._response)
                                  .errorMessages[0].errorMessage
                              }`;
                            }
                            Alert.alert(
                              "Could not ban this user!",
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
              onRemoveBan={() => {
                Alert.alert(
                  "Do you really want to remove the ban for user?",
                  "This action can be reverted later!",
                  [
                    {
                      text: "Remove ban",
                      onPress: async () => {
                        setIsLoading(true);
                        UserService.removeBanById(user.id)
                          .then(fetchUsers)
                          .catch((err) => {
                            let alertMessage = "Oops, something went wrong!";
                            if (err?.response?.request?._response) {
                              alertMessage = `${
                                JSON.parse(err.response.request._response)
                                  .errorMessages[0].errorMessage
                              }`;
                            }
                            Alert.alert(
                              "Could not remove the ban for this user!",
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
          );
        })}
      </SafeAreaView>
    </ScrollView>
  );
};
