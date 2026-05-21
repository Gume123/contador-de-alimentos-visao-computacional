import cv2
import math
import time
import numpy as np
import requests
from datetime import datetime
from ultralytics import YOLO

# =========================
# CARREGAR MODELO
# =========================
modelo = YOLO("best.pt")

print("Classes do modelo:", modelo.names)

# =========================
# INICIAR CÂMERA
# =========================
camera = cv2.VideoCapture(0)

camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

if not camera.isOpened():
    print("Erro: não foi possível abrir a câmera.")
    exit()

print("Iniciando câmera... Pressione 'q' para sair.")

# =========================
# CONFIG SERVIDOR
# =========================
URL_SERVIDOR = "http://127.0.0.1:8000/registrar-contagem/"

# =========================
# CALIBRAÇÃO DA PLATAFORMA
# =========================

# TROQUE PELOS PONTOS DO SEU CALIBRADOR
pontos_imagem_pixel = np.array([
    [120, 23],
    [534, 17],
    [582, 432],
    [79, 432]
], dtype="float32")

# Quadrado real de 30cm x 30cm
pontos_real_cm = np.array([
    [0, 0],
    [27, 0],
    [27, 27],
    [0, 27]
], dtype="float32")

# Matriz de conversão pixel -> cm
matriz_medidas, _ = cv2.findHomography(
    pontos_imagem_pixel,
    pontos_real_cm
)

# =========================
# VARIÁVEIS DE CONTROLE
# =========================

estado = "SEM_OBJETO"


frames_estaveis = 0
frames_sem_objeto = 0

item_atual = None

# Quantidade de frames necessários
FRAMES_ESTAVEIS = 10
FRAMES_SEM_OBJETO = 10

# Contagem total real
contagem_total = {}

# =========================
# CONTROLE DE CONFIRMAÇÃO
# =========================

item_pendente = None

historico_confirmados = []
mensagem_feedback = ""

# Lista de notificações ativas: [{"tipo": str, "texto": str, "timestamp": float}, ...]
notificacoes = []

# =========================
# FUNÇÃO DE ENVIO
# =========================

def enviar_para_servidor(item_completo):

    try:

        partes = item_completo.split()

        peso = partes[-1]

        nome_item = " ".join(partes[:-1])
        dados = {
            "equipa_id": 1,
            "tipo_produto": nome_item,
            "peso": peso,
            "contagem": 1,
            "confianca": 1.0
        }

        resposta = requests.post(
            URL_SERVIDOR,
            json=dados,
            timeout=3
        )

        print(f"ENVIADO -> {dados}")
        print(f"STATUS -> {resposta.status_code}")

        dados_resposta = resposta.json()

        print(dados_resposta)
        id_servidor = dados_resposta["id"]

        return id_servidor

    except Exception as erro:

        print(f"ERRO AO ENVIAR: {erro}")

def deletar_do_servidor(id_item):

    try:
        url_delete = f"http://127.0.0.1:8000/registrar-contagem/{id_item}"

        resposta = requests.delete(url_delete)

        print(f"DELETE STATUS: {resposta.status_code}")

    except Exception as erro:

        print(f"ERRO DELETE: {erro}")

# =========================
# LOOP PRINCIPAL
# =========================
while True:

    sucesso, frame = camera.read()

    if not sucesso:
        print("Erro ao acessar câmera.")
        break

    resultados = modelo(frame, stream=True)

    itens_frame = []

    frame_anotado = frame.copy()

    # =========================
    # DETECÇÕES YOLO
    # =========================
    for resultado in resultados:

        frame_anotado = resultado.plot()
        frame_anotado = np.ascontiguousarray(frame_anotado).copy()

        if resultado.boxes is not None and len(resultado.boxes) > 0:

            nomes = resultado.names

            for box in resultado.boxes:

                cls_id = int(box.cls[0])

                nome_item = nomes[cls_id]

                itens_frame.append(nome_item)

                # =========================
                # COORDENADAS DA BOX
                # =========================
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                # =========================
                # MEDIÇÃO REAL EM CM
                # =========================

                base_esq_pixel = np.array([[[x1, y2]]], dtype="float32")
                base_dir_pixel = np.array([[[x2, y2]]], dtype="float32")

                base_esq_cm = cv2.perspectiveTransform(
                    base_esq_pixel,
                    matriz_medidas
                )[0][0]

                base_dir_cm = cv2.perspectiveTransform(
                    base_dir_pixel,
                    matriz_medidas
                )[0][0]

                largura_cm = math.sqrt(
                    (base_dir_cm[0] - base_esq_cm[0])**2 +
                    (base_dir_cm[1] - base_esq_cm[1])**2
                )

                # =========================
                # CLASSIFICAÇÃO DE PESO
                # =========================

                peso = "desconhecido"

                # ARROZ
                if nome_item == "pacote de arroz":

                    if largura_cm < 22:
                        peso = "1kg"

                    elif largura_cm < 27:
                        peso = "2kg"

                    else:
                        peso = "5kg"

                # FEIJÃO
                elif nome_item == "pacote de feijão":

                    if largura_cm < 22:
                        peso = "1kg"

                    else:
                        peso = "2kg"

                # MACARRÃO
                elif nome_item == "pacote de macarrão":

                    peso = "500g"

                # AÇÚCAR
                elif nome_item == "pacote de acucar":

                    if largura_cm < 25:
                        peso = "1kg"

                    else:
                        peso = "5kg"

                # FUBÁ
                elif nome_item == "pacote de fuba":

                    if largura_cm < 22:
                        peso = "500g"

                    else:
                        peso = "1kg"

                # ÓLEO
                elif nome_item == "garrafa de oleo":

                    if largura_cm < 8:
                        peso = "900ml"

                    else:
                        peso = "1L"

                # Nome final
                nome_completo = f"{nome_item} {peso}"

                item_atual = nome_completo

                # Mostrar medida
                texto = f"{nome_completo} ({largura_cm:.1f}cm)"

                cv2.putText(
                    frame_anotado,
                    texto,
                    (int(x1), int(y1) - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 255),
                    2
                )

    # =========================
    # LÓGICA DE CONTAGEM
    # =========================

    if len(itens_frame) > 0:

        # Como passa 1 objeto por vez,
        # pegamos o primeiro detectado
        item_detectado = item_atual

        frames_sem_objeto = 0

        # =========================
        # SEM OBJETO -> DETECTOU
        # =========================
        if estado == "SEM_OBJETO":

            item_atual = item_detectado
            frames_estaveis = 1

            estado = "OBJETO_DETECTADO"

        # =========================
        # OBJETO SENDO VALIDADO
        # =========================
        elif estado == "OBJETO_DETECTADO":

            # Mesmo objeto continua
            if item_detectado == item_atual:

                frames_estaveis += 1

            else:
                # Troca de objeto
                item_atual = item_detectado
                frames_estaveis = 1

            # CONFIRMOU OBJETO
            if frames_estaveis >= FRAMES_ESTAVEIS:

                if item_atual not in contagem_total:
                    contagem_total[item_atual] = 0

                # ITEM AGORA FICA PENDENTE
                item_pendente = item_atual

                print(f"ITEM PENDENTE: {item_pendente}")

                estado = "OBJETO_CONTADO"

        # =========================
        # JÁ CONTADO
        # =========================
        elif estado == "OBJETO_CONTADO":
            pass

    # =========================
    # NENHUM OBJETO DETECTADO
    # =========================
    else:

        frames_sem_objeto += 1

        # Liberar nova contagem
        if frames_sem_objeto >= FRAMES_SEM_OBJETO:

            estado = "SEM_OBJETO"

            frames_estaveis = 0
            item_atual = None

    # =========================
    # PAINEL VISUAL
    # =========================

    # Filtra apenas itens confirmados (quantidade > 0)
    itens_confirmados = {k: v for k, v in contagem_total.items() if v > 0}

    linhas_lista = len(itens_confirmados)
    altura_caixa = 45 + max(linhas_lista, 1) * 24 + 50

    cv2.rectangle(frame_anotado,
                  (10, 10),
                  (460, altura_caixa),
                  (0, 0, 0),
                  -1)

    cv2.putText(frame_anotado,
                "CONTAGEM TOTAL",
                (18, 34),
                cv2.FONT_HERSHEY_COMPLEX,
                0.6,
                (0, 220, 220),
                1)

    y_pos = 58

    for item, quantidade in itens_confirmados.items():

        texto = f"{item}: {quantidade}"

        cv2.putText(frame_anotado,
                    texto,
                    (18, y_pos),
                    cv2.FONT_HERSHEY_COMPLEX,
                    0.5,
                    (220, 220, 220),
                    1)

        y_pos += 24

    if not itens_confirmados:
        cv2.putText(frame_anotado,
                    "Nenhum item confirmado",
                    (18, y_pos),
                    cv2.FONT_HERSHEY_COMPLEX,
                    0.45,
                    (140, 140, 140),
                    1)
        y_pos += 24

    # Estado e atalhos
    cv2.putText(frame_anotado,
                f"Estado: {estado}",
                (18, y_pos + 10),
                cv2.FONT_HERSHEY_COMPLEX,
                0.45,
                (0, 210, 0),
                1)

    cv2.putText(frame_anotado,
                "C=Confirmar  R=Rejeitar  U=Undo  Q=Sair",
                (18, y_pos + 30),
                cv2.FONT_HERSHEY_COMPLEX,
                0.38,
                (180, 180, 0),
                1)

    # =========================
    # ITEM PENDENTE
    # =========================

    if item_pendente is not None:

        frame_w = frame_anotado.shape[1]

        # Caixa compacta no canto superior direito
        box_w = 420
        box_x = frame_w - box_w - 10
        box_y1 = 10
        box_y2 = 80

        # Fundo escuro
        cv2.rectangle(
            frame_anotado,
            (box_x, box_y1),
            (frame_w - 10, box_y2),
            (15, 15, 15),
            -1
        )
        # Borda ciano fina
        cv2.rectangle(
            frame_anotado,
            (box_x, box_y1),
            (frame_w - 10, box_y2),
            (200, 200, 0),
            1
        )

        # Título pequeno
        cv2.putText(
            frame_anotado,
            "PENDENTE:",
            (box_x + 10, box_y1 + 25),
            cv2.FONT_HERSHEY_COMPLEX,
            0.45,
            (0, 210, 210),
            1
        )

        # Nome do item
        cv2.putText(
            frame_anotado,
            item_pendente,
            (box_x + 130, box_y1 + 25),
            cv2.FONT_HERSHEY_COMPLEX,
            0.48,
            (255, 255, 255),
            1
        )

        # Atalhos
        cv2.putText(
            frame_anotado,
            "C=Confirmar  R=Rejeitar",
            (box_x + 10, box_y1 + 55),
            cv2.FONT_HERSHEY_COMPLEX,
            0.38,
            (0, 190, 80),
            1
        )

    # =========================
    # NOTIFICAÇÕES VISUAIS COM FADE (canto inferior esquerdo)
    # =========================

    tempo_atual = time.time()
    # Filtrar notificações ativas (máximo 4 segundos de duração)
    notificacoes = [n for n in notificacoes if tempo_atual - n["timestamp"] < 4.0]

    frame_h = frame_anotado.shape[0]  # altura do frame (720)
    spacing = 34
    box_h = 28

    # Desenhar da mais nova (na base) para a mais antiga (subindo)
    for i, n in enumerate(reversed(notificacoes)):
        elapsed = tempo_atual - n["timestamp"]
        
        # Efeito de fade out no último segundo
        if elapsed < 3.0:
            alpha = 1.0
        else:
            alpha = max(0.0, 1.0 - (elapsed - 3.0) / 1.0)

        if n["tipo"] == "adicionado":
            cor_borda = (0, 200, 80)
            cor_texto = (180, 255, 200)
            icone     = "[+]"
        else:
            cor_borda = (0, 140, 255)
            cor_texto = (180, 210, 255)
            icone     = "[U]"

        linha = f"{icone} {n['texto']}"

        # Coordenadas da caixa da notificação
        y2 = (frame_h - 12) - i * spacing
        y1 = y2 - box_h
        x1, x2 = 10, 500

        # Garantir limites da imagem
        if y1 >= 0 and y2 <= frame_h:
            # Criar um sub-frame temporário para fazer o blending (fade suave)
            sub_img = frame_anotado[y1:y2, x1:x2].copy()
            
            # Desenhar fundo escuro
            cv2.rectangle(sub_img, (0, 0), (x2 - x1, box_h), (20, 20, 20), -1)
            # Desenhar borda fina
            cv2.rectangle(sub_img, (0, 0), (x2 - x1, box_h), cor_borda, 1)
            # Desenhar texto
            cv2.putText(
                sub_img,
                linha,
                (8, 20),
                cv2.FONT_HERSHEY_COMPLEX,
                0.48,
                cor_texto,
                1
            )
            
            # Blending com o frame original baseado no alpha
            cv2.addWeighted(sub_img, alpha, frame_anotado[y1:y2, x1:x2], 1.0 - alpha, 0, dst=frame_anotado[y1:y2, x1:x2])

    # =========================
    # EXIBIR TELA
    # =========================

    cv2.imshow("Contador Inteligente YOLO", frame_anotado)

    tecla = cv2.waitKey(1) & 0xFF

    # =========================
    # CONFIRMAR ITEM
    # =========================
    if tecla == ord('c'):

        if item_pendente is not None:

            # Soma contagem
            if item_pendente not in contagem_total:
                contagem_total[item_pendente] = 0

            contagem_total[item_pendente] += 1

           # Envia servidor
            id_servidor = enviar_para_servidor(item_pendente)

            # Guarda histórico completo
            historico_confirmados.append({
                "nome": item_pendente,
                "id": id_servidor
            })

            print(f"ITEM CONFIRMADO: {item_pendente}")

            notificacoes.append({
                "tipo": "adicionado",
                "texto": f"+ {item_pendente}",
                "timestamp": time.time()
            })

            item_pendente = None

    elif tecla == ord('r'):

        if item_pendente is not None:

            print(f"ITEM REJEITADO: {item_pendente}")

            item_pendente = None
            
            # Reiniciar estado e timers para nova identificação imediata
            estado = "SEM_OBJETO"
            frames_estaveis = 0
            frames_sem_objeto = 0
            item_atual = None

    elif tecla == ord('u'):

        if len(historico_confirmados) > 0:

            ultimo = historico_confirmados.pop()

            if isinstance(ultimo, str):

                ultimo_item = ultimo
                id_item = None

            else:

                ultimo_item = ultimo["nome"]
                id_item = ultimo["id"]

            # Remove da contagem
            if ultimo_item in contagem_total:

                contagem_total[ultimo_item] -= 1

                # Remove item zerado
                if contagem_total[ultimo_item] <= 0:
                    del contagem_total[ultimo_item]

            # Remove do servidor
            if id_item is not None:
                deletar_do_servidor(id_item)

            mensagem_feedback = f"UNDO: {ultimo_item}"

            notificacoes.append({
                "tipo": "undo",
                "texto": f"Desfeito: {ultimo_item}",
                "timestamp": time.time()
            })

            print(f"UNDO REALIZADO: {ultimo_item}")

        else:

            mensagem_feedback = "Nada para desfazer"

            notificacoes.append({
                "tipo": "undo",
                "texto": "Nada para desfazer",
                "timestamp": time.time()
            })

    # =========================
    # FECHAR
    # =========================
    elif tecla == ord('q'):
        break

# =========================
# FINALIZAÇÃO
# =========================
camera.release()
cv2.destroyAllWindows()