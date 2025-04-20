import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import { Toaster } from "./components/ui/sonner";
import { AuthForm } from "./components/AuthForm";
import PrivateRoute from "./components/PrivateRoute";
import AxiosProvider from "./provider/AxiosProvider";
import { AuthProvider } from "./provider/AuthProvider";
import ReactQueryProvider from "./provider/QueryProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AxiosProvider>
          <ReactQueryProvider>
            <Toaster richColors position="top-right" />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/signup" element={<AuthForm />} />
                <Route path="/signin" element={<AuthForm />} />
                <Route path="/" element={<Landing />}></Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/home" element={<Home />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ReactQueryProvider>
        </AxiosProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
