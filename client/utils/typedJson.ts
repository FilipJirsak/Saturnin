export function typedJson<T>(data: T, init?: number | ResponseInit): Response {
  const responseInit: ResponseInit =
      typeof init === "number" ? { status: init } : init || {};

  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers: {
      "Content-Type": "application/json",
      ...responseInit.headers,
    },
  });
}
