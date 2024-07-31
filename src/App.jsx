import { AuthProvider } from "./context/authContext";
import AppRouter from "./router";
import { VideoProvider } from "./context/VideoContext";
import ChatProvider from "./context/ChatContext";
import ThemeProvider from "./context/ThemeContext";

function App() {
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