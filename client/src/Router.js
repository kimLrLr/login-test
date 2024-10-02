import { HashRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { Main } from "./pages/main/Main";
import { Join } from "./pages/account/Join";
import { Login } from "./pages/account/Login";
import { PageNotFound } from "./pages/pageNotFound/PageNotFound";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

function Router() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path={routes.main} element={<Main />} />
        <Route path={routes.join} element={<Join />} />
        <Route path={routes.login} element={<Login />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default Router;
