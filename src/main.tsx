import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import AppProvider from "./AppProvider";
import store from "./store/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  //<React.StrictMode>
  <Provider store={store}>
    <AppProvider />
  </Provider>
  //</React.StrictMode>
);
