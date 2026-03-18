import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gymtracker.app',
  appName: 'Gym Tracker',
  webDir: 'dist',
  server: {
    // Для разработки укажи свой локальный адрес:
    // url: 'http://192.168.1.100:5173',
    // cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#1a1a2e',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e',
    },
  },
};

export default config;
