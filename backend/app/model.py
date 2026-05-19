from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from database import Base


# ─── SQLAlchemy Model (tabela no banco) ────────────────────────────────────────

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    primeiro_nome = Column(String, nullable=False)
    ultimo_nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    equipa_id = Column(Integer, nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

class EventoContagem(Base):
    __tablename__ = "eventos_contagem"

    id = Column(Integer, primary_key=True, index=True)
    equipa_id = Column(Integer, index=True, nullable=False)
    tipo_produto = Column(String, nullable=False)
    peso = Column(String, nullable=False)
    contagem = Column(Integer, nullable=False)
    confianca = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


# ─── Pydantic Schemas (validação da API) ───────────────────────────────────────

class UsuarioCadastro(BaseModel):
    primeiro_nome: str
    ultimo_nome: str
    email: str
    senha: str
    equipa_id: int = None

class UsuarioLogin(BaseModel):
    email: str
    senha: str

class UsuarioResposta(BaseModel):
    id: int
    primeiro_nome: str
    ultimo_nome: str
    email: str
    equipa_id: int | None = None

    class Config:
        from_attributes = True


# ─── Contagem de Alimentos (modelo original) ───────────────────────────────────

class ContagemItem(BaseModel):
    equipa_id: int
    tipo_produto: str
    peso: str
    contagem: int
    confianca: float

class ContagemItemResposta(ContagemItem):
    id: int
    
    class Config:
        from_attributes = True