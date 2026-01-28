import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RecentTools from '../components/recentTools'
describe('Composant RecentTools (Tableau)', () => {
  
  // Test 1 : Affichage basique
  it('affiche le tableau avec les en-têtes corrects', () => {
    render(<RecentTools />)
    
    // On vérifie le titre du composant
    expect(screen.getByText('Recent Tools')).toBeInTheDocument()
    
    // On vérifie que les colonnes clés sont là
    expect(screen.getByText('Tool')).toBeInTheDocument()
    expect(screen.getByText('Monthly Cost')).toBeInTheDocument()
  })

  // Test 2 : Interaction de Tri
  it('permet de cliquer sur l\'en-tête Coût pour trier', () => {
    render(<RecentTools />)
    
    // On cherche l'élément cliquable via l'ID de test
    const costHeader = screen.getByTestId('sort-monthly_cost')
    
    expect(costHeader).toBeInTheDocument()

    // On simule un clic
    fireEvent.click(costHeader)
    
  })

  // Test 3 : Pagination
  it('affiche les boutons de navigation (Précédent/Suivant)', () => {
    render(<RecentTools />)
    
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.includes('Page')
    })).toBeInTheDocument()

    // Vérifie que le chiffre "1" est bien visible 
    expect(screen.getByText('1')).toBeInTheDocument()
    
    // On vérifie que le bouton Suivant existe via l'ID
    const nextButton = screen.getByTestId('next-page')
    expect(nextButton).toBeInTheDocument()
  })
})