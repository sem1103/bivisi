import { AuthProvider } from "./context/authContext";
import AppRouter from "./router";
import { VideoProvider } from "./context/VideoContext";
import ChatProvider from "./context/ChatContext";

function App() {
  return (
    <>
      <AuthProvider>
        <VideoProvider>
          <ChatProvider>
            <AppRouter />
          </ChatProvider>
        </VideoProvider>
      </AuthProvider>
    </>
  );
}

export default App;