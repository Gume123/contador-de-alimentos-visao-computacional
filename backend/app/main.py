from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import bcrypt
from datetime import datetime
from typing import List, Dict

from model import ContagemItem, ContagemItemResposta, EventoContagem, Usuario, UsuarioCadastro, UsuarioLogin
from database import engine, Base, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LE - Contagem Inteligente de Alimentos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A partir de agora, os eventos são salvos no SQLite via SQLAlchemy.
#Endpoints

@app.get("/")
def home():
    return {"mensagem": "Bem-vindo à API de Contagem Inteligente de Alimentos!"}

@app.get("/registrar-contagem/", response_model=List[ContagemItemResposta])
async def listar_contagens(db: Session = Depends(get_db)):
    eventos = db.query(EventoContagem).all()
    return eventos

@app.post("/registrar-contagem/", response_model=ContagemItemResposta)
async def registrar_contagem(item: ContagemItem, db: Session = Depends(get_db)):
    novo_evento = EventoContagem(
        equipa_id=item.equipa_id,
        tipo_produto=item.tipo_produto,
        peso=item.peso,
        contagem=item.contagem,
        confianca=item.confianca
    )
    db.add(novo_evento)
    db.commit()
    db.refresh(novo_evento)

    print(f"Recebido: {item.tipo_produto} (Confiança: {item.confianca}) da Equipe {item.equipa_id}")

    return novo_evento

@app.delete("/registrar-contagem/{item_id}")
async def deletar_contagem(item_id: int, db: Session = Depends(get_db)):
    evento = db.query(EventoContagem).filter(EventoContagem.id == item_id).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    
    db.delete(evento)
    db.commit()
    return {"status": "sucesso", "mensagem": f"Item {item_id} deletado com sucesso"}

@app.post("/cadastro")
def cadastrar_usuario(usuario: UsuarioCadastro, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
    
    senha_hash = bcrypt.hashpw(usuario.senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    novo_usuario = Usuario(
        primeiro_nome=usuario.primeiro_nome,
        ultimo_nome=usuario.ultimo_nome,
        email=usuario.email, 
        senha_hash=senha_hash,
        equipa_id=usuario.equipa_id
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return {"mensagem": "Usuário criado com sucesso"}

@app.post("/login")
async def login(usuario_login: UsuarioLogin, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario_login.email).first()
    if not db_usuario:
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")
    
    if not bcrypt.checkpw(usuario_login.senha.encode('utf-8'), db_usuario.senha_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")
        
    return {
        "mensagem": "Login realizado com sucesso",
        "usuario": {
            "id": db_usuario.id,
            "primeiro_nome": db_usuario.primeiro_nome,
            "ultimo_nome": db_usuario.ultimo_nome,
            "email": db_usuario.email,
            "equipa_id": db_usuario.equipa_id
        }
    }



@app.get("/relatorio/equipe/{equipa_id}")
async def obter_relatorio_equipe(equipa_id: int, db: Session = Depends(get_db)):
    eventos_da_equipe = db.query(EventoContagem).filter(EventoContagem.equipa_id == equipa_id).all()

    if not eventos_da_equipe:
        return {"mensagem": f"Nenhum dado encontrado da equipe {equipa_id}", "totais": {}}
    
    resumo = {}

    for ev in eventos_da_equipe:
        tipo = ev.tipo_produto
        resumo[tipo] = resumo.get(tipo, 0) + ev.contagem

    return {
        "equipa_id": equipa_id,
        "total_itens_geral": sum(resumo.values()),
        "resumo_por_produto": resumo,
        "historico_detalhado": eventos_da_equipe
    }

@app.get("/eventos/todos/")
async def ver_eventos(db: Session = Depends(get_db)):
    eventos = db.query(EventoContagem).all()
    return {
        "total_registros": len(eventos),
        "dados": eventos
    }
