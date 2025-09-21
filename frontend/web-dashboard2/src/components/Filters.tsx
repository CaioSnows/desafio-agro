// src/components/Filters.tsx
import React from 'react';
import { Uf, Produto } from '../services/api';
import './Filters.css'; 

interface FiltersProps {
  ufs: Uf[];
  produtos: Produto[];
  onSearch: (uf: number, produto: string, ano: number) => void;
  isLoading: boolean;
}

export const Filters: React.FC<FiltersProps> = React.memo(({ ufs, produtos, onSearch, isLoading }) => {
  const [selectedUf, setSelectedUf] = React.useState<number>(35); 
  const [selectedProduto, setSelectedProduto] = React.useState<string>('2713'); 
  const [ano, setAno] = React.useState<number>(2024); 

  const anos = React.useMemo(() => {
    const lastYear = 2024; 
    const startYear = 2000; 
    const years = [];
    
    for (let year = lastYear; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  }, []);

  const handleSearchClick = () => {
    onSearch(selectedUf, selectedProduto, ano);
  };

  return (
    <div className="filters-container">
      <div className="filter-item">
        <label htmlFor="uf-select">Estado</label>
        <select id="uf-select" value={selectedUf} onChange={(e) => setSelectedUf(Number(e.target.value))}>
          {ufs.map((uf) => (
            <option key={uf.id} value={uf.id}>
              {uf.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="produto-select">Produto</label>
        <select id="produto-select" value={selectedProduto} onChange={(e) => setSelectedProduto(e.target.value)}>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="ano-select">Ano</label>
        <select id="ano-select" value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {anos.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSearchClick} disabled={isLoading}>
        {isLoading ? 'Buscando...' : 'Buscar Produção'}
      </button>
    </div>
  );
});