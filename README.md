# BAGU Studio Portfolio

Complete MVP portfolio website for Batuhan Güyıldar / BAGU Studio, built with React, Vite, TypeScript, Tailwind CSS, and React Router.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Build For Production

```bash
npm run build
```

The production files will be generated in `dist/`.

## Deployment Notes

### Vercel

1. Import the project repository into Vercel.
2. Use `npm run build` as the build command.
3. Use `dist` as the output directory.

### Netlify

1. Import the project repository into Netlify.
2. Use `npm run build` as the build command.
3. Use `dist` as the publish directory.

For React Router support on static hosting, add a redirect rule if needed:

```txt
/* /index.html 200
```

## Where To Edit Products

Edit product/project content in:

```txt
src/data/products.ts
```

Each product supports:

- `id`
- `title`
- `shortDescription`
- `longDescription`
- `image`
- `price`
- `category`
- `tags`
- `marketplaceUrl`
- `featured`

## Where To Connect A Marketplace API

The product service is in:

```txt
src/services/productService.ts
```

Add a public API URL there when an official marketplace API or your own backend endpoint is available.

Do not expose private API keys in frontend code. If an API key is required, use a backend endpoint, serverless function, or proxy to keep the key secret and return safe product data to the website.
