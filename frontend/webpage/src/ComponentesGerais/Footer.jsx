import styled from 'styled-components';
import {
  FaInstagram,
  FaYoutube,
  FaLinkedinIn
} from 'react-icons/fa';

import React from 'react';
import Liderancas from '../assets/liderancas.png';

const FooterContainer = styled.footer`
  background: linear-gradient(
  90deg,
  #2b8a63 0%,
  #2f7d5c 35%,
  #245847 70%,
  #1d2b31 100%
);
  color: white;

  padding: 60px 80px 30px;

  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 40px 25px;
  }
`;

const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const FooterImg = styled.img`
  width: 95px;
  height: 95px;
  object-fit: contain;
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandTitle = styled.h3`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
`;

const BrandSubtitle = styled.p`
  margin-top: 8px;
  font-size: 15px;
  opacity: 0.85;
  max-width: 320px;
  line-height: 1.5;
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 35px;
  flex-wrap: wrap;
  justify-content: center;

  a {
    color: white;
    text-decoration: none;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 17px;
    font-weight: 600;
    position: relative;
    transition: 0.2s ease;

    &:hover {
      opacity: 0.8;
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
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  a {
    width: 48px;
    height: 48px;

    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 50%;

    color: white;
    font-size: 20px;

    transition: 0.2s ease;

    &:hover {
      background-color: rgba(255,255,255,0.12);
      transform: translateY(-2px);
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255,255,255,0.2);

  padding-top: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 14px;
  opacity: 0.8;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

function Footer() {
  return (
    <FooterContainer>

      <FooterTop>

        <BrandSection>
          <FooterImg
            src={Liderancas}
            alt="Lideranças Empáticas"
          />

          <BrandText>
            <BrandTitle>
              Lideranças Empáticas
            </BrandTitle>

            <BrandSubtitle>
              Desenvolvendo conexões humanas,
              liderança e transformação social.
            </BrandSubtitle>
          </BrandText>
        </BrandSection>

        <LinksContainer>
          <a href="#">Início</a>
          <a href="#">Participantes</a>
        </LinksContainer>

        <SocialLinks>

          <a
            href="https://www.youtube.com/@Lideran%C3%A7asEmp%C3%A1ticas"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>

          <a
            href="https://www.linkedin.com/company/projeto-lideran%C3%A7as-emp%C3%A1ticas/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn />
          </a>

          <a
            href="https://www.instagram.com/liderancasempaticas/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>

        </SocialLinks>

      </FooterTop>

      <FooterBottom>
        <span>
          © 2025 Lideranças Empáticas. Todos os direitos reservados.
        </span>

        <span>
          Desenvolvido para impacto social e educacional.
        </span>
      </FooterBottom>

    </FooterContainer>
  );
}

export default Footer;