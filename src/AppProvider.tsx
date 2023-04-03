import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
const AppDesktop = lazy(() => import("./AppDesktop"));
// const AppMobile = lazy(() => import("./AppMobile"));
const appModes: any = { desktop: <AppDesktop /> /*mobile: <AppMobile />*/ };

import AppLoader from "./Components/AppLoader";
import { printBuildInfo } from "./utils/file";

const AppProvider = () => {
  printBuildInfo();
  const appMode: any = useSelector((state: any) => state.reducer.settings.appMode);
  return (
    <Suspense fallback={<AppLoader msg="应用程序" />}>
      {appModes[appMode]}
    </Suspense>
  );
};
export default AppProvider;
