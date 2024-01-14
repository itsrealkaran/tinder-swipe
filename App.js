// App.js
import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import Stack from "./components/Stack";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default App;
