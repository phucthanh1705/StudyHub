// constants/cardStyles.ts
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const cardStyles = StyleSheet.create({
  card: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardActions: { flexDirection: "row", gap: 8 },
});
