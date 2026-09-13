# gel-al-web

Gel-Al **müşteri sitesi**. Next.js 16 (App Router) + Tailwind v4 + React 19.

Müşteri konumuna uygun şubeyi seçer, **aynı şubedeki farklı markalardan tek
sepet** kurar, online öder ve siparişini şubeden teslim alır.

## Veritabanı yok

Bu uygulama Postgres'i görmez, Prisma'yı tanımaz. Tüm veriyi
[gelal-api-backend](https://github.com/ataberk388-ux/gelal-api-backend)
üzerinden alır:

```
src/app/page.tsx
   └─ api.subeler('Pendik')            src/lib/api.ts
        └─ @gelal/shared → url.ts      adres burada kurulur
             └─ GET http://localhost:3001/v1/subeler?konum=Pendik
```

Backend'in adresi tek bir ortam değişkenindedir (`NEXT_PUBLIC_API_URL`); kodda
hiçbir yerde `localhost:3001` yazmaz. Canlıya çıkarken değişen tek şey odur.

## Kurulum

```bash
cp .env.example .env.local
pnpm install
pnpm dev              # http://localhost:3000
```

**Önce backend çalışıyor olmalı.** Ayakta değilse site açılır ama menü yerine
"İçerik yüklenemedi" ekranı görünür — bu kasıtlıdır, boş menü göstermek yanlış
bilgi vermek olurdu.

## Klasörler

```
src/
  app/
    page.tsx              ana sayfa: kahraman + şube listesi + nasıl çalışır
    sube/[slug]/page.tsx  şube menüsü
    siparislerim/         sipariş takibi (yapım aşamasında)
    isletme/              işletme girişine yönlendirme
    error.tsx             backend'e ulaşılamadığında görünen ekran
    global-error.tsx      kök düzen çöktüğünde görünen ekran
  components/
    menu-ekrani.tsx       menü + ortak sepet (istemci bileşeni)
    marka.tsx             logo ve marka işaretleri
  lib/
    api.ts                backend bağlantısı — veriye ulaşılan TEK kapı
    sepet.tsx             ortak sepet (localStorage)
    metin.ts              Türkçe metin yardımcıları
```

## Ortak sepet kuralı

Faz 1'in can alıcı kuralı, `src/lib/sepet.tsx` içinde:

- Sepet yalnızca **TEK** şubeye aittir.
- Aynı şubedeki farklı markaların ürünleri birleşir, sepette markaya göre gruplanır.
- Başka şubeden ürün eklenmek istenirse kullanıcıya sorulur; onaylanırsa sepet
  temizlenip yeni şubeyle başlanır.

**Tuzak:** "farklı şube" kontrolü `setState` güncelleyicisinin İÇİNDE yapılamaz.
React güncelleyiciyi senkron çalıştırmadığı için dönüş değeri hep "eklendi"
oluyor; uyarı görünmüyor ve tıklama sessizce kayboluyor. Kontrol olay
işleyicisinde yapılır.

## Bilinen tuzaklar

- **`.env` içine `NODE_ENV` yazma.** Üretim derlemesini development moduna
  düşürür; hata mesajı sebebi hiç göstermez. Ayrıntı `.env.example` içinde.
- Kök düzen backend'den işletme bilgisi okuduğu için `export const dynamic =
  'force-dynamic'` tanımlıdır. Aksi halde statik ön-render derleme anında
  backend ister ve CI kırılır.
- Next 16'da `global-error.tsx` geri çağırımı `reset` değil **`retry`**.
- Hürmet Gıda'nın **özgün logo dosyaları yok**; `src/components/marka.tsx`
  içindeki SVG geçici. Gerçek logolar `public/marka/` altına konulunca o bileşen
  değiştirilecek.

## Bağımlılık: @gelal/shared

Para biçimlendirme, sipariş durumları ve API adresleri
[gelal-shared](https://github.com/ataberk388-ux/gelal-shared) reposundadır.
Sürüm etiketle sabitlenir; `main` kullanılmaz.
