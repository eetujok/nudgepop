import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavMenu } from "@shopify/app-bridge-react";
import { Page, Spinner, Text } from "@shopify/polaris";
import { useEffect, useMemo, Suspense, lazy } from "react";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
  useNavigate,
  Link
} from "react-router-dom";

const PlansPage = lazy(() => import("../routes/plans"));
const TooltipIndex = lazy(() => import("../routes/TooltipIndex"));
const TooltipCreate = lazy(() => import("../routes/TooltipCreate"));
const TooltopStyling = lazy(() => import("../routes/TooltipStyling"));
const TooltipConditions = lazy(() => import("../routes/TooltipConditions"));
const TooltipInstall = lazy(() => import("../routes/TooltipInstall"));
const Dashboard = lazy(() => import("../components/Dashboard"));

import { api } from "../api";
import { MantleProvider } from "@heymantle/react";
import { useFindFirst } from "@gadgetinc/react";

const loading =
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>

function Error404() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname ===
      new URL(process.env.GADGET_PUBLIC_SHOPIFY_APP_URL).pathname
    )
      return navigate("/", { replace: true });
  }, [location.pathname]);

  return <div>404 not found</div>;
}

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={
          <Suspense fallback={loading}>
            <TooltipIndex />
          </Suspense>
        } />
        <Route path="*" element={<Error404 />} />
        <Route path="/plans" element={
          <Suspense fallback={loading}>
            <PlansPage />
          </Suspense>
        } />
        <Route path="/tooltip-content" element={
          <Suspense fallback={loading}>
            <TooltipCreate />
          </Suspense>
          } />
        <Route path="/tooltip-style" element={
          <Suspense fallback={loading}>
            <TooltopStyling />
          </Suspense>
        } />
        <Route path="/tooltip-conditions" element={
          <Suspense fallback={loading}>
            <TooltipConditions />
          </Suspense>
        } />
        <Route path="/tooltip-install" element={
          <Suspense fallback={loading}>
            <TooltipInstall />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={loading}>
            <Dashboard />
          </Suspense>
          } />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

function Layout() {
  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
      api={api}
    >
      <AuthenticatedApp />
    </GadgetProvider>
  );
}

function AuthenticatedApp() {
  // we use `isAuthenticated` to render pages once the OAuth flow is complete!
  const { isAuthenticated, loading } = useGadget();
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }
  return isAuthenticated ? <EmbeddedApp /> : <UnauthenticatedApp />;
}

function EmbeddedApp() {
  const [{ data, fetching }] = useFindFirst(api.shopifyShop);

  if (fetching) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }

  return (
    <MantleProvider
      appId={process.env.GADGET_PUBLIC_MANTLE_APP_ID}
      customerApiToken={data?.mantleApiToken}
    >
      <Outlet />
      <NavMenu>
        <Link to="/" rel="home">Shop Information</Link>
        <Link to="/plans">Plans</Link>
      </NavMenu>
    </MantleProvider>
  );
}

function UnauthenticatedApp() {
  return (
    <Page title="App">
      <Text variant="bodyMd" as="p">
        App can only be viewed in the Shopify Admin.
      </Text>
    </Page>
  );
}



export default App;
