import { createContext } from "react";

const { Provider: ApiServiceProvider, Consumer: ApiServiceConsumer } =
  createContext({});

export { ApiServiceProvider, ApiServiceConsumer };
