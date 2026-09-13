/**
 * Backend bağlantısı.
 *
 * Müşteri sitesinin veriye ulaştığı TEK kapı burasıdır. Sayfalar ve bileşenler
 * `fetch` çağırmaz, adres kurmaz, hata gövdesi çözmez — hepsi istemcinin içinde.
 *
 * Taban adres ortam değişkeninden gelir; kodda hiçbir yerde `localhost:3001`
 * yazmaz. Canlıya çıkarken değişen tek şey bu değerdir.
 */

import { ApiError, createApiClient } from '@gelal/shared';

const TABAN_ADRES = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const api = createApiClient({ baseUrl: TABAN_ADRES });

/**
 * Sayfanın çizilmesi için kritik OLMAYAN veriler bununla çekilir.
 *
 * Örnek: alt bilgideki sosyal medya bağlantıları. API'ye ulaşılamadığında
 * bütün siteyi hata sayfasına düşürmek yerine o bölüm boş kalır. Menü ve
 * fiyat gibi kritik veriler bununla ÇEKİLMEZ — orada sessizce boş göstermek,
 * yanlış bilgi göstermek demektir.
 */
export async function sessizce<T>(is: () => Promise<T>): Promise<T | null> {
  try {
    return await is();
  } catch (hata) {
    if (hata instanceof ApiError) {
      console.warn(`[api] ${hata.code}: ${hata.message}`);
      return null;
    }
    throw hata;
  }
}

export { ApiError };
