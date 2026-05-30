// VARIÁVEIS GLOBAIS DE CONTROLE
let tempoSuperaquecimento = 0; // Contador de tempo para o Desafio Extra
let sistemaBloqueado = false;  // Flag de intertravamento do painel SCADA
let idIntervaloSensor = null;  // Guarda a referência do loop do sensor

// Executa automaticamente ao carregar o DOM da página
window.onload = function() {
    gerarListaMaquinas();
};


// REQUISITO: VALIDAÇÃO DE ACESSO (If/Else)
function validarAcesso() {
    if (sistemaBloqueado) return;

    const nomeInput = document.getElementById('nome');
    const nomeValue = nomeInput.value.trim(); // .trim() elimina espaços vazios acidentais
    const msg = document.getElementById('msg');

    if (nomeValue === '' || nomeValue === null) {
        // Feedback visual de Erro
        msg.innerText = "ERRO: O campo de credencial não pode ser vazio!";
        msg.style.color = '#ef4444'; // Vermelho
        msg.style.fontWeight = 'bold';
    } else {
        // Feedback visual de Sucesso
        msg.innerText = `Acesso liberado. Operador Lógico: ${nomeValue}.`;
        msg.style.color = '#10b981'; // Verde
        msg.style.fontWeight = 'normal';
        
        // Desabilita o campo de nome após logar (padrão de segurança industrial)
        nomeInput.disabled = true;

        // Dispara o loop de monitoramento do sensor apenas se não houver um ativo
        if (!idIntervaloSensor) {
            idIntervaloSensor = setInterval(monitorarSensor, 1000); // Roda a cada 1 segundo (1000ms)
        }
    }
}


// AUTOMAÇÃO DE INTERFACE (Laço For)
function gerarListaMaquinas() {
    const dropdown = document.getElementById("equipamentoDropdown");
    
    // Matriz/Array contendo os equipamentos da planta
    const maquinas = ["Prensa 1", "Torno 2", "CNC 3", "Injetora 4", "Esteira 5"];

    // Cria a opção default neutra
    dropdown.innerHTML = '<option value="">-- Selecione uma Máquina --</option>';

    // Laço For populando dinamicamente o DOM conforme os critérios de avaliação
    for (let i = 0; i < maquinas.length; i++) {
        let opcao = document.createElement("option");
        opcao.value = maquinas[i];
        opcao.innerText = maquinas[i];
        dropdown.appendChild(opcao);
    }
}


// ROTEAMENTO DIRETO (Estrutura Switch)
function verificarStatus() {
    if (sistemaBloqueado) return;

    const maquinaSelecionada = document.getElementById("equipamentoDropdown").value;
    const campoStatus = document.getElementById("statusEquipamento");

    // Roteamento de mensagens baseadas no equipamento selecionado no select
    switch (maquinaSelecionada) {
        case "Prensa 1":
            campoStatus.innerText = "Em operação";
            campoStatus.style.color = "#10b981"; // Verde
            break;
        case "Torno 2":
            campoStatus.innerText = "Manutenção necessária";
            campoStatus.style.color = "#f97316"; // Laranja
            break;
        case "CNC 3":
            campoStatus.innerText = "Desligada";
            campoStatus.style.color = "#9ca3af"; // Cinza
            break;
        case "Injetora 4":
            campoStatus.innerText = "Aquecimento de Molde";
            campoStatus.style.color = "#38bdf8"; // Azul
            break;
        case "Esteira 5":
            campoStatus.innerText = "Em operação (Velocidade Reduzida)";
            campoStatus.style.color = "#10b981"; // Verde
            break;
        default:
            campoStatus.innerText = "-";
            campoStatus.style.color = "#ffffff";
    }
}


// MONITORAMENTO DE SENSOR (Cascata Lógica + Desafio Extra)
function monitorarSensor() {
    if (sistemaBloqueado) return;

    // Simulação de CLP: Gera valores térmicos aleatórios abrangendo a faixa de 20°C a 110°C
    let temperatura = Math.floor(Math.random() * (110 - 20 + 1)) + 20;
    
    const statusTxt = document.getElementById('statusTermico');
    const tempTxt = document.getElementById('temp');

    tempTxt.innerText = temperatura;

    // Aplicação da Cascata Lógica via injeção de classes CSS
    if (temperatura < 50) {
        statusTxt.innerText = "Normal";
        statusTxt.className = "normal";
    } else if (temperatura >= 50 && temperatura <= 80) {
        statusTxt.innerText = "Alerta";
        statusTxt.className = "alerta";
    } else {
        statusTxt.innerText = "PERIGO - SUPERAQUECIMENTO";
        statusTxt.className = "perigo"; // Aplica vermelho e negrito
    }

    // INTERTRAVAMENTO AUTOMÁTICO
    if (temperatura > 95) {
        tempoSuperaquecimento++; // Incrementa 1 segundo a cada iteração do setInterval (1s)
        
        if (tempoSuperaquecimento >= 5) {
            paradaDeEmergencia();
        }
    } else {
        tempoSuperaquecimento = 0; // Reseta o timer caso a temperatura oscile para baixo de 95°C
    }
}

// Botao parada de emergencia
function paradaDeEmergencia() {
    sistemaBloqueado = true;
    
    // Para o laço de leitura do sensor
    clearInterval(idIntervaloSensor);
    
    // Dispara o alerta síncrono do navegador solicitado no desafio
    alert("PARADA DE EMERGÊNCIA ATIVADA!");
    
    // Atualização do DOM para estado de Travamento Crítico
    const statusTxt = document.getElementById('statusTermico');
    statusTxt.innerText = "SISTEMA INTERTRAVADO - PAINEL BLOQUEADO";
    statusTxt.className = "perigo";

    const msgSeguranca = document.getElementById("msgSeguranca");
    msgSeguranca.innerText = "ALERTA DE SEGURANÇA: Painel desativado. Reinicie a página após a manutenção física.";
    msgSeguranca.style.color = "#ef4444";
    msgSeguranca.style.fontWeight = "bold";

    // Bloqueia inputs e seletores do DOM impossibilitando ações do operador
    document.getElementById("nome").disabled = true;
    document.getElementById("equipamentoDropdown").disabled = true;
    document.getElementById("btnEmergencia").disabled = true;
}
