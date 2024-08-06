import { AuthProvider } from "./context/authContext";
import AppRouter from "./router";
import { VideoProvider } from "./context/VideoContext";
import ChatProvider from "./context/ChatContext";
import ThemeProvider from "./context/ThemeContext";

import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  return (
    <>
      <ThemeProvider>
       
        <AuthProvider>
        <GoogleOAuthProvider 
        clientId="240313584583-p2ouffpi3b9r9q3qmmooai65r7ktqmrn.apps.googleusercontent.com"
        >
          <VideoProvider>
            <ChatProvider>
              <AppRouter />
            </ChatProvider>
          </VideoProvider>
        </GoogleOAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;