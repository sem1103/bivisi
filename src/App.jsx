import { AuthProvider } from "./context/authContext";
import AppRouter from "./router";
import { VideoProvider } from "./context/VideoContext";
import ChatProvider from "./context/ChatContext";
import { SubscriptionProvider } from "./context/subscriptionContext";

function App() {
  return (
    <>
      <AuthProvider>
        <VideoProvider>
          <ChatProvider>
            <SubscriptionProvider>
            <AppRouter />
            </SubscriptionProvider>
          </ChatProvider>
        </VideoProvider>
      </AuthProvider>
    </>
  );
}

export default App;