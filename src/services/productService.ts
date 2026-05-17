import { products as fallbackProducts } from '../data/products';
import type { Product } from '../types/Product';

const MARKETPLACE_API_URL = '';

export async function getProducts(): Promise<Product[]> {
  if (!MARKETPLACE_API_URL) {
    return fallbackProducts;
  }

  try {
    const response = await fetch(MARKETPLACE_API_URL);

    if (!response.ok) {
      throw new Error(`Product API failed with status ${response.status}`);
    }

    const data = (await response.json()) as Product[];
    return data;
  } catch {
    return fallbackProducts;
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

/*
  Marketplace API notes:
  - Put a public product API URL in MARKETPLACE_API_URL when one is available.
  - If an API key is required, do not place the secret key in frontend code.
  - Use a backend endpoint, serverless function, or deployment proxy to store
    private keys safely and return only the product data this website needs.
*/
