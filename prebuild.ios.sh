rm -rf ios/Pods
pod install --project-directory=ios
./node_modules/react-native-webrtc/tools/downloadBitcode.sh