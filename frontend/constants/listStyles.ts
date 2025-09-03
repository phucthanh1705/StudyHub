// constants/listStyles.ts
import { StyleSheet } from "react-native";

export const listStyles = StyleSheet.create({
  listContainer: {
    paddingBottom: 100,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
  },
});
