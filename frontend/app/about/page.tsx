// apps/frontend/app/about/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">
            Notre Histoire
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Depuis 2025, JASS Scarvi, a Tunisian brand combines elegance and authenticity through refined scarves.🧣✨
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-light mb-6">
                 , Une Histoire d'Amour
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Fondée en 2025 à Tunis par Ghofrane Ben Achour, notre maison a commencé comme un petit atelier familial 
                dans le quartier historique de La Marsa. Ce n'était pas seulement une entreprise, mais une mission : 
                préserver et valoriser le savoir-faire textile tunisien face à la mondialisation.
              </p>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Aujourd'hui, JASS emploie plus de 200 artisans à travers la Tunisie, chacun formé aux techniques 
                ancestrales de tissage, broderie et confection. Nous travaillons avec des matières nobles : 
                coton égyptien, lin français, soie naturelle, et des teintures végétales traditionnelles.
              </p>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Notre philosophie est simple : chaque pièce doit raconter une histoire, porter l'âme de son créateur, 
                et faire honneur à l'héritage culturel tunisien.
              </p>
              
              <Link
                href="/contact"
                className="inline-flex items-center text-black font-serif hover:text-nude-500"
              >
                Contactez-nous pour en savoir plus →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gray-200">
                <Image
                  src="/images/ghofrane.jpeg"
                  alt="Fatma Jass - Fondatrice"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-200">
                <Image
                  src="/images/accessoires/collierfleur.jpeg"
                  alt="Atelier de broderie"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-200">
                <Image
                  src="/images/scarfs/grey.jpeg"
                  alt="Tissage traditionnel"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-200">
                <Image
                  src="/images/scarfs/jaune2.jpeg"
                  alt="Détail broderie"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light mb-4">
              Nos Valeurs
            </h2>
            <p className="text-gray-600">
              Ce qui nous guide dans chaque décision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white border border-gray-200">
              <div className="text-6xl font-serif mb-6">01</div>
              <h3 className="text-xl font-serif mb-4">Savoir-Faire Ancestral</h3>
              <p className="text-gray-600">
                Chaque pièce est confectionnée à la main par nos artisans, transmettant des techniques séculaires
              </p>
            </div>
            
            <div className="text-center p-8 bg-white border border-gray-200">
              <div className="text-6xl font-serif mb-6">02</div>
              <h3 className="text-xl font-serif mb-4">Matières Nobles</h3>
              <p className="text-gray-600">
                Cachemire égyptien, Bouclette français,  - nous sélectionnons les meilleurs matériaux
              </p>
            </div>
            
            <div className="text-center p-8 bg-white border border-gray-200">
              <div className="text-6xl font-serif mb-6">03</div>
              <h3 className="text-xl font-serif mb-4">Éthique & Durable</h3>
              <p className="text-gray-600">
                Production locale, commerce équitable, emballages écologiques, zéro gaspillage
              </p>
            </div>
          </div>
        </div>
      </section>

            <div className="text-center">
              <div className="aspect-square w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6">
                <Image
                  src="/images/scarfs/marrose.jpeg"
                  alt="Jass Scarf"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-serif mb-2">Ben Achour Ghofrane</h3>
              <p className="text-gray-600 mb-4">Fondatrice & Directrice Artistique</p>
              <p className="text-gray-600 text-sm">
                Diplômée de l'École des Beaux-Arts de Tunis, elle allie tradition et modernité
              </p>
            </div>
             

      {/* Timeline */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light mb-4">
              Notre Chronologie
            </h2>
            <p className="text-gray-300">
              Un voyage de 40 ans dans l'excellence textile
            </p>
          </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-700"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              <div className="flex items-start">
                <div className="w-16 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-nude-500 flex items-center justify-center">
                    <span className="text-black font-serif text-sm">2025</span>
                  </div>
                </div>
               
              <div className="flex items-start">
                <div className="w-16 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-nude-500 flex items-center justify-center">
                    <span className="text-black font-serif text-sm">2025</span>
                  </div>
                </div>
                <div className="ml-8 flex-1">
                  <h3 className="text-xl font-serif mb-2">Numérisation</h3>
                  <p className="text-gray-300">
                    Lancement du site web et de la boutique en ligne
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-16 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-nude-500 flex items-center justify-center">
                    <span className="text-black font-serif text-sm">2025</span>
                  </div>
                </div>
                <div className="ml-8 flex-1">
                  <h3 className="text-xl font-serif mb-2">Nouvelle Génération</h3>
                  <p className="text-gray-300">
                    Transmission du savoir-faire à la 3ème génération d'artisans
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-light mb-6">
            Envie de découvrir notre univers ?
          </h2>
          <p className="text-gray-600 mb-8">
            Contactez-nous pour une expérience personnalisée ou pour visiter notre atelier à Tunis
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-black text-white font-serif hover:bg-gray-800 transition-colors"
            >
              Prendre rendez-vous
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 border border-black font-serif hover:bg-black hover:text-white transition-colors"
            >
              Découvrir la collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}