import Link from 'next/link';

export const metadata = { title: 'Sayfa bulunamadı' };

export default function BulunamadiSayfasi() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
      <p className="text-4xl" aria-hidden>
        🧭
      </p>
      <h1 className="mt-5 text-2xl font-semibold text-orman-800">Aradığın sayfa yok</h1>
      <p className="mt-3 leading-relaxed text-orman-600">
        Bağlantı değişmiş veya şube yayından kaldırılmış olabilir. Şube listesinden devam
        edebilirsin.
      </p>
      <Link
        href="/#subeler"
        className="mt-7 rounded-full bg-orman-800 px-6 py-3 text-sm font-medium text-krem-50 transition hover:bg-orman-700"
      >
        Şubelere dön
      </Link>
    </div>
  );
}
