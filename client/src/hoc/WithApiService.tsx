import { useContext } from "react";
import { ApiServiceConsumer } from "../contexts/ApiServiceContext";
import AuthContext, { AuthProps } from "../contexts/AuthContext";
import ApiService from "../services/ApiService";

export type WithApiServiceProps = {
  apiService: ApiService;
  auth: AuthProps;
};

const withApiService = () => (Wrapped: any) => {
  return (props: any) => {
    const authCtx = useContext(AuthContext);
    return (
      <ApiServiceConsumer>
        {(apiService) => {
          return <Wrapped {...props} apiService={apiService} auth={authCtx} />;
        }}
      </ApiServiceConsumer>
    );
  };
};

export default withApiService;
