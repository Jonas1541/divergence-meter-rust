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

document.addEventListener('DOMContentLoaded', () => {
    // Trava de segurança: avisa no console se o arquivo JS original não for encontrado
    if (typeof particlesJS === 'undefined') {
        console.error("ERRO: O arquivo particles.js não foi encontrado ou não carregou a tempo.");
        return;
    }

    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 100, // Um pouco mais de poeira temporal
                "density": { "enable": true, "value_area": 800 }
            },
            "color": { "value": "#FF8C00" }, // Laranja Nixie
            "shape": { "type": "circle" },
            "opacity": {
                "value": 0.8, // Opacidade base bem alta para brilhar no fundo escuro
                "random": true,
                "anim": { "enable": true, "speed": 1, "opacity_min": 0.3, "sync": false }
            },
            "size": {
                "value": 4, // Tamanho um pouco maior para ganhar destaque
                "random": true,
                "anim": { "enable": false }
            },
            "line_linked": {
                "enable": false // Mantém sem linhas, apenas poeira
            },
            "move": {
                "enable": true,
                "speed": 1.5, 
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": false },
                "onclick": { "enable": false },
                "resize": true
            }
        },
        "retina_detect": true
    });
});