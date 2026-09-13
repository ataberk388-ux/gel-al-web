import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { MenuEkrani } from '@/components/menu-ekrani';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sube = await api.sube(slug);
  return { title: sube ? sube.name : 'Şube bulunamadı' };
}

export default async function SubeSayfasi({ params }: Props) {
  const { slug } = await params;
  const sube = await api.sube(slug);
  if (!sube) notFound();

  return <MenuEkrani sube={sube} />;
}
