import { Link } from 'react-router-dom';

export function Index() {
  const productCategories = [
    { name: 'Leather Products', href: '/products/leather' },
    { name: 'Copper Products', href: '/products/copper' },
    { name: 'Imitation Jewelry', href: '/products/imitation-jewelry' },
    { name: 'Indian Handicrafts', href: '/products/handicrafts' },
    { name: 'Sustainable Products', href: '/products/sustainable' },
  ];

  const features = [
    {
      title: 'End-to-End Export Support',
      description: 'From documentation to doorstep delivery'
    },
    {
      title: 'Certified & Compliant',
      description: 'REACH, RoHS, CE, FSSAI, BIS (where applicable)'
    },
    {
      title: 'Custom Design & Private Label',
      description: 'Tailored for global retailers and brands'
    },
    {
      title: 'Ethical & Sustainable Sourcing',
      description: 'Supporting artisans and eco-friendly practices'
    },
    {
      title: 'Eco-Friendly Packaging',
      description: 'Prioritising sustainability at every step'
    },
    {
      title: 'Timely Delivery & Quality Assurance',
      description: 'Trusted across EU, US, Middle East, and Africa'
    },
  ];

  const markets = [
    'European Union',
    'United States',
    'Middle East',
    'Africa',
    'Asia Pacific'
  ];

  return (
    <div className="bg-veblyssBackground">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-b from-black/60 to-transparent">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a4b970cdace307a2cd9e9f308236be4b7b5ff2ad?width=2880"
              alt="Premium Indian Export Products"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="font-playfair font-bold text-4xl md:text-6xl lg:text-7xl text-veblyssSecondary mb-6 max-w-6xl">
            Exporting India's Finest to the World
          </h1>
          <p className="font-opensans font-semibold text-xl md:text-2xl lg:text-3xl text-veblyssTextLight mb-12 max-w-4xl">
            From handcrafted elegance to sustainable essentials – delivered globally
          </p>
          <Link
            to="/products"
            className="bg-veblyssPrimary text-veblyssTextLight font-opensans font-bold text-xl md:text-2xl px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 shadow-lg"
          >
            Explore Products
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-veblyssSecondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image */}
            <div className="lg:w-1/2">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/50b824c1cf90adbf20b1e9a85b35e6859cde5b6f?width=1442"
                alt="VeBlyss Global Products"
                className="w-full h-96 object-cover rounded-r-3xl"
              />
            </div>

            {/* Content */}
            <div className="lg:w-1/2 space-y-8">
              <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-veblyssPrimary">
                Welcome to VeBlyss Global
              </h2>
              <p className="font-opensans text-lg text-veblyssText leading-relaxed">
                Based in Bengaluru, VeBlyss Global specializes in ethically sourced, premium Indian exports including 
                imitation jewelry, copper-ware, leather goods, and sustainable products for global markets...
              </p>
              <Link
                to="/about"
                className="inline-block bg-veblyssPrimary text-veblyssTextLight font-opensans font-bold text-xl px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="bg-veblyssSecondary py-16 relative">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/3f655568e5b4bffa2cacfa4c48c571adc084d811?width=2880"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-veblyssPrimary text-center mb-12">
            Product Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {productCategories.map((category, index) => (
              <div key={category.name} className="bg-veblyssBackground rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="h-56 bg-gray-300 relative overflow-hidden">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/cd01491fbb036e83d0eae88f5cff9cdbac281ec8?width=388"
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-playfair font-semibold text-xl text-veblyssText mb-4">
                    {category.name}
                  </h3>
                  <Link
                    to={category.href}
                    className="inline-block bg-veblyssPrimary text-veblyssTextLight font-opensans font-bold text-sm px-4 py-2 rounded-xl hover:bg-opacity-90 transition-all duration-300"
                  >
                    Check More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-veblyssSecondary py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-veblyssPrimary text-center mb-12">
            What Makes Us Different
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-veblyssBackground rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="font-playfair font-bold text-xl text-veblyssText text-center mb-4">
                  {feature.title}
                </h3>
                <p className="font-opensans text-veblyssText text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets We Serve */}
      <section className="bg-veblyssSecondary py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-veblyssPrimary text-center mb-12">
            Markets We Serve
          </h2>

          <div className="flex overflow-x-auto space-x-8 pb-4">
            {markets.map((market, index) => (
              <div key={market} className="flex-shrink-0 w-72 text-center">
                <div className="h-28 bg-gray-300 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={index % 2 === 0 
                      ? "https://api.builder.io/api/v1/image/assets/TEMP/5bd98620bf0a51915f69da3e5dcaef76593599a9?width=576"
                      : "https://api.builder.io/api/v1/image/assets/TEMP/196fe813a9d622fb79ada3987e37ff5734ed983c?width=576"
                    }
                    alt={market}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-playfair font-bold text-xl text-veblyssText">
                  {market}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="bg-veblyssSecondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Content */}
            <div className="lg:w-1/2 space-y-8">
              <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-veblyssPrimary">
                Let's Build a Global Partnership
              </h2>
              <p className="font-opensans text-lg text-veblyssText leading-relaxed">
                Reach out today to explore our curated collections and export services tailored for your market.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-veblyssPrimary text-veblyssTextLight font-opensans font-bold text-xl px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300"
              >
                Contact Us Now
              </Link>
            </div>

            {/* Image */}
            <div className="lg:w-1/2">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/662e930b131ad97aa5ae647780816e34303eeb2d?width=1442"
                alt="Global Partnership"
                className="w-full h-96 object-cover rounded-l-3xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
