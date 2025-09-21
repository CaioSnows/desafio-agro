// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
});

export interface Uf {
  id: number;
  nome: string;
}

export interface Produto {
  id: string;
  nome: string;
}

export interface Producao {
  id: string;
  municipio: string;
  producao_toneladas: number;
}

export const getUfs = () => api.get<Uf[]>('/ufs');
export const getProdutos = () => api.get<Produto[]>('/produtos');

export const getProducao = (uf: number, produto: string, ano: number) => {
  return api.get<Producao[]>('/producao', {
    params: { uf, produto, ano },
  });
};