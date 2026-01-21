'use client';
import { useRouter } from 'next/navigation';
import CakeScene from '../components/Cake';
export default function Home() {
  const router = useRouter();
  return (
    <main className="h-screen w-full flex flex-col md:flex-row bg-pink-50 overflow-hidden">
      <div className="w-full md:w-1/3 flex items-center justify-center p-10 z-20">
        <div className="text-center md:text-left"><h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4">Happy Birthday, <span className="text-purple-600">Khushi!</span></h1><p className="text-gray-500 text-lg"> </p></div>
      </div>
      <div className="w-full md:w-2/3 h-full bg-blue-50 relative"><CakeScene onOpenGift={() => router.push('/gift')} /></div>
    </main>
  );
}