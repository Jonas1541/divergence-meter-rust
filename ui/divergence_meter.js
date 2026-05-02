// Acessa a ponte de comunicação do Tauri
const { invoke } = window.__TAURI__.core;

window.onload = async () => {
    try {
        // Chama a função Rust 'get_current_divergence'
        const divergenceValue = await invoke('get_current_divergence');
        updateTubesInstantly(divergenceValue);
    } catch (error) {
        console.error("Falha ao carregar a linha do mundo inicial:", error);
    }
};

async function triggerShift() {
    try {
        // Chama a função Rust 'shift_divergence'
        const divergenceValue = await invoke('shift_divergence');
        
        const audio = new Audio('images/divergence_change.mp3');
        audio.play(); 
        
        animateNixieTubes(divergenceValue); 

    } catch (error) {
        console.error("Erro na flutuação da linha do mundo:", error);
    }
}

// Função para atualizar as imagens dos tubos (ex: "0.003412")
function updateTubesInstantly(valueStr) {
    const chars = valueStr.split('');
    let imgIndex = 0;
    
    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        if (char === '.') {
            // O arquivo p.png do repositório original representa o ponto decimal
            document.getElementById('digit-dot').src = 'images/p.png';
        } else {
            // Atualiza os números (images/0.png, images/1.png, etc)
            const digitImg = document.getElementById('digit-' + imgIndex);
            if (digitImg) {
                digitImg.src = 'images/' + char + '.png';
            }
            imgIndex++;
        }
    }
}

// Simula a rolagem maluca dos números antes de estabilizar
function animateNixieTubes(finalValue) {
    // 1. Troca todos os 7 dígitos para a animação do tubo girando
    for (let i = 0; i < 7; i++) {
        const digitImg = document.getElementById('digit-' + i);
        if (digitImg) {
            digitImg.src = 'images/11.gif?t=' + new Date().getTime(); // Mude para 12.gif se preferir a outra estética
        }
    }

    // O arquivo p.png (o ponto) não precisa girar, ele fica estático
    document.getElementById('digit-dot').src = 'images/p.png';

    // 2. Define o tempo exato para a GIF rodar antes de parar no novo número
    // O áudio divergence_change.mp3 tem aproximadamente 1.8 segundos.
    setTimeout(() => {
        updateTubesInstantly(finalValue);
    }, 1800); // 1800 milissegundos
}

// Escuta as teclas pressionadas na janela
document.addEventListener('keydown', async (event) => {
    if (event.key === 'F11') {
        // Bloqueia o comportamento padrão da tecla no WebKit
        event.preventDefault(); 
        
        try {
            // Chama a nova função do Rust para cuidar da janela
            await invoke('toggle_fullscreen');
        } catch (error) {
            console.error("Falha ao alterar a tela cheia:", error);
        }
    }
});