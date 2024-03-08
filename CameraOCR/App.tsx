import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition'; // Import TextRecognition

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);

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

      const result = await TextRecognition.recognize(uri); // Call recognize method with URI

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
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Text Recognized:</Text>
          <Text style={styles.result}>{text}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
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
    marginTop: 20,
  },
  resultText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  result: {
    textAlign: 'center',
  },
});

export default App;