import { ApiServiceConsumer } from "../contexts/ApiServiceContext";
import ApiService from "../services/ApiService";

export type WithApiServiceProps = {
  apiService: ApiService;
};

const withApiService = () => (Wrapped: any) => {
  return (props: any) => {
    return (
      <ApiServiceConsumer>
        {(apiService) => {
          return <Wrapped {...props} apiService={apiService} />;
        }}
      </ApiServiceConsumer>
    );
  };
};

export default withApiService;
