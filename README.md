# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

### Client

Run the dev server:

```shellscript
deno task client
```

### Server

Run the dev server:

```shellscript
deno task server
```

## Deployment

First, build your app for production:

```sh
deno task build
```

Then run the app in production mode:

```sh
deno task start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `deno task build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
