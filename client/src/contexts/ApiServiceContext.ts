import React, { createContext } from "react";
import ApiService from "../services/ApiService";

const {
  Provider: ApiServiceProvider,
  Consumer: ApiServiceConsumer,
}: {
  Provider: React.Provider<ApiService>;
  Consumer: React.Consumer<ApiService>;
} = createContext({} as ApiService);

export { ApiServiceProvider, ApiServiceConsumer };
