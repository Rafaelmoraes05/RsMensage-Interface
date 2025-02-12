document.addEventListener("DOMContentLoaded", function () {
    const botaoMensagem = document.getElementById("botaoMensagem");
    const mensagemDiv = document.getElementById("mensagem");

    botaoMensagem.addEventListener("click", function () {
        fetchMensagemDoDia();
    });

    function fetchMensagemDoDia() {
        fetch("http://localhost:8080/mensagens/dia")
            .then(response => response.json())
            .then(data => {
                if (data) {
                    exibirMensagem(data.texto);
                    marcarMensagemComoLida(data.id);
                } else {
                    mensagemDiv.innerHTML = "Não há mais mensagens para hoje!";
                }
            })
            .catch(error => {
                console.error("Erro ao buscar mensagem:", error);
                mensagemDiv.innerHTML = "Ocorreu um erro. Tente novamente mais tarde.";
            });
    }

    function exibirMensagem(texto) {
        // Limpa a mensagem anterior e aplica a animação
        mensagemDiv.innerHTML = "";
        let letras = texto.split('');
        
        letras.forEach((letra, index) => {
            let span = document.createElement("span");

            // Se a letra for espaço, criamos uma string vazia
            span.innerText = letra === ' ' ? '\u00A0' : letra; // '\u00A0' é o espaço não quebrável
            span.style.animationDelay = `${index * 0.05}s`;
            mensagemDiv.appendChild(span);
        });

        mensagemDiv.classList.remove("fadeIn"); // Remover qualquer animação anterior
        void mensagemDiv.offsetWidth; // Força a reinicialização da animação
        mensagemDiv.classList.add("slideUp"); // Adiciona a nova animação
    }

    function marcarMensagemComoLida(id) {
        fetch(`http://localhost:8080/mensagens/lidas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                lida: true,
                dataLeitura: new Date().toISOString().split('T')[0] // Data no formato yyyy-mm-dd
            })
        }).then(response => {
            if (response.ok) {
                console.log("Mensagem marcada como lida!");
            }
        }).catch(error => console.error("Erro ao marcar mensagem como lida:", error));
    }
});
