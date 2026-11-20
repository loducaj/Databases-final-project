import { Route, Routes } from "react-router";
import Layout from "./components/Layout.jsx";
import Applications from "./pages/Applications.jsx";
import { Login, SignUp } from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LogApplication from "./pages/LogApplication.jsx";
import Postings from "./pages/Postings.jsx";

// One route per page. The pages inside <Layout> get the sidebar; log in and sign up don't.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="applications/new" element={<LogApplication />} />
        <Route path="postings" element={<Postings />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
    </Routes>
  );
}
