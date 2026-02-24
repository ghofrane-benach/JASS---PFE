import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', href: '/app/products' },
        { name: 'Categories', href: '/app/categories' },
        { name: 'New Arrivals', href: '/app/products?sort=newest' },
        { name: 'Best Sellers', href: '/app/products?sort=bestsellers' },
      
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms & Conditions', href: '/terms' },
      ],
    },
    {
      title: 'Account',
      links: [
        { name: 'My Account', href: '/account' },
        { name: 'Order History', href: '/orders' },
        { name: 'Login / Register', href: '/app/login' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
      ],
    },
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'PayPal', icon: '💳' },
  ];

  return (
    <footer className="bg-black text-gray-300">
      {/* Main Footer Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-light">JASS</span>
            </div>
            <p className="text-gray-400">
              Your trusted online shopping destination for quality products at great prices.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1DsBrL4nmY/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/jasscarvi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="  
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Dynamic Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-white font-semibold text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Subscribe to our newsletter</h4>
              <p className="text-gray-400 text-sm">
                Get the latest updates on new products and special offers
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Payment Methods & Copyright */}
            <div className="space-y-4">
              <div>
                <h4 className="text-2xl font-serif font-light">Payment Methods</h4>
                <div className="flex flex-wrap gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.name}
                      className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg"
                    >
                      <span className="text-xl">{method.icon}</span>
                      <span className="text-sm text-gray-300">{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  &copy; {currentYear} JASS. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure Shopping</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}