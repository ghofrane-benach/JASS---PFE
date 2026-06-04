// frontend/__tests__/Header.test.tsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import Header from '@/component/Header'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter:   () => ({ push: jest.fn() }),
}))

jest.mock('@/component/AuthProvider', () => ({
  useAuth: jest.fn(() => ({
    user:       null,
    isLoggedIn: false,
    logout:     jest.fn(),
  })),
}))

jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    items:      [],
    totalQty:   0,
    isOpen:     false,
    setIsOpen:  jest.fn(),
    removeItem: jest.fn(),
    updateQty:  jest.fn(),
  }),
}))

global.fetch = jest.fn().mockResolvedValue({
  ok:   true,
  json: () => Promise.resolve([
    { id: 'clothing',    name: 'Clothing',    slug: 'clothing'    },
    { id: 'scarfs',      name: 'Scarfs',      slug: 'scarfs'      },
    { id: 'accessories', name: 'Accessories', slug: 'accessories' },
  ]),
}) as jest.Mock

describe('Header', () => {

  beforeEach(() => {
    jest.clearAllMocks()
    const { useAuth } = require('@/component/AuthProvider')
    useAuth.mockReturnValue({
      user: null, isLoggedIn: false, logout: jest.fn(),
    })
  })

  it('should render JASS logo', async () => {
    await act(async () => { render(<Header />) })
    expect(screen.getAllByText('JASS').length).toBeGreaterThan(0)
  })

  it('should render navigation links', async () => {
    await act(async () => { render(<Header />) })
    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('JASS Collection')).toBeInTheDocument()
    expect(screen.getByText('Notre Histoire')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('should render search button', async () => {
    await act(async () => { render(<Header />) })
    expect(screen.getByLabelText('Rechercher')).toBeInTheDocument()
  })

  it('should open search on click', async () => {
    await act(async () => { render(<Header />) })
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Rechercher'))
    })
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/looking for/i)).toBeInTheDocument()
    })
  })

  it('should render categories dropdown button', async () => {
    await act(async () => { render(<Header />) })
    expect(screen.getByText(/catégories/i)).toBeInTheDocument()
  })

  it('should render cart button', async () => {
    await act(async () => { render(<Header />) })
    expect(screen.getByLabelText('Mon compte')).toBeInTheDocument()
  })

  it('should show user name when logged in', async () => {
    const { useAuth } = require('@/component/AuthProvider')
    useAuth.mockReturnValue({
      user:       { name: 'Yassmine Ben Achour', email: 'test@jass.tn' },
      isLoggedIn: true,
      logout:     jest.fn(),
    })

    await act(async () => { render(<Header />) })
    expect(screen.getByText('Yassmine')).toBeInTheDocument()
  })
})