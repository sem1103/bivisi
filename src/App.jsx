import { AuthProvider } from "./context/authContext";
import AppRouter from "./router";
import { VideoProvider } from "./context/VideoContext";

function App() {
  return (
    <>
      <AuthProvider>
        <VideoProvider>
          <AppRouter />
        </VideoProvider>
      </AuthProvider>
    </>
  );
}

export default App;
