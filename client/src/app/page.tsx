import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-neutral-500 to-neutral-300">
        <h1 className="text-4xl font-bold text-white">
          Exporting India&apos;s Finest to the World
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          From handcrafted elegance to sustainable essentials - delivered
          globally
        </p>
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

      {/*Product Categories*/}
      <div className="flex flex-col items-center justify-center mt-16 mb-8">
        <h2 className="font-serif text-tealHeading font-bold text-[clamp(28px,4vw,44px)] text-[#4c8380] leading-tight mb-6">
          Product Categories
        </h2>
        <div>
          <section className="max-w-7xl px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <Image
                  src="/images/placeholder.png"
                  alt="Leather Products"
                  width={200}
                  height={400}
                />
                <h3 className="font-serif text-lg font-semibold mb-3">
                  Leather Products
                </h3>
                <div>
                  <Link
                    href="/products/leather"
                    className="inline-block px-6 py-3 bg-[#4c8380] rounded-lg bg-tealButton text-white text-lg font-semibold shadow-sm"
                  >
                    Check more
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <Image
                  src="/images/placeholder.png"
                  alt="Copper Products"
                  width={200}
                  height={400}
                />
                <h3 className="font-serif text-lg font-semibold mb-3">
                  Copper Products
                </h3>
                <div>
                  <Link
                    href="/products/leather"
                    className="inline-block px-6 py-3 bg-[#4c8380] rounded-lg bg-tealButton text-white text-lg font-semibold shadow-sm"
                  >
                    Check more
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <Image
                  src="/images/placeholder.png"
                  alt="Products"
                  width={200}
                  height={400}
                />
                <h3 className="font-serif text-lg font-semibold mb-3">
                  Products
                </h3>
                <div>
                  <Link
                    href="/products/leather"
                    className="inline-block px-6 py-3 bg-[#4c8380] rounded-lg bg-tealButton text-white text-lg font-semibold shadow-sm"
                  >
                    Check more
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <Image
                  src="/images/placeholder.png"
                  alt="Products"
                  width={200}
                  height={400}
                />
                <h3 className="font-serif text-lg font-semibold mb-3">
                  Products
                </h3>
                <div>
                  <Link
                    href="/products/leather"
                    className="inline-block px-6 py-3 bg-[#4c8380] rounded-lg bg-tealButton text-white text-lg font-semibold shadow-sm"
                  >
                    Check more
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <Image
                  src="/images/placeholder.png"
                  alt="Products"
                  width={200}
                  height={400}
                />
                <h3 className="font-serif text-lg font-semibold mb-3">
                  Products
                </h3>
                <div>
                  <Link
                    href="/products/leather"
                    className="inline-block px-6 py-3 bg-[#4c8380] rounded-lg bg-tealButton text-white text-lg font-semibold shadow-sm"
                  >
                    Check more
                  </Link>
                </div>
              </div>
            </div>
          </section>x
        </div>
      </div>
    </div>
  );
}
