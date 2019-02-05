export interface JWKInterface {
  kty: string;
  e: string;
  n: string;
  d: string;
  p: string;
  q: string;
  dp: string;
  dq: string;
  qi: string;
}

export interface JWKPublicInterface {
  kty: string;
  e: string;
  n: string;
}
