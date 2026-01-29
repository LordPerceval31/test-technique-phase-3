import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecentTools from '../components/recentTools';
import type { Tool } from '../utils/interfaces';

// mock complet
const mockTools: Tool[] = [{
  id: 1,
  name: "Jira",
  description: "suivi de tickets",
  vendor: "Atlassian",
  category: "Productivity",
  monthly_cost: 3024,
  previous_month_cost: 2800,
  owner_department: "Communication",
  status: "active",
  website_url: "https://jira.com",
  active_users_count: 52,
  icon_url: "https://example.com/jira.png",
  created_at: "2025-01-01",
  updated_at: "2026-01-29"
}];

describe('Composant RecentTools (Tableau)', () => {
  
  // test 1 : affichage des en-têtes et des données
  it('affiche le tableau avec les en-têtes corrects', () => {
    render(<RecentTools tools={mockTools} />);
    expect(screen.getByText('Recent Tools')).toBeInTheDocument();
    expect(screen.getByText('Tool')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
    expect(screen.getByText('Jira')).toBeInTheDocument();
  });

  // test 2 : interaction de tri
  it('permet de cliquer sur l\'en-tête Coût pour trier', () => {
    render(<RecentTools tools={mockTools} />);
    const costHeader = screen.getByText('Cost');
    fireEvent.click(costHeader);
    // le test passe si le clic ne déclenche pas d'erreur
  });

  // test 3 : pagination
  it('affiche les informations de pagination', () => {
    render(<RecentTools tools={mockTools} />);
    expect(screen.getByText(/Page/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // test 4 : sélection multiple
  it('appelle la fonction onSelect lors du clic sur la checkbox', () => {
    const onSelectMock = vi.fn();
    render(<RecentTools tools={mockTools} onSelect={onSelectMock} selectedIds={[]} />);
    
    // sélection de la checkbox custom 
    const row = screen.getByText('Jira').closest('tr');
    const checkbox = row?.querySelector('.cursor-pointer');
    
    if (checkbox) fireEvent.click(checkbox);
    expect(onSelectMock).toHaveBeenCalledWith(1);
  });

  // test 5 : actions unitaires
  it('affiche les icônes d\'actions au survol (Edit, Delete, etc.)', () => {
    render(
      <RecentTools 
        tools={mockTools} 
        showActions={true} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
      />
    );
    expect(screen.getByTitle('Visit Website')).toBeInTheDocument();
    expect(screen.getByTitle('Edit')).toBeInTheDocument();
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });
});