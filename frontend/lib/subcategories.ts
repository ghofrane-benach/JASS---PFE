// frontend/src/lib/subcategories.ts

export const SUBCATEGORIES: Record<string, { label: string; slug: string }[]> = {
  clothing: [
    { label: 'Coats',     slug: 'coats'     },
    { label: 'Sets',      slug: 'sets'      },
    { label: 'chemises',    slug: 'chemises'    },
    { label: 'Pantalons', slug: 'pantalons' },
  ],
  accessories: [
    { label: 'Colliers',          slug: 'colliers'          },
    { label: 'Bracelets',         slug: 'bracelets'         },
    { label: "Boucles d'oreilles", slug: 'boucles-doreilles' },
  ],
  scarfs: [], // pas de sous-catégories
};