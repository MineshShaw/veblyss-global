import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Vision & Mission', href: '/vision-mission' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAF9F6'}}>
      {/* Navigation Header */}
      <header className="relative">
        <nav className="rounded-xl mx-4 md:mx-12 mt-6 px-4 py-4" style={{backgroundColor: '#368581'}}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="bg-white px-6 py-3 rounded-lg">
                <span className="text-veblyssPrimary font-playfair font-bold text-xl">
                  VeBlyss Global
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-playfair text-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-white font-bold'
                      : 'text-veblyssTextLight hover:text-white font-normal'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-veblyssTextLight p-2">
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 pt-4 border-t border-veblyssTextLight border-opacity-20">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-playfair text-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-white font-bold'
                      : 'text-veblyssTextLight hover:text-white font-normal'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-veblyssPrimary text-veblyssTextLight mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            {/* Company Information */}
            <div className="mb-8 md:mb-0">
              <h3 className="font-playfair font-bold text-2xl mb-4">VeBlyss Global Pvt Ltd</h3>
              <div className="space-y-2 font-opensans">
                <p>Address</p>
                <p>Email</p>
                <p>Phone</p>
                <p>LinkedIn</p>
                <p>Instagram</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-veblyssTextLight border-opacity-20 my-8"></div>

          {/* Domain Details */}
          <div className="text-center md:text-left">
            <p className="font-opensans text-xl">Domain details</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
