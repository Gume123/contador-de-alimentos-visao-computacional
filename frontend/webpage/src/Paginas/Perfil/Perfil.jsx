import { useState, useRef } from 'react';
import styled from 'styled-components';

import SideNav from '../../ComponentesGerais/SideNav.jsx';

const PageWrapper = styled.div`
  min-height: 100vh;

  background:
    radial-gradient(circle at top left, #3f7d5c 0%, transparent 25%),
    radial-gradient(circle at bottom right, #1f2f35 0%, transparent 25%),
    #f4f4f4;

  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;

  padding: 45px;

  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const TopSection = styled.div`
  margin-bottom: 40px;
`;

const PageTitle = styled.h1`
  margin: 0;

  font-size: 48px;
  font-weight: 800;

  color: #111;

  letter-spacing: -1.5px;

  @media (max-width: 768px) {
    font-size: 38px;
  }
`;

const Subtitle = styled.p`
  margin-top: 12px;

  color: #666;

  font-size: 18px;

  line-height: 1.7;
`;

const ProfileGrid = styled.div`
  display: grid;

  grid-template-columns: 340px 1fr;

  gap: 30px;

  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  position: relative;

  background: rgba(255,255,255,0.78);

  backdrop-filter: blur(14px);

  border-radius: 30px;

  padding: 35px;

  border: 1px solid rgba(255,255,255,0.25);

  box-shadow:
    0 12px 32px rgba(0,0,0,0.08),
    0 4px 12px rgba(0,0,0,0.04);

  overflow: hidden;
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

const ProfileCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  position: relative;

  width: 170px;
  height: 170px;

  border-radius: 50%;

  padding: 5px;

  background: linear-gradient(
    135deg,
    #396c35,
    #5ea658
  );

  margin-bottom: 25px;

  box-shadow:
    0 12px 24px rgba(57,108,53,0.25);
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 50%;

  background: white;
`;

const UserName = styled.h2`
  margin: 0;

  font-size: 28px;
  font-weight: 800;

  color: #161616;

  text-align: center;
`;

const UserEmail = styled.p`
  margin-top: 10px;

  color: #666;

  font-size: 15px;

  text-align: center;
`;

const ChangePhotoButton = styled.button`
  margin-top: 25px;

  border: none;

  padding: 14px 24px;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    #396c35 0%,
    #4f8c4a 100%
  );

  color: white;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.25s ease;

  box-shadow:
    0 10px 25px rgba(57,108,53,0.25);

  &:hover {
    transform: translateY(-3px);

    box-shadow:
      0 16px 32px rgba(57,108,53,0.35);
  }
`;

const FormCard = styled(Card)``;

const FormTitle = styled.h2`
  margin: 0 0 30px 0;

  font-size: 30px;
  font-weight: 800;

  color: #111;
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
  color: #202020;

  font-size: 15px;
  font-weight: 700;

  margin-bottom: 10px;
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
`;

const SubmitButton = styled.button`
  margin-top: 10px;

  align-self: flex-start;

  border: none;

  padding: 17px 30px;

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
      0 16px 32px rgba(57,108,53,0.35);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Perfil = () => {

  const fileInputRef = useRef(null);

  const [image, setImage] = useState(
    'https://via.placeholder.com/300'
  );

  const userInfo = JSON.parse(localStorage.getItem('user_info')) || {};

  const [formData, setFormData] = useState({
    primeiroNome: userInfo.primeiro_nome || '',
    ultimoNome: userInfo.ultimo_nome || '',
    email: userInfo.email || '',
  });

  const handleImageChange = (event) => {

    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    alert('Perfil atualizado!');
  };

  return (

    <PageWrapper>

      <ContentArea>

        <SideNav />

        <MainContent>

          <TopSection>

            <PageTitle>
              Meu Perfil
            </PageTitle>

            <Subtitle>
              Gerencie suas informações pessoais
              e personalize sua conta.
            </Subtitle>

          </TopSection>

          <ProfileGrid>

            <ProfileCard>

              <GlowEffect />

              <AvatarWrapper>

                <Avatar
                  src={image}
                  alt="Foto de perfil"
                />

              </AvatarWrapper>

              <UserName>
                {formData.primeiroNome} {formData.ultimoNome}
              </UserName>

              <UserEmail>
                {formData.email}
              </UserEmail>

              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
              />

              <ChangePhotoButton
                type="button"
                onClick={() => fileInputRef.current.click()}
              >
                Alterar Foto
              </ChangePhotoButton>

            </ProfileCard>

            <FormCard>

              <GlowEffect />

              <FormTitle>
                Informações Pessoais
              </FormTitle>

              <Form onSubmit={handleSubmit}>

                <FieldGroup>

                  <Label>
                    Primeiro Nome
                  </Label>

                  <Input
                    name="primeiroNome"
                    type="text"
                    value={formData.primeiroNome}
                    onChange={handleInputChange}
                    required
                  />

                </FieldGroup>

                <FieldGroup>

                  <Label>
                    Último Nome
                  </Label>

                  <Input
                    name="ultimoNome"
                    type="text"
                    value={formData.ultimoNome}
                    onChange={handleInputChange}
                    required
                  />

                </FieldGroup>

                <FieldGroup>

                  <Label>
                    Email
                  </Label>

                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                </FieldGroup>

                <SubmitButton type="submit">
                  Salvar Alterações
                </SubmitButton>

              </Form>

            </FormCard>

          </ProfileGrid>

        </MainContent>

      </ContentArea>

    </PageWrapper>
  );
};

export default Perfil;