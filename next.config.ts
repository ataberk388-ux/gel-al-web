import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // Not: Prisma artık burada yok. Müşteri sitesi veritabanını tanımıyor,
  // tüm veriyi `gelal-api` üzerinden alıyor.
};

export default config;
