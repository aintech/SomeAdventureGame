import { AuthProps } from "../contexts/AuthContext";

async function sendHttp<T>(
  path: string,
  auth: AuthProps | null,
  params: string[] = [],
  method = "GET",
  body: any = null
): Promise<T> {
  let headers: HeadersInit = new Headers();

  if (auth) {
    headers.set("Authorization", `Bearer ${auth.token}`);
    params.push(`user_id=${auth.userId}`);
  }

  if (body) {
    body = JSON.stringify(body);
    headers.set("Content-Type", "application/json");
  }

  const url = path + (params ? "?" : "") + params.join("&");
  const request = { method, body, headers };

  try {
    const response = await fetch(url, request);

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
