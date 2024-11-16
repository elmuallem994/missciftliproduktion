"use client";

const VideoSection = () => {
  return (
    <div className="container mx-auto py-16 px-4 flex flex-col items-center ">
      <h2
        className="glowing-text text-4xl md:text-5xl lg:text-6xl  pb-14  text-gray-100 mb-8 text-center mt-24"
        style={{ fontFamily: "AardvarkCafe, sans-serif" }}
      >
        Miss Çiftlik Hikayesi
      </h2>
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.youtube.com/embed/Kunu7Zjz6zQ?autoplay=1&mute=1&loop=1&playlist=Kunu7Zjz6zQ"
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
