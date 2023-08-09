import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  FontAwesome5,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "react-native-vector-icons";

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
import ShowLocation from "../screens/ShowLocation";
import CreateAssociation from "../screens/CreateAssociation";
import UpdateAssociation from "../screens/UpdateAssociation";
import ViewAssociation from "../screens/ViewAssociation";
import JoinAssociation from "../screens/JoinAssociation";
import Apartments from "../screens/Apartments";
import CreateApartment from "../screens/CreateApartment";
import UpdateApartment from "../screens/UpdateApartment";
import Invoices from "../screens/Invoices";
import CreateInvoice from "../screens/CreateInvoice";
import ViewInvoice from "../screens/ViewInvoice";
import Indexes from "../screens/Indexes";
import CreateIndex from "../screens/CreateIndex";
import Payments from "../screens/Payments";
import CreatePayment from "../screens/CreatePayment";
import ViewApartment from "../screens/ViewApartment";
import ViewIndex from "../screens/ViewIndex";
import AssociationMembers from "../screens/AssociationMembers";
import ViewInvoiceDistribution from "../screens/ViewInvoiceDistribution";
import ViewPayment from "../screens/ViewPayment";
import Posts from "../screens/Posts";
import ViewPost from "../screens/ViewPost";

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
    <AuthenticationStack.Screen
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
      name="ShowLocation"
      component={ShowLocation}
      options={{ ...headerOptions, title: "Association location" }}
    />
    <AssociationsStack.Screen
      name="CreateAssociation"
      component={CreateAssociation}
      options={{ ...headerOptions, title: "Create association" }}
    />
    <AssociationsStack.Screen
      name="UpdateAssociation"
      component={UpdateAssociation}
      options={{ ...headerOptions, title: "Update association" }}
    />
    <AssociationsStack.Screen
      name="ViewAssociation"
      component={ViewAssociation}
      options={{ ...headerOptions, title: "Association details" }}
    />
    <AssociationsStack.Screen
      name="JoinAssociation"
      component={JoinAssociation}
      options={{ ...headerOptions, title: "Join association" }}
    />
    <AssociationsStack.Screen
      name="Apartments"
      component={Apartments}
      options={{ ...headerOptions, title: "Apartments" }}
    />
    <AssociationsStack.Screen
      name="ViewApartment"
      component={ViewApartment}
      options={{ ...headerOptions, title: "Apartment details" }}
    />
    <AssociationsStack.Screen
      name="CreateApartment"
      component={CreateApartment}
      options={{ ...headerOptions, title: "Create apartment" }}
    />
    <AssociationsStack.Screen
      name="UpdateApartment"
      component={UpdateApartment}
      options={{ ...headerOptions, title: "Update apartment" }}
    />
    <AssociationsStack.Screen
      name="AssociationMembers"
      component={AssociationMembers}
      options={{ ...headerOptions, title: "Association members" }}
    />
    <AssociationsStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <AssociationsStack.Screen
      name="Settings"
      component={Settings}
      options={headerOptions}
    />
    <AssociationsStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={emptyHeaderOptions}
    />
    <AssociationsStack.Screen
      name="DeleteAccount"
      component={DeleteAccount}
      options={emptyHeaderOptions}
    />
  </AssociationsStack.Navigator>
);

const InvoicesStack = createStackNavigator();
const InvoicesStackScreen = () => (
  <InvoicesStack.Navigator initialRouteName="MyInvoices">
    <InvoicesStack.Screen
      name="MyInvoices"
      component={Invoices}
      options={{ ...headerOptions, title: "Invoices" }}
    />
    <InvoicesStack.Screen
      name="CreateInvoice"
      component={CreateInvoice}
      options={{ ...headerOptions, title: "Add invoice" }}
    />
    <InvoicesStack.Screen
      name="ViewInvoice"
      component={ViewInvoice}
      options={{ ...headerOptions, title: "Invoice details" }}
    />
  </InvoicesStack.Navigator>
);

const IndexesStack = createStackNavigator();
const IndexesStackScreen = () => (
  <IndexesStack.Navigator initialRouteName="MyIndexes">
    <IndexesStack.Screen
      name="MyIndexes"
      component={Indexes}
      options={{ ...headerOptions, title: "Indexes" }}
    />
    <IndexesStack.Screen
      name="CreateIndex"
      component={CreateIndex}
      options={{ ...headerOptions, title: "Add index" }}
    />
    <IndexesStack.Screen
      name="ViewIndex"
      component={ViewIndex}
      options={{ ...headerOptions, title: "Index details" }}
    />
  </IndexesStack.Navigator>
);

const PaymentsStack = createStackNavigator();
const PaymentsStackScreen = () => (
  <PaymentsStack.Navigator initialRouteName="MyPayments">
    <PaymentsStack.Screen
      name="MyPayments"
      component={Payments}
      options={{ ...headerOptions, title: "Payments" }}
    />
    <PaymentsStack.Screen
      name="CreatePayment"
      component={CreatePayment}
      options={{ ...headerOptions, title: "Make a new payment" }}
    />
    <PaymentsStack.Screen
      name="ViewPayment"
      component={ViewPayment}
      options={{ ...headerOptions, title: "Payment details" }}
    />
    <PaymentsStack.Screen
      name="ViewInvoiceDistribution"
      component={ViewInvoiceDistribution}
      options={{ ...headerOptions, title: "Invoice distribution details" }}
    />
    <PaymentsStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <PaymentsStack.Screen
      name="Settings"
      component={Settings}
      options={headerOptions}
    />
    <PaymentsStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={emptyHeaderOptions}
    />
    <PaymentsStack.Screen
      name="DeleteAccount"
      component={DeleteAccount}
      options={emptyHeaderOptions}
    />
  </PaymentsStack.Navigator>
);

const PostsStack = createStackNavigator();
const PostsStackScreen = () => (
  <PostsStack.Navigator initialRouteName="MyPosts">
    <PostsStack.Screen
      name="MyPosts"
      component={Posts}
      options={{ ...headerOptions, title: "Posts" }}
    />
    <PostsStack.Screen
      name="ViewPost"
      component={ViewPost}
      options={{
        ...headerOptions,
        title: "Post details",
        headerStyle: { backgroundColor: colors.offWhite },
      }}
    />
  </PostsStack.Navigator>
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
        name="Indexes"
        component={IndexesStackScreen}
        options={{
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              name="counter"
              size={props.size}
              color={props.color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Invoices"
        component={InvoicesStackScreen}
        options={{
          tabBarIcon: (props) => (
            <FontAwesome5
              name="file-invoice"
              size={props.size}
              color={props.color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Payments"
        component={PaymentsStackScreen}
        options={{
          tabBarIcon: (props) => (
            <MaterialIcons
              name="payment"
              size={props.size}
              color={props.color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Posts"
        component={PostsStackScreen}
        options={{
          tabBarIcon: (props) => (
            <MaterialIcons
              name="local-post-office"
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
