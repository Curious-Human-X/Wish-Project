// This file holds all the Tailwind classes to keep our components clean

export const boothStyles = {
  container: "min-h-screen bg-stone-900 flex flex-col items-center justify-center py-10 px-4",
  header: "text-4xl text-white font-mono mb-6 tracking-widest",
  
  // Controls Area
  controlsContainer: "flex flex-col items-center gap-6",
  filterContainer: "flex gap-3 flex-wrap justify-center bg-stone-800 p-3 rounded-full",
  filterButton: (isActive) => `px-4 py-2 rounded-full text-sm font-bold transition-all ${
    isActive 
      ? 'bg-pink-600 text-white shadow-lg scale-105' 
      : 'bg-stone-700 text-gray-300 hover:bg-stone-600'
  }`,

  // Camera Area
  cameraWrapper: "relative border-8 border-stone-700 rounded-2xl overflow-hidden shadow-2xl",
  webcam: "w-96 h-96 object-cover",
  flashOverlay: (active) => `absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 ease-out ${active ? 'opacity-100' : 'opacity-0'}`,
  countdownOverlay: "absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm",
  countdownText: "text-9xl text-white font-bold animate-ping drop-shadow-lg",
  startButton: "absolute bottom-6 left-1/2 -translate-x-1/2 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-10 py-4 rounded-full font-bold shadow-xl transition transform hover:scale-105 tracking-wider",

  // Review Area
  reviewContainer: "flex flex-col items-center gap-8 animate-fadeIn",
  stripWrapper: "bg-pink-50 p-6 pb-10 shadow-2xl rotate-1 transform border-4 border-double border-pink-400",
  stripHeader: "text-center font-mono text-2xl text-pink-700 mb-6 tracking-widest font-bold",
  stripImages: "flex flex-col gap-5",
  stripImage: "w-full h-72 object-cover rounded-sm border border-gray-200 shadow-sm",
  stripFooter: "text-center mt-6",
  footerTitle: "font-mono text-lg tracking-widest text-gray-700 uppercase",
  footerDate: "text-sm text-gray-500",

  // Action Buttons
  actionsContainer: "flex flex-col items-center gap-4",
  savingText: "text-pink-400 animate-pulse",
  savedText: "text-green-400 text-xl font-bold animate-bounce",
  buttonGroup: "flex gap-4",
  btnNew: "px-6 py-3 bg-stone-700 text-white rounded-full font-bold hover:bg-stone-600 shadow-lg transition",
  btnDownload: "px-8 py-3 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold hover:opacity-90 shadow-lg transition animate-pulse",
};

// --- UPDATED MEMORY GALLERY STYLES ---
export const memoryStyles = {
  // Main Container
  container: "w-full h-[80vh] flex items-center justify-center p-4 relative",
  
  // The "Slide" Card
  card: "w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] md:h-[500px] transition-all duration-300 relative",
  
  // Left Half: Image Container
  // Changed bg-gray-100 to bg-stone-200 for a nicer frame look
  // Added p-4 to give the image some breathing room (frame effect)
  imageSection: "w-full md:w-3/5 relative h-3/5 md:h-full bg-stone-200 flex items-center justify-center p-2",
  
  // The Image Itself
  // Changed object-cover to object-contain so NO cropping happens
  image: "object-contain w-full h-full drop-shadow-md rounded-lg", 
  
  // Right Half: Text
  contentSection: "w-full md:w-2/5 p-8 flex flex-col justify-center gap-6 bg-white",
  
  // Text Elements
  title: "text-3xl md:text-4xl font-bold text-stone-800 font-serif",
  description: "text-lg text-stone-600 leading-relaxed italic",

  // Navigation Arrows
  navButtonLeft: "absolute left-2 md:left-10 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-3 w-12 h-12 rounded-full shadow-lg transition-all z-20 hover:scale-110 flex items-center justify-center font-bold text-xl cursor-pointer",
  navButtonRight: "absolute right-2 md:right-10 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-3 w-12 h-12 rounded-full shadow-lg transition-all z-20 hover:scale-110 flex items-center justify-center font-bold text-xl cursor-pointer",
};