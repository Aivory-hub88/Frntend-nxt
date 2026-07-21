import Link from 'next/link';

export default function BastionFooter() {
  return (
    <footer className="bg-[#050505] border-t border-[#1F1F1F] text-[#B3B3B3] py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm font-light flex items-center gap-2">
          <span className="font-medium text-white">Aivory Bastion</span> 
          <span className="text-[#B3B3B3]/50">by</span> 
          <Link href="/" className="hover:text-white transition-colors">Aivory</Link>
        </div>
        
        <div className="text-sm font-light">
          Autonomous Infrastructure Defense.
        </div>
      </div>
    </footer>
  );
}
