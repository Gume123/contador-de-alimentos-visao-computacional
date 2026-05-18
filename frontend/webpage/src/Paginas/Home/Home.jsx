import React, { useRef } from 'react';
import styled from 'styled-components';

import Header from '../../ComponentesGerais/Header.jsx';
import SideNav from '../../ComponentesGerais/SideNav.jsx';

import Rosa from './Graficos/Rosa.jsx';
import Linha from './Graficos/Linha.jsx';

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

  padding: 40px;

  display: flex;
  flex-direction: column;

  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 35px;

  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const DashboardTitle = styled.h1`
  margin: 0;

  font-size: 42px;
  font-weight: 800;

  color: #121212;

  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 34px;
  }
`;

const DashboardSubtitle = styled.p`
  margin-top: 10px;

  color: #5f5f5f;

  font-size: 17px;

  line-height: 1.6;
`;

const SaveButton = styled.button`
  border: none;

  padding: 16px 28px;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    #396c35 0%,
    #4f8c4a 100%
  );

  color: white;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.25s ease;

  box-shadow:
    0 10px 25px rgba(57,108,53,0.25);

  &:hover {
    transform: translateY(-3px);

    box-shadow:
      0 14px 30px rgba(57,108,53,0.35);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ChartGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));

  gap: 28px;

  width: 100%;
`;

const ChartCard = styled.div`
  position: relative;

  background: rgba(255,255,255,0.78);

  backdrop-filter: blur(14px);

  border-radius: 28px;

  padding: 28px;

  border: 1px solid rgba(255,255,255,0.25);

  box-shadow:
    0 12px 32px rgba(0,0,0,0.08),
    0 4px 12px rgba(0,0,0,0.04);

  overflow: hidden;

  transition: 0.25s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const GlowEffect = styled.div`
  position: absolute;

  width: 180px;
  height: 180px;

  border-radius: 50%;

  background: rgba(57,108,53,0.12);

  filter: blur(55px);

  top: -60px;
  right: -60px;
`;

const CardTitle = styled.h2`
  margin: 0 0 18px 0;

  font-size: 22px;
  font-weight: 700;

  color: #161616;
`;

function Home() {

  const rosaRef = useRef(null);
  const linhaRef = useRef(null);

  const salvarNoHistorico = () => {

    const refs = [
      { ref: rosaRef, name: 'Gráfico Rosa (Distribuição)' },
      { ref: linhaRef, name: 'Gráfico de Linha (Tendência)' },
    ];

    const novosRelatorios = [];

    refs.forEach(({ ref, name }) => {

      if (ref.current) {

        const chartInstance = ref.current.getEchartsInstance();

        const base64Image = chartInstance.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff',
        });

        novosRelatorios.push({
          id: Date.now() + Math.random(),
          name: name,
          date: new Date().toLocaleString(),
          image: base64Image,
        });
      }
    });

    if (novosRelatorios.length > 0) {

      const historicoExistente = JSON.parse(
        localStorage.getItem('meu-historico-charts') || '[]'
      );

      localStorage.setItem(
        'meu-historico-charts',
        JSON.stringify([
          ...novosRelatorios,
          ...historicoExistente
        ])
      );

      alert('Ambos os gráficos foram salvos no histórico!');

    } else {

      alert('Erro: Não foi possível capturar os gráficos.');
    }
  };

  return (
    <PageWrapper>

      <MainContent>

        <SideNav />

        <ContentArea>

          <TopSection>

            <TitleArea>

              <DashboardTitle>
                Dashboard Analítico
              </DashboardTitle>

              <DashboardSubtitle>
                Visualize métricas, tendências e relatórios
                em tempo real da plataforma.
              </DashboardSubtitle>

            </TitleArea>

            <SaveButton onClick={salvarNoHistorico}>
              Salvar Relatórios
            </SaveButton>

          </TopSection>

          <ChartGrid>

            <ChartCard>

              <GlowEffect />

              <CardTitle>
                Distribuição Geral
              </CardTitle>

              <Rosa ref={rosaRef} />

            </ChartCard>

            <ChartCard>

              <GlowEffect />

              <CardTitle>
                Tendência Temporal
              </CardTitle>

              <Linha ref={linhaRef} />

            </ChartCard>

          </ChartGrid>

        </ContentArea>

      </MainContent>

    </PageWrapper>
  );
}

export default Home;