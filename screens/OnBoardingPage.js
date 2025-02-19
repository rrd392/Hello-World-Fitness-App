import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ImageBackground,
  Image,
  Button,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const onboardingData = [
    {
      id: 1,
      title1: 'Welcome to',
      image: require('../assets/onboardingicon1.png'),
      background: require('../assets/bck1.png'),
      showButton: false,
    },
    {
      id: 2,
      title: "Start your journey towards a more active lifestyle",
      image: require('../assets/workupicon.png'),
      background: require('../assets/bck2.png'),
      showButton: false,
    },
    {
      id: 3,
      title: "Find nutrition tips that fit your lifestyle",
      background: require('../assets/bck3.png'),
      showButton: false,
    },
    {
      id: 4,
      title: "A community for you, challenge yourself",
      background: require('../assets/bck4.png'),
      showButton: true,
    },
  ];

  const renderItem = ({ item }) => (
    <ImageBackground
      source={item.background}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Unique Layout for First Onboarding Page */}
      {item.id === 1 ? (
        <View style={styles.firstSlide}>
          <Text style={styles.firstSlideTitle}>{item.title1}</Text>
          <Image source={item.image} style={styles.firstSlideImage} />
        </View>
      ) : (
        <View style={styles.otherSlides}>
          <View style={styles.textContainer}>
            < Image source={item.image} style={styles.otherslidesimage}/>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          {item.showButton && (
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('UserDashboard')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
        </View>
      )}
    </ImageBackground>
  );

  const Pagination = () => (
    <View style={styles.paginationContainer}>
      {onboardingData.map((_, index) => (
        <View 
          key={index}
          style={[
            styles.paginationDot,
            currentPage === index && styles.activeDot
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button Moved to Top Right */}
      {currentPage !==0 && currentPage < onboardingData.length - 1 && (
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => flatListRef.current.scrollToEnd()}
        >
          <Text style={styles.skipText}>Skip ‣ </Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const newPage = Math.round(offsetX / width);
          setCurrentPage(newPage);
        }}
      />
      
      <Pagination />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstSlide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  firstSlideTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#BB79D6',
    textAlign: 'center',
    marginBottom: 20,
  },
  firstSlideImage: {
    width:1200,
    height: 200,
    resizeMode: 'contain',
  },
  otherslidesimage:{
    width:'auto',
    height:'auto',
  },
  otherSlides: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
  },
  textContainer: {
    backgroundColor: '#B3A0FF',
    alignItems: 'center',
    justifyContent: 'center',  // Center text vertically
    width: '100%',             // Make it full width
    paddingHorizontal: 20,     // Keep some horizontal padding
    marginTop: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    padding:20,
    color: 'white',
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 33,
    position: 'absolute',
    bottom: 40,
    width: '100%',
  },
  paginationDot: {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B3A0FF',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 30,
  },
  getStartedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop:15,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: 'grey', // White shadow
    shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.66, // Shadow visibility
    shadowRadius: 5, // How blurry the shadow is
    elevation: 5, // Shadow for Android
    width:'60%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex:10,
  },
  skipText: {
    fontSize: 16,
    color: '#E2F163',

  },
});

export default OnboardingScreen;
