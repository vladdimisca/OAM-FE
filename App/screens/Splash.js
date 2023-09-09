import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { Avatar } from "react-native-elements";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// storage
import { UserStorage } from "../util/UserStorage";

// service
import { UserService } from "../services/UserService";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ({ navigation }) => {
  useFocusEffect(() => {
    const fetchData = async () => {
      const { userId } = await UserStorage.retrieveUserIdAndToken();
      const user = await UserService.getUserById(userId).catch(() => null);
      if (user !== null) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: user.role === "ADMIN" ? "Admin" : "App",
                state: {
                  routes: [
                    {
                      name: "My Profile",
                      state: { routes: [{ name: "Profile" }] },
                    },
                  ],
                },
              },
            ],
          })
        );
        return;
      }
      // clear the storage
      await UserStorage.clearStorage();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    };

    fetchData();
  });

  return (
    <>
      <FocusAwareStatusBar
        barStyle="light-content"
        backgroundColor={colors.midBlue}
      />
      <LinearGradient
        style={styles.container}
        colors={[colors.midBlue, colors.darkBlue]}
      >
        <Avatar
          activeOpacity={0.7}
          size={screen.width * 0.65}
          source={require("../assets/images/splash.png")}
        />
      </LinearGradient>
    </>
  );
};
