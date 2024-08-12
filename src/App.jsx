import { AuthProvider } from "./context/authContext";
import AppRouter from "./router";
import { VideoProvider } from "./context/VideoContext";
import ChatProvider from "./context/ChatContext";
import ThemeProvider from "./context/ThemeContext";

import { GoogleOAuthProvider } from '@react-oauth/google';

import NotificationProvider from "./context/NotificationContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";
import { FacebookOAuthProvider } from "facebook-oauth-react";


function App() {
  return (
    <>
    <I18nextProvider i18n={i18n}>
    <ThemeProvider>
        <AuthProvider>
          <FacebookOAuthProvider appId={1018574332965285} appVersion={'v20.0'}>
        
        <GoogleOAuthProvider 
        clientId="205866087663-pbrcdfpn3io5d9m5ejlt940k1n46ji8k.apps.googleusercontent.com"
        >
          <VideoProvider>
          <NotificationProvider>
            <ChatProvider>
              <AppRouter />
            </ChatProvider>
            </NotificationProvider>
          </VideoProvider>
        </GoogleOAuthProvider>
    
        </FacebookOAuthProvider>
        </AuthProvider>

      </ThemeProvider>
    </I18nextProvider>
    
    </>
  );
}

export default App;