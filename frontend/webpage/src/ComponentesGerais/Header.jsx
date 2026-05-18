import { Link } from 'react-router-dom';
import Liderancas from '../assets/liderancas.png';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  width: 100%;
  background: linear-gradient(
  90deg,
  #2b8a63 0%,
  #2f7d5c 35%,
  #245847 70%,
  #1d2b31 100%
);

  padding: 18px 60px;

  top: 0;
  z-index: 1000;

  box-sizing: border-box;

  box-shadow: 0 2px 10px rgba(0,0,0,0.08);

  @media (max-width: 768px) {
    padding: 18px 25px;
  }
`;

const NavContainer = styled.div`
  max-width: 1400px;

  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const HeaderImg = styled.img`
  width: 78px;
  height: 78px;
  object-fit: contain;
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BrandTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  color: white;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
`;

const BrandSubtitle = styled.span`
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  margin-top: 4px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 35px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledNavLink = styled(Link)`
  color: white;
  text-decoration: none;

  font-size: 16px;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;

  position: relative;

  transition: 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &::after {
    content: '';
    position: absolute;

    bottom: -6px;
    left: 0;

    width: 0%;
    height: 2px;

    background-color: white;

    transition: 0.2s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const BaseButton = styled(Link)`
  text-decoration: none;

  padding: 12px 24px;

  border-radius: 999px;

  font-weight: 700;
  font-size: 15px;

  transition: 0.2s ease;

  font-family: Arial, Helvetica, sans-serif;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ButtonPerfil = styled(BaseButton)`
  background-color: rgba(255,255,255,0.12);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);

  &:hover {
    background-color: rgba(255,255,255,0.18);
  }
`;

const ButtonLogin = styled(BaseButton)`
  background-color: white;
  color: #396c35;

  &:hover {
    opacity: 0.92;
  }
`;

export default function Header() {

  const handleNavigation = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <HeaderContainer>

      <NavContainer>

        <LeftSection>

          <HeaderImg
            src={Liderancas}
            alt="Lideranças Empáticas"
          />

          <BrandText>
            <BrandTitle>
              Lideranças Empáticas
            </BrandTitle>

            <BrandSubtitle>
              Desenvolvimento humano e social
            </BrandSubtitle>
          </BrandText>

        </LeftSection>

        

        <ButtonGroup>

          <ButtonPerfil
            onClick={handleNavigation}
            to="/perfil"
          >
            Perfil
          </ButtonPerfil>

          <ButtonLogin
            onClick={handleNavigation}
            to="/"
          >
            Login
          </ButtonLogin>

        </ButtonGroup>

      </NavContainer>

    </HeaderContainer>
  );
}