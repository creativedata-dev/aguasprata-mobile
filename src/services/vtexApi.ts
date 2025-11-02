import axios from 'axios';
import Constants from 'expo-constants';

const ACCOUNT = 'aguasprata';
const BASE_PUBLIC = `https://${ACCOUNT}.vtexcommercestable.com.br`;

/**
 * Proxy base URL: set in app config (to your deployed serverless)
 * Example: https://aguasprata-proxy.vercel.app/api
 * If not set, proxy calls will throw.
 */
const PROXY_BASE = (Constants.expoConfig?.extra as any)?.PROXY_BASE || '';

export const searchProducts = async (q = '', page = 1, pageSize = 12) => {
  const params: Record<string, string | number> = {
    _from: (page - 1) * pageSize,
    _to: page * pageSize - 1,
  };
  if (q) params['q'] = q;

  const url = `${BASE_PUBLIC}/api/catalog_system/pub/products/search/`;
  const resp = await axios.get(url, { params });
  return resp.data;
};

export const getProductBySlug = async (slug: string) => {
  const url = `${BASE_PUBLIC}/api/catalog_system/pub/products/search/${encodeURIComponent(slug)}`;
  const resp = await axios.get(url);
  return resp.data?.[0];
};

/**
 * Create order via serverless proxy.
 * The proxy will include AppKey/AppToken in server-side request to VTEX.
 */
export const createOrder = async (orderPayload: any) => {
  if (!PROXY_BASE) throw new Error('PROXY_BASE not configured in app extras');
  const url = `${PROXY_BASE}/create-order`;
  const resp = await axios.post(url, orderPayload);
  return resp.data;
};