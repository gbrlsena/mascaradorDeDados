# Ferramenta de Segurança de Dados e Editor de Imagens | Konsi

Uma página web desenvolvida para a Konsi, focada na segurança da informação. A ferramenta oferece funcionalidades para mascarar dados sensíveis e editar imagens, garantindo a conformidade com as políticas de privacidade e a LGPD durante o atendimento ao cliente.

---

## ✨ Funcionalidades Principais

Este projeto combina duas ferramentas essenciais em uma única interface:

### 1. 🎭 **Mascarador de Dados**
Uma solução rápida para ofuscar informações sensíveis antes de compartilhá-las.
- **Tipos de Dados Suportados:** CPF, E-mail, Número de telefone, Endereço, CEP, N° de Benefício e Dados Bancários.
- **Cópia Rápida:** Botão "Copiar" que envia o dado mascarado diretamente para a área de transferência.
- **Interface Inteligente:** Os campos de entrada se adaptam conforme o tipo de dado selecionado (ex: campos separados para agência e conta).
- **Alertas de Segurança:** Avisos específicos para o compartilhamento de dados bancários.

### 2. 🖼️ **Editor de Imagens**
Uma ferramenta poderosa para remover informações confidenciais de capturas de tela.
- **Carregamento Flexível:** Carregue imagens do seu computador, arraste e solte na tela ou simplesmente cole (`Ctrl+V`).
- **Ferramentas de Edição:**
    - **🔲 Pixelizar:** Desfoque áreas específicas da imagem para torná-las ilegíveis.
    - **📏 Linha e ↗️ Seta:** Adicione anotações visuais para destacar pontos importantes.
- **Controles Intuitivos:** Ajuste facilmente o tamanho do pixel, a cor e a espessura das linhas.
- **Histórico de Ações:** Desfaça (`↩️`) e refaça (`↪️`) alterações a qualquer momento.
- **Download Fácil:** Baixe a imagem editada com um único clique.

---

## 📚 Conteúdo de Apoio

A página também inclui seções de consulta rápida para reforçar as boas práticas:
- **Tabela de Permissões:** Um guia claro sobre quais dados podem ou não ser compartilhados.
- **Dicas de Boas Práticas:** Lembretes sobre como tratar os dados dos clientes de forma segura e responsável.
- **Tutoriais Integrados:** Janelas de ajuda ("?") para guiar o usuário no uso de cada ferramenta.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído do zero utilizando tecnologias web fundamentais, sem a necessidade de frameworks externos.

- **HTML5:** Para a estrutura semântica do conteúdo.
- **CSS3:** Para toda a estilização, utilizando Flexbox, Grid e variáveis para um design responsivo e de fácil manutenção.
- **JavaScript (ES6+):** Para toda a lógica interativa, manipulação do DOM e as funcionalidades do canvas do editor de imagens.

---
