import React, { useState } from 'react';
import styled from 'styled-components';
import SideNav from '../../ComponentesGerais/SideNav.jsx';

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

  background:
    ${({ rank }) =>
      rank === 1
        ? 'linear-gradient(135deg, #d4af37, #f6d365)'
        : rank === 2
        ? 'linear-gradient(135deg, #9ca3af, #d1d5db)'
        : rank === 3
        ? 'linear-gradient(135deg, #b45309, #f59e0b)'
        : 'linear-gradient(135deg, #396c35, #4f8c4a)'};

  box-shadow:
    0 10px 20px rgba(0,0,0,0.12);
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

const formatWeight = (v) => {

  if (v >= 1000000)
    return {
      val: (v / 1000000).toFixed(2),
      unit: 't'
    };

  if (v >= 1000)
    return {
      val: (v / 1000).toFixed(2),
      unit: 'kg'
    };

  return {
    val: v.toFixed(1),
    unit: 'g'
  };
};

function Times() {

  const initialTeams = [
    { id: 1, name: 'Alpha Squad', score: 1250500 },
    { id: 2, name: 'Beta Force', score: 8500 },
    { id: 3, name: 'Gamma Team', score: 450 },
    { id: 4, name: 'Delta Group', score: 95400 },
  ];

  const [teams] = useState(
    [...initialTeams].sort((a, b) => b.score - a.score)
  );

  return (

    <PageWrapper>

      <MainContent>

        <SideNav />

        <ContentArea>

          <TopSection>

            <Title>
              Ranking das Equipes
            </Title>

            <Subtitle>
              Acompanhe o desempenho das equipes
              com base no peso total coletado
              e compare os resultados em tempo real.
            </Subtitle>

          </TopSection>

          <RankingContainer>

            <GlowEffect />

            <RankingHeader>

              <span>Posição</span>
              <span>Equipe</span>
              <span>Peso Total</span>

            </RankingHeader>

            {teams.map((team, index) => {

              const display = formatWeight(team.score);

              return (

                <RankingRow key={team.id}>

                  <RankPosition>

                    <RankCircle rank={index + 1}>
                      #{index + 1}
                    </RankCircle>

                  </RankPosition>

                  <TeamInfo>

                    <TeamName>
                      {team.name}
                    </TeamName>

                    <TeamSubtitle>
                      Equipe participante da plataforma
                    </TeamSubtitle>

                  </TeamInfo>

                  <ScoreContainer>

                    <ScoreBadge>
                      {display.val} {display.unit}
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