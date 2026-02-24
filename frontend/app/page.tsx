import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const featuredCategories = [
    { id: 1, name: 'Clothing', slug: 'clothing', image: '/images/violet.jpeg' },
    { id: 2, name: 'Scarfs', slug: 'scarfs', image: '/images/burgundy.jpeg' },
    { id: 3, name: 'Accessories', slug: 'accessories', image: '/images/bleu1.jpeg' },
  ];

  const featuredProducts = [
   { id: 1, name: 'Zebra Scarf', price: 40, image: '/images/zebra1.jpeg' },
    { id: 2, name: 'Red Scarf', price: 40, image: '/images/red2.jpeg' },
    { id: 3, name: 'White Scarf', price: 40, image: '/images/white.jpeg' },
    { id: 4, name: 'marrose Scarf', price: 40, image: '/images/marrose.jpeg' },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to JASS
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted Shopping platform for quality products
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/About"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our wide selection of products across different categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square bg-gray-200">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our latest and most popular products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-square bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="p-6">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    TND{product.price.toFixed(2)}
                  </p>

                  <button className="w-full py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-700transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-lg shadow-md">
              <div className="text-blue-600 text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Shipping Throughout Tunisia</p>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-md">
              <div className="text-green-600 text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600">echange policy</p>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-md">
              <div className="text-yellow-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Multiple payment options</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}