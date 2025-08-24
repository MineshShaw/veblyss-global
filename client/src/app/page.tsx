import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/*Hero Section*/}
        <Image
          src="/images/placeholder.png"
          alt="VeBlyss Global Logo"
          className="z-0 w-full h-full"
          width={800}
          height={800}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
            Exporting India&apos;s Finest to the World
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            From handcrafted elegance to sustainable essentials – delivered
            globally
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block px-6 py-3 rounded-lg bg-[#4c8380] text-white text-lg font-semibold shadow-md hover:bg-[#3a6663]"
          >
            Explore Products
          </Link>
        </div>
      </div>

      {/*Welcome*/}
      <div className="flex flex-col sm:flex-row p-1 items-center align-middle justify-center mt-8">
        <div className="w-[50%] flex align-middle justify-center">
          <Image
            src="/images/placeholder.png"
            alt="Description of image"
            width={500}
            height={300}
          />
        </div>
        <section className="w-[50%] px-6 py-16">
          <h1 className="font-serif text-tealHeading font-bold text-[clamp(28px,4vw,44px)] text-[#4c8380] leading-tight mb-6">
            Welcome to VeBlyss Global
          </h1>

          <p className="text-[clamp(15px,2.2vw,18px)] mb-9 max-w-prose">
            Based in Bengaluru, VeBlyss Global specializes in ethically sourced,
            premium Indian exports including imitation jewelry, copper-ware,
            leather goods, and sustainable products for global markets…
          </p>

          <div>
            <Link
              href="/about"
              className="inline-block px-6 py-3 bg-[#4c8380] rounded-lg bg-tealButton text-white text-lg font-semibold shadow-sm"
            >
              Read more
            </Link>
          </div>
        </section>
      </div>

      {/* Product Categories */}
      <div className="flex flex-col relative items-center justify-center mt-16 mb-8 p-8">
        <div className="absolute inset-0 z-0 bg-[url('/images/placeholder.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-red-500/20" />
        <div className="absolute inset-0 bg-white/60" />

        <h2 className="font-serif text-tealHeading font-bold text-[clamp(28px,4vw,44px)] text-[#4c8380] z-1 leading-tight mb-6">
          Product Categories
        </h2>
        <section className="min-h-fit px-6 gap-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Card */}
            {[
              { title: "Leather Products", link: "/products/leather" },
              { title: "Copper Products", link: "/products/copper" },
              { title: "Products", link: "/products/other1" },
              { title: "Products", link: "/products/other2" },
              { title: "Products", link: "/products/other3" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow flex flex-col items-center w-60 h-80 p-3 overflow-hidden z-1"
              >
                {/* Fixed height image with crop */}
                <div className="w-full h-80">
                  <Image
                    src="/images/placeholder.png"
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-bold mt-3 mb-2 text-center">
                  {item.title}
                </h3>

                {/* Button */}
                <Link
                  href={item.link}
                  className="mb-4 inline-block px-5 py-2 bg-[#4c8380] text-white rounded-full text-sm font-semibold shadow-sm"
                >
                  Check More
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* What Makes Us Different */}
      <div className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-[#4c8380] mb-8">
          What Makes Us Different
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-serif text-lg font-semibold mb-2">
              End-to-End Export Support
            </h3>
            <p className="text-gray-600">
              From documentation to doorstep delivery
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-serif text-lg font-semibold mb-2">
              Certified &amp; Compliant
            </h3>
            <p className="text-gray-600">
              REACH, RoHS, CE, FSSAI, BIS (where applicable)
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-serif text-lg font-semibold mb-2">
              Custom Design &amp; Private Label
            </h3>
            <p className="text-gray-600">
              Tailored for global retailers and brands
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-serif text-lg font-semibold mb-2">
              Ethical &amp; Sustainable Sourcing
            </h3>
            <p className="text-gray-600">
              Supporting artisans and eco-friendly practices
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-serif text-lg font-semibold mb-2">
              Eco-Friendly Packaging
            </h3>
            <p className="text-gray-600">
              Prioritising sustainability at every step
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-serif text-lg font-semibold mb-2">
              Timely Delivery &amp; Quality Assurance
            </h3>
            <p className="text-gray-600">
              Trusted across EU, US, Middle East, and Africa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
