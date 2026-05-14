import { redirect } from 'next/navigation';
import { listUsers } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const current = await getCurrentUser();
  if (current) redirect('/partidos');
  const players = await listUsers();
  return (
    <section className="mx-auto max-w-md px-6 py-20 md:py-28">
      <p className="eyebrow">Entrar a la quiniela</p>
      <h1 className="display mt-4 text-[clamp(48px,7vw,84px)] leading-[0.92]">
        Escoge tu<br /><span className="text-[var(--color-primary)]">apodo</span>.
      </h1>
      <p className="mt-5 text-[var(--color-secondary-text)]">
        Selecciona tu nombre y mete tu PIN de 4 dígitos. Si no sabes tu PIN, pídeselo a quien armó la quiniela.
      </p>
      <div className="mt-10">
        <LoginForm players={players.map((p) => p.name)} />
      </div>
    </section>
  );
}
