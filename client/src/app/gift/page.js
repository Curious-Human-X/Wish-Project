'use client';
import { useRouter } from 'next/navigation';
import MemoryPath from '../../components/MemoryPath';
export default function GiftPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen w-full bg-stone-100 pb-20">
      <MemoryPath />
      <div className="flex flex-col items-center justify-center gap-6 mt-10">
        <p className="text-2xl text-stone-500 font-light text-center px-4">We have made so many memories together...</p>
        <button onClick={() => router.push('/booth')} className="bg-stone-800 hover:bg-stone-700 text-white text-xl font-bold py-4 px-10 rounded-full shadow-2xl transform transition hover:scale-105">Let&apos;s Make a New One 📸</button>
      </div>
    </main>
  );
}