# Desafio Agro - Dashboard de Produção Agrícola

Um sistema completo para visualização de dados da produção agrícola municipal brasileira, com backend em FastAPI e frontend em React.

Dashboard de Produção Agrícola

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [API Backend](#api-backend)
- [Frontend](#frontend)
- [Docker](#docker)
- [Desenvolvimento](#desenvolvimento)
- [Licença](#licença)

## 🔍 Visão Geral

O Desafio Agro é uma aplicação web para visualização e análise de dados da produção agrícola municipal brasileira, utilizando dados do IBGE (Instituto Brasileiro de Geografia e Estatística). A aplicação permite selecionar estados, produtos agrícolas e anos para visualizar a produção em diferentes municípios.

## ✨ Funcionalidades

- **Filtros Interativos**: Seleção de estados, produtos agrícolas e anos
- **Visualização em Gráficos**: Exibição dos top 10 municípios produtores
- **Mapa Interativo**: Visualização geográfica da localização do estado selecionado
- **Integração com a API do IBGE**: Dados reais da produção agrícola nacional
- **Cache de Consultas**: Melhor performance para consultas repetidas
- **Responsividade**: Interface adaptável a diferentes dispositivos

## 🏗 Arquitetura

O projeto segue uma arquitetura cliente-servidor:

- **Backend**: API RESTful desenvolvida com FastAPI (Python)
- **Frontend**: Single Page Application (SPA) desenvolvida com React (TypeScript)
- **Containerização**: Docker e Docker Compose para isolamento e fácil implantação

## 🛠 Tecnologias Utilizadas

### Backend
- **FastAPI**: Framework web assíncrono de alta performance
- **Python 3.13**: Linguagem de programação
- **Uvicorn**: Servidor ASGI para Python
- **Requests**: Biblioteca para requisições HTTP
- **Python-dotenv**: Gerenciamento de variáveis de ambiente
- **Docker**: Containerização da aplicação

### Frontend
- **React 19**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Axios**: Cliente HTTP para requisições à API
- **Chart.js/React-Chartjs-2**: Biblioteca para criação de gráficos
- **Leaflet/React-Leaflet**: Biblioteca para mapas interativos
- **Docker**: Containerização da aplicação

## 📁 Estrutura do Projeto

```
desafio_agro/
├── backend/
│   ├── data/
│   │   ├── municipios.json
│   │   ├── produtos.json
│   │   └── uf.json
│   ├── config.py
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   └── web-dashboard2/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Filters.tsx
│       │   │   ├── ProductionChart.tsx
│       │   │   └── ProductionMap.tsx
│       │   ├── data/
│       │   │   └── coordenadas.ts
│       │   ├── services/
│       │   │   └── api.ts
│       │   ├── App.tsx
│       │   └── index.tsx
│       ├── package.json
│       └── tsconfig.json
└── docker-compose.yaml
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local do frontend)
- Python 3.8+ (para desenvolvimento local do backend)

### Utilizando Docker Compose (recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/CaioSnows/desafio-agro.git
cd desafio-agro
```

2. Inicie os containers com Docker Compose:
```bash
docker compose up -d
```

3. Acesse a aplicação:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Documentação da API: http://localhost:8000/docs

### Instalação Manual (Desenvolvimento)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend/web-dashboard2
npm install
npm start
```

## 📡 API Backend

A API do backend fornece endpoints para consulta de estados, produtos e dados de produção agrícola.

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET    | `/api/ufs` | Lista todos os estados disponíveis |
| GET    | `/api/produtos` | Lista todos os produtos agrícolas disponíveis |
| GET    | `/api/producao` | Consulta dados de produção por UF, produto e ano |

### Parâmetros para `/api/producao`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| uf        | string | Código da UF (ex: 35 para São Paulo) |
| produto   | string | Código do produto (ex: 2713 para Milho) |
| ano       | int    | Ano da consulta (ex: 2024) |

### Exemplo de Resposta

```json
[
  {
    "id": "2713",
    "produto": "Milho",
    "municipio": "Campinas",
    "ano": "2024",
    "producao_toneladas": 120.5
  }
]
```

## 🖥 Frontend

O frontend é uma aplicação React que fornece uma interface amigável para visualização dos dados de produção agrícola.

### Componentes Principais

- **App**: Componente principal que gerencia o estado da aplicação
- **Filters**: Componente para seleção de UF, produto e ano
- **ProductionChart**: Gráfico de barras mostrando os top 10 municípios produtores
- **ProductionMap**: Mapa interativo mostrando a localização do estado selecionado

### Fluxo de Dados

1. O usuário seleciona um estado, produto e ano nos filtros
2. A aplicação envia uma requisição para o backend
3. Os dados recebidos são processados e exibidos no gráfico
4. O mapa é atualizado para mostrar o estado selecionado

## 🐳 Docker

O projeto utiliza Docker para facilitar a implantação e garantir um ambiente consistente.

### Serviços

- **backend**: Aplicação FastAPI
  - Porta: 8000
  - Ambiente: development
  - Volumes: ./backend:/app

- **frontend**: Aplicação React
  - Porta: 3000
  - Ambiente: REACT_APP_API_URL=http://localhost:8000
  - Volumes: ./frontend/web-dashboard:/app

## 👨‍💻 Desenvolvimento

### Backend

Para adicionar novos endpoints ou funcionalidades no backend:

1. Modifique o arquivo `main.py`
2. Adicione novas dependências ao `requirements.txt`
3. Reinicie o servidor

### Frontend

Para adicionar novos componentes ou funcionalidades no frontend:

1. Adicione ou modifique componentes em `src/components/`
2. Atualize os serviços de API em `src/services/api.ts` se necessário
3. Execute `npm start` para visualizar as alterações

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Desenvolvido por [Caio Neves](https://github.com/CaioSnows)