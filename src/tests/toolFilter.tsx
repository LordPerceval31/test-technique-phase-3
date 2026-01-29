import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToolFilters from '../components/toolFilter';

describe('Composant ToolFilters', () => {
  // test de la mise à jour du terme de recherche
  it('appelle setSearchTerm lors de la saisie de texte', () => {
    const setSearchTermMock = vi.fn();
    render(
      <ToolFilters 
        isDark={false} 
        searchTerm="" 
        setSearchTerm={setSearchTermMock}
        selectedDept="All" setSelectedDept={vi.fn()}
        selectedCategory="All" setSelectedCategory={vi.fn()}
        selectedStatus="All" setSelectedStatus={vi.fn()}
        minCost="" setMinCost={vi.fn()}
        maxCost="" setMaxCost={vi.fn()}
        sortOrder="desc" setSortOrder={vi.fn()}
        viewMode="grid" setViewMode={vi.fn()}
        onSelectAll={vi.fn()} allSelected={false}
      />
    );

    const input = screen.getByPlaceholderText(/Search tools.../i);
    fireEvent.change(input, { target: { value: 'Figma' } });
    expect(setSearchTermMock).toHaveBeenCalledWith('Figma');
  });

  // test de la bascule du mode d'affichage (grille / liste)
  it('change le mode de vue lors du clic sur les boutons dédiés', () => {
    const setViewModeMock = vi.fn();
    render(
      <ToolFilters 
        isDark={false} searchTerm="" setSearchTerm={vi.fn()}
        selectedDept="All" setSelectedDept={vi.fn()}
        selectedCategory="All" setSelectedCategory={vi.fn()}
        selectedStatus="All" setSelectedStatus={vi.fn()}
        minCost="" setMinCost={vi.fn()}
        maxCost="" setMaxCost={vi.fn()}
        sortOrder="desc" setSortOrder={vi.fn()}
        viewMode="grid" 
        setViewMode={setViewModeMock}
        onSelectAll={vi.fn()} allSelected={false}
      />
    );

    // le bouton liste est le deuxième bouton d'affichage
    const listButton = screen.getAllByRole('button').pop(); 
    if (listButton) fireEvent.click(listButton);
    expect(setViewModeMock).toHaveBeenCalledWith('list');
  });
});