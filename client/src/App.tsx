import Home from "./components/Home";
import Quote from "./components/Quote";
import NotFound from "./components/NotFound";
import { Toaster } from "./components/ui/sonner";
import { AuthForm } from "./components/AuthForm";
import SecretQuote from "./components/SecretQuote";
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
                <Route index element={<Quote />} />
                <Route element={<PrivateRoute />}>
                  <Route path="secretquote" element={<SecretQuote />} />
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
