export default class AuthService {
  async request(url, method = "GET", body = null, headers = {}) {
    let loading = false;
    let error = null;

    try {
      if (body) {
        body = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(url, {
        method,
        body,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Server is overloaded, try again later please!"
        );
      }

      loading = false;

      return data;
    } catch (e) {
      loading = false;
      error = e.message;
      throw e;
    }
  }
}
