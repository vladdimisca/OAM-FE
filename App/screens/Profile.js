import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Text,
  Linking,
  RefreshControl,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { DotIndicator } from "react-native-indicators";
import { Avatar } from "react-native-elements";
import { Fontisto, Feather } from "react-native-vector-icons";
import { CommonActions } from "@react-navigation/routers";

// constants
import colors from "../constants/colors";

// components
import { GeneralButton } from "../components/GeneralButton";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { UserService } from "../services/UserService";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  dotIndicatorContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.offWhite,
    flexDirection: "row",
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    elevation: 5,
    backgroundColor: colors.offWhite,
    marginRight: 28,
  },
  headerTextContainer: {
    maxWidth: screen.width * 0.4,
    marginTop: 15,
    flexDirection: "column",
  },
  headerText: {
    fontSize: 24,
    color: colors.text,
    fontWeight: "bold",
  },
  textItem: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
    color: colors.darkBorder,
  },
  actionText: {
    alignSelf: "center",
    fontSize: 18,
    color: colors.lightBlue,
    marginVertical: 15,
  },
});

export default ({ navigation, route }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // user management
  const [currentUser, setCurrentUser] = useState(null);
  const [displayedUser, setDisplayedUser] = useState(null);

  const fetchData = useCallback(async () => {
    const { userId } = await UserStorage.retrieveUserIdAndToken();

    const user = await UserService.getUserById(userId).catch(() => null);

    if (user !== null) {
      setCurrentUser(user);
      let userToDisplay = user;

      if (route.params && route.params.userId) {
        userToDisplay = await UserService.getUserById(route.params.userId);
      }

      setDisplayedUser(userToDisplay);
      setIsProfileLoading(false);
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          key: null,
          routes: [
            {
              name: "Authentication",
              state: {
                routes: [{ name: "Login" }],
              },
            },
          ],
        })
      );
    }
  }, [navigation, route]);

  useEffect(() => {
    fetchData();
  }, [navigation, route, fetchData]);

  return (
    <View style={{ flex: 1 }}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.offWhite}
      />

      {isProfileLoading ? (
        <View style={styles.dotIndicatorContainer}>
          <DotIndicator color={colors.midBlue} count={3} />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <ScrollView
            refreshControl={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  setIsRefreshing(true);
                  fetchData().finally(() => setIsRefreshing(false));
                }}
              />
            }
          >
            <View style={styles.header}>
              <Avatar
                size={screen.width * 0.3}
                rounded
                source={
                  displayedUser.profilePictureURL
                    ? {
                        uri: displayedUser.profilePictureURL,
                      }
                    : require("../assets/images/profile-placeholder.png")
                }
                containerStyle={styles.avatarContainer}
              />

              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>
                  {`${displayedUser.firstName} ${displayedUser.lastName}`}
                </Text>
              </View>
            </View>

            <ProfileItem
              leftIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <Feather
                  name="message-circle"
                  size={32}
                  color={colors.darkBorder}
                />
              }
              text={displayedUser.description}
            />

            <ItemSeparator />

            <ProfileItem
              active={displayedUser.id !== currentUser.id}
              onPress={() => {
                if (displayedUser.id === currentUser.id) {
                  return;
                }

                Linking.openURL(`mailto:${displayedUser.email}`);
              }}
              leftIcon={
                <Fontisto name="email" size={32} color={colors.darkBorder} />
              }
              text={displayedUser.email}
            />

            <ItemSeparator />

            <ProfileItem
              active={displayedUser.id !== currentUser.id}
              onPress={() => {
                if (displayedUser.id === currentUser.id) {
                  return;
                }

                Linking.openURL(
                  `tel:+${displayedUser.callingCode} ${displayedUser.phoneNumber}`
                );
              }}
              leftIcon={
                <Feather name="phone" size={32} color={colors.darkBorder} />
              }
              text={`+${displayedUser.callingCode} ${displayedUser.phoneNumber}`}
            />

            {currentUser.id === displayedUser.id && (
              <GeneralButton
                onPress={() => navigation.push("Settings")}
                text="Settings"
              />
            )}
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};
