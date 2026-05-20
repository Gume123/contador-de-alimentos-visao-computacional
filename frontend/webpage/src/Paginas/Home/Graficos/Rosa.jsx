import React, { forwardRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ReactEcharts from 'echarts-for-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Times New Roman', Times, serif;
  animation: ${fadeIn} 0.5s ease both;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
`;

const CategoryCard = styled.div`
  background: #fff;
  padding: 18px 20px;
  border-radius: 14px;
  border-left: 5px solid ${(p) => p.color || '#ccc'};
  box-shadow: 0 4px 14px rgba(0,0,0,0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: ${fadeIn} 0.4s ease both;
  animation-delay: ${(p) => p.delay || '0s'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 22px rgba(0,0,0,0.12);
  }

  span {
    display: block;
    color: #64748b;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.6px;
    margin-bottom: 6px;
  }

  strong {
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
  }

  small {
    display: block;
    margin-top: 4px;
    color: #94a3b8;
    font-size: 12px;
  }
`;

const ChartContainer = styled.div`
  background: #fff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.07);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
  gap: 12px;

  svg { opacity: 0.4; }

  p {
    margin: 0;
    font-size: 15px;
    font-family: 'Times New Roman', Times, serif;
  }
`;

const SkeletonBar = styled.div`
  height: ${(p) => p.h || '20px'};
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  width: ${(p) => p.w || '100%'};
  margin-bottom: ${(p) => p.mb || '0'};
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 14px 18px;
  color: #dc2626;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Paleta de cores para produtos dinâmicos
const PALETTE = [
  '#5dac57', '#2e7829', '#446041', '#0f9e03',
  '#3a86ff', '#fb5607', '#ffbe0b', '#8338ec',
  '#06d6a0', '#ef476f', '#118ab2', '#ffd166',
];

const Rosa = forwardRef(({ equipaId }, ref) => {
  const [dadosAlimentos, setDadosAlimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [totalItens, setTotalItens] = useState(0);

  useEffect(() => {
    if (!equipaId) {
      setLoading(false);
      return;
    }

    const fetchDados = async () => {
      setLoading(true);
      setErro(null);

      try {
        const res = await fetch(`http://localhost:8000/relatorio/equipe/${equipaId}`);

        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);

        const data = await res.json();

        if (!data.resumo_por_produto || Object.keys(data.resumo_por_produto).length === 0) {
          setDadosAlimentos([]);
          setTotalItens(0);
          setLoading(false);
          return;
        }

        // Transforma o resumo em array para o gráfico
        const entries = Object.entries(data.resumo_por_produto);
        const total = entries.reduce((acc, [, v]) => acc + v, 0);

        const alimentos = entries.map(([nome, contagem], idx) => ({
          value: contagem,
          name: nome,
          itemStyle: { color: PALETTE[idx % PALETTE.length] },
        }));

        setDadosAlimentos(alimentos);
        setTotalItens(total);
      } catch (err) {
        setErro(err.message || 'Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [equipaId]);

  // --- Skeleton ---
  if (loading) {
    return (
      <PageWrapper>
        <ChartContainer>
          <SkeletonBar h="28px" w="200px" mb="20px" />
          <SkeletonBar h="320px" />
        </ChartContainer>
        <CardGrid>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.07)' }}>
              <SkeletonBar h="12px" w="60%" mb="8px" />
              <SkeletonBar h="22px" w="80%" />
            </div>
          ))}
        </CardGrid>
      </PageWrapper>
    );
  }

  // --- Erro ---
  if (erro) {
    return (
      <ErrorBanner>
        <span>⚠️</span>
        <span>{erro} — Verifique se a API está em execução.</span>
      </ErrorBanner>
    );
  }

  // --- Sem dados ---
  if (dadosAlimentos.length === 0) {
    return (
      <EmptyState>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
          <path d="M3 3h18v18H3z" rx="2" />
          <path d="M9 9h6M9 12h6M9 15h4" />
        </svg>
        <p>Nenhum alimento registrado para esta equipe ainda.</p>
      </EmptyState>
    );
  }

  const option = {
    title: {
      text: 'Alimentos Arrecadados',
      subtext: `Total: ${totalItens} itens`,
      left: 'center',
      textStyle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Times New Roman, serif' },
      subtextStyle: { fontSize: 14, color: '#64748b' },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} itens ({d}%)',
      backgroundColor: '#fff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#1e293b', fontFamily: 'Times New Roman, serif' },
    },
    series: [
      {
        name: 'Alimentos',
        type: 'pie',
        roseType: 'area',
        radius: ['20%', '68%'],
        center: ['50%', '52%'],
        data: dadosAlimentos,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 8,
        },
        label: {
          fontFamily: 'Times New Roman, serif',
          fontSize: 13,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 16,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.18)',
          },
        },
      },
    ],
  };

  return (
    <PageWrapper>
      <ChartContainer>
        <ReactEcharts
          ref={ref}
          option={option}
          style={{ height: '380px', width: '100%' }}
        />
      </ChartContainer>

      <CardGrid>
        {dadosAlimentos.map((item, index) => (
          <CategoryCard
            key={index}
            color={item.itemStyle.color}
            delay={`${index * 0.07}s`}
          >
            <span>{item.name}</span>
            <strong>{item.value}</strong>
            <small>itens reconhecidos</small>
          </CategoryCard>
        ))}
      </CardGrid>
    </PageWrapper>
  );
});

Rosa.displayName = 'Rosa';

export default Rosa;