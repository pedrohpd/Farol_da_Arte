import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Instagram from '../assets/instagram.png';
import Whatsapp from '../assets/wpp.png';

export default function Footer() {
  return (
    <footer className="bg-[#6B7F5E] border-t-4 border-[#E8B864]">
      {/* Reduzi o py-12 para py-6 para diminuir a altura total */}
      <div className="w-full mx-auto px-6 md:px-12 lg:px-16 py-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="shrink-0">
            <Link to="/" className="flex items-center gap-4">
              {/* Logo aumentada de w-10 para w-16 */}
              <img src={Logo} className="w-16 h-16 brightness-110 object-contain" alt="Logo" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tighter text-[#F7E9D0] leading-none">
                  Farol das Artes
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8B864] font-medium">
                  Ateliê Criativo
                </span>
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-[#E8B864] font-bold uppercase tracking-wider text-[10px] mb-2">
              Entre em contato com o Farol
            </h4>
            
            <div className="flex items-center gap-4 text-sm font-medium">
              <a 
                href="https://www.instagram.com/faroldasartesbylidiadias/"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src={Instagram} 
                  alt="Instagram" 
                  className="w-5 h-5 transition-all group-hover:invert" 
                />
              </a>
              
              <a 
                href="https://wa.me/5519976004388"
              >
                <img 
                  src={Whatsapp} 
                  alt="Whatsapp" 
                  className="w-5 h-5 transition-all group-hover:invert" 
                />
              </a>
            </div>

            <p className="mt-2 text-[10px] uppercase tracking-widest text-[#D9CDB8] font-medium opacity-80">
              Campinas, SP - Brasil
            </p>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-center items-center text-[11px] text-[#3E4A36] font-bold">
          <p>© 2026 Farol das Artes. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}