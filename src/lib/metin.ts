/**
 * Görüntüleme metni yardımcıları.
 *
 * Menü PDF'lerindeki kategori adları tümü büyük harf ("MEZE VE ZEYTİNYAĞLILAR").
 * CSS'in `capitalize` özelliği her kelimeyi büyütüyor ve "Meze Ve Zeytinyağlılar"
 * gibi Türkçede yanlış bir başlık üretiyor; bağlaçlar küçük kalmalı.
 *
 * Ayrıca `toLocaleLowerCase('tr-TR')` şart: varsayılan `toLowerCase()` "I"
 * harfini "i" yapıyor, Türkçede doğrusu "ı".
 */

/** Başlıkta küçük kalması gereken kelimeler. */
const KUCUK_KALANLAR = new Set(['ve', 'ile', 'veya', 'ya', 'da', 'de']);

/** "MEZE VE ZEYTİNYAĞLILAR" → "Meze ve Zeytinyağlılar" */
export function baslikYap(metin: string): string {
  const kelimeler = metin.toLocaleLowerCase('tr-TR').split(/\s+/).filter(Boolean);

  return kelimeler
    .map((kelime, sira) => {
      if (sira > 0 && KUCUK_KALANLAR.has(kelime)) return kelime;
      return kelime.charAt(0).toLocaleUpperCase('tr-TR') + kelime.slice(1);
    })
    .join(' ');
}
