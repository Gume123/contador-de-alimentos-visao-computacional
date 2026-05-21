import React, { forwardRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactEcharts from 'echarts-for-react';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 100%;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: center;
  padding: 20px;
  width: 100%; 
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const CardStyled = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-top: 20px;
  width: 100%;      
  max-width: 250px;
  border-left: 6px solid ${(props) => props.unitColor || '#64748b'};
  
  h3 {
    margin: 0;
    font-size: 14px;
    color: #64748b;
    text-transform: uppercase;
  }

  .number {
    font-size: 32px;
    font-weight: bold;
    color: #1e293b;
  }

  .unit {
    font-size: 18px;
    font-weight: 600;
    color: #94a3b8;
    margin-left: 4px;
  }
`;

const parseWeightToGrams = (pesoStr) => {
  if (!pesoStr) return 0;

  const clean = pesoStr.trim();

  const match = clean.match(/^([\d.,]+)\s*([a-zA-Z]+)$/);

  if (!match) {
    const num = parseFloat(clean.replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }

  const value = parseFloat(match[1].replace(',', '.'));
  const unit = match[2].toLowerCase();

  if (isNaN(value)) return 0;

  if (
    unit === 'kg' ||
    unit === 'l' ||
    unit === 'liter' ||
    unit === 'litro' ||
    unit === 'litros'
  ) {
    return value * 1000;
  }

  if (
    unit === 'g' ||
    unit === 'ml' ||
    unit === 'grama' ||
    unit === 'gramas'
  ) {
    return value;
  }

  return value;
};

// NORMALIZAÇÃO DO PESO
// Evita "1L" e "1l" virarem colunas diferentes
const normalizePeso = (pesoStr) => {
  if (!pesoStr) return pesoStr;

  const clean = pesoStr.trim();

  const match = clean.match(/^([\d.,]+)\s*([a-zA-Z]+)$/);

  if (!match) return clean;

  const value = match[1];
  const unit = match[2].toLowerCase();

  if (
    unit === 'l' ||
    unit === 'liter' ||
    unit === 'litro' ||
    unit === 'litros'
  ) {
    return `${value}L`;
  }

  if (unit === 'kg') return `${value}kg`;

  if (
    unit === 'g' ||
    unit === 'grama' ||
    unit === 'gramas'
  ) {
    return `${value}g`;
  }

  if (unit === 'ml') return `${value}ml`;

  return clean;
};

const mapProductName = (name) => {
  if (!name) return 'Outros';

  const n = name.toLowerCase();

  if (n.includes('arroz')) return 'Arroz';

  if (
    n.includes('feijão') ||
    n.includes('feijao')
  ) {
    return 'Feijão';
  }

  if (
    n.includes('macarrão') ||
    n.includes('macarrao')
  ) {
    return 'Macarrão';
  }

  if (
    n.includes('acucar') ||
    n.includes('açúcar') ||
    n.includes('açucar')
  ) {
    return 'Açúcar';
  }

  if (
    n.includes('fuba') ||
    n.includes('fubá')
  ) {
    return 'Fubá';
  }

  if (
    n.includes('oleo') ||
    n.includes('óleo')
  ) {
    return 'Óleo';
  }

  return 'Outros';
};

// MANTÉM ORDEM ORIGINAL DE APARIÇÃO
// NÃO ORDENA
// Isso evita o bug do ECharts trocar as barras
const manterOrdemAparicao = (set) => Array.from(set);

const WeightCard = ({ total }) => {
  const getDisplayData = (v) => {
    if (v >= 1000000)
      return {
        val: (v / 1000000).toFixed(2),
        unit: 't',
        color: '#b45309'
      };

    if (v >= 1000)
      return {
        val: (v / 1000).toFixed(2),
        unit: 'kg',
        color: '#2563eb'
      };

    return {
      val: v.toFixed(1),
      unit: 'g',
      color: '#64748b'
    };
  };

  const display = getDisplayData(total);

  return (
    <CardStyled unitColor={display.color}>
      <h3>Peso Total Somado</h3>

      <div>
        <span className="number">{display.val}</span>
        <span className="unit">{display.unit}</span>
      </div>
    </CardStyled>
  );
};

const Linha = forwardRef(({ equipaId }, ref) => {
  const [totalPeso, setTotalPeso] = useState(0);

  const [datasetSource, setDatasetSource] = useState([
  ['product'],
  ['Sem Dados']
]);

const [seriesConfig, setSeriesConfig] = useState([]);

  useEffect(() => {
    if (!equipaId) return;

    const fetchDados = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/relatorio/equipe/${equipaId}`
        );

        if (!res.ok) {
          throw new Error(`Erro ${res.status}`);
        }

        const data = await res.json();

        const historico = data.historico_detalhado || [];

        // SOMA PESO TOTAL
        const total = historico.reduce((acc, ev) => {
          const pesoEmGramas = parseWeightToGrams(ev.peso);

          return acc + (pesoEmGramas * (ev.contagem || 1));
        }, 0);

        setTotalPeso(total);

        // PROCESSAMENTO DO GRÁFICO
        if (historico.length > 0) {

          // IMPORTANTE:
          // NÃO ORDENAR OS PESOS
          // Mantém a ordem original do banco
          // Isso evita o deslocamento das barras no ECharts

          const pesosUnicosSet = new Set();

          historico.forEach(ev => {
            if (ev.peso) {
              pesosUnicosSet.add(
                normalizePeso(ev.peso)
              );
            }
          });

          const pesosUnicos =
            pesosUnicosSet.size > 0
              ? manterOrdemAparicao(pesosUnicosSet)
              : ['500g', '1kg', '5kg'];

          const produtosUnicosSet = new Set();

          historico.forEach(ev => {
            produtosUnicosSet.add(
              mapProductName(ev.tipo_produto)
            );
          });

          const produtosUnicos = Array.from(produtosUnicosSet);

          const source = [
            ['product', ...pesosUnicos]
          ];

          produtosUnicos.forEach(prod => {
            const linha = [prod];

            pesosUnicos.forEach(pesoNorm => {

              const totalQtd = historico
                .filter(ev =>
                  mapProductName(ev.tipo_produto) === prod &&
                  normalizePeso(ev.peso) === pesoNorm
                )
                .reduce(
                  (acc, ev) =>
                    acc + (ev.contagem || 1),
                  0
                );

              linha.push(totalQtd);
            });

            source.push(linha);
          });

          setDatasetSource(source);

          setSeriesConfig(
            pesosUnicos.map(() => ({
              type: 'bar'
            }))
          );

        } else {

          setDatasetSource([
            ['product'],
            ['Sem Alimentos']
          ]);

          setSeriesConfig([]);
        }

      } catch (err) {
        console.error(
          'Erro ao buscar relatorio equipe:',
          err
        );
      }
    };

    fetchDados();

  }, [equipaId]);

  const option = {
    color: [
      '#5dac57',
      '#2e7829',
      '#446041',
      '#3a86ff',
      '#fb5607',
      '#ffbe0b'
    ],

    title: {
      text: 'Peso dos Alimentos',
      subtext: 'Distribuição por embalagem (itens)',
      left: 'center',

      textStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        fontFamily: 'Times New Roman, serif'
      },
    },

    tooltip: {
      trigger: 'axis'
    },

    dataset: {
      source: datasetSource,
    },

    xAxis: {
      type: 'category'
    },

    yAxis: {
      name: 'Quantidade'
    },

    series: seriesConfig,
  };

  return (
    <PageWrapper>
      <ChartContainer>

        <ReactEcharts
          ref={ref}
          option={option}
          style={{
            height: '400px',
            width: '100%'
          }}
        />

      </ChartContainer>

      <WeightCard total={totalPeso} />
    </PageWrapper>
  );
});

export default Linha;