from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime
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
    criado_em = Column(DateTime(timezone=True), server_default=func.now())


# ─── Pydantic Schemas (validação da API) ───────────────────────────────────────

class UsuarioCadastro(BaseModel):
    primeiro_nome: str
    ultimo_nome: str
    email: str
    senha: str

class UsuarioLogin(BaseModel):
    email: str
    senha: str

class UsuarioResposta(BaseModel):
    id: int
    primeiro_nome: str
    ultimo_nome: str
    email: str

    class Config:
        from_attributes = True


# ─── Contagem de Alimentos (modelo original) ───────────────────────────────────

class ContagemItem(BaseModel):
    equipa_id: int
    tipo_produto: str
    peso: float
    contagem: int
    confianca: float