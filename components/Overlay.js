import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator,Text,StyleSheet } from 'react-native';
import ThreeDotsAnimation from './ThreeDotsAnimation';


const Overlay = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="black" />
      <Text style={styles.headerText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'Grey',
    textAlign: 'center',
  },
});

export default Overlay;