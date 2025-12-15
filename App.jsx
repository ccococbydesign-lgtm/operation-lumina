import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Magical Star Component with Gold Glitter Fill Animation
const MagicalStar = ({ filled, size = 100, onComplete }) => {
  const fillAnimation = useRef(new Animated.Value(0)).current;
  const glitterOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (filled) {
      // Create glitter particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * size,
        y: Math.random() * size,
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0),
      }));
      setParticles(newParticles);

      // Animate star fill
      Animated.parallel([
        Animated.timing(fillAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(scaleAnimation, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Animate glitter particles
      newParticles.forEach((particle, index) => {
        Animated.sequence([
          Animated.delay(index * 50),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Continuous shimmer effect
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(glitterOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glitterOpacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();

      if (onComplete) {
        setTimeout(onComplete, 2000);
      }
    }
  }, [filled]);

  const fillHeight = fillAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size],
  });

  return (
    <Animated.View
      style={[
        styles.starContainer,
        { transform: [{ scale: scaleAnimation }] },
      ]}
    >
      {/* Star outline */}
      <View style={[styles.starOutline, { width: size, height: size }]}>
        <Text style={[styles.starIcon, { fontSize: size }]}>⭐</Text>
      </View>

      {/* Gold fill */}
      <Animated.View
        style={[
          styles.starFill,
          {
            width: size,
            height: fillHeight,
            bottom: 0,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.goldGradient,
            { opacity: glitterOpacity },
          ]}
        />
      </Animated.View>

      {/* Glitter particles */}
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.glitterParticle,
            {
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              transform: [{ scale: particle.scale }],
            },
          ]}
        >
          <Text style={styles.glitterIcon}>✨</Text>
        </Animated.View>
      ))}
    </Animated.View>
  );
};

// Field Kit Scanner Component (QR/NFC)
const FieldKitScanner = ({ onScan, visible, onClose }) => {
  const [manualCode, setManualCode] = useState('');

  const handleManualEntry = () => {
    if (manualCode.length >= 6) {
      onScan(manualCode);
      setManualCode('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.scannerModal}>
          <Text style={styles.scannerTitle}>Activate Field Kit</Text>
          <Text style={styles.scannerSubtitle}>
            Enter the code from your Physical Field Kit
          </Text>

          <TextInput
            style={styles.codeInput}
            value={manualCode}
            onChangeText={setManualCode}
            placeholder="Enter 6-digit code"
            placeholderTextColor="#9D84B7"
            maxLength={12}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={styles.activateButton}
            onPress={handleManualEntry}
          >
            <Text style={styles.activateButtonText}>Activate Kit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.scannerHint}>
            💡 Find your code inside your Field Kit box
          </Text>
        </View>
      </View>
    </Modal>
  );
};

// Main App Component
export default function OperationLuminaApp() {
  const [agentName, setAgentName] = useState('');
  const [agentNumber, setAgentNumber] = useState(null);
  const [totalStars, setTotalStars] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [showSetup, setShowSetup] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showTransmission, setShowTransmission] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [fieldKitActivated, setFieldKitActivated] = useState(false);
  const [completedMission, setCompletedMission] = useState(null);
  const [animatingStar, setAnimatingStar] = useState(false);

  const DEFAULT_OPPORTUNITIES = [
    {
      id: 1,
      title: 'Help with a household task without being asked',
      stars: 2,
      completed: false,
      category: 'Responsibility',
    },
    {
      id: 2,
      title: 'Show kindness to a sibling or friend',
      stars: 2,
      completed: false,
      category: 'Kindness',
    },
    {
      id: 3,
      title: 'Complete homework on time',
      stars: 1,
      completed: false,
      category: 'Responsibility',
    },
    {
      id: 4,
      title: 'Practice patience when frustrated',
      stars: 3,
      completed: false,
      category: 'Emotional Growth',
    },
    {
      id: 5,
      title: 'Clean up after yourself',
      stars: 1,
      completed: false,
      category: 'Responsibility',
    },
    {
      id: 6,
      title: 'Tell the truth even when it\'s hard',
      stars: 3,
      completed: false,
      category: 'Integrity',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('operationLuminaData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setAgentName(data.name || '');
        setAgentNumber(data.agentNumber || null);
        setTotalStars(data.totalStars || 0);
        setOpportunities(data.opportunities || DEFAULT_OPPORTUNITIES);
        setFieldKitActivated(data.fieldKitActivated || false);
        setShowSetup(false);
      } else {
        setOpportunities(DEFAULT_OPPORTUNITIES);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setOpportunities(DEFAULT_OPPORTUNITIES);
    }
  };

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem('operationLuminaData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const setupAgent = () => {
    if (agentName.trim()) {
      const data = {
        name: agentName,
        agentNumber,
        totalStars: 0,
        opportunities: DEFAULT_OPPORTUNITIES,
        fieldKitActivated: false,
      };
      saveData(data);
      setShowSetup(false);
    }
  };

  const completeOpportunity = (id) => {
    const opp = opportunities.find((o) => o.id === id);
    if (opp && !opp.completed) {
      const updatedOpportunities = opportunities.map((o) =>
        o.id === id ? { ...o, completed: true } : o
      );
      const newTotalStars = totalStars + opp.stars;

      setOpportunities(updatedOpportunities);
      setCompletedMission(opp);
      setAnimatingStar(true);

      // Show completion modal after star animation
      setTimeout(() => {
        setTotalStars(newTotalStars);
        setShowCompletion(true);
        setAnimatingStar(false);

        saveData({
          name: agentName,
          agentNumber,
          totalStars: newTotalStars,
          opportunities: updatedOpportunities,
          fieldKitActivated,
        });
      }, 2000);
    }
  };

  const transmitStars = () => {
    if (totalStars > 0) {
      setShowTransmission(true);
      // In production, this would make API call to backend
    }
  };

  const activateFieldKit = (code) => {
    // In production, validate code with backend
    // For now, accept any 6+ character code
    if (code.length >= 6) {
      setFieldKitActivated(true);
      // Could assign agent number based on code
      const randomNumber = Math.floor(Math.random() * 50) + 1;
      setAgentNumber(randomNumber);

      saveData({
        name: agentName,
        agentNumber: randomNumber,
        totalStars,
        opportunities,
        fieldKitActivated: true,
      });
    }
  };

  const getCurrentDate = () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  if (showSetup) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.setupContainer}>
          <Text style={styles.setupLogo}>OPERATION LUMINA</Text>
          <Text style={styles.setupSubtitle}>Field Agent Portal</Text>

          <View style={styles.setupCard}>
            <Text style={styles.setupTitle}>Welcome, Field Agent!</Text>
            <Text style={styles.setupText}>
              Enter your agent name to begin your mission:
            </Text>

            <TextInput
              style={styles.nameInput}
              value={agentName}
              onChangeText={setAgentName}
              placeholder="Your Name"
              placeholderTextColor="#9D84B7"
            />

            <TouchableOpacity style={styles.beginButton} onPress={setupAgent}>
              <Text style={styles.beginButtonText}>Begin Mission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>OPERATION LUMINA</Text>
          <Text style={styles.subtitle}>Field Agent Portal</Text>
        </View>

        {/* Agent Badge */}
        <View style={styles.agentBadge}>
          <Text style={styles.agentName}>Field Agent {agentName}</Text>
          {fieldKitActivated && agentNumber ? (
            <Text style={styles.agentNumberBadge}>
              Founding Agent #{agentNumber}
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.activateKitButton}
              onPress={() => setShowScanner(true)}
            >
              <Text style={styles.activateKitText}>
                📦 Activate Field Kit
              </Text>
            </TouchableOpacity>
          )}
          <Text style={styles.clearance}>Security Clearance: Active</Text>

          {/* Star Counter with Animation */}
          <View style={styles.starCounter}>
            {animatingStar && completedMission ? (
              <MagicalStar
                filled={true}
                size={80}
                onComplete={() => setAnimatingStar(false)}
              />
            ) : (
              <>
                <Text style={styles.starIcon}>⭐</Text>
                <Text style={styles.starCount}>{totalStars}</Text>
                <Text style={styles.starLabel}>Stars Collected</Text>
              </>
            )}
          </View>
        </View>

        {/* Today's Missions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Redemption Opportunities</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Mission Date: {getCurrentDate()}</Text>
          </View>

          {opportunities.map((opp) => (
            <View
              key={opp.id}
              style={[
                styles.opportunityItem,
                opp.completed && styles.opportunityCompleted,
              ]}
            >
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{opp.category}</Text>
              </View>
              <Text style={styles.opportunityTitle}>
                {opp.completed ? '✅ ' : ''}
                {opp.title}
              </Text>
              <Text style={styles.opportunityReward}>
                ⭐ {opp.stars} Star{opp.stars > 1 ? 's' : ''}
              </Text>
              {!opp.completed && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => completeOpportunity(opp.id)}
                >
                  <Text style={styles.completeButtonText}>
                    Complete Mission
                  </Text>
                </TouchableOpacity>
              )}
              {opp.completed && (
                <Text style={styles.completedText}>Mission Accomplished!</Text>
              )}
            </View>
          ))}
        </View>

        {/* Transmission Section */}
        <View style={styles.transmissionSection}>
          <Text style={styles.transmissionTitle}>
            🎄 Transmit to North Pole 🎄
          </Text>
          <Text style={styles.transmissionText}>
            Ready to send your earned stars to Aurora Frost?
          </Text>
          <TouchableOpacity
            style={styles.transmitButton}
            onPress={transmitStars}
          >
            <Text style={styles.transmitButtonText}>Transmit Magic ✨</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={showCompletion}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCompletion(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.celebration}>⭐✨🎉</Text>
            <Text style={styles.modalTitle}>Mission Complete!</Text>
            {completedMission && (
              <Text style={styles.modalMessage}>
                You earned {completedMission.stars} star
                {completedMission.stars > 1 ? 's' : ''}! Great work, Agent{' '}
                {agentName}!
              </Text>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowCompletion(false)}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Transmission Modal */}
      <Modal
        visible={showTransmission}
        animationType="fade"
        transparent
        onRequestClose={() => setShowTransmission(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.celebration}>🎄✨🎅</Text>
            <Text style={styles.modalTitle}>Transmission Successful!</Text>
            <Text style={styles.modalMessage}>
              Your stars have been received at the North Pole!
            </Text>
            <Text style={styles.auroraMessage}>
              Aurora Frost is celebrating your growth! 🌟
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowTransmission(false)}
            >
              <Text style={styles.modalButtonText}>Amazing!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Field Kit Scanner */}
      <FieldKitScanner
        visible={showScanner}
        onScan={activateFieldKit}
        onClose={() => setShowScanner(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3D',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  logo: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECCA3',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#E8F4F8',
    textAlign: 'center',
  },
  agentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  agentName: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 20,
    color: '#D4AF37',
    marginBottom: 5,
    textAlign: 'center',
  },
  agentNumberBadge: {
    fontSize: 14,
    color: '#4ECCA3',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  activateKitButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginVertical: 10,
    alignSelf: 'center',
  },
  activateKitText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  clearance: {
    fontSize: 12,
    color: '#9D84B7',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  starCounter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 10,
  },
  starIcon: {
    fontSize: 40,
  },
  starCount: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 32,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  starLabel: {
    fontSize: 14,
    color: '#E8F4F8',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 22,
    color: '#4ECCA3',
    marginBottom: 15,
  },
  dateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateLabel: {
    fontSize: 12,
    color: '#9D84B7',
  },
  opportunityItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#9D84B7',
    marginBottom: 15,
  },
  opportunityCompleted: {
    borderColor: '#4ECCA3',
    backgroundColor: 'rgba(78, 204, 163, 0.15)',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(157, 132, 183, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    color: '#E8B4D9',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  opportunityTitle: {
    fontSize: 16,
    color: '#E8F4F8',
    marginBottom: 5,
  },
  opportunityReward: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: '#4ECCA3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  completeButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  completedText: {
    color: '#4ECCA3',
    fontSize: 14,
    marginTop: 10,
  },
  transmissionSection: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',
  },
  transmissionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 20,
    color: '#D4AF37',
    marginBottom: 10,
  },
  transmissionText: {
    fontSize: 14,
    color: '#E8F4F8',
    textAlign: 'center',
    marginBottom: 20,
  },
  transmitButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  transmitButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Magical Star Styles
  starContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starOutline: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starFill: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 50,
  },
  goldGradient: {
    flex: 1,
    backgroundColor: '#FFD700',
  },
  glitterParticle: {
    position: 'absolute',
  },
  glitterIcon: {
    fontSize: 12,
    color: '#FFD700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A2B3D',
    borderRadius: 20,
    padding: 40,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ECCA3',
  },
  celebration: {
    fontSize: 60,
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 24,
    color: '#4ECCA3',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#E8F4F8',
    textAlign: 'center',
    marginBottom: 20,
  },
  auroraMessage: {
    fontSize: 14,
    color: '#E8B4D9',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4ECCA3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  modalButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Setup Styles
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  setupLogo: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ECCA3',
    marginBottom: 10,
  },
  setupSubtitle: {
    fontSize: 16,
    color: '#E8F4F8',
    marginBottom: 40,
  },
  setupCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  setupTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 24,
    color: '#D4AF37',
    marginBottom: 15,
    textAlign: 'center',
  },
  setupText: {
    fontSize: 14,
    color: '#E8F4F8',
    textAlign: 'center',
    marginBottom: 20,
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#9D84B7',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  beginButton: {
    backgroundColor: '#4ECCA3',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  beginButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Scanner Modal Styles
  scannerModal: {
    backgroundColor: '#1A2B3D',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  scannerTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 24,
    color: '#D4AF37',
    marginBottom: 10,
    textAlign: 'center',
  },
  scannerSubtitle: {
    fontSize: 14,
    color: '#E8F4F8',
    textAlign: 'center',
    marginBottom: 25,
  },
  codeInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 4,
  },
  activateButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  activateButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#9D84B7',
  },
  scannerHint: {
    fontSize: 12,
    color: '#E8B4D9',
    textAlign: 'center',
    marginTop: 15,
  },
});
