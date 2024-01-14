// Stack.js
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, PanResponder, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome icons

const Stack = () => {
  const originalCardData = [
    { id: 1, backgroundColor: "pink" },
    { id: 2, backgroundColor: "yellow" },
    { id: 3, backgroundColor: "orange" },
    { id: 4, backgroundColor: "blue" },
    { id: 5, backgroundColor: "green" },
    { id: 6, backgroundColor: "purple" },
    { id: 7, backgroundColor: "brown" },
  ];

  const [cardsData, setCardsData] = useState(originalCardData.slice(0, 3));
  const [direction, setDirection] = useState("");

  const position = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gesture) => {
        return Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10;
      },
      onPanResponderMove: (event, gesture) => {
        handleSwipe;
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > 120) {
          // Swipe right
          handleSwipe("right");
          setDirection("right");
        } else if (gesture.dx < -120) {
          // Swipe left
          handleSwipe("left");
          setDirection("left");
        }
      },
    })
  ).current;

  const handleSwipe = (direction) => {
    Animated.parallel([
      Animated.timing(rotation, {
        toValue: direction === "right" ? 45 : -45,
        delay: 100,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        delay: 200,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(iconOpacity, {
        toValue: 1,
        delay: 100,
        duration: 10,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Remove the swiped card from the stack
      setCardsData((cards) => {
        console.log(cards[0].id);
        const prevCards = cards.slice(1);
        const nextCard = originalCardData[cards[0].id + 2];
        if (nextCard) {
          return [...prevCards, nextCard];
        }
        return [...prevCards];
      });

      // Reset rotation, position, and opacity after animation
      rotation.setValue(0);
      position.setValue({ x: 0, y: 0 });
      cardOpacity.setValue(1);
      iconOpacity.setValue(0);
    });
  };

  return (
    <View style={styles.stack}>
      {cardsData.map((card, index) => (
        <Animated.View
          key={index}
          id={card.id}
          style={[
            styles.card,
            {
              backgroundColor: card.backgroundColor,
              zIndex: -index,
              transform: [
                ...position.getTranslateTransform(),
                { translateY: 25 * index },
                { scale: 1 - 0.05 * index },
                {
                  rotate:
                    index === 0
                      ? rotation.interpolate({
                          inputRange: [-45, 0, 45],
                          outputRange: ["-45deg", "0deg", "45deg"],
                        })
                      : "0deg",
                },
              ],
              opacity: index === 0 ? cardOpacity : 1,
            },
          ]}
          {...panResponder.panHandlers}
        >
          {index === 0 &&
            (direction === "right" ? (
              <Animated.View
                style={[styles.iconContainer, { opacity: iconOpacity }]}
              >
                <FontAwesome
                  name="check-circle"
                  size={70}
                  color="#0f0"
                  style={styles.icon}
                />
              </Animated.View>
            ) : (
              <Animated.View
                style={[styles.iconContainer, { opacity: iconOpacity }]}
              >
                <FontAwesome
                  name="times-circle"
                  size={70}
                  color="#f00"
                  style={styles.iconRight}
                />
              </Animated.View>
            ))}
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stack: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "80%",
    height: "90%",
    position: "absolute",
    overflow: "hidden", // Ensure the icons are within the card boundaries
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    top: 30,
    left: 30,
  },
  iconRight: {
    position: "absolute",
    top: 30,
    right: 30,
  },
});

export default Stack;
