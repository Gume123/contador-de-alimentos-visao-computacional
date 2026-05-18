import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledBoxContent = styled.div`
    width: 100%;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;

    gap: 26px;
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    color: #1e1e1e;

    font-size: 15px;
    font-weight: 700;

    margin-bottom: 10px;

    letter-spacing: 0.3px;
`;

const Input = styled.input`
    width: 100%;

    padding: 18px 20px;

    border-radius: 16px;

    border: 1.5px solid rgba(0,0,0,0.08);

    background: rgba(255,255,255,0.75);

    font-size: 16px;

    color: #111;

    box-sizing: border-box;

    transition: all 0.25s ease;

    &:focus {
        outline: none;

        border-color: #396c35;

        background: white;

        box-shadow:
            0 0 0 4px rgba(57,108,53,0.12);

        transform: translateY(-1px);
    }

    &::placeholder {
        color: #9b9b9b;
    }
`;

const ActionsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 20px;

    margin-top: 5px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const SignupText = styled.p`
    margin: 0;

    color: #666;

    font-size: 15px;

    line-height: 1.6;

    a {
        color: #396c35;

        text-decoration: none;

        font-weight: 700;

        transition: 0.2s ease;
    }

    a:hover {
        opacity: 0.8;
    }

    @media (max-width: 768px) {
        text-align: center;
    }
`;

const Button = styled.button`
    min-width: 190px;

    padding: 17px 28px;

    border: none;

    border-radius: 999px;

    background: linear-gradient(
        135deg,
        #396c35 0%,
        #4f8c4a 100%
    );

    color: white;

    font-size: 16px;
    font-weight: 700;

    letter-spacing: 0.3px;

    cursor: pointer;

    transition: all 0.25s ease;

    box-shadow:
        0 10px 24px rgba(57,108,53,0.25);

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

const ForgotPassword = styled.button`
    background: none;

    border: none;

    padding: 0;

    color: #666;

    font-size: 14px;

    cursor: pointer;

    transition: 0.2s ease;

    &:hover {
        color: #396c35;
    }

    @media (max-width: 768px) {
        text-align: center;
    }
`;

const API_URL = 'http://localhost:8000';


function LoginBox() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    senha: password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.detail || 'Erro ao realizar login.');
                return;
            }

            const data = await response.json();
            console.log('Login efetuado com sucesso:', data.mensagem);
            
            localStorage.setItem('user_info', JSON.stringify(data.usuario));

            navigate('/Home');
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor.');
        }
    };

    return (

        <StyledBoxContent>

            <Form onSubmit={handleSubmit}>

                <FieldGroup>

                    <Label>Email</Label>

                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu melhor e-mail"
                        required
                    />

                </FieldGroup>

                <FieldGroup>

                    <Label>Senha</Label>

                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        required
                    />

                </FieldGroup>

                <ForgotPassword type="button">
                    Esqueceu sua senha?
                </ForgotPassword>

                <ActionsContainer>

                    <SignupText>
                        Não possui conta?{' '}
                        <Link to="/Cadastro">
                            Cadastre-se
                        </Link>
                    </SignupText>

                    <Button type="submit">
                        Entrar
                    </Button>

                </ActionsContainer>

            </Form>

        </StyledBoxContent>
    );
}

export default LoginBox;