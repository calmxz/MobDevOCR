import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import Tts from 'react-native-tts';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    Tts.setDefaultLanguage('en-US');
  }, []);

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo' }, handleImage);
  };

  const chooseImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, handleImage);
  };

  const handleImage = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorCode);
    } else {
      const uri = response.assets?.[0]?.uri;
      if (!uri) {
        console.error('Image URI is null or empty');
        return;
      }
      setImage(uri);
      recognizeText(uri);
    }
  };

  const recognizeText = async (uri: string | null) => {
    try {
      if (!uri) {
        throw new Error('Image URI is null or empty');
      }

      const result = await TextRecognition.recognize(uri);
      console.log(result);

      if (Array.isArray(result)) {
        const joinedText = result.join('\n');
        setText(joinedText);
      } else {
        setText(result);
      }
    } catch (error) {
      console.error('Text recognition error: ', error);
    }
  };

  const speakText = (text: string | null) => {
    if (text) {
      Tts.speak(text);
      setIsPlaying(true);
    }
  };

  const pauseText = () => {
    Tts.stop();
    setIsPlaying(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.cameraContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <Text>No Image</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={takePhoto} style={styles.button}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={chooseImage} style={styles.button}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>
      </View>
      {text && (
        <View style={styles.playPauseContainer}>
          {!isPlaying ? (
            <TouchableOpacity onPress={() => speakText(text)} style={[styles.playPauseButton, styles.playButton]}>
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pauseText} style={[styles.playPauseButton, styles.pauseButton]}>
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {text && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultText}>Text Recognized:</Text>
          <Text style={styles.result}>{text}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'stretch',
    maxHeight: 200,
  },
  resultText: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  result: {
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  playPauseContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  playPauseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FF5722',
  },
});

export default App;