async function sendHttp<T>(
  url: string,
  token: string | null,
  method = "GET",
  body: any = null
): Promise<T> {
  let headers: HeadersInit = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (body) {
    body = JSON.stringify(body);
    headers.set("Content-Type", "application/json");
  }

  try {
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

    return data;
  } catch (e) {
    throw e;
  }
}

export default sendHttp;
