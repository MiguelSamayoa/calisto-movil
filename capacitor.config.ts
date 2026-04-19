import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.calisto.reposteria',
  appName: 'Calisto',
  webDir: 'www/browser',
  android: {
    allowMixedContent: false,
    backgroundColor: '#1a1a2e',
  },
  server: {
    url: 'http://192.168.1.19:8100',
    cleartext: true,
  },
  plugins: {
    CapacitorSQLite: {
      androidIsEncryption: false,
      androidBiometricAuth: false,
      androidBiometricTitle: 'Biometric login',
    },
    Camera: {
      permissions: ['camera', 'photos'],
    },
    Filesystem: {
      androidScheme: 'https',
    },
  },
};

export default config;

