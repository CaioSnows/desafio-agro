from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from config import CORS_ORIGINS
from functools import lru_cache
import requests
import json


app = FastAPI(title="Produção Agrícola Municipal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_static_data():
    base_path = Path(__file__).parent
    data_path = base_path / "data"
    
    try:
        with open(data_path / "uf.json", "r", encoding="utf-8") as f:
            ufs = json.load(f)
        
        with open(data_path / "produtos.json", "r", encoding="utf-8") as f:
            produtos = json.load(f)
        
        print(f"Carregados {len(ufs)} UFs e {len(produtos)} produtos")
        return ufs, produtos
    except FileNotFoundError as e:
        print(f"Erro: Arquivo não encontrado - {e}")
        return [], []

UFS_DISPONIVEIS, PRODUTOS_DISPONIVEIS = load_static_data()

UFS_VALIDAS = {str(uf["id"]) for uf in UFS_DISPONIVEIS}
PRODUTOS_VALIDOS = {produto["id"] for produto in PRODUTOS_DISPONIVEIS}

@app.get("/api/ufs")
def get_ufs():
    return UFS_DISPONIVEIS

@app.get("/api/produtos")
def get_produtos():
    return PRODUTOS_DISPONIVEIS

def validar_uf(uf: str) -> str:
    if uf not in UFS_VALIDAS:
        ufs_disponiveis = ", ".join(sorted(UFS_VALIDAS))
        raise HTTPException(
            status_code=400, 
            detail=f"UF inválida: {uf}. UFs disponíveis: {ufs_disponiveis}"
        )
    return uf

def validar_produto(produto: str) -> str:
    if produto not in PRODUTOS_VALIDOS:
        produtos_disponiveis = ", ".join(sorted(PRODUTOS_VALIDOS))
        raise HTTPException(
            status_code=400, 
            detail=f"Produto inválido: {produto}. Produtos disponíveis: {produtos_disponiveis}"
        )
    return produto

def build_sidra_url(uf: str, produto: str, ano: int) -> str:
    return f"https://apisidra.ibge.gov.br/values/h/n/t/1612/p/{ano}/v/allxp/c81/{produto}/n6/in%20n3%20{uf}?formato=json"

@lru_cache(maxsize=128)
def buscar_dados_producao_cached(uf: str, produto: str, ano: int) -> list:
    sidra_url = build_sidra_url(uf, produto, ano)
    
    print(f"Cache MISS - Buscando dados da API para UF:{uf}, Produto:{produto}, Ano:{ano}")
    response = requests.get(sidra_url)
    response.raise_for_status()
    data = response.json()
    return processar_dados(data)

def processar_dados(raw_data: list) -> list:
    dados_processados = []
    for item in raw_data:
        if item['V'] in ('...', '-'):
            continue
        
        dados_processados.append({
            "id": item['D3C'],                 
            "produto": item['D3N'],             
            "municipio": item['D4N'],           
            "ano": item['D1N'],                
            "producao_toneladas": float(item['V']) 
        })
    return dados_processados

@app.get("/api/producao")
def get_producao_agricola(
    uf: str = Query(..., description="Código da UF"),
    produto: str = Query(..., description="Código do produto"), 
    ano: int = Query(..., description="Ano da consulta")
):
    uf = validar_uf(uf)
    produto = validar_produto(produto)
    
    print(f"Consultando dados para UF:{uf}, Produto:{produto}, Ano:{ano}")
    
    try:
        dados = buscar_dados_producao_cached(uf, produto, ano)
        print(f"Cache HIT - Dados retornados do cache")
        return dados
    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar a API do IBGE: {e}")
        raise HTTPException(status_code=502, detail="Erro de comunicação com a API do IBGE.")
    except (KeyError, IndexError) as e:
        print(f"Erro ao processar os dados do IBGE: {e}")
        raise HTTPException(status_code=500, detail="Erro no processamento dos dados recebidos do IBGE.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")