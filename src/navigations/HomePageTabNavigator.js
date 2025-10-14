import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform, View } from "react-native";
import { useLocalization } from "../localization";


import SearchScreen from "../screens/search/SearchScreen";
import FavoriteScreen from "../screens/profile/FavoriteScreen";
import HomeScreen from "../screens/home/HomeScreen";
import MenuScreen from "../screens/menu/MenuScreen";
import PrivacyPolicyScreen from "../screens/menu/PrivacyPolicyScreen";
import AboutUsScreen from "../screens/menu/AboutUsScreen";
import ListingDetailScreen from "../screens/listings/ListingDetailScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { Theme } from "../theme";
import { stackScreenOptions } from "./NavigationHelper";
import NavigationNames from "./NavigationNames";
import ProfileEditScreen from "../screens/profile/ProfileEditScreen";
import AgentScreen from "../screens/profile/AgentScreen";
import ChatUserListScreen from "../screens/chats/ChatUserListScreen";
import ChatDetailScreen from "../screens/chats/ChatDetailScreen";
import ChatClientDetailScreen from "../screens/chats/ChatClientDetailScreen";
import ClientScreen from "../screens/profile/ClientScreen";
import { SocketConext } from "../context/SocketContext";
import { AuthenticationContext } from "../context/AuthenticationContext";
import ChatTempScreen from "../screens/chats/ChatTempScreen";
import NotificationScreen from "../screens/profile/NotificationScreen";
import AppointmentScreen from "../screens/profile/AppointmentScreen";
import UserDetailScreen from "../screens/profile/UserDetailScreen";
import UnreadCount from "../screens/chats/components/UnreadCount";
import { SearchMapScreen } from "../screens/maps/SearchMapScreen";
import { NewsListScreen } from "../screens/news/NewsListScreen";
import { NewsDetailScreen } from "../screens/news/NewsDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabStack = () => {
  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.HomeScreen}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationNames.HomeTab_ListingDetailScreen}
        component={ListingDetailScreen}
      />
    </Stack.Navigator>
  );
};

const SearchTabStack = () => {
  const { getString } = useLocalization();

  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.SearchScreen}
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationNames.SearchTab_ListingDetailScreen}
        component={ListingDetailScreen}
      />
      <Stack.Screen
        name={NavigationNames.SearchMapScreen}
        component={SearchMapScreen}
        options={{ title: getString("Map View") }}
      />
    </Stack.Navigator>
  );
};

const ProfileTabStack = () => {
  const { getString } = useLocalization();
  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.ProfileScreen}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationNames.ProfileTab_FavoriteScreen}
        component={FavoriteScreen}
        options={{ title: getString("Favorites") }}
      />
      <Stack.Screen
        name={NavigationNames.ProfileTab_ListingDetailScreen}
        component={ListingDetailScreen}
      />
      <Stack.Screen
        name={NavigationNames.ProfileTab_ProfileEditScreen}
        component={ProfileEditScreen}
        options={{ title: getString("Edit Profile") }}
      />
      <Stack.Screen
        name={NavigationNames.ProfileTab_SearchMapScreen}
        component={SearchMapScreen}
        options={{ title: getString("Favorites Map") }}
      />
      <Stack.Screen
        name={NavigationNames.ProfileTab_AgentScreen}
        component={AgentScreen}
        options={{ title: getString("My Agent") }}
      />
      <Stack.Screen
        name={NavigationNames.ProfileTab_ClientScreen}
        component={ClientScreen}
        options={{ title: getString("My Clients") }}
      />
      <Stack.Screen
        name={NavigationNames.ProfileTab_NotificationScreen}
        component={NotificationScreen}
        options={{ title: getString("My Notifications") }}
      />
      <Stack.Screen
        name={NavigationNames.ProfileTab_AppointmentScreen}
        component={AppointmentScreen}
        options={{ title: getString("My Appointments") }}
      />

      <Stack.Screen
        name={NavigationNames.ProfileTab_UserDetailScreen}
        component={UserDetailScreen}
        options={{ title: getString("Detail") }}
      />
    </Stack.Navigator>
  );
};

const ChatTabStack = () => {
  const { getString } = useLocalization();
  const { user } = useContext(AuthenticationContext);
  const { agentInfo, chatInfo } = useContext(SocketConext);

  let chatList = chatInfo?.chatList ?? [];

  if (user?.role === 'client' && agentInfo) {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>

        <Stack.Screen
          name={NavigationNames.ChatTab_ChatClientDetailScreen}
          component={ChatClientDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  if (user?.role === 'agent' || chatList?.length > 0) {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
        <Stack.Screen
          name={NavigationNames.ChatTab_AgentListScreen}
          component={ChatUserListScreen}
          options={{ title: user?.role === 'agent' ? 'Clients' : 'Agents' }}
        />
        <Stack.Screen
          name={NavigationNames.ChatTab_ChatDetailScreen}
          component={ChatDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.ChatTab_ChatTempScreen}
        component={ChatTempScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );


}

const MenuTabStack = () => {
  const { getString } = useLocalization();
  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.MenuScreen}
        component={MenuScreen}
        options={{ title: getString("Menu") }}
      />
      <Stack.Screen
        name={NavigationNames.NewsListScreen}
        component={NewsListScreen}
        options={{ title: getString("News") }}
      />
      <Stack.Screen
        name={NavigationNames.NewsDetailScreen}
        component={NewsDetailScreen}
        options={{ title: getString("News Detail") }}
      />
      <Stack.Screen
        name={NavigationNames.AboutUsScreen}
        component={AboutUsScreen}
        options={{ title: getString("About Us") }}
      />
      <Stack.Screen
        name={NavigationNames.PrivacyPolicyScreen}
        component={PrivacyPolicyScreen}
        options={{ title: getString("Privacy Policy") }}
      />
    </Stack.Navigator>
  );
};

const HomePageTabNavigator = () => {
  const authContext = useContext(AuthenticationContext);
  const { chatInfo, agentInfo } = useContext(SocketConext);
  const { getString } = useLocalization();
  const checkTabStatus = () => {
    if (!authContext?.user) {
      return false;
    }

    if (authContext.user?.role === 'agent' && chatInfo?.chatList?.length > 0) {
      return true;
    }

    if (authContext.user?.role === 'client' && agentInfo) {
      return true;
    }

    return false;
  }

  let totalUnreadCount = chatInfo?.totalUnreadCount;

  return (
    <Tab.Navigator
      screenOptions={() => {
        return (
          {
            headerShown: false,
            tabBarStyle: {
              // position: 'absolute',
              // display: "none",
            },
            tabBarActiveTintColor: Theme.colors.navbarActiveColor,
            tabBarInactiveTintColor: Theme.colors.navbarInactiveColor,
            tabBarHideOnKeyboard: Platform.OS === 'ios' ? false : true,
          }
        )
      }}
    >
      <Tab.Screen name={NavigationNames.HomeTab}
        options={{
          title: getString("Home"),
          tabBarIcon: ({ color, size }) => <Ionicons name={"ios-home"} size={28} color={color} />
        }}
        component={HomeTabStack} />
      <Tab.Screen name={NavigationNames.SearchTab}
        options={{
          title: getString("Search"),
          tabBarIcon: ({ color, size }) => <Ionicons name={"ios-search"} size={28} color={color} />
        }}
        component={SearchTabStack} />

      <Tab.Screen name={NavigationNames.ChatTab} component={ChatTabStack}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (authContext.user) {
              return;
            }
            e.preventDefault();
            navigation.navigate(NavigationNames.RootLoginScreen);
          },
        })}
        options={checkTabStatus() ? {
          title: getString("Chat"),
          tabBarIcon: ({ color, size }) => totalUnreadCount > 0 ?
            (<View>
              <Ionicons name={"chatbox"} size={28} color={color} />
              <UnreadCount count={totalUnreadCount} style={{ position: 'absolute', right: -10, top: -6 }} />
            </View>) : <Ionicons name={"chatbox"} size={28} color={color} />
        } : {
          tabBarButton: (props) => null
        }}
      />

      <Tab.Screen
        name={NavigationNames.ProfileTab}
        component={ProfileTabStack}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (authContext.user) {
              return;
            }
            e.preventDefault();
            navigation.navigate(NavigationNames.RootLoginScreen);
          },
        })}
        options={{
          title: getString("Profile"),
          tabBarIcon: ({ color, size }) => <Ionicons name={"md-person"} size={28} color={color} />
        }}
      />
      <Tab.Screen name={NavigationNames.MenuTab}
        options={{
          title: getString("Menu"),
          tabBarIcon: ({ color, size }) => <Ionicons name={"ios-menu"} size={28} color={color} />
        }}
        component={MenuTabStack} />
    </Tab.Navigator>
  );
};

export default HomePageTabNavigator;
