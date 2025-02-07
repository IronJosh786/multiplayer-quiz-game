import Home from "./components/Home";
import Base from "./components/Base";
import Secret from "./components/Secret";
import NotFound from "./components/NotFound";
import { Toaster } from "./components/ui/sonner";
import { AuthForm } from "./components/AuthForm";
import PrivateRoute from "./components/PrivateRoute";
import AxiosProvider from "./components/AxiosProvider";
import { AuthProvider } from "./components/AuthProvider";
import ReactQueryProvider from "./components/QueryProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AxiosProvider>
          <ReactQueryProvider>
            <Toaster richColors position="top-right" toastOptions={{}} />
            <Routes>
              <Route path="/signup" element={<AuthForm />} />
              <Route path="/signin" element={<AuthForm />} />
              <Route path="/" element={<Home />}>
                <Route index element={<Base />} />
                <Route element={<PrivateRoute />}>
                  <Route path="secret" element={<Secret />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ReactQueryProvider>
        </AxiosProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
