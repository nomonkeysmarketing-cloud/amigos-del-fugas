import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ChangePinForm } from './ChangePinForm';

export const dynamic = 'force-dynamic';

export default async function ChangePinPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const firstTime = !user.pin_changed;

  return (
    <section className="mx-auto max-w-md px-6 py-16 md:py-24">
      <p className="eyebrow">{firstTime ? 'Primera vez · Bienvenido' : 'Cambiar PIN'}</p>
      <h1 className="display mt-4 text-[clamp(48px,7vw,84px)] leading-[0.92]">
        Crea tu<br />
        <span className="text-[var(--color-primary)]">PIN</span> personal<span className="text-[var(--color-primary)]">.</span>
      </h1>
      <p className="mt-5 text-[var(--color-secondary-text)]">
        {firstTime ? (
          <>
            Ya entraste, <strong className="text-[var(--color-text)]">{user.name}</strong>. Antes de
            empezar a jugar, escoge un PIN de 4 dígitos que solo tú sepas. Lo vas a usar cada vez
            que vuelvas a entrar.
          </>
        ) : (
          <>
            Cambia tu PIN actual por uno nuevo de 4 dígitos.
          </>
        )}
      </p>
      <div className="mt-10">
        <ChangePinForm />
      </div>
    </section>
  );
}
