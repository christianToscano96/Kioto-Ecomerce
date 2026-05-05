import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-background w-full mt-20 border-t border-dashed border-outline-variant/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 font-body text-sm tracking-wide uppercase">
        <div className="space-y-6">
          <div className="font-serif text-xl italic text-on-surface">KIOTO</div>
          <p className="text-on-surface/60 normal-case leading-relaxed">
            © 2024 KIOTO. Curando para los Terrenales. Hecho con intención y respeto por el mundo natural.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-on-surface">Colección</h4>
          <Link
            to="/new"
            className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all"
          >
            Nuevas Llegadas
          </Link>
          <Link
            to="/best-sellers"
            className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all"
          >
            Más Vendidos
          </Link>
          <Link
            to="/sustainability"
            className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all"
          >
            Sostenibilidad
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-on-surface">Asistencia</h4>
          <Link
            to="/shipping"
            className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all"
          >
            Envíos
          </Link>
          <Link
            to="/returns"
            className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all"
          >
            Devoluciones
          </Link>
          <Link
            to="/contact"
            className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all"
          >
            Contacto
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="font-bold text-on-surface">Journal</h4>
          <div className="flex border-b border-outline-variant pb-2">
            <input
              className="bg-transparent border-none focus:ring-0 p-0 text-xs w-full normal-case"
              placeholder="Correo electrónico"
              type="email"
            />
            <button className="text-primary font-bold">Unirme</button>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary text-lg">public</span>
            <span className="material-symbols-outlined text-primary text-lg">eco</span>
            <span className="material-symbols-outlined text-primary text-lg">filter_vintage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}