import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SideNav from '../../ComponentesGerais/SideNav.jsx';
import { jsPDF } from 'jspdf';

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

  display: flex;
  flex-direction: column;
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
  align-self: center;
  margin-top: 28px;

  color: #666;

  font-size: 18px;

  line-height: 1.7;

  max-width: 700px;
`;

const EmptyState = styled.div`
  margin-top: 50px;

  background: rgba(255,255,255,0.78);

  backdrop-filter: blur(14px);

  border-radius: 28px;

  padding: 60px 30px;

  text-align: center;

  border: 1px solid rgba(255,255,255,0.3);

  box-shadow:
    0 12px 32px rgba(0,0,0,0.06);

  h2 {
    margin-bottom: 12px;

    color: #111;

    font-size: 30px;
  }

  p {
    color: #666;

    font-size: 17px;
  }
`;

const HistoryGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));

  gap: 28px;
`;

const HistoryCard = styled.div`
  position: relative;

  background: rgba(255,255,255,0.78);

  backdrop-filter: blur(14px);

  border-radius: 30px;

  overflow: hidden;

  border: 1px solid rgba(255,255,255,0.3);

  box-shadow:
    0 12px 32px rgba(0,0,0,0.08),
    0 4px 12px rgba(0,0,0,0.04);

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-6px);

    box-shadow:
      0 20px 40px rgba(0,0,0,0.12);
  }
`;

const GlowEffect = styled.div`
  position: absolute;

  width: 180px;
  height: 180px;

  border-radius: 50%;

  background: rgba(57,108,53,0.12);

  filter: blur(55px);

  top: -70px;
  right: -70px;
`;

const ImageWrapper = styled.div`
  padding: 24px 24px 0 24px;
`;

const ChartImage = styled.img`
  width: 100%;
  height: 240px;

  object-fit: contain;

  background: white;

  border-radius: 18px;

  padding: 12px;

  border: 1px solid rgba(0,0,0,0.05);
`;

const CardContent = styled.div`
  padding: 24px;
`;

const ChartTitle = styled.h3`
  margin: 0;

  font-size: 24px;
  font-weight: 800;

  color: #151515;
`;

const ChartDate = styled.p`
  margin-top: 12px;

  color: #666;

  font-size: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;

  gap: 14px;

  margin-top: 24px;

  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  flex: 1;

  min-width: 140px;

  border: none;

  padding: 15px 20px;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    #396c35 0%,
    #4f8c4a 100%
  );

  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.25s ease;

  box-shadow:
    0 10px 25px rgba(57,108,53,0.2);

  &:hover {
    transform: translateY(-3px);

    box-shadow:
      0 16px 32px rgba(57,108,53,0.3);
  }
`;

const DeleteButton = styled.button`
  flex: 1;

  min-width: 140px;

  border: none;

  padding: 15px 20px;

  border-radius: 999px;

  background: rgba(220, 53, 69, 0.12);

  color: #d62839;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.25s ease;

  &:hover {
    background: rgba(220, 53, 69, 0.18);

    transform: translateY(-2px);
  }
`;

function Arquivos() {

  const [chartHistory, setChartHistory] = useState([]);

  useEffect(() => {

    const savedHistory = localStorage.getItem(
      'meu-historico-charts'
    );

    if (savedHistory) {
      setChartHistory(JSON.parse(savedHistory));
    }

  }, []);

  const exportToPDF = (imageData, fileName) => {

    const pdf = new jsPDF('landscape');

    pdf.addImage(
      imageData,
      'PNG',
      10,
      10,
      280,
      150
    );

    pdf.save(`${fileName}.pdf`);
  };

  const deleteFromHistory = (id) => {

    const filtered = chartHistory.filter(
      (item) => item.id !== id
    );

    setChartHistory(filtered);

    localStorage.setItem(
      'meu-historico-charts',
      JSON.stringify(filtered)
    );
  };

  return (

    <PageWrapper>

      <MainContent>

        <SideNav />

        <ContentArea>

          <TopSection>

            <Title>
              Histórico de Relatórios
            </Title>

            <Subtitle>
              Visualize, exporte e gerencie todos os relatórios
              e gráficos armazenados na plataforma.
            </Subtitle>

          </TopSection>

          {chartHistory.length === 0 ? (

            <EmptyState>

              <h2>
                Nenhum relatório encontrado
              </h2>

              <p>
                Os gráficos salvos aparecerão aqui.
              </p>

            </EmptyState>

          ) : (

            <HistoryGrid>

              {chartHistory.map((item) => (

                <HistoryCard key={item.id}>

                  <GlowEffect />

                  <ImageWrapper>

                    <ChartImage
                      src={item.image}
                      alt="Snapshot do gráfico"
                    />

                  </ImageWrapper>

                  <CardContent>

                    <ChartTitle>
                      {item.name || 'Relatório'}
                    </ChartTitle>

                    <ChartDate>
                      {item.date}
                    </ChartDate>

                    <ButtonGroup>

                      <ActionButton
                        onClick={() =>
                          exportToPDF(
                            item.image,
                            item.name || 'grafico'
                          )
                        }
                      >
                        Exportar PDF
                      </ActionButton>

                      <DeleteButton
                        onClick={() =>
                          deleteFromHistory(item.id)
                        }
                      >
                        Excluir
                      </DeleteButton>

                    </ButtonGroup>

                  </CardContent>

                </HistoryCard>

              ))}

            </HistoryGrid>

          )}

        </ContentArea>

      </MainContent>

    </PageWrapper>
  );
}

export default Arquivos;