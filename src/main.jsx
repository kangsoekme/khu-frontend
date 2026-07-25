import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routes/AppRouter.jsx";

import { Provider } from "react-redux";
import { store } from "./store/store.js";

import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppRouter />
      <Toaster position="top-center" richColors />
    </Provider>
  </StrictMode>,
);
