import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import SideNav from '../../ComponentesGerais/SideNav.jsx';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, #3f7d5c 0%, transparent 25%),
    radial-gradient(circle at bottom right, #1f2f35 0%, transparent 25%),
    #f4f4f4;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 45px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const TopSection = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 50px;
  font-weight: 800;
  color: #111;
  letter-spacing: -1.5px;

  @media (max-width: 768px) {
    font-size: 38px;
  }
`;

const Subtitle = styled.p`
  margin-top: 14px;
  color: #666;
  font-size: 18px;
  line-height: 1.7;
  max-width: 700px;
`;

const RefreshButton = styled.button`
  margin-top: 18px;
  border: none;
  padding: 10px 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, #396c35 0%, #4f8c4a 100%);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 6px 16px rgba(57,108,53,0.22);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(57,108,53,0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const RankingContainer = styled.div`
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(14px);
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.25);
  box-shadow:
    0 12px 32px rgba(0,0,0,0.08),
    0 4px 12px rgba(0,0,0,0.04);
  position: relative;
  animation: ${fadeIn} 0.5s ease both;
`;

const GlowEffect = styled.div`
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(57,108,53,0.12);
  filter: blur(70px);
  top: -80px;
  right: -80px;
  pointer-events: none;
`;

const RankingHeader = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 220px;
  padding: 24px 30px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  font-size: 15px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RankingRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 220px;
  align-items: center;
  padding: 26px 30px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  transition: 0.25s ease;
  position: relative;
  animation: ${fadeIn} 0.4s ease both;
  animation-delay: ${(p) => p.delay || '0s'};

  &:hover {
    background: rgba(255,255,255,0.45);
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 24px;
  }
`;

const RankPosition = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const RankCircle = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: white;
  background: ${({ rank }) =>
    rank === 1
      ? 'linear-gradient(135deg, #d4af37, #f6d365)'
      : rank === 2
      ? 'linear-gradient(135deg, #9ca3af, #d1d5db)'
      : rank === 3
      ? 'linear-gradient(135deg, #b45309, #f59e0b)'
      : 'linear-gradient(135deg, #396c35, #4f8c4a)'};
  box-shadow: 0 10px 20px rgba(0,0,0,0.12);
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TeamName = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #161616;
`;

const TeamSubtitle = styled.span`
  margin-top: 6px;
  color: #666;
  font-size: 14px;
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const ScoreBadge = styled.div`
  padding: 14px 24px;
  border-radius: 999px;
  background: rgba(57,108,53,0.1);
  color: #396c35;
  font-size: 16px;
  font-weight: 800;
  border: 1px solid rgba(57,108,53,0.15);
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 26px 30px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
`;

const SkeletonCircle = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;

const SkeletonBar = styled.div`
  height: ${(p) => p.h || '16px'};
  width: ${(p) => p.w || '100%'};
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 14px;
  padding: 16px 20px;
  color: #dc2626;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EmptyState = styled.div`
  padding: 60px 30px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
`;

const formatWeight = (v) => {
  if (v >= 1000000) return { val: (v / 1000000).toFixed(2), unit: 't' };
  if (v >= 1000)    return { val: (v / 1000).toFixed(2),    unit: 'kg' };
  return                   { val: v.toFixed(1),              unit: 'g' };
};

// Busca o relatório de cada equipe (IDs 1..N) para montar o ranking
async function fetchRankingData(maxEquipes = 20) {
  // Busca todos os eventos e agrupa por equipa_id no frontend,
  // pois a API oferece /eventos/todos/ com todos os registros.
  const res = await fetch('http://localhost:8000/eventos/todos/');
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);

  const data = await res.json();
  const eventos = data.dados || [];

  // Agrupa peso total por equipa_id
  // O campo "peso" é uma string (ex: "500g", "1kg"), então usamos "contagem" como métrica
  const mapaEquipes = {};

  eventos.forEach((ev) => {
    const id = ev.equipa_id;
    if (!mapaEquipes[id]) {
      mapaEquipes[id] = { id, totalItens: 0, produtos: new Set() };
    }
    mapaEquipes[id].totalItens += ev.contagem;
    mapaEquipes[id].produtos.add(ev.tipo_produto);
  });

  return Object.values(mapaEquipes)
    .sort((a, b) => b.totalItens - a.totalItens)
    .map((eq) => ({
      id: eq.id,
      name: `Equipe ${eq.id}`,
      score: eq.totalItens,
      produtos: eq.produtos.size,
    }));
}

function Times() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const ranking = await fetchRankingData();
      setTeams(ranking);
    } catch (err) {
      setErro(err.message || 'Não foi possível carregar o ranking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  return (
    <PageWrapper>
      <MainContent>
        <SideNav />

        <ContentArea>
          <TopSection>
            <Title>Ranking das Equipes</Title>
            <Subtitle>
              Acompanhe o desempenho das equipes com base no total de
              itens reconhecidos e compare os resultados em tempo real.
            </Subtitle>
            <RefreshButton onClick={carregar} disabled={loading}>
              {loading ? 'Atualizando…' : '↻ Atualizar ranking'}
            </RefreshButton>
          </TopSection>

          {erro && (
            <ErrorBanner style={{ marginBottom: 24 }}>
              ⚠️ {erro} — Verifique se a API está em execução.
            </ErrorBanner>
          )}

          <RankingContainer>
            <GlowEffect />

            {!loading && !erro && teams.length > 0 && (
              <RankingHeader>
                <span>Posição</span>
                <span>Equipe</span>
                <span>Total de Itens</span>
              </RankingHeader>
            )}

            {/* Skeleton */}
            {loading && [1, 2, 3].map((i) => (
              <SkeletonRow key={i}>
                <SkeletonCircle />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <SkeletonBar h="18px" w="40%" />
                  <SkeletonBar h="13px" w="60%" />
                </div>
                <SkeletonBar h="42px" w="120px" style={{ borderRadius: 999 }} />
              </SkeletonRow>
            ))}

            {/* Sem dados */}
            {!loading && !erro && teams.length === 0 && (
              <EmptyState>Nenhuma equipe com registros ainda.</EmptyState>
            )}

            {/* Ranking */}
            {!loading && teams.map((team, index) => {
              const display = formatWeight(team.score);

              return (
                <RankingRow key={team.id} delay={`${index * 0.06}s`}>
                  <RankPosition>
                    <RankCircle rank={index + 1}>
                      #{index + 1}
                    </RankCircle>
                  </RankPosition>

                  <TeamInfo>
                    <TeamName>{team.name}</TeamName>
                    <TeamSubtitle>
                      {team.produtos} tipo{team.produtos !== 1 ? 's' : ''} de produto reconhecido{team.produtos !== 1 ? 's' : ''}
                    </TeamSubtitle>
                  </TeamInfo>

                  <ScoreContainer>
                    <ScoreBadge>
                      {team.score} itens
                    </ScoreBadge>
                  </ScoreContainer>
                </RankingRow>
              );
            })}
          </RankingContainer>
        </ContentArea>
      </MainContent>
    </PageWrapper>
  );
}

export default Times;