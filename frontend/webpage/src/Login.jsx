import React from 'react';
import styled from 'styled-components';
import LoginBox from './LoginBox.jsx';

const PageContainer = styled.div`
    min-height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 60px 20px;

    background:
        radial-gradient(circle at top left, #3f7d5c 0%, transparent 25%),
        radial-gradient(circle at bottom right, #1f2f35 0%, transparent 25%),
        #f4f4f4;

    overflow: hidden;
`;

const ContentWrapper = styled.div`
    width: 100%;
    max-width: 1350px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 80px;

    @media (max-width: 980px) {
        flex-direction: column;
        gap: 50px;
    }
`;

const LeftContent = styled.div`
    flex: 1;
    max-width: 560px;

    position: relative;
`;

const GlowEffect = styled.div`
    position: absolute;

    width: 260px;
    height: 260px;

    border-radius: 50%;

    background: rgba(57,108,53,0.12);

    filter: blur(70px);

    top: -80px;
    left: -80px;

    z-index: 0;
`;

const TextContent = styled.div`
    position: relative;
    z-index: 1;
`;

const StyleTitulo = styled.h1`
    margin: 0;

    font-size: 72px;
    line-height: 1.05;

    color: #111;

    font-weight: 800;

    letter-spacing: -2px;

    @media (max-width: 768px) {
        font-size: 46px;
        text-align: center;
    }
`;

const Highlight = styled.span`
    background: linear-gradient(
        135deg,
        #396c35,
        #5ea658
    );

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
    margin-top: 28px;

    color: #5d5d5d;

    font-size: 20px;

    line-height: 1.8;

    max-width: 520px;

    @media (max-width: 768px) {
        text-align: center;
        font-size: 18px;
    }
`;

const StatsRow = styled.div`
    display: flex;

    gap: 20px;

    margin-top: 40px;

    @media (max-width: 768px) {
        justify-content: center;
        flex-wrap: wrap;
    }
`;

const StatCard = styled.div`
    background: rgba(255,255,255,0.65);

    backdrop-filter: blur(10px);

    border: 1px solid rgba(255,255,255,0.25);

    border-radius: 20px;

    padding: 20px 24px;

    min-width: 130px;

    box-shadow:
        0 8px 20px rgba(0,0,0,0.06);
`;

const StatNumber = styled.h3`
    margin: 0;

    color: #396c35;

    font-size: 28px;

    font-weight: 800;
`;

const StatLabel = styled.p`
    margin-top: 6px;

    color: #666;

    font-size: 14px;
`;

const RightContent = styled.div`
    flex: 1;

    display: flex;
    justify-content: center;
`;

const LoginCard = styled.div`
    width: 100%;
    max-width: 540px;

    position: relative;

    background: rgba(255,255,255,0.82);

    backdrop-filter: blur(14px);

    border: 1px solid rgba(255,255,255,0.35);

    border-radius: 30px;

    padding: 55px;

    box-shadow:
        0 20px 50px rgba(0,0,0,0.12),
        0 8px 24px rgba(0,0,0,0.08);

    overflow: hidden;

    @media (max-width: 768px) {
        padding: 35px 25px;
    }
`;

const CardGlow = styled.div`
    position: absolute;

    width: 220px;
    height: 220px;

    border-radius: 50%;

    background: rgba(57,108,53,0.14);

    filter: blur(60px);

    top: -70px;
    right: -70px;
`;

const LoginTitle = styled.h2`
    position: relative;

    margin: 0 0 12px 0;

    font-size: 42px;

    color: #111;

    font-weight: 800;

    letter-spacing: -1px;
`;

const LoginSubtitle = styled.p`
    position: relative;

    color: #666;

    font-size: 17px;

    line-height: 1.7;

    margin-bottom: 35px;
`;

function Login() {

    return (

        <PageContainer>

            <ContentWrapper>

                <LeftContent>

                    <GlowEffect />

                    <TextContent>

                        <StyleTitulo>
                            Acesse sua <Highlight>plataforma</Highlight>
                        </StyleTitulo>

                        <Description>
                            Entre na sua conta para visualizar relatórios,
                            acompanhar informações importantes e acessar
                            recursos exclusivos da plataforma.
                        </Description>

                        <StatsRow>

                            <StatCard>
                                <StatNumber>
                                    24h
                                </StatNumber>

                                <StatLabel>
                                    Disponibilidade
                                </StatLabel>
                            </StatCard>

                            <StatCard>
                                <StatNumber>
                                    100%
                                </StatNumber>

                                <StatLabel>
                                    Seguro
                                </StatLabel>
                            </StatCard>

                        </StatsRow>

                    </TextContent>

                </LeftContent>

                <RightContent>

                    <LoginCard>

                        <CardGlow />

                        <LoginTitle>
                            Login
                        </LoginTitle>

                        <LoginSubtitle>
                            Faça login para continuar utilizando
                            a plataforma de forma segura.
                        </LoginSubtitle>

                        <LoginBox />

                    </LoginCard>

                </RightContent>

            </ContentWrapper>

        </PageContainer>
    );
}

export default Login;