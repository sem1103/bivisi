import { AuthProvider } from "./context/authContext";
import AppRouter from "./router";
import { VideoProvider } from "./context/VideoContext";
import ChatProvider from "./context/ChatContext";
import ThemeProvider from "./context/ThemeContext";
import { useState } from "react";

function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <VideoProvider>
            <ChatProvider>
              <AppRouter />
            </ChatProvider>
          </VideoProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;