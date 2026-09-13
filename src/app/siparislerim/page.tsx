export const dynamic = 'force-dynamic';

export const metadata = { title: 'Siparişlerim' };

export default function SiparislerimSayfasi() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-orman-800">Siparişlerim</h1>
      <p className="mt-3 text-orman-600">
        Sipariş takibi, sipariş ve ödeme akışı bağlandığında burada olacak.
      </p>
    </div>
  );
}
