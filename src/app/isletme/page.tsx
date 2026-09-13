export const dynamic = 'force-dynamic';

export const metadata = { title: 'İşletme Girişi' };

export default function IsletmeGirisSayfasi() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-orman-800">İşletme Girişi</h1>
      <p className="mt-3 text-orman-600">
        Canlı sipariş ekranı ve ticari dashboard, yetkilendirme bağlandığında burada olacak.
      </p>
    </div>
  );
}
