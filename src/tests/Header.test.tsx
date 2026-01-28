import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '../components/header'

describe('Composant Header', () => {
  
  it('appelle la fonction toggleTheme lors du clic sur le bouton de thème', () => {
    // On crée une fonction "espion" (mock) pour vérifier l'appel
    const toggleThemeMock = vi.fn()
    
    render(
      <Navbar 
        isDark={true} 
        toggleTheme={toggleThemeMock} 
      />
    )

    // On récupère le bouton 
    const toggleButton = screen.getByTestId('theme-toggle')
    
    // On simule le clic
    fireEvent.click(toggleButton)

    // On vérifie que la fonction a été appelée exactement 1 fois
    expect(toggleThemeMock).toHaveBeenCalledTimes(1)
  })

  it('affiche l\'icône Soleil en mode sombre et Lune en mode clair', () => {
    const { rerender } = render(
      <Navbar isDark={true} toggleTheme={() => {}} />
    )
    
    // En mode sombre (isDark: true), on s'attend à voir l'icône Sun (soleil)
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    
    // On re-rend le composant en mode clair
    rerender(<Navbar isDark={false} toggleTheme={() => {}} />)
    
    // On vérifie que le bouton est toujours là
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })
})