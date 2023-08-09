import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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

// services
import { AssociationService } from "../services/AssociationService";

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
  const [associationRole, setAssociationRole] = useState("ADMIN");

  const getAssociations = useCallback(async (role, overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }

    await AssociationService.getAssociations(role)
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
              <MenuOption onSelect={() => navigation.push("JoinAssociation")}>
                <Text
                  style={{
                    ...styles.menuOption,
                    color: colors.green,
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

    getAssociations("ADMIN");
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
            <GeneralButton
              text="As admin"
              isActive={associationRole === "ADMIN"}
              onPress={async () => {
                if (associationRole === "ADMIN") {
                  return;
                }

                setAssociationRole("ADMIN");
                getAssociations("ADMIN");
              }}
            />
          </View>

          <View style={{ flex: 1, marginLeft: -12 }}>
            <GeneralButton
              text="As member"
              isActive={associationRole === "MEMBER"}
              onPress={async () => {
                if (associationRole === "MEMBER") {
                  return;
                }

                setAssociationRole("MEMBER");
                getAssociations("MEMBER");
              }}
            />
          </View>
        </View>

        <ScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                getAssociations(associationRole).finally(() =>
                  setIsRefreshing(false)
                );
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
                onImagePress={() =>
                  navigation.push("ShowLocation", {
                    location: {
                      latitude: association.latitude,
                      longitude: association.longitude,
                    },
                  })
                }
                onAssociationPress={() => {
                  navigation.push("ViewAssociation", {
                    associationId: association.id,
                  });
                }}
                onApartmentsPress={() =>
                  navigation.push("Apartments", { association })
                }
                onMembersPress={() =>
                  navigation.push("AssociationMembers", { association })
                }
              />
            );
          })}

          {associations.length === 0 ? (
            <Text style={styles.emptyListText}>
              You are not part of any association yet!
            </Text>
          ) : (
            <View style={{ marginBottom: 15 }} />
          )}

          <View style={{ paddingBottom: 15 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
