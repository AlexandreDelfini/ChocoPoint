/**
 * ChocoPoint - Script do Site
 * 
 * Gerencia a funcionalidade do site institucional,
 * incluindo produtos, carrinho de compras e envio de pedidos via WhatsApp.
 */

// ========================================
// CONSTANTES
// ========================================

// Número do WhatsApp da loja (formato: código do país + número sem espaços)
const NUMERO_WHATSAPP_LOJA = '5513988490542';
const NOME_LOJA = 'ChocoPoint';

// Lista de produtos
const produtos = [
    {
        id: 1,
        nome: 'Morango Trufado',
        descricao: 'Morango trufado com chocolate nobre e morango fresco',
        preco: 12.00,
        imagem: 'images/morango-trufado.png'
    },
    {
        id: 2,
        nome: 'Mousse de Maracujá',
        descricao: 'Mousse leve e cremoso de maracujá com calda',
        preco: 8.00,
        imagem: 'images/mousse-maracujá.png'
    },
    {
        id: 3,
        nome: 'Brownie de Chocolate',
        descricao: 'Brownie caseiro com chocolate derretido por dentro',
        preco: 8.00,
        imagem: '🍫'
    },
    {
        id: 4,
        nome: 'Brigadeiro Tradicional',
        descricao: 'Brigadeiro cremoso coberto com chocolate granulado',
        preco: 3.50,
        imagem: '🟤'
    },
    {
        id: 5,
        nome: 'Pudim de Leite',
        descricao: 'Pudim macio com calda caramelizada',
        preco: 7.00,
        imagem: '🍮'
    },
    {
        id: 6,
        nome: 'Bolo de Cenoura',
        descricao: 'Bolo de cenoura com cobertura de chocolate',
        preco: 25.00,
        imagem: '🎂'
    },
    {
        id: 7,
        nome: 'Palha Italiana',
        descricao: 'Doce cremoso com biscoito e chocolate',
        preco: 6.00,
        imagem: '🍪'
    },
    {
        id: 8,
        nome: 'Beijinho de Coco',
        descricao: 'Doce de coco ralado com cravo',
        preco: 3.00,
        imagem: '🥥'
    }
];

// ========================================
// ESTADO DO CARRINHO
// ========================================

let carrinho = [];

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Formata um valor monetário para o formato brasileiro
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado
 */
function formatarValor(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

/**
 * Calcula o total do carrinho
 * @returns {number} Total do carrinho
 */
function calcularTotal() {
    return carrinho.reduce((total, item) => total + (item.quantidade * item.produto.preco), 0);
}

/**
 * Calcula a quantidade total de itens no carrinho
 * @returns {number} Quantidade total
 */
function quantidadeTotalItens() {
    return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

// ========================================
// FUNÇÕES DO CARRINHO
// ========================================

/**
 * Adiciona um produto ao carrinho
 * @param {number} produtoId - ID do produto
 */
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto) return;
    
    const itemExistente = carrinho.find(item => item.produto.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ produto, quantidade: 1 });
    }
    
    atualizarInterfaceCarrinho();
    abrirModalCarrinho();
}

/**
 * Remove um produto do carrinho
 * @param {number} produtoId - ID do produto
 */
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.produto.id !== produtoId);
    atualizarInterfaceCarrinho();
}

/**
 * Atualiza a quantidade de um item no carrinho
 * @param {number} produtoId - ID do produto
 * @param {number} novaQuantidade - Nova quantidade
 */
function atualizarQuantidade(produtoId, novaQuantidade) {
    if (novaQuantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
    }
    
    const item = carrinho.find(item => item.produto.id === produtoId);
    if (item) {
        item.quantidade = novaQuantidade;
        atualizarInterfaceCarrinho();
    }
}

/**
 * Limpa o carrinho
 */
function limparCarrinho() {
    carrinho = [];
    atualizarInterfaceCarrinho();
}

// ========================================
// INTERFACE DO CARRINHO
// ========================================

/**
 * Atualiza a interface do carrinho (badge e conteúdo)
 */
function atualizarInterfaceCarrinho() {
    // Atualiza badge de quantidade
    const quantidadeCarrinho = document.getElementById('quantidadeCarrinho');
    if (quantidadeCarrinho) {
        quantidadeCarrinho.textContent = quantidadeTotalItens();
    }
    
    // Atualiza conteúdo do modal
    renderizarItensCarrinho();
    renderizarResumoCarrinho();
}

/**
 * Renderiza os itens do carrinho no modal
 */
function renderizarItensCarrinho() {
    const itensCarrinhoEl = document.getElementById('itensCarrinho');
    const carrinhoVazioEl = document.getElementById('carrinhoVazio');
    const resumoCarrinhoEl = document.getElementById('resumoCarrinho');
    
    if (!itensCarrinhoEl || !carrinhoVazioEl || !resumoCarrinhoEl) return;
    
    if (carrinho.length === 0) {
        itensCarrinhoEl.innerHTML = '';
        itensCarrinhoEl.style.display = 'none';
        carrinhoVazioEl.style.display = 'block';
        resumoCarrinhoEl.style.display = 'none';
        return;
    }
    
    itensCarrinhoEl.style.display = 'block';
    carrinhoVazioEl.style.display = 'none';
    resumoCarrinhoEl.style.display = 'block';
    
    // Função para verificar se é imagem ou emoji
    const getImagemHtml = (imagem) => {
        if (imagem.endsWith('.png') || imagem.endsWith('.jpg') || imagem.endsWith('.jpeg')) {
            return `<img src="${imagem}" alt="Produto" style="width:50px;height:50px;object-fit:cover;border-radius:8px;">`;
        }
        return `<span style="font-size:36px;">${imagem}</span>`;
    };
    
    itensCarrinhoEl.innerHTML = carrinho.map(item => `
        <div class="itemCarrinho">
            <div class="itemCarrinho-imagem">${getImagemHtml(item.produto.imagem)}</div>
            <div class="itemCarrinho-info">
                <div class="itemCarrinho-nome">${item.produto.nome}</div>
                <div class="itemCarrinho-preco">${formatarValor(item.produto.preco)} cada</div>
            </div>
            <div class="itemCarrinho-quantidade">
                <button class="botaoQuantidade" onclick="atualizarQuantidade(${item.produto.id}, ${item.quantidade - 1})">−</button>
                <span class="quantidadeItem">${item.quantidade}</span>
                <button class="botaoQuantidade" onclick="atualizarQuantidade(${item.produto.id}, ${item.quantidade + 1})">+</button>
            </div>
            <div class="itemCarrinho-subtotal">${formatarValor(item.quantidade * item.produto.preco)}</div>
            <button class="botaoRemover" onclick="removerDoCarrinho(${item.produto.id})" title="Remover">🗑️</button>
        </div>
    `).join('');
}

/**
 * Renderiza o resumo do carrinho (total)
 */
function renderizarResumoCarrinho() {
    const valorTotalEl = document.getElementById('valorTotalCarrinho');
    if (valorTotalEl) {
        valorTotalEl.textContent = formatarValor(calcularTotal());
    }
}

// ========================================
// MODAIS
// ========================================

/**
 * Abre o modal do carrinho
 */
function abrirModalCarrinho() {
    const modal = document.getElementById('modalCarrinho');
    if (modal) {
        modal.classList.add('mostrar');
        atualizarInterfaceCarrinho();
    }
}

/**
 * Fecha o modal do carrinho
 */
function fecharModalCarrinho() {
    const modal = document.getElementById('modalCarrinho');
    if (modal) {
        modal.classList.remove('mostrar');
    }
}

/**
 * Abre o modal de finalização
 */
function abrirModalFinalizacao() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione itens primeiro!');
        return;
    }
    
    // Atualiza resumo do pedido
    document.getElementById('resumoQuantidade').textContent = quantidadeTotalItens() + ' itens';
    document.getElementById('resumoTotal').textContent = 'Total: ' + formatarValor(calcularTotal());
    
    // Fecha modal do carrinho e abre o de finalização
    fecharModalCarrinho();
    
    const modal = document.getElementById('modalFinalizacao');
    if (modal) {
        modal.classList.add('mostrar');
    }
}

/**
 * Fecha o modal de finalização
 */
function fecharModalFinalizacao() {
    const modal = document.getElementById('modalFinalizacao');
    if (modal) {
        modal.classList.remove('mostrar');
    }
}

/**
 * Abre o modal de sucesso
 */
function abrirModalSucesso() {
    const modal = document.getElementById('modalSucesso');
    if (modal) {
        modal.classList.add('mostrar');
    }
}

/**
 * Fecha o modal de sucesso
 */
function fecharModalSucesso() {
    const modal = document.getElementById('modalSucesso');
    if (modal) {
        modal.classList.remove('mostrar');
    }
}

/**
 * Fecha todos os modais
 */
function fecharTodosModais() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('mostrar');
    });
}

// ========================================
// WHATSAPP - FORMAÇÃO DE MENSAGEM
// ========================================

/**
 * Formata a lista de itens do pedido para texto
 * @returns {string} Texto formatado com os itens
 */
function formatarListaItens() {
    return carrinho.map(item => {
        const subtotal = item.quantidade * item.produto.preco;
        return `• ${item.quantidade}x ${item.produto.nome}\n  R$ ${item.produto.preco.toFixed(2).replace('.', ',')} cada\n  Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }).join('\n\n');
}

/**
 * Gera a mensagem completa do pedido
 * @param {Object} dadosCliente - Dados do cliente
 * @returns {string} Mensagem formatada
 */
function gerarMensagemPedido(dadosCliente) {
    const { nome, telefone, endereco, formaPagamento } = dadosCliente;
    const total = calcularTotal();
    
    const mensagem = `
*${NOME_LOJA}* - Novo Pedido
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Dados do Cliente*
Nome: ${nome}
Telefone: ${telefone}
Endereço: ${endereco}
Pagamento: ${formaPagamento}

*Itens do Pedido*
${formatarListaItens()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Total: R$ ${total.toFixed(2).replace('.', ',')}*

*Agradecemos o seu pedido!*
`;
    
    return encodeURIComponent(mensagem);
}

/**
 * Gera a URL do WhatsApp para envio do pedido
 * @param {Object} dadosCliente - Dados do cliente
 * @returns {string} URL formatada para WhatsApp
 */
function gerarLinkWhatsApp(dadosCliente) {
    const mensagem = gerarMensagemPedido(dadosCliente);
    return `https://wa.me/${NUMERO_WHATSAPP_LOJA}?text=${mensagem}`;
}

/**
 * Envia o pedido via WhatsApp
 */
function enviarPedidoWhatsApp() {
    // Valida dados do formulário
    const nome = document.getElementById('nomeCliente').value.trim();
    const telefone = document.getElementById('telefoneCliente').value.trim();
    const endereco = document.getElementById('enderecoEntrega').value.trim();
    const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked').value;
    
    if (!nome) {
        alert('Por favor, informe seu nome.');
        document.getElementById('nomeCliente').focus();
        return;
    }
    
    if (!telefone) {
        alert('Por favor, informe seu telefone.');
        document.getElementById('telefoneCliente').focus();
        return;
    }
    
    // Valida telefone com DDD (exatamente 11 dígitos)
    const telefoneNumeros = telefone.replace(/\D/g, '');
    if (telefoneNumeros.length !== 11) {
        alert('Por favor, insira um telefone válido com DDD. O telefone deve ter 11 dígitos (ex: 11988490542)');
        document.getElementById('telefoneCliente').focus();
        return;
    }
    
    if (!endereco) {
        alert('Por favor, informe o endereço de entrega.');
        document.getElementById('enderecoEntrega').focus();
        return;
    }
    
    // Prepara dados do cliente
    const dadosCliente = {
        nome,
        telefone,
        endereco,
        formaPagamento
    };
    
    // Gera link do WhatsApp
    const linkWhatsApp = gerarLinkWhatsApp(dadosCliente);
    
    // Abre o WhatsApp
    window.open(linkWhatsApp, '_blank');
    
    // Fecha modal de finalização e abre sucesso
    fecharModalFinalizacao();
    abrirModalSucesso();
    
    // Limpa o carrinho
    limparCarrinho();
}

// ========================================
// RENDERIZAÇÃO DE PRODUTOS
// ========================================

/**
 * Renderiza os produtos na grade de produtos
 */
function renderizarProdutos() {
    const gradeProdutos = document.getElementById('gradeProdutos');
    
    if (!gradeProdutos) return;
    
    gradeProdutos.innerHTML = produtos.map(produto => {
        // Verifica se a imagem é um arquivo (png/jpg) ou emoji
        const isImageFile = produto.imagem.endsWith('.png') || produto.imagem.endsWith('.jpg') || produto.imagem.endsWith('.jpeg');
        const imagemHtml = isImageFile 
            ? `<img src="${produto.imagem}" alt="${produto.nome}">`
            : produto.imagem;
        
        return `
        <article class="cartaoProduto" data-id="${produto.id}">
            <div class="imagemProduto">
                ${imagemHtml}
            </div>
            <div class="conteudoProduto">
                <h3 class="nomeProduto">${produto.nome}</h3>
                <p class="descricaoProduto">${produto.descricao}</p>
                <p class="precoProduto">${formatarValor(produto.preco)}</p>
                <button 
                    class="botaoAdicionar" 
                    onclick="adicionarAoCarrinho(${produto.id})"
                >
                    Adicionar ao Carrinho
                </button>
            </div>
        </article>
    `}).join('');
}

// ========================================
// CONFIGURAÇÃO DE EVENTOS
// ========================================

/**
 * Configura a navegação suave e eventos da página
 */
function configurarEventos() {
    // Configura links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(ancora => {
        ancora.addEventListener('click', function(e) {
            e.preventDefault();
            const destino = document.querySelector(this.getAttribute('href'));
            if (destino) {
                destino.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Efeito de mudança de cor do cabeçalho ao rolar
    window.addEventListener('scroll', function() {
        const cabecalho = document.getElementById('cabecalhoPrincipal');
        if (cabecalho) {
            if (window.scrollY > 50) {
                cabecalho.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            } else {
                cabecalho.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
        }
    });
    
    // Botão do carrinho
    const botaoCarrinho = document.getElementById('botaoCarrinho');
    if (botaoCarrinho) {
        botaoCarrinho.addEventListener('click', abrirModalCarrinho);
    }
    
    // Botão pedido WhatsApp na seção contato
    const botaoPedidoWhatsApp = document.getElementById('botaoPedidoWhatsApp');
    if (botaoPedidoWhatsApp) {
        botaoPedidoWhatsApp.addEventListener('click', function() {
            if (carrinho.length > 0) {
                abrirModalFinalizacao();
            } else {
                // Se carrinho vazio, abre ele para adicionar produtos
                abrirModalCarrinho();
            }
        });
    }
    
    // Fechar modais ao clicar no botão X
    document.querySelectorAll('.modal-fechar').forEach(botao => {
        botao.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('mostrar');
            }
        });
    });
    
    // Fechar modais ao clicar fora do conteúdo
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('mostrar');
            }
        });
    });
    
    // Botão finalizar pedido
    const botaoFinalizar = document.getElementById('botaoFinalizar');
    if (botaoFinalizar) {
        botaoFinalizar.addEventListener('click', abrirModalFinalizacao);
    }
    
    // Botão enviar pedido
    const botaoEnviarPedido = document.getElementById('botaoEnviarPedido');
    if (botaoEnviarPedido) {
        botaoEnviarPedido.addEventListener('click', enviarPedidoWhatsApp);
    }
    
    // Botão fechar sucesso
    const botaoFecharSucesso = document.getElementById('botaoFecharSucesso');
    if (botaoFecharSucesso) {
        botaoFecharSucesso.addEventListener('click', function() {
            fecharModalSucesso();
            // Recarrega a página para resetar tudo
            window.location.reload();
        });
    }
    
    // Botões de finalizar dos modais de "X" com data-fechar-modal
    document.querySelectorAll('[data-fechar-modal]').forEach(botao => {
        botao.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('mostrar');
            }
        });
    });
}

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Formata o campo de telefone automaticamente
 * @param {HTMLInputElement} input - Elemento input do telefone
 */
function formatarTelefone(input) {
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length > 0) {
        if (valor.length <= 2) {
            valor = '(' + valor;
        } else if (valor.length <= 6) {
            valor = '(' + valor.substring(0, 2) + ') ' + valor.substring(2);
        } else if (valor.length <= 10) {
            valor = '(' + valor.substring(0, 2) + ') ' + valor.substring(2, 6) + '-' + valor.substring(6);
        } else {
            valor = '(' + valor.substring(0, 2) + ') ' + valor.substring(2, 7) + '-' + valor.substring(7, 11);
        }
    }
    
    input.value = valor;
}

/**
 * Inicializa a aplicação quando o DOM está pronto
 */
document.addEventListener('DOMContentLoaded', function() {
    renderizarProdutos();
    configurarEventos();
    atualizarInterfaceCarrinho();
    
    // Configura formatação automática do telefone
    const inputTelefone = document.getElementById('telefoneCliente');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function() {
            formatarTelefone(this);
        });
    }
});

// Exporta funções para uso global
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.atualizarQuantidade = atualizarQuantidade;
window.abrirModalCarrinho = abrirModalCarrinho;
window.fecharModalCarrinho = fecharModalCarrinho;
window.abrirModalFinalizacao = abrirModalFinalizacao;
window.fecharModalFinalizacao = fecharModalFinalizacao;
window.enviarPedidoWhatsApp = enviarPedidoWhatsApp;


