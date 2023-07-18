import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome5, Feather } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// root navigation
import { navigationRef } from "../util/RootNavigation";

// screens
import Splash from "../screens/Splash";
import Register from "../screens/Register";
import Login from "../screens/Login";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import ChangePassword from "../screens/ChangePassword";
import DeleteAccount from "../screens/DeleteAccount";
import ForgotPassword from "../screens/ForgotPassword";
import Associations from "../screens/Associations";
import ProvideLocation from "../screens/ProvideLocation";
import CreateAssociation from "../screens/CreateAssociation";
import ViewAssociation from "../screens/ViewAssociation";
import Apartments from "../screens/Apartments";
import CreateApartment from "../screens/CreateApartment";

const emptyHeaderOptions = {
  title: null,
  headerStyle: {
    backgroundColor: colors.white,
    elevation: 0,
  },
};

const headerOptions = {
  headerStyle: { backgroundColor: colors.white },
  headerTitleAlign: "center",
};

const screenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.lightBlue,
  tabBarStyle: {
    backgroundColor: colors.offWhite,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
};

const AuthenticationStack = createStackNavigator();
const AuthenticationStackScreen = () => (
  <AuthenticationStack.Navigator initialRouteName="Splash">
    <AuthenticationStack.Screen
      name="Splash"
      component={Splash}
      options={{ headerShown: false }}
    />
    <AuthenticationStack.Screen
      name="Register"
      component={Register}
      options={emptyHeaderOptions}
    />
    <AuthenticationStack.Screen
      name="Login"
      component={Login}
      options={emptyHeaderOptions}
    />
    <ProfileStack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={emptyHeaderOptions}
    />
  </AuthenticationStack.Navigator>
);

const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator initialRouteName="Profile">
    <ProfileStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={Settings}
      options={headerOptions}
    />
    <ProfileStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={emptyHeaderOptions}
    />
    <ProfileStack.Screen
      name="DeleteAccount"
      component={DeleteAccount}
      options={emptyHeaderOptions}
    />
  </ProfileStack.Navigator>
);

const AssociationsStack = createStackNavigator();
const AssociationsStackScreen = () => (
  <AssociationsStack.Navigator initialRouteName="Associations">
    <AssociationsStack.Screen
      name="MyAssociations"
      component={Associations}
      options={{
        ...headerOptions,
        title: "Associations",
        headerRight: () => (
          <Feather
            name="plus-circle"
            size={24}
            color={colors.midBlue}
            style={{ marginRight: 20 }}
          />
        ),
      }}
    />
    <AssociationsStack.Screen
      name="ProvideLocation"
      component={ProvideLocation}
      options={{ ...headerOptions, title: "Provide the location" }}
    />
    <AssociationsStack.Screen
      name="CreateAssociation"
      component={CreateAssociation}
      options={{ ...headerOptions, title: "Create association" }}
    />
    <AssociationsStack.Screen
      name="ViewAssociation"
      component={ViewAssociation}
      options={{ ...headerOptions, title: "Association details" }}
    />
    <AssociationsStack.Screen
      name="Apartments"
      component={Apartments}
      options={{ ...headerOptions, title: "Apartments" }}
    />
    <AssociationsStack.Screen
      name="CreateApartment"
      component={CreateApartment}
      options={{ ...headerOptions, title: "Create apartment" }}
    />
  </AssociationsStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const TabsScreen = () => {
  return (
    <Tabs.Navigator screenOptions={screenOptions} initialRouteName="My Profile">
      <Tabs.Screen
        name="Associations"
        component={AssociationsStackScreen}
        options={{
          tabBarIcon: (props) => (
            <FontAwesome5
              name="house-user"
              size={props.size}
              color={props.color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="My Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: (props) => (
            <Ionicons name="md-person" size={props.size} color={props.color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

const MainStack = createStackNavigator();
const MainStackScreen = () => (
  <MainStack.Navigator initialRouteName="Authentication">
    <MainStack.Screen
      name="Authentication"
      component={AuthenticationStackScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="App"
      component={TabsScreen}
      options={{ headerShown: false }}
    />
  </MainStack.Navigator>
);

export default () => (
  <NavigationContainer ref={navigationRef}>
    <MainStackScreen />
  </NavigationContainer>
);
