# Dashboard Industrial SCADA – Indústria 4.0 🚀

Este projeto consiste em um **Dashboard de Monitoramento em Tempo Real (SCADA)** desenvolvido como parte dos desafios práticos do curso do **SENAI**. A aplicação simula a interface de uma planta fabril digitalizada, integrando controle de acesso, gerenciamento de equipamentos e telemetria térmica em tempo real.

---

## 🛠️ Tecnologias Utilizadas

O sistema foi desenvolvido utilizando tecnologias web fundamentais (Vanilla Architecture), sem o uso de frameworks externos:
* **HTML5:** Estruturação semântica do painel de controle e componentes de interface.
* **CSS3:** Estilização com temática industrial (cores escuras, fontes monoespaçadas de CLPs) e animações de alerta em tempo real.
* **JavaScript (ES6):** Manipulação dinâmica do DOM, estruturas condicionais avançadas e controle de temporização.

---

## ⚙️ Funcionalidades e Conceitos Aplicados

Em conformidade com os critérios de avaliação do projeto, foram implementadas as seguintes engrenagens lógicas:

1.  **Controle de Acesso (If/Else):** Validação estrita da credencial do operador técnico. Impede a inicialização de rotinas críticas caso o campo esteja vazio.
2.  **Automação de Interface (Laço For):** Alimentação automática e dinâmica do elemento `<select>` do DOM a partir de uma matriz de dados contendo os equipamentos da linha de produção.
3.  **Roteamento Direto (Switch):** Leitura seletiva do maquinário ativo (Prensa, Torno, CNC, Injetora, Esteira) com alteração imediata de status e cores operacionais correspondentes.
4.  **Telemetria Térmica (Cascata Lógica + `setInterval`):** Simulação de um sensor RTD industrial atualizado a cada 1 segundo. Aplica regras de segurança em cascata:
    * *Abaixo de 50°C:* Operação Normal (Verde)
    * *Entre 50°C e 80°C:* Estado de Alerta (Laranja)
    * *Acima de 80°C:* Perigo Crítico por Superaquecimento (Vermelho Piscante)

### 🚨 Desafio Extra: Sistema de Intertravamento Automático
Foi desenvolvido o protocolo de segurança máxima. Caso o sensor térmico registre temperaturas superiores a **95°C por 5 segundos consecutivos**, a função `paradaDeEmergencia()` é disparada de forma autônoma:
* Emite um alerta síncrono em tela (`alert`).
* Bloqueia permanentemente todas as funções de controle do painel utilizando a propriedade `.disabled` nos elementos do DOM.
* Congela a leitura do sensor térmico (`clearInterval`), exigindo o reinício físico do sistema após a manutenção.

---

## 📁 Estrutura de Arquivos

O projeto está estritamente modularizado em 3 arquivos independentes para garantir a organização do código:

```text
├── index.html       # Estrutura de tags e inputs do painel
├── style.css        # Identidade visual industrial e animações de alarme
└── script.js        # Regras de negócio, loops e inteligência do sistema
