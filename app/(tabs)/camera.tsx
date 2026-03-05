import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const cameraRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={['#1E3A5F', '#0D1F3C']} style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>[CAM]</Text>
          <Text style={styles.permissionTitle}>نحتاج إذن الكاميرا</Text>
          <Text style={styles.permissionText}>
            للسماح بالتقاط الفيديو، يرجى منح الإذن للوصول للكاميرا
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>منح الإذن</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        setRecordingTime(0);
        setHasRecorded(false);

        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            if (prev >= 10) {
              stopRecording();
              return 10;
            }
            return prev + 1;
          });
        }, 1000);

        const video = await cameraRef.current.recordAsync({
          maxDuration: 10,
          quality: '720p',
        });

        if (video) {
          setHasRecorded(true);
          Alert.alert('تم التسجيل', `تم حفظ الفيديو: ${video.uri}`);
        }
      } catch (error) {
        console.error('Recording error:', error);
        Alert.alert('خطأ', 'فشل في تسجيل الفيديو');
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} mode="video">
        <View style={styles.topControls}>
          <Text style={styles.timer}>
            {isRecording ? `00:${recordingTime.toString().padStart(2, '0')}` : '00:00'}
          </Text>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>جاري التسجيل...</Text>
            </View>
          )}
        </View>

        {!isRecording && !hasRecorded && (
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              اضغط على زر التسجيل لبدء التصوير
            </Text>
            <Text style={styles.instructionSubtext}>
              الحد الأقصى 10 ثواني
            </Text>
          </View>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.bottomControls}
        >
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Text style={styles.flipButtonText}>[F]</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
            ]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <View
              style={[
                styles.recordButtonInner,
                isRecording && styles.recordButtonInnerActive,
              ]}
            />
          </TouchableOpacity>

          <View style={styles.placeholder} />
        </LinearGradient>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
    marginRight: 8,
  },
  recordingText: {
    color: '#fff',
    fontSize: 16,
  },
  instructions: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instructionSubtext: {
    fontSize: 14,
    color: '#B8D4E8',
    marginTop: 8,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#ff4444',
  },
  recordButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    backgroundColor: '#ff4444',
  },
  recordButtonInnerActive: {
    borderRadius: 8,
    width: '60%',
    height: '60%',
  },
  placeholder: {
    width: 50,
    height: 50,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionIcon: {
    fontSize: 48,
    marginBottom: 20,
    color: '#fff',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#B8D4E8',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
