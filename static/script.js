if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/static/service-worker.js")
        .then(() => console.log("Service Worker registrado!"))
        .catch((erro) => console.log("Erro ao registrar SW:", erro));
}

let servicos = [];

function adicionarItem() {
    const servicosInput = document.getElementById("servicos");
    const texto = servicosInput.value.trim();
    
    if (texto !== "") {
        const novoItem = document.createElement("li");

        // Criar span para exibir o texto inicial
        const span = document.createElement("span");
        span.textContent = texto;
        novoItem.appendChild(span);

        // Criar input para edição (inicialmente escondido)
        const inputEditar = document.createElement("input");
        inputEditar.type = "text";
        inputEditar.value = texto;
        inputEditar.style.display = "none"; // Escondido inicialmente
        novoItem.appendChild(inputEditar);

        //Criar Div botões
        const divBtn = document.createElement("div");
        divBtn.A

        // Criar botão Editar
        const botaoEditar = document.createElement("input");
        botaoEditar.type = "button";
        botaoEditar.value = "✏️";
        botaoEditar.addEventListener("click", function () {
            span.style.display = "none"; 
            inputEditar.style.display = "inline"; 
            inputEditar.focus();
        });

        // Criar botão Salvar
        const botaoSalvar = document.createElement("input");
        botaoSalvar.type = "button";
        botaoSalvar.value = "✅";
        botaoSalvar.style.display = "none"; 
        botaoSalvar.addEventListener("click", function () {
            const novoTexto = inputEditar.value.trim();
            if (novoTexto !== "") {
                span.textContent = novoTexto;
                span.style.display = "inline";
                inputEditar.style.display = "none";
                botaoSalvar.style.display = "none";
                atualizarLista();
            }
        });

        // Exibir "Salvar" automaticamente quando o input ganhar foco
        inputEditar.addEventListener("input", function () {
            botaoSalvar.style.display = "inline";
            botaoEditar.style.display = "inline";
            botaoRemover.style.display = "inline";
        });

        // Criar botão Remover
        const botaoRemover = document.createElement("input");
        botaoRemover.type = "button";
        botaoRemover.value = "❌";
        botaoRemover.addEventListener("click", function () {
            novoItem.remove();
            atualizarLista();
        });
        botaoEditar.classList.add("botaoLista")
        botaoSalvar.classList.add("botaoLista")
        botaoRemover.classList.add("botaoLista")

        //Botão a li
        divBtn.classList.add("botoesLista")
        novoItem.appendChild(divBtn)

        // Adicionar botões ao item
        divBtn.appendChild(botaoEditar);
        divBtn.appendChild(botaoSalvar);
        divBtn.appendChild(botaoRemover);

        // Adicionar item à lista
        document.getElementById("listaServicos").appendChild(novoItem);
        atualizarLista();

        // Limpar input e focar novamente
        servicosInput.value = "";
        servicosInput.focus();
    }
}

// Capturar Enter para adicionar item
document.getElementById("servicos").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        adicionarItem();
    }
});

// Adicionar serviço ao clicar no botão
document.getElementById("adicionarServico").addEventListener("click", adicionarItem);

// Atualizar lista de serviços no array
function atualizarLista() {
    servicos = [];
    document.querySelectorAll("#listaServicos li span").forEach(item => {
        servicos.push(item.textContent);
    });

    // Atualizar campo oculto antes de enviar o formulário
    document.getElementById("servicosHidden").value = JSON.stringify(servicos);
}



