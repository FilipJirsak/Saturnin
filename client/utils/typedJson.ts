export function typedJson<T>(data: T, init?: ResponseInit | number): Response {
  const responseInit: ResponseInit = typeof init === "number" ? { status: init } : init || {};

  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers: {
      ...(responseInit.headers || {}),
      "Content-Type": "application/json",
    },
  });
}
