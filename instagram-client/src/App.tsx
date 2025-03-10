import { Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import AuthLayout from "./layouts/AuthLayout";
import HomePage from "./pages/HomePage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import WelcomePage from "./pages/WelcomePage";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<WelcomePage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="timeline" element={<HomePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
