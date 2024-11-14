"use client";

const VideoSection = () => {
  return (
    <div className="container mx-auto py-16 px-4 flex flex-col items-center">
      <h2 className="text-4xl font-bold text-orange-400 mb-8 text-center">
        Ürünlerimizin Hikayesi
      </h2>
      <p className="text-gray-200 text-lg text-center mb-8 max-w-2xl">
        Çiftliğimizden sofranıza ulaşan ürünlerimizin nasıl üretildiğini görün.
        Kalite ve doğallık için çalışıyoruz.
      </p>
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.youtube.com/embed/NHH11EAkrAI?autoplay=1&mute=1"
          title="YouTube video player"
          width="100%"
          height="100%"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoSection;
