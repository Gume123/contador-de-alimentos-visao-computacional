import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SideNavContainer = styled.aside`
  width: 260px;

  min-height: 100vh;

  background: linear-gradient(
    180deg,
    #2f6f3b 0%,
    #244421 100%
  );

  padding: 35px 25px;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  box-shadow: 4px 0 18px rgba(0,0,0,0.08);

  position: sticky;
  top: 0;

  @media (max-width: 900px) {
    width: 100%;
    min-height: auto;

    flex-direction: row;
    justify-content: center;
    align-items: center;

    gap: 15px;

    padding: 18px;

    position: relative;
  }
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;

  gap: 18px;

  margin-top: 40px;

  @media (max-width: 900px) {
    flex-direction: row;
    margin-top: 0;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavItem = styled(Link)`
  text-decoration: none;

  color: rgba(255,255,255,0.9);

  font-size: 18px;
  font-weight: 600;

  padding: 16px 18px;

  border-radius: 14px;

  transition: all 0.25s ease;

  position: relative;

  &:hover {
    background: rgba(255,255,255,0.12);

    transform: translateX(4px);

    color: white;
  }

  @media (max-width: 900px) {
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const SidebarTitle = styled.h2`
  color: white;

  margin: 0;

  font-size: 28px;
  font-weight: 800;

  letter-spacing: -0.5px;

  @media (max-width: 900px) {
    display: none;
  }
`;

function SideNav() {
  return (
    <SideNavContainer>

      <SidebarTitle>
        Painel
      </SidebarTitle>

      <NavSection>

        <NavItem to="/Home">
          Home
        </NavItem>

        <NavItem to="/arquivos">
          Arquivos
        </NavItem>

        <NavItem to="/times">
          Times
        </NavItem>

      </NavSection>

    </SideNavContainer>
  );
}

export default SideNav;