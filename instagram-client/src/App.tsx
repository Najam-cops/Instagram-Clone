import { Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import AuthLayout from "./layouts/AuthLayout";
import HomePage from "./pages/HomePage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import ProtectedPage from "./pages/ProtectedPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<HomePage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="home" element={<ProtectedPage />} />
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
