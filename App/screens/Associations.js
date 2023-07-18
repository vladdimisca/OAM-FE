import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Feather } from "react-native-vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

// constants
import colors from "../constants/colors";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { AssociationService } from "../services/AssociationService";
import { UserService } from "../services/UserService";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { AssociationCard } from "../components/AssociationCard";
import { GeneralButton } from "../components/GeneralButton";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  emptyListText: {
    fontSize: 18,
    alignSelf: "center",
    marginTop: 25,
  },
  menuOption: {
    alignSelf: "center",
    fontSize: 14,
    padding: 5,
  },
});

export default ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [associations, setAssociations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const getAssociations = useCallback(async (overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }
    const { userId } = await UserStorage.retrieveUserIdAndToken();
    await UserService.getUserById(userId).then((user) => setCurrentUser(user));

    await AssociationService.getAssociations()
      .then(setAssociations)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger>
            <Feather
              name="plus-circle"
              size={24}
              color={colors.midBlue}
              style={{ marginRight: 20 }}
            />
          </MenuTrigger>
          <MenuOptions>
            <TouchableOpacity activeOpacity={0.7}>
              <MenuOption onSelect={() => navigation.push("ProvideLocation")}>
                <Text
                  style={{
                    ...styles.menuOption,
                    color: colors.lightBlue,
                  }}
                >
                  Create a new association
                </Text>
              </MenuOption>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <MenuOption>
                <Text
                  style={{
                    ...styles.menuOption,
                    color: "#32a883",
                  }}
                >
                  Join using code
                </Text>
              </MenuOption>
            </TouchableOpacity>
          </MenuOptions>
        </Menu>
      ),
    });

    getAssociations();
  }, [navigation, getAssociations]);

  return (
    <View style={styles.container}>
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

      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 5,
            position: "absolute",
            backgroundColor: colors.white,
            borderBottomColor: colors.darkBorder,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.darkBorder,
            borderTopWidth: StyleSheet.hairlineWidth,
            zIndex: 2,
          }}
        >
          <View style={{ flex: 1, marginRight: -12 }}>
            <GeneralButton text="As admin" />
          </View>

          <View style={{ flex: 1, marginLeft: -12 }}>
            <GeneralButton text="As member" />
          </View>
        </View>

        <ScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                getAssociations().finally(() => setIsRefreshing(false));
              }}
            />
          }
          style={{ marginTop: 75 }}
        >
          {associations.map((association) => {
            return (
              <AssociationCard
                key={association.id}
                association={association}
                currentUser={currentUser}
                onImagePress={() =>
                  navigation.push("Profile", { userId: association.user.id })
                }
                onAssociationPress={() => {
                  navigation.push("ViewAssociation", { association });
                }}
                onSelect={() => {
                  Alert.alert(
                    "Do you really want to remove this association?",
                    "This action is not reversible!",
                    [
                      {
                        text: "Delete",
                        onPress: async () => {
                          //   setIsLoading(true);
                          //   RouteService.deleteRouteById(route.id)
                          //     .then(() => {
                          //       setRoutes(routes.filter((r) => r !== route));
                          //     })
                          //     .catch((err) => {
                          //       let alertMessage = "Oops, something went wrong!";
                          //       if (err?.response?.request?._response) {
                          //         alertMessage = `${
                          //           JSON.parse(err.response.request._response)
                          //             .errorMessage
                          //         }`;
                          //       }
                          //       Alert.alert(
                          //         "Could not delete this route!",
                          //         alertMessage,
                          //         [
                          //           {
                          //             text: "Ok",
                          //             style: "cancel",
                          //           },
                          //         ]
                          //       );
                          //     })
                          //     .finally(() => setIsLoading(false));
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

          {associations.length === 0 && (
            <Text style={styles.emptyListText}>
              You are not part of any association yet!
            </Text>
          )}

          <View style={{ paddingBottom: 15 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
