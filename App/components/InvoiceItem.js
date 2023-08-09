import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import colors from "../constants/colors";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textStyle: {
    fontSize: 18,
    marginHorizontal: 20,
    color: colors.text,
  },
  separator: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
  },
});

export const InvoiceItem = ({
  leftIcon,
  rightIcon,
  text,
  customTextColor,
  onPress,
  active,
}) => {
  return (
    <View style={styles.container}>
      {leftIcon}

      <TouchableOpacity activeOpacity={active ? 0.7 : 1}>
        <Text
          onPress={onPress}
          style={{
            ...styles.textStyle,
            width: rightIcon ? screen.width * 0.6 : screen.width * 0.75,
            color:
              customTextColor !== undefined
                ? customTextColor
                : styles.textStyle.color,
            fontStyle: "italic",
          }}
        >
          {text}
        </Text>
      </TouchableOpacity>

      {rightIcon}
    </View>
  );
};
