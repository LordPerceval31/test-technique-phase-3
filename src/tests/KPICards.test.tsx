import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Wrench } from 'lucide-react'
import KPICard from '../components/KPICard'

describe('Composant KPICard', () => {
  
  // Test 1 : Affichage des textes
  it('affiche correctement le titre et la valeur', () => {
    render(
      <KPICard 
        title="Active Tools" 
        value="147" 
        trend="+8" 
        icon={Wrench} 
        color="blue" 
      />
    )

    expect(screen.getByText('Active Tools')).toBeInTheDocument()
    expect(screen.getByText('147')).toBeInTheDocument()
  })

  // Test 2 : La barre de progression
  it('affiche la barre de progression quand la prop est fournie', () => {
    render(
      <KPICard 
        title="Budget" 
        value="€30k" 
        trend="+12%" 
        icon={Wrench} 
        color="green" 
        progress={50}
      />
    )

    const progressBar = screen.getByTestId('progress-bar')
    
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ width: '50%' })
  })

  // Test 3 : Absence de barre
  it('n\'affiche pas la barre de progression quand la prop est manquante', () => {
    render(
      <KPICard 
        title="No Progress" 
        value="0" 
        trend="0" 
        icon={Wrench} 
        color="blue" 
      />
    )

    // On vérifie qu'on ne trouve PAS l'ID
    const progressBar = screen.queryByTestId('progress-bar')
    expect(progressBar).not.toBeInTheDocument()
  })
})