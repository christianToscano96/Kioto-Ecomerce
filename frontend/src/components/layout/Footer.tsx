import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Leaf, Flower, ChevronDown } from '@/components/icons';

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-background w-full mt-12 md:mt-20 border-t border-dashed border-outline-variant/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 font-body text-sm tracking-wide uppercase">
        {/* Brand */}
        <div className="space-y-4">
          <div className="font-serif text-xl italic text-on-surface">KIOTO</div>
          <p className="text-on-surface/60 normal-case leading-relaxed text-xs">
            © 2026 KIOTO.
          </p>
        </div>

        {/* Mobile Accordion Sections */}
        <div className="md:hidden">
          {/* Colección */}
          <div className="border-b border-outline-variant/20">
            <button
              onClick={() => toggleSection('collection')}
              className="w-full flex justify-between items-center py-3 text-on-surface font-bold min-h-[44px]"
            >
              <span>Colección</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform ${openSection === 'collection' ? 'rotate-180' : ''}`}
              />
            </button>
            <div className={`overflow-hidden transition-all ${openSection === 'collection' ? 'max-h-40 pb-4' : 'max-h-0'}`}>
              <div className="flex flex-col gap-3 pl-2">
                <Link to="/best-sellers" className="text-on-surface/60 hover:underline text-sm min-h-[44px] flex items-center">Más Vendidos</Link>
                <Link to="/sustainability" className="text-on-surface/60 hover:underline text-sm min-h-[44px] flex items-center">Sostenibilidad</Link>
              </div>
            </div>
          </div>
          
          {/* Asistencia */}
          <div className="border-b border-outline-variant/20">
            <button
              onClick={() => toggleSection('help')}
              className="w-full flex justify-between items-center py-3 text-on-surface font-bold min-h-[44px]"
            >
              <span>Asistencia</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform ${openSection === 'help' ? 'rotate-180' : ''}`}
              />
            </button>
            <div className={`overflow-hidden transition-all ${openSection === 'help' ? 'max-h-60 pb-4' : 'max-h-0'}`}>
              <div className="flex flex-col gap-3 pl-2">
                <Link to="/shipping" className="text-on-surface/60 hover:underline text-sm min-h-[44px] flex items-center">Envíos</Link>
                <Link to="/returns" className="text-on-surface/60 hover:underline text-sm min-h-[44px] flex items-center">Devoluciones</Link>
                <Link to="/contact" className="text-on-surface/60 hover:underline text-sm min-h-[44px] flex items-center">Contacto</Link>
              </div>
            </div>
          </div>
          
          {/* Journal */}
          <div className="border-b border-outline-variant/20">
            <button
              onClick={() => toggleSection('journal')}
              className="w-full flex justify-between items-center py-3 text-on-surface font-bold min-h-[44px]"
            >
              <span>Journal</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform ${openSection === 'journal' ? 'rotate-180' : ''}`}
              />
            </button>
            <div className={`overflow-hidden transition-all ${openSection === 'journal' ? 'max-h-40 pb-4' : 'max-h-0'}`}>
              <div className="flex flex-col gap-3 pl-2">
                <div className="flex border-b border-outline-variant pb-2">
                  <input
                    className="bg-transparent border-none focus:ring-0 p-0 text-sm w-full normal-case"
                    placeholder="Correo electrónico"
                    type="email"
                    inputMode="email"
                  />
                  <button className="text-primary font-bold text-sm px-2 min-h-[44px]">Unirme</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Links - visible on md+ */}
        <div className="hidden md:flex flex-col gap-4">
          <h4 className="font-bold text-on-surface">Colección</h4>
          <Link to="/best-sellers" className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all">Más Vendidos</Link>
          <Link to="/sustainability" className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all">Sostenibilidad</Link>
        </div>

        <div className="hidden md:flex flex-col gap-4">
          <h4 className="font-bold text-on-surface">Asistencia</h4>
          <Link to="/shipping" className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all">Envíos</Link>
          <Link to="/returns" className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all">Devoluciones</Link>
          <Link to="/contact" className="text-on-surface/60 hover:underline decoration-dotted decoration-primary underline-offset-4 transition-all">Contacto</Link>
        </div>

        <div className="hidden md:flex flex-col gap-6">
          <h4 className="font-bold text-on-surface">Journal</h4>
          <div className="flex border-b border-outline-variant pb-2">
            <input
              className="bg-transparent border-none focus:ring-0 p-0 text-sm w-full normal-case"
              placeholder="Correo electrónico"
              type="email"
              inputMode="email"
            />
            <button className="text-primary font-bold text-sm px-2">Unirme</button>
          </div>
          <div className="flex gap-4">
            <Globe size={20} className="text-primary" aria-label="Sitio web" />
            <Leaf size={20} className="text-primary" aria-label="Sostenibilidad" />
            <Flower size={20} className="text-primary" aria-label="Colección" />
          </div>
        </div>
      </div>
    </footer>
  );
}
