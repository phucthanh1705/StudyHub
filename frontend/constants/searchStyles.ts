import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const searchStyles = StyleSheet.create({
  searchWrapper: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 25,
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
});
