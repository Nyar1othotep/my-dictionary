import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./components/app/App";
import ThemeProvider from "./contexts/themeProvider";
import { Provider } from "react-redux";
import { store } from "./store";
import "./firebase";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <React.StrictMode>
      <ThemeProvider>
         <Provider store={store}>
            <App />
         </Provider>
      </ThemeProvider>
   </React.StrictMode>
);
