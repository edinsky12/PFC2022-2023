import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const ThreeDotsAnimation = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount + 1) % 3);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.dot, dotCount === 0 && styles.activeDot]} />
      <View style={[styles.dot, dotCount === 1 && styles.activeDot]} />
      <View style={[styles.dot, dotCount === 2 && styles.activeDot]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#000',
  },
});

export default ThreeDotsAnimation;