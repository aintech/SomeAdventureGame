import { ApiServiceConsumer } from "../contexts/api-service-context";
import ApiService from "../services/api-service";

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
