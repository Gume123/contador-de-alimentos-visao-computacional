import React, { useState } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ── Fonte ────────────────────────────────────────────────────────────────────
const GlobalFont = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
`;

// ── Animações ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const floatBlob = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -20px) scale(1.05); }
  66%       { transform: translate(-20px, 15px) scale(0.97); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-5px); }
  80%       { transform: translateX(5px); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ── Layout ───────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d1f13;
  position: relative;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
`;

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  animation: ${floatBlob} ${(p) => p.dur || '8s'} ease-in-out infinite;
  animation-delay: ${(p) => p.delay || '0s'};

  &:nth-child(1) {
    width: 480px; height: 480px;
    background: #2e7829;
    top: -120px; left: -80px;
  }
  &:nth-child(2) {
    width: 360px; height: 360px;
    background: #3f7d5c;
    bottom: -100px; right: -60px;
  }
  &:nth-child(3) {
    width: 260px; height: 260px;
    background: #0f9e03;
    top: 50%; left: 60%;
  }
`;

// Grid: esquerda (hero) + direita (formulário)
const Card = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: min(960px, 95vw);
  min-height: 560px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0,0,0,0.5);
  animation: ${fadeUp} 0.6s cubic-bezier(.22,.68,0,1.2) both;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

// Painel esquerdo — identidade do produto
const HeroPanel = styled.div`
  background: linear-gradient(155deg, #1a3d20 0%, #0d2610 100%);
  padding: 52px 44px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  @media (max-width: 700px) {
    display: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
`;

const HeroTop = styled.div``;

const Logo = styled.div`
  font-family: 'Lora', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #6dbf67;
  margin-bottom: 48px;
`;

const HeroTitle = styled.h1`
  font-family: 'Lora', serif;
  font-size: 36px;
  font-weight: 700;
  color: #f0faf0;
  line-height: 1.25;
  margin: 0 0 20px;
`;

const HeroText = styled.p`
  font-size: 15px;
  color: #7aab78;
  line-height: 1.7;
  margin: 0;
`;

const HeroBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  span:first-child {
    font-size: 22px;
  }

  div {
    strong {
      display: block;
      font-size: 15px;
      font-weight: 600;
      color: #d4f0d2;
    }
    small {
      font-size: 12px;
      color: #5a8a57;
    }
  }
`;

// Painel direito — formulário
const FormPanel = styled.div`
  background: #ffffff;
  padding: 52px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
`;

const FormTitle = styled.h2`
  font-family: 'Lora', serif;
  font-size: 28px;
  font-weight: 700;
  color: #0d1f13;
  margin: 0 0 6px;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 36px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.3px;
`;

const Input = styled.input`
  height: 48px;
  border: 1.5px solid ${(p) => (p.hasError ? '#fca5a5' : '#e2e8f0')};
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  color: #0f172a;
  background: ${(p) => (p.hasError ? '#fef2f2' : '#f8fafc')};
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;

  &:focus {
    border-color: #396c35;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(57,108,53,0.12);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 14px;
  color: #dc2626;
  font-size: 13px;
  margin-bottom: 20px;
  animation: ${shake} 0.4s ease;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #2e7829 0%, #4f8c4a 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 20px rgba(46,120,41,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(46,120,41,0.38);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
  color: #cbd5e1;
  font-size: 13px;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
`;

const RegisterLink = styled.p`
  font-size: 14px;
  color: #64748b;
  text-align: center;
  margin: 0;

  a {
    color: #396c35;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ── Componente ───────────────────────────────────────────────────────────────
function Login() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [senha, setSenha]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [erro, setErro]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        // A API retorna { detail: "Credenciais inválidas." }
        throw new Error(data.detail || 'Erro ao fazer login.');
      }

      // ✅ AQUI está o que o snippet tentava explicar:
      // Salvamos o objeto inteiro do usuário (incluindo equipa_id)
      // no localStorage para que Home.jsx e outros componentes possam ler.
      //
      // data.usuario tem este formato:
      // {
      //   id: 1,
      //   primeiro_nome: "João",
      //   ultimo_nome: "Silva",
      //   email: "joao@email.com",
      //   equipa_id: 3
      // }
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redireciona para o dashboard
      navigate('/home');

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalFont />
      <Page>
        <Blob dur="9s"  delay="0s"   />
        <Blob dur="12s" delay="-3s"  />
        <Blob dur="7s"  delay="-5s"  />

        <Card>
          {/* ── Painel esquerdo ── */}
          <HeroPanel>
            <HeroTop>
              <Logo>LE · Contagem</Logo>
              <HeroTitle>
                Inteligência<br />
                <em>para cada</em><br />
                coleta.
              </HeroTitle>
              <HeroText>
                Visão computacional reconhece os alimentos
                automaticamente. Acompanhe os dados da sua
                equipe em tempo real.
              </HeroText>
            </HeroTop>

            <HeroBottom>
              <Stat>
                <span>🥫</span>
                <div>
                  <strong>Reconhecimento automático</strong>
                  <small>Por visão computacional</small>
                </div>
              </Stat>
              <Stat>
                <span>📊</span>
                <div>
                  <strong>Dashboard em tempo real</strong>
                  <small>Dados sempre atualizados</small>
                </div>
              </Stat>
              <Stat>
                <span>🏆</span>
                <div>
                  <strong>Ranking entre equipes</strong>
                  <small>Compete e supera metas</small>
                </div>
              </Stat>
            </HeroBottom>
          </HeroPanel>

          {/* ── Painel direito ── */}
          <FormPanel>
            <FormTitle>Bem‑vindo de volta</FormTitle>
            <FormSubtitle>Acesse com seu e-mail e senha da equipe.</FormSubtitle>

            {erro && (
              <ErrorBox>
                <span>⚠️</span> {erro}
              </ErrorBox>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <FormGroup>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  hasError={!!erro}
                  autoComplete="email"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  hasError={!!erro}
                  autoComplete="current-password"
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner /> Entrando…
                  </>
                ) : (
                  'Entrar'
                )}
              </SubmitButton>
            </form>

            <Divider>ou</Divider>

            <RegisterLink>
              Não tem conta?{' '}
              <a onClick={() => navigate('/cadastro')}>
                Cadastre-se aqui
              </a>
            </RegisterLink>
          </FormPanel>
        </Card>
      </Page>
    </>
  );
}

export default Login;