import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

// constants
import colors from "../constants/colors";

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.lightBlue,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  textStyle: {
    fontSize: 18,
    color: colors.white,
  },
});

export const GeneralButton = ({
  text,
  onPress,
  backgroundColor,
  isActive = false,
}) => {
  return (
    <TouchableOpacity
      disabled={isActive}
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        ...styles.buttonStyle,
        opacity: isActive ? 0.7 : 1,
        backgroundColor:
          backgroundColor !== undefined
            ? backgroundColor
            : styles.buttonStyle.backgroundColor,
      }}
    >
      <Text style={styles.textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};
