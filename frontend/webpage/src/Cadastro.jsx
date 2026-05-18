import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const StyledBoxContent = styled.div`
    width: 100%;
    max-width: 760px;

    position: relative;

    background: rgba(255,255,255,0.82);

    backdrop-filter: blur(14px);

    border: 1px solid rgba(255,255,255,0.35);

    border-radius: 28px;

    padding: 65px;

    box-shadow:
        0 20px 50px rgba(0,0,0,0.12),
        0 8px 24px rgba(0,0,0,0.08);

    overflow: hidden;

    @media (max-width: 768px) {
        padding: 40px 28px;
    }
`;

const GlowEffect = styled.div`
    position: absolute;

    width: 240px;
    height: 240px;

    background: rgba(57,108,53,0.15);

    border-radius: 50%;

    filter: blur(60px);

    top: -80px;
    right: -80px;
`;

const TopicContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 45px;
`;

const TopicText = styled.h1`
    margin: 0;

    font-size: 52px;
    line-height: 1.1;

    color: #111;

    font-weight: 800;

    letter-spacing: -1.5px;

    @media (max-width: 768px) {
        font-size: 40px;
    }
`;

const Subtitle = styled.p`
    align-self: center;
    margin-top: 18px;

    color: #5a5a5a;

    font-size: 18px;

    line-height: 1.7;

    max-width: 540px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;

    gap: 28px;
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    color: #202020;

    font-weight: 700;

    font-size: 15px;

    margin-bottom: 10px;

    letter-spacing: 0.3px;
`;

const Input = styled.input`
    width: 100%;

    padding: 18px 20px;

    border: 1.5px solid rgba(0,0,0,0.08);

    border-radius: 16px;

    background: rgba(255,255,255,0.72);

    font-size: 16px;

    color: #111;

    transition: all 0.25s ease;

    box-sizing: border-box;

    &:focus {
        outline: none;

        border-color: #396c35;

        background: white;

        box-shadow:
            0 0 0 4px rgba(57,108,53,0.12);

        transform: translateY(-1px);
    }

    &::placeholder {
        color: #9a9a9a;
    }
`;

const Button = styled.button`
    margin-top: 15px;

    align-self: center;

    min-width: 220px;

    padding: 18px 30px;

    border: none;

    border-radius: 999px;

    background: linear-gradient(
        135deg,
        #396c35 0%,
        #4f8c4a 100%
    );

    color: white;

    font-size: 17px;
    font-weight: 700;

    letter-spacing: 0.3px;

    cursor: pointer;

    transition: all 0.25s ease;

    box-shadow:
        0 10px 25px rgba(57,108,53,0.28);

    &:hover {
        transform: translateY(-3px);

        box-shadow:
            0 16px 32px rgba(57,108,53,0.35);
    }

    &:active {
        transform: scale(0.98);
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

function Cadastro() {

    const navigate = useNavigate();

    const [PrimeiroNome, setPrimeiroNome] = useState('');
    const [UltimoNome, setUltimoNome] = useState('');
    const [Email, setEmail] = useState('');
    const [Senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    primeiro_nome: PrimeiroNome,
                    ultimo_nome: UltimoNome,
                    email: Email,
                    senha: Senha
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.detail || 'Erro ao realizar cadastro.');
                return;
            }

            alert('Cadastro realizado com sucesso!');
            navigate('/');
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor.');
        }
    };

    return (
        <PageContainer>

            <StyledBoxContent>

                <GlowEffect />

                <TopicContainer>

                    <TopicText>
                        Sobre Você
                    </TopicText>

                    <Subtitle>
                        Preencha suas informações para continuar
                        e acessar a plataforma de forma segura.
                    </Subtitle>

                </TopicContainer>

                <Form onSubmit={handleSubmit}>

                    <FieldGroup>
                        <Label>Primeiro Nome</Label>

                        <Input
                            type="text"
                            placeholder="Digite seu primeiro nome"
                            value={PrimeiroNome}
                            onChange={(e) => setPrimeiroNome(e.target.value)}
                            required
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>Último Nome</Label>

                        <Input
                            type="text"
                            placeholder="Digite seu sobrenome"
                            value={UltimoNome}
                            onChange={(e) => setUltimoNome(e.target.value)}
                            required
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>Email</Label>

                        <Input
                            type="email"
                            placeholder="Digite seu melhor e-mail"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>Senha</Label>

                        <Input
                            type="password"
                            placeholder="Digite sua melhor senha"
                            value={Senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </FieldGroup>

                    <Button type="submit">
                        Continuar
                    </Button>

                </Form>

            </StyledBoxContent>

        </PageContainer>
    );
}

export default Cadastro;