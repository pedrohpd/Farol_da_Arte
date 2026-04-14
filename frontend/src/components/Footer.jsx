import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Instagram from '../assets/instagram.png';

export default function Footer() {
  return (
    <footer className="bg-[#6B7F5E] text-[#F7E9D0] border-t-4 border-[#E8B864]">
      <div className="w-full mx-auto px-6 md:px-12 lg:px-16 py-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          <div className="shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <img src={Logo} className="w-10 h-10 brightness-110" alt="Logo" />
              <span className="text-xl font-bold tracking-tighter">
                Farol das Artes
              </span>
            </Link>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <h4 className="text-[#E8B864] font-bold uppercase tracking-wider text-[10px] mb-4">
              Acompanhe o Farol
            </h4>
            
            <div className="flex items-center gap-4 text-sm font-medium">
              <a 
                href="https://instagram.com"
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-all group"
              >
                <img 
                  src={Instagram} 
                  alt="Instagram" 
                  className="w-5 h-5 transition-all group-hover:brightness-0" 
                />
              </a>
              
              <a 
                href="https://wa.me/5519976004388" 
                className="hover:text-[#E8B864] transition-colors"
              >
                +55 (19) 97600-4388
              </a>
            </div>

            <p className="mt-4 text-[10px] font-bold tracking-wide uppercase">
              Campinas, SP - Brasil
            </p>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex justify-center items-center text-[10px] uppercase tracking-widest font-bold">
          <p>© 2026 Farol das Artes. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}