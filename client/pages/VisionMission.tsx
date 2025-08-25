export function VisionMission() {
  const driveValues = [
    'Sustainability',
    'Compliance', 
    'Fair Trade',
    'Reliability',
    'Innovation'
  ];

  const visionLifeSteps = [
    'Curate Artisan-Made Products',
    'Ensure Global Compliance',
    'Enable Private Labeling & Customization',
    'Deliver Worldwide with Reliability'
  ];

  return (
    <div className="bg-veblyssBackground">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-b from-black/60 to-transparent">
            <div className="w-full h-full bg-gray-300"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="font-playfair font-bold text-4xl md:text-6xl lg:text-7xl text-veblyssSecondary mb-6 max-w-6xl">
            Our Vision & Mission
          </h1>
          <p className="font-opensans font-semibold text-xl md:text-2xl lg:text-3xl text-veblyssTextLight mb-12 max-w-4xl">
            Purpose-led. Globally focused. Rooted in Indian heritage
          </p>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="bg-veblyssSecondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Content */}
            <div className="lg:w-1/2 space-y-8">
              <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-veblyssPrimary">
                Our vision
              </h2>
              <p className="font-opensans text-lg text-veblyssTextLight leading-relaxed bg-veblyssPrimary bg-opacity-10 p-6 rounded-xl">
                To be a global leader in exporting Indian-crafted fashion, lifestyle, and essential products—delivering 
                trust and value to every client.
              </p>
            </div>

            {/* Illustration */}
            <div className="lg:w-1/2">
              <div className="w-full h-64 bg-gray-300 rounded-xl flex items-center justify-center">
                <span className="text-veblyssTextLight font-opensans text-lg">illustration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="bg-veblyssSecondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Illustration */}
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="w-full h-96 bg-gray-300 rounded-xl"></div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2 space-y-8 order-1 lg:order-2">
              <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-veblyssPrimary">
                Our mission
              </h2>
              <div className="space-y-4 bg-veblyssPrimary bg-opacity-10 p-6 rounded-xl">
                <p className="font-opensans text-lg text-veblyssTextLight leading-relaxed">
                  To empower Indian artisans and manufacturers by giving them global reach
                </p>
                <p className="font-opensans text-lg text-veblyssTextLight leading-relaxed">
                  To deliver high-quality, sustainable and ethically sourced products from India
                </p>
                <p className="font-opensans text-lg text-veblyssTextLight leading-relaxed">
                  To align every product with international design and compliance standards
                </p>
                <p className="font-opensans text-lg text-veblyssTextLight leading-relaxed">
                  To build long-term value for clients through trust, transparency, and excellence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Drives Us */}
      <section className="bg-veblyssSecondary py-16 relative">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/0ac27a7b365479a91ab00d23f9044cda020cccb7?width=2880"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-veblyssPrimary text-center mb-12">
            What Drives Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {driveValues.map((value, index) => (
              <div key={index} className="bg-veblyssBackground rounded-xl p-12 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <h3 className="font-playfair font-bold text-3xl lg:text-4xl text-veblyssText">
                  {value}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Bring Our Vision to Life */}
      <section className="bg-veblyssSecondary py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-veblyssPrimary text-center mb-16">
            How We Bring Our Vision to Life
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {visionLifeSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-6">
                {/* Illustration */}
                <div className="w-64 h-64 bg-gray-300 rounded-xl"></div>
                
                {/* Text */}
                <h3 className="font-opensans font-normal text-2xl text-veblyssTextLight bg-veblyssPrimary bg-opacity-90 px-8 py-4 rounded-xl max-w-md">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background Image Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/88f61ec1ae3b76c679d6b6a10292107f26c9db5f?width=2880"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-veblyssSecondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="font-playfair text-2xl lg:text-3xl text-veblyssPrimary leading-relaxed">
              <span className="font-bold">
                "We believe India's true strength lies in its craftsmanship, and our goal is to share that 
                strength with the world, sustainably and ethically."
              </span>
              <footer className="mt-8">
                <cite className="font-normal text-xl">– VeBlyss</cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  );
}
