import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToolCard from '../components/toolCard';
import type { Tool } from '../utils/interfaces';

// définition d'un outil de test avec une icône valide pour éviter les erreurs de chargement d'image
const mockTool: Tool = {
  id: 1,
  name: 'Slack',
  description: 'communication d\'équipe',
  vendor: 'Slack Technologies',
  category: 'Communication',
  monthly_cost: 150,
  previous_month_cost: 150,
  owner_department: 'Marketing',
  status: 'active',
  website_url: 'https://slack.com',
  active_users_count: 25,
  icon_url: 'https://ui-avatars.com/api/?name=Slack', // url valide pour éviter le warning src=""
  created_at: '2025-01-01',
  updated_at: '2026-01-29'
};

describe('Composant ToolCard', () => {
  
  // vérification du rendu des informations essentielles
  it('affiche le nom de l\'outil et son coût', () => {
    render(
      <ToolCard 
        tool={mockTool} 
        isDark={false} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onToggleStatus={vi.fn()} 
        onView={vi.fn()} 
        onSelect={vi.fn()} 
        isSelected={false} 
      />
    );
    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.getByText('€150')).toBeInTheDocument();
  });

  // test de l'interaction avec la zone de sélection (checkbox personnalisée)
  it('appelle onSelect quand on clique sur la checkbox', () => {
    const onSelectMock = vi.fn();
    const { container } = render(
      <ToolCard 
        tool={mockTool} 
        isDark={false} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onToggleStatus={vi.fn()} 
        onView={vi.fn()} 
        onSelect={onSelectMock} 
        isSelected={false} 
      />
    );
    
    // recherche de l'élément de sélection via sa classe CSS puisque c'est une div et non un input
    const checkbox = container.querySelector('.cursor-pointer');
    
    if (checkbox) {
      fireEvent.click(checkbox);
    }
    
    // validation que l'id de l'outil est bien transmis à la fonction de sélection
    expect(onSelectMock).toHaveBeenCalledWith(1);
  });

  // vérification de l'ouverture de la vue détaillée au clic sur la carte
  it('appelle onView lors du clic sur le corps de la carte', () => {
    const onViewMock = vi.fn();
    render(
      <ToolCard 
        tool={mockTool} 
        isDark={false} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onToggleStatus={vi.fn()} 
        onView={onViewMock} 
        onSelect={vi.fn()} 
        isSelected={false} 
      />
    );

    // clic sur le nom de l'outil pour déclencher la vue détaillée
    const cardTitle = screen.getByText('Slack');
    fireEvent.click(cardTitle);

    expect(onViewMock).toHaveBeenCalledWith(mockTool);
  });
});