export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        <div>
          <h4 className="font-semibold mb-4 text-gray-900">Contato</h4>
          <ul className="text-gray-500 text-sm space-y-2">
            <li>+55 (00) 99999-9999</li>
            <li>[EMAIL_ADDRESS]</li>
            <li><a href="https://www.instagram.com/lidia.dias.940?igsh=bjYzczQ4Nm0yaXNp" className="hover:underline">@lidia.dias.940</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mt-12">
        &copy; 2026 Farol da Arte.
      </div>
    </footer>
  );
}