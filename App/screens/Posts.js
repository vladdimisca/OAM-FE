import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
  LogBox,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Feather } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { PostService } from "../services/PostService";
import { UserService } from "../services/UserService";
import { AssociationService } from "../services/AssociationService";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { PostCard } from "../components/PostCard";
import { CustomDropdown } from "../components/CustomDropdown";

// ignored warnings
LogBox.ignoreLogs(["new NativeEventEmitter"]);

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
  dropdown: {
    marginHorizontal: 25,
    marginBottom: 20,
    marginTop: 15,
  },
});

export default ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [associations, setAssociations] = useState([]);
  const [selectedAssociation, setSelectedAssociation] = useState(null);

  const getPayments = useCallback(async (overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }
    const { userId } = await UserStorage.retrieveUserIdAndToken();
    await UserService.getUserById(userId).then((user) => setCurrentUser(user));

    await AssociationService.getAssociations().then((fetchedAssociations) =>
      setAssociations(
        fetchedAssociations.map((a) => {
          return {
            label: `Str. ${a.street}, no. ${a.number}, bl. ${a.block}, ${a.locality}, ${a.country}`,
            value: a.id,
          };
        })
      )
    );

    await PostService.getPosts()
      .then(setPosts)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.push("CreatePost");
          }}
        >
          <Feather
            name="plus-circle"
            size={24}
            color={colors.midBlue}
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
    });

    getPayments();
  }, [navigation, getPayments]);

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
        <ScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                getPayments().finally(() => setIsRefreshing(false));
              }}
            />
          }
        >
          <View style={styles.dropdown}>
            <CustomDropdown
              defaultButtonText={
                selectedAssociation !== null
                  ? associations.filter(
                      (a) => a.value === selectedAssociation
                    )[0]?.label
                  : "Select the association..."
              }
              data={associations}
              onSelect={(selectedItem) => {
                setSelectedAssociation(selectedItem.value);
              }}
              buttonTextAfterSelection={(selectedItem) => selectedItem.label}
              rowTextForSelection={(selectedItem) => selectedItem.label}
            />
          </View>

          {posts.map((post) => {
            return (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onPress={() => {
                  navigation.push("ViewPost", { post });
                }}
                onProfilePicturePress={() => {
                  navigation.push("Profile", {
                    userId: post.user?.id,
                  });
                }}
              />
            );
          })}

          {posts.length === 0 && (
            <Text style={styles.emptyListText}>
              There is no post to display!
            </Text>
          )}

          <View style={{ paddingBottom: 15 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
