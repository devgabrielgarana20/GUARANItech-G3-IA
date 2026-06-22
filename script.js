// ===================== CONFIGURAÇÕES =====================
const CONFIG = {
    apiKey: "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",
    model: "gpt-4o-mini",
    maxTokens: 1500,
    temperature: 0.7,
    systemPrompt: `Você é o G3 AI EDU, um assistente educacional especializado em ENSINAR em vez de dar respostas prontas. 
    Você NUNCA deve dar respostas diretas para perguntas de prova, teste ou exercícios. 
    Seu objetivo é promover o aprendizado genuíno.
    Quando um aluno perguntar algo que pareça ser de prova ou teste, você deve:
    1. Identificar que é uma pergunta de avaliação
    2. Responder com uma explicação do conceito
    3. Fazer perguntas guiadas para o aluno pensar
    4. NUNCA dar a resposta final
    Responda em português do Brasil de forma clara, didática e encorajadora.`
};

// ===================== SISTEMA ANTI-TRAPAÇA =====================
const ANTI_CHEAT = {
    // Palavras que indicam tentativa de cola (expandido)
    suspiciousKeywords: [
        'resposta', 'gabarito', 'prova', 'teste', 'exame', 'avaliação',
        'colar', 'trapaça', 'resolver', 'me dê a resposta', 'qual a resposta',
        'me fala', 'diz aí', 'passa a resposta', 'responde aí',
        'me ajuda na prova', 'preciso da resposta', 'urgente resposta',
        'questão', 'exercício', 'tarefa', 'dever', 'trabalho escolar',
        'qual é a resposta', 'me diga a resposta', 'fala a resposta',
        'responde rápido', 'preciso saber', 'me ajuda com essa',
        'qual o resultado', 'me explica como resolve', 'faz pra mim',
        'resolve essa', 'me dá a solução', 'preciso da solução'
    ],
    
    // Matérias escolares
    subjects: [
        'matemática', 'português', 'história', 'geografia', 'ciências',
        'biologia', 'física', 'química', 'inglês', 'espanhol',
        'filosofia', 'sociologia', 'artes', 'educação física',
        'literatura', 'gramática', 'álgebra', 'geometria',
        'trigonometria', 'cálculo', 'estatística', 'probabilidade'
    ],
    
    // Padrões específicos de prova
    examPatterns: [
        /questão \d+/i,
        /número \d+/i,
        /alternativa [a-e]/i,
        /item \d+/i,
        /qual a resposta da/i,
        /resposta do exercício/i,
        /me ajuda com a questão/i,
        /como resolver a questão/i,
        /questão \d+ da prova/i,
        /prova de [a-z]+/i,
        /teste de [a-z]+/i,
        /avaliação de [a-z]+/i
    ],
    
    blockedCount: 0,
    
    // ===== FUNÇÃO PRINCIPAL DE DETECÇÃO =====
    isExamQuestion: function(text) {
        const lowerText = text.toLowerCase().trim();
        
        // 1. Verifica palavras suspeitas
        for (let keyword of this.suspiciousKeywords) {
            if (lowerText.includes(keyword)) {
                console.log(`🔍 Palavra suspeita detectada: "${keyword}"`);
                return { 
                    detected: true, 
                    reason: `Palavra suspeita: "${keyword}"`,
                    level: 'high'
                };
            }
        }
        
        // 2. Verifica padrões de prova
        for (let pattern of this.examPatterns) {
            if (pattern.test(text)) {
                console.log(`🔍 Padrão de prova detectado: ${pattern}`);
                return { 
                    detected: true, 
                    reason: 'Padrão de prova detectado',
                    level: 'critical'
                };
            }
        }
        
        // 3. Verifica se menciona matéria + pergunta direta
        for (let subject of this.subjects) {
            if (lowerText.includes(subject)) {
                // Verifica se está pedindo resposta direta
                const directAskPatterns = [
                    'qual a', 'qual é', 'me diga', 'me fale', 'me mostra',
                    'resposta', 'gabarito', 'resultado', 'solução',
                    'como faz', 'como resolver', 'me ajuda'
                ];
                for (let pattern of directAskPatterns) {
                    if (lowerText.includes(pattern)) {
                        console.log(`🔍 Tentativa de cola em ${subject} detectada`);
                        return { 
                            detected: true, 
                            reason: `Tentativa de cola em ${subject}`,
                            level: 'medium'
                        };
                    }
                }
            }
        }
        
        return { detected: false };
    },
    
    // ===== GERAR RESPOSTA EDUCACIONAL =====
    generateEducationalResponse: function(question) {
        // Detecta matéria
        let subject = null;
        for (let s of this.subjects) {
            if (question.toLowerCase().includes(s)) {
                subject = s;
                break;
            }
        }
        
        const responses = [
            `# 🎓 **Vamos Aprender Juntos!**

🔍 **Entenda o problema:**
Em vez de te dar a resposta direta, vou te ajudar a entender o conceito.

📝 **Pense sobre:**
- O que você já sabe sobre este assunto?
- Que informações são importantes?
- Como você começaria a resolver?

💡 **Dica de estudo:**
- Leia a questão com atenção
- Destaque as informações principais
- Tente resolver por conta própria primeiro

🤔 **Perguntas para refletir:**
1. Qual é o tema principal?
2. O que você já estudou sobre isso?
3. Onde você está com dificuldade?

**Me mostre sua tentativa e vamos corrigir juntos!**`,
            
            `# 📚 **Modo Tutor Ativado!**

✨ **Não vou te dar a resposta pronta, mas vou te ensinar a chegar até ela:**

**Passo 1: Compreensão**
- Qual é a pergunta exata?
- O que está sendo pedido?

**Passo 2: Planejamento**
- Que conhecimentos você precisa?
- Como organizar as informações?

**Passo 3: Execução**
- Tente resolver passo a passo
- Não tenha medo de errar

**Passo 4: Verificação**
- Sua resposta faz sentido?
- Como confirmar?

**Vamos tentar juntos? Comece me mostrando o que você já sabe.**`,
            
            `# 🧠 **Aprendizado Ativo!**

🚫 **Não vou te dar a resposta direta** - isso não te ajuda a aprender!

📖 **Vamos fazer diferente:**

1️⃣ **Identifique o conceito:**
Qual é o tema da questão?

2️⃣ **Pesquise no seu material:**
O que seu livro/apostila diz sobre isso?

3️⃣ **Tente com suas palavras:**
Como você explicaria isso para um amigo?

4️⃣ **Pratique:**
Faça um exercício similar

**🔄 Refaça se necessário:**
- Errar faz parte do aprendizado
- Cada erro te ensina algo novo

**Me mostre sua tentativa!**`
        ];
        
        let response = responses[Math.floor(Math.random() * responses.length)];
        
        if (subject) {
            response += `\n\n📘 **Sobre ${subject.charAt(0).toUpperCase() + subject.slice(1)}:**\nVamos focar nos conceitos fundamentais. O que você já sabe sobre ${subject}?`;
        }
        
        response += `\n\n⚠️ **Lembre-se:** O objetivo é aprender, não copiar.`;
        
        return response;
    },
    
    // ===== REGISTRAR TENTATIVA =====
    logAttempt: function(question, reason) {
        this.blockedCount++;
        const attempt = {
            timestamp: new Date().toISOString(),
            question: question,
            reason: reason,
            blocked: true
        };
        
        const saved = localStorage.getItem('cheat_attempts');
        const attempts = saved ? JSON.parse(saved) : [];
        attempts.push(attempt);
        localStorage.setItem('cheat_attempts', JSON.stringify(attempts));
        
        console.warn('🚨 Tentativa de cola bloqueada:', attempt);
        document.getElementById('statBlocked').textContent = this.blockedCount;
    }
};

// ===================== ESTADO =====================
let conversations = [];
let currentConversationId = null;
let isProcessing = false;
let totalTokens = 0;
let apiCalls = 0;

// ===================== UTILITÁRIOS =====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.className = 'toast';
    if (type === 'error') toast.classList.add('error');
    if (type === 'warning') toast.classList.add('warning');
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.success}"></i>
        <span>${message}</span>
    `;
    toast.style.display = 'flex';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

function generateId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===================== GERENCIAMENTO =====================
function loadData() {
    const saved = localStorage.getItem('g3ai_edu_data');
    if (saved) {
        const data = JSON.parse(saved);
        conversations = data.conversations || [];
        totalTokens = data.totalTokens || 0;
        ANTI_CHEAT.blockedCount = data.blockedCount || 0;
        if (conversations.length === 0) {
            createWelcomeConversation();
        } else {
            currentConversationId = conversations[0].id;
        }
    } else {
        createWelcomeConversation();
    }
    renderConversationsList();
    renderMessages();
    updateStats();
}

function saveData() {
    const data = {
        conversations: conversations,
        totalTokens: totalTokens,
        blockedCount: ANTI_CHEAT.blockedCount,
        lastSaved: new Date().toISOString()
    };
    localStorage.setItem('g3ai_edu_data', JSON.stringify(data));
}

function createWelcomeConversation() {
    const welcomeMessage = `# 🎓 **Bem-vindo ao G3 AI EDU!**

## 📚 **Assistente Educacional com Sistema Anti-Trapaça**

### 🎯 **Como posso te ajudar a aprender:**

✅ **Ensinar conceitos** - Explico de forma clara e didática
✅ **Tirar dúvidas** - Respondo perguntas específicas
✅ **Guiar no estudo** - Ajudo a organizar o aprendizado
✅ **Dar dicas** - Sugiro caminhos para resolver problemas
✅ **Corrigir exercícios** - Mostro onde você errou e como melhorar

### ⛔ **O que NÃO faço:**

❌ Dar respostas de provas ou testes
❌ Passar gabaritos
❌ Resolver questões sem explicar
❌ Incentivar a cola ou trapaça

### 💡 **Como estudar comigo:**

1️⃣ **Pergunte sobre o assunto** - "Me ensine sobre frações"
2️⃣ **Mostre sua tentativa** - Me diga o que você já sabe
3️⃣ **Peça dicas** - Posso te orientar no caminho certo
4️⃣ **Pratique** - Faça exercícios e me mostre

### 📝 **Exemplos de perguntas que posso ajudar:**

- "Me ensine sobre frações" 📐
- "Como fazer uma redação?" ✍️
- "Qual a fórmula da área?" 📏
- "Explique a Revolução Francesa" 🏛️

**Vamos começar a aprender?** 🚀

*Desenvolvido por DEVgabriel para promover aprendizado genuíno*`;

    const newConversation = {
        id: generateId(),
        title: "🎓 Modo Tutor - Aprendizado",
        createdAt: new Date().toISOString(),
        messages: [{
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date().toISOString()
        }]
    };
    conversations = [newConversation];
    currentConversationId = newConversation.id;
    saveData();
}

function createNewConversation() {
    const newConversation = {
        id: generateId(),
        title: `📚 Conversa ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
        messages: []
    };
    conversations.unshift(newConversation);
    currentConversationId = newConversation.id;
    saveData();
    renderConversationsList();
    renderMessages();
    showToast("✨ Nova conversa educacional criada!");
    closeSidebar();
}

function getCurrentConversation() {
    return conversations.find(c => c.id === currentConversationId);
}

// ===================== FUNÇÃO PRINCIPAL - ADICIONAR MENSAGEM =====================
async function addMessage(role, content) {
    const conversation = getCurrentConversation();
    if (!conversation) return;

    conversation.messages.push({
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    });

    if (role === 'user' && conversation.messages.filter(m => m.role === 'user').length === 1) {
        conversation.title = '📚 ' + content.substring(0, 25) + (content.length > 25 ? '...' : '');
    }

    saveData();
    renderConversationsList();
    renderMessages();

    // 🔥 SE FOR MENSAGEM DO USUÁRIO, VERIFICA ANTI-TRAPAÇA
    if (role === 'user') {
        await processEducationalRequest(content);
    }
}

// ===================== PROCESSAMENTO EDUCACIONAL (CORRIGIDO) =====================
async function processEducationalRequest(message) {
    console.log('🔍 Verificando mensagem:', message);
    
    // ===== 1. VERIFICAÇÃO ANTI-TRAPAÇA =====
    const examCheck = ANTI_CHEAT.isExamQuestion(message);
    
    if (examCheck.detected) {
        console.log('🚨 ANTI-TRAPAÇA ATIVADO!');
        
        // Registrar tentativa
        ANTI_CHEAT.logAttempt(message, examCheck.reason);
        
        // Mostrar alerta
        showToast('🚨 Tentativa de cola bloqueada! Vamos aprender de verdade.', 'warning');
        
        // Gerar resposta educacional
        const educationalResponse = ANTI_CHEAT.generateEducationalResponse(message);
        await addMessage('assistant', educationalResponse);
        
        // Atualizar estatísticas
        updateStats();
        
        return true;
    }
    
    // ===== 2. CLIMA =====
    if (message.toLowerCase().includes('clima') || message.toLowerCase().includes('tempo')) {
        const weatherResponse = await getWeatherInfo(message);
        if (weatherResponse) {
            await addMessage('assistant', weatherResponse);
            return true;
        }
    }
    
    // ===== 3. CÁLCULOS =====
    if (message.toLowerCase().includes('calcular') || message.toLowerCase().includes('quanto é')) {
        const calcResponse = teachCalculation(message);
        if (calcResponse) {
            await addMessage('assistant', calcResponse);
            return true;
        }
    }
    
    // ===== 4. MATÉRIAS =====
    for (let subject of ANTI_CHEAT.subjects) {
        if (message.toLowerCase().includes(subject)) {
            const teachResponse = generateSubjectTeaching(subject, message);
            await addMessage('assistant', teachResponse);
            return true;
        }
    }
    
    // ===== 5. SE NÃO FOR NENHUM COMANDO ESPECIAL, USA A API =====
    return false;
}

// ===================== FUNÇÕES EDUCACIONAIS =====================
function generateSubjectTeaching(subject, question) {
    const teachings = {
        'matemática': `# 📐 **Vamos aprender Matemática!**

🧮 **Conceitos fundamentais:**
- Identifique a operação necessária
- Organize os números
- Resolva passo a passo

📝 **Passo a passo:**
1. Leia o problema com atenção
2. Identifique o que está sendo pedido
3. Escolha a operação correta
4. Resolva com calma
5. Verifique o resultado

💡 **Dica de estudo:**
- Faça exercícios similares
- Use exemplos práticos
- Ensine alguém - é a melhor forma de aprender!

**Que parte da matemática você está estudando?**`,
        
        'português': `# 📖 **Vamos estudar Português!**

✍️ **Interpretação de texto:**
- Leia o texto mais de uma vez
- Identifique o tema principal
- Destaque as palavras-chave
- Faça conexões com o que você já sabe

📝 **Análise:**
- Qual é a mensagem do autor?
- Que recursos literários foram usados?
- Como você interpreta o texto?

💡 **Dica de redação:**
- Faça um rascunho antes
- Organize suas ideias
- Revise a ortografia
- Peça feedback

**O que você gostaria de aprender em português?**`,
        
        'história': `# 🏛️ **Vamos estudar História!**

📜 **Entendendo o contexto histórico:**
- Quando aconteceu?
- O que estava acontecendo na época?
- Quais eram as principais questões?

🔍 **Análise:**
- Causas e consequências
- Personagens importantes
- Impactos na sociedade atual

💡 **Como estudar história:**
- Faça linhas do tempo
- Relacione com a atualidade
- Assista a documentários
- Visite museus virtuais

**Qual período da história você está estudando?**`,
        
        'geografia': `# 🌍 **Vamos explorar a Geografia!**

🗺️ **Entendendo o espaço:**
- Localização geográfica
- Características físicas
- Clima e vegetação
- Aspectos humanos

🌎 **Conexões:**
- Como os lugares se relacionam?
- Quais são as influências?
- Impactos ambientais?

💡 **Dicas de estudo:**
- Use mapas mentais
- Assista a documentários
- Faça comparações entre regiões

**Que região você está estudando?**`
    };
    
    const teaching = teachings[subject] || `# 📚 **Vamos estudar ${subject}!**

🔍 **Pesquise sobre o assunto:**
- O que você já sabe?
- O que gostaria de aprender?
- Quais são os conceitos principais?

💡 **Dicas:**
- Leia seu material didático
- Faça resumos
- Pratique com exercícios
- Tire dúvidas com seu professor

**Me mostre o que você já sabe sobre ${subject}!**`;
    
    return `${teaching}\n\n🤔 **Vamos começar? Me mostre o que você já sabe sobre o assunto!**`;
}

function teachCalculation(message) {
    const numbers = message.match(/\d+(?:\.\d+)?/g);
    if (!numbers || numbers.length < 2) return null;
    
    let operation = '';
    let explanation = '';
    
    if (message.includes('+')) {
        operation = 'soma';
        explanation = `🧮 **Aprendendo a somar:**

Para somar ${numbers.join(' + ')}:

1️⃣ **Identifique os números:** ${numbers.join(', ')}
2️⃣ **Organize:** Coloque um abaixo do outro
3️⃣ **Some:** Comece pela direita
4️⃣ **Verifique:** Confira o resultado

💡 **Dica:** Some os números menores primeiro!
📝 **Tente você mesmo e me diga o resultado!**`;
    } else if (message.includes('-')) {
        operation = 'subtração';
        explanation = `🧮 **Aprendendo a subtrair:**

Para subtrair ${numbers[0]} - ${numbers[1]}:

1️⃣ **Identifique:** Qual número é maior?
2️⃣ **Organize:** Coloque o maior em cima
3️⃣ **Subtraia:** Comece pela direita
4️⃣ **Verifique:** Some o resultado com o menor

💡 **Dica:** Subtraia partes menores!
📝 **Tente fazer e me mostre o resultado!**`;
    } else if (message.includes('*') || message.includes('vezes')) {
        operation = 'multiplicação';
        explanation = `🧮 **Aprendendo a multiplicar:**

Para multiplicar ${numbers.join(' × ')}:

1️⃣ **Entenda:** Multiplicar é somar várias vezes
2️⃣ **Use a tabuada:** Consulte se necessário
3️⃣ **Calcule:** Multiplique passo a passo
4️⃣ **Verifique:** Confira o resultado

💡 **Dica:** Decomponha os números!
📝 **Tente calcular e me diga o resultado!**`;
    } else if (message.includes('/') || message.includes('dividido')) {
        operation = 'divisão';
        explanation = `🧮 **Aprendendo a dividir:**

Para dividir ${numbers[0]} ÷ ${numbers[1]}:

1️⃣ **Identifique:** Quem é o dividendo e divisor?
2️⃣ **Organize:** Monte a conta de divisão
3️⃣ **Divida:** Encontre quantas vezes cabe
4️⃣ **Verifique:** Multiplique o resultado pelo divisor

💡 **Dica:** Comece dividindo números menores!
📝 **Tente fazer e me mostre o resultado!**`;
    } else {
        return null;
    }
    
    return `# 🧮 **Aprendendo ${operation}**

${explanation}

🤔 **Qual foi o resultado que você encontrou? Me mostre como você fez!**`;
}

async function getWeatherInfo(message) {
    const cities = ['salvador', 'bahia', 'são paulo', 'rio de janeiro', 'brasília', 'belo horizonte', 'porto alegre'];
    let city = 'Salvador';
    for (let c of cities) {
        if (message.toLowerCase().includes(c)) {
            city = c.charAt(0).toUpperCase() + c.slice(1);
            break;
        }
    }
    
    const weatherData = {
        Salvador: { temp: 28, condition: 'Ensolarado', humidity: 65, wind: 12, icon: '☀️' },
        'São Paulo': { temp: 22, condition: 'Nublado', humidity: 70, wind: 8, icon: '☁️' },
        'Rio de Janeiro': { temp: 30, condition: 'Ensolarado', humidity: 60, wind: 10, icon: '☀️' },
        Brasília: { temp: 24, condition: 'Parcialmente Nublado', humidity: 55, wind: 15, icon: '⛅' }
    };
    
    const data = weatherData[city] || { temp: 26, condition: 'Parcialmente Nublado', humidity: 62, wind: 11, icon: '⛅' };
    
    return `# 🌤️ **Aprendendo sobre o Clima em ${city}**

📊 **Dados meteorológicos:**
- 🌡️ Temperatura: ${data.temp}°C
- ☁️ Condição: ${data.condition}
- 💧 Umidade: ${data.humidity}%
- 💨 Vento: ${data.wind} km/h

🔍 **Vamos interpretar esses dados:**
1. Como a temperatura e umidade se relacionam?
2. O que esses dados dizem sobre o clima da região?
3. Como isso afeta o dia a dia?

💡 **Pesquise mais sobre:**
- Como se forma o clima?
- O que causa mudanças climáticas?
- Como prever o tempo?

**O que mais você gostaria de saber sobre o clima?**`;
}

// ===================== API =====================
async function sendToAPI() {
    const conversation = getCurrentConversation();
    const userMessages = conversation.messages.filter(m => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];
    
    if (!lastUserMessage) return;

    // 🔥 PRIMEIRO: Verifica anti-trapaça
    const processed = await processEducationalRequest(lastUserMessage.content);
    if (processed) {
        document.getElementById('typingIndicator').style.display = 'none';
        return;
    }

    const url = "https://openrouter.ai/api/v1/chat/completions";
    
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONFIG.apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "G3 AI EDU - Modo Tutor"
    };

    // 🔥 ADICIONA INSTRUÇÃO ANTITRAPAÇA NO PROMPT DO SISTEMA
    const antiCheatInstruction = {
        role: 'system',
        content: `⚠️ INSTRUÇÃO CRÍTICA: Você é um assistente educacional. 
        Você NUNCA deve dar respostas diretas para perguntas de prova, teste ou exercícios.
        Se o aluno perguntar algo que parece ser de avaliação, você deve:
        1. NUNCA dar a resposta direta
        2. Explicar o conceito por trás da pergunta
        3. Fazer perguntas para guiar o aluno
        4. Incentivar o aluno a pensar e tentar resolver sozinho
        Responda em português do Brasil.`
    };

    const apiMessages = [
        antiCheatInstruction,
        ...conversation.messages.map(m => ({
            role: m.role,
            content: m.content
        }))
    ];

    const data = {
        model: CONFIG.model,
        messages: apiMessages,
        max_tokens: CONFIG.maxTokens,
        temperature: CONFIG.temperature
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const result = await response.json();
        totalTokens += result.usage?.total_tokens || 0;
        apiCalls++;
        
        await addMessage('assistant', result.choices[0].message.content);
        updateStats();
        
    } catch (error) {
        console.error(error);
        await addMessage('assistant', `❌ **Erro:** ${error.message}\n\nVerifique sua conexão com a internet.`);
        showToast(error.message, 'error');
    }
}

// ===================== INTERFACE =====================
function renderConversationsList() {
    const container = document.getElementById('conversationsList');
    if (!container) return;

    container.innerHTML = conversations.map(conv => `
        <div class="conv-item ${conv.id === currentConversationId ? 'active' : ''}" data-id="${conv.id}">
            <div class="conv-title">${escapeHtml(conv.title)}</div>
            <div class="conv-date">${moment(conv.createdAt).format('DD/MM HH:mm')}</div>
        </div>
    `).join('');

    document.querySelectorAll('.conv-item').forEach(item => {
        item.addEventListener('click', () => {
            currentConversationId = item.dataset.id;
            renderConversationsList();
            renderMessages();
            closeSidebar();
        });
    });
}

function renderMessages() {
    const container = document.getElementById('messages');
    const conversation = getCurrentConversation();
    if (!container || !conversation) return;

    container.innerHTML = conversation.messages.map(msg => `
        <div class="message ${msg.role}">
            <div class="message-avatar">
                <i class="fas ${msg.role === 'user' ? 'fa-user' : 'fa-graduation-cap'}"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-header">
                        <strong>${msg.role === 'user' ? 'Você' : 'G3 AI EDU'}</strong>
                        <span>${moment(msg.timestamp).format('HH:mm')}</span>
                    </div>
                    <div class="message-text">${marked.parse(msg.content)}</div>
                </div>
            </div>
        </div>
    `).join('');

    const messagesArea = document.getElementById('messagesArea');
    if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

async function sendMessage() {
    if (isProcessing) return;

    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;

    input.value = '';
    input.style.height = 'auto';

    // Adiciona mensagem do usuário
    await addMessage('user', message);
    
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'flex';
    
    const messagesArea = document.getElementById('messagesArea');
    messagesArea.scrollTop = messagesArea.scrollHeight;

    isProcessing = true;
    document.getElementById('statusText').innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Ensinando...';

    try {
        await sendToAPI();
        document.getElementById('statusText').innerHTML = 'Tutor';
    } catch (error) {
        document.getElementById('statusText').innerHTML = '❌ Erro';
    } finally {
        typingIndicator.style.display = 'none';
        isProcessing = false;
    }
}

function updateStats() {
    const conversation = getCurrentConversation();
    if (conversation) {
        const messagesCount = conversation.messages.length;
        const exchanges = Math.floor(messagesCount / 2);
        document.getElementById('statMessages').textContent = messagesCount;
        document.getElementById('statExchanges').textContent = exchanges;
        document.getElementById('tokenCount').textContent = totalTokens;
        document.getElementById('statTokens').textContent = totalTokens;
        document.getElementById('statBlocked').textContent = ANTI_CHEAT.blockedCount;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================== UI =====================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}

function openSettings() {
    const sheet = document.getElementById('bottomSheet');
    sheet.classList.add('open');
}

function closeSettings() {
    const sheet = document.getElementById('bottomSheet');
    sheet.classList.remove('open');
}

function setTheme(theme) {
    document.body.parentElement.setAttribute('data-theme', theme);
    localStorage.setItem('g3ai_theme', theme);
}

function loadTheme() {
    const saved = localStorage.getItem('g3ai_theme') || 'dark';
    setTheme(saved);
}

// ===================== EVENTOS =====================
function setupEventListeners() {
    document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
    document.getElementById('overlay').addEventListener('click', closeSidebar);
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('newChatBtn').addEventListener('click', createNewConversation);
    document.getElementById('newChatSidebarBtn').addEventListener('click', createNewConversation);
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('closeSheetBtn').addEventListener('click', closeSettings);
    
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 80) + 'px';
    });

    document.getElementById('modelSelect').addEventListener('change', (e) => {
        CONFIG.model = e.target.value;
        showToast(`Modelo: ${CONFIG.model}`);
    });

    const tempSlider = document.getElementById('temperatureSlider');
    const tempValue = document.getElementById('tempValue');
    tempSlider.addEventListener('input', () => {
        tempValue.textContent = tempSlider.value;
        CONFIG.temperature = parseFloat(tempSlider.value);
    });

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
            showToast(`Tema: ${btn.dataset.theme}`);
        });
    });

    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('messageInput').value = btn.dataset.query;
            sendMessage();
        });
    });
}

// ===================== INICIALIZAÇÃO =====================
function init() {
    loadTheme();
    loadData();
    setupEventListeners();
    showToast('🎓 Modo Tutor Ativado! Vamos aprender juntos!');
    
    console.log('🎓 G3 AI EDU - Sistema Anti-Trapaça Ativo!');
    console.log('📚 Configurações:', CONFIG);
    console.log('🔒 Bloqueios ativos:', ANTI_CHEAT.suspiciousKeywords.length, 'palavras monitoradas');
    console.log('📝 Palavras bloqueadas:', ANTI_CHEAT.suspiciousKeywords);
}

// Inicializa
init();
