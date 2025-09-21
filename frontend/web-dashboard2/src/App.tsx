import React, { useState, useEffect } from 'react';
import './App.css';
import { getUfs, getProdutos, getProducao, Uf, Produto, Producao } from './services/api';
import { Filters } from './components/Filters';
import { ProductionChart } from './components/ProductionChart';
import { ProductionMap } from './components/ProductionMap';


function App() {
  const [ufs, setUfs] = useState<Uf[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [producaoData, setProducaoData] = useState<Producao[]>([]);
  const [selectedUf, setSelectedUf] = useState<Uf | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [ufsResponse, produtosResponse] = await Promise.all([getUfs(), getProdutos()]);
        setUfs(ufsResponse.data);
        setProdutos(produtosResponse.data);
        const sp = ufsResponse.data.find(uf => uf.id === 35);
        if (sp) setSelectedUf(sp);

      } catch (err) {
        setError('Falha ao carregar dados iniciais.');
      }
    }
    loadInitialData();
  }, []);

  const handleSearch = async (ufId: number, produtoId: string, ano: number) => {
    setIsLoading(true);
    setError(null);
    setProducaoData([]); 

    const currentUf = ufs.find(uf => uf.id === ufId);
    if(currentUf) setSelectedUf(currentUf);

    try {
      const response = await getProducao(ufId, produtoId, ano);
      setProducaoData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Dashboard de Produção Agrícola</h1>
      </header>
      <main>
        <Filters 
          ufs={ufs} 
          produtos={produtos} 
          onSearch={handleSearch} 
          isLoading={isLoading} 
        />
        {error && <p className="error-message">{error}</p>}
        
        <div className="dashboard-container">
          <div className="chart-wrapper">
            {producaoData.length > 0 ? (
              <ProductionChart data={producaoData} />
            ) : (
              <p>Nenhum dado de produção para exibir. Faça uma busca.</p>
            )}
          </div>
          <div className="map-wrapper">
            <ProductionMap selectedUf={selectedUf} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;