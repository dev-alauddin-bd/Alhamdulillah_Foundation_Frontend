"use client";

import React, { ReactNode, FC } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { SessionSync } from "./SessionSync";

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionSync>
          {children}
        </SessionSync>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
