// --- LÓGICA DO MASCARADOR (CÓDIGO 1) ---
const tipoEl = document.getElementById('tipo');
const entradaEl = document.getElementById('entrada');
const agenciaEl = document.getElementById('agencia');
const contaEl = document.getElementById('conta');
const saidaEl = document.getElementById('saida');
const botaoCopiar = document.getElementById('botaoCopiar');

function maskData(tipo, valor) {
  const numeros = valor.replace(/\D/g, '');
  switch (tipo) {
    case 'CPF':
      if (numeros.length !== 11) return '';
      return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '∗∗∗.∗∗∗.∗∗∗-$4');
    
    case 'E-mail': {
      const [user, domain] = valor.split('@');
      if (!user || !domain) return valor;
      const [dom, ext] = domain.split('.');
      if (!dom || !ext) return valor;
      const userMasked = user.slice(0, 3) + '∗∗∗' + user.slice(-1);
      const domainMasked = dom[0] + '∗∗∗';
      return `${userMasked}@${domainMasked}.${ext}`;
    }

    case 'Número de telefone':
      return numeros.replace(/^.*(?=\d{4})/, '∗∗∗∗∗∗∗');

    case 'Endereço':
      return valor.split(' ').map(p => {
        if (/^(Rua|Travessa)$/i.test(p)) return p;
        if (p.length > 3) return p.slice(0, 3) + '∗∗∗';
        return p;
      }).join(' ');

    case 'CEP':
      return numeros.length === 8 ? numeros.replace(/(\d{3})(\d{2})(\d{3})$/, '∗∗∗$2-$3') : '';

    case 'Benefício ou Matrícula':
      return numeros.replace(/\d(?=\d{3})/g, '∗');

    case 'Agência': {
      if (numeros.length === 0) return '';
      if (numeros.length === 1) return '∗' + numeros;
      return numeros.slice(0, -1).replace(/\d/g, '∗') + numeros.slice(-1);
    }

    case 'Conta': {
      if (numeros.length < 5) return '';
      const digitosMascarados = numeros.slice(0, -1).replace(/\d/g, '∗');
      const ultimoDigito = numeros.slice(-1);
      return `${digitosMascarados}-${ultimoDigito}`;
    }

    default:
      return valor;
  }
}

// VERSÃO NOVA 
function copiar() {
    const texto = saidaEl.textContent;
    if (!texto || texto.trim() === '') {
        alert('Nada para copiar!');
        return;
    }

    // 1. Lógica para selecionar o texto na tela
    const range = document.createRange();
    range.selectNodeContents(saidaEl); // Cria um "range" que engloba o conteúdo do nosso elemento de saída
    const selection = window.getSelection(); // Pega o objeto de seleção do navegador
    selection.removeAllRanges(); // Limpa qualquer seleção anterior
    selection.addRange(range); // Adiciona nosso novo range, efetivamente selecionando o texto

    // 2. Lógica para copiar para a área de transferência (a que já existia)
    navigator.clipboard.writeText(texto).then(() => {
        botaoCopiar.classList.add('copied');
        botaoCopiar.textContent = "Copiado!";
        setTimeout(() => {
            botaoCopiar.classList.remove('copied');
            botaoCopiar.textContent = "Copiar";
            selection.removeAllRanges(); // Opcional: remove a seleção após o sucesso
        }, 1000);
    }).catch(err => {
        console.error('Falha ao copiar para a área de transferência:', err);
        // Se a cópia automática falhar, o texto já está selecionado para o usuário copiar manualmente
        alert('Texto selecionado! Pressione Ctrl+C para copiar.');
    });
}

  // --- FUNÇÃO PRINCIPAL DE CONTROLE ---
function atualizar() {

 if (event && event.type === 'change' && event.target === tipoEl) {
        entradaEl.value = '';
        agenciaEl.value = '';
        contaEl.value = '';
    }

    const tipo = tipoEl.value;
    const imagemEditorContainer = document.getElementById('imagem-editor-container');
    const mascaradorOutputContainer = document.getElementById('mascarador-output-container');
    const ajudaMascaradorBtn = document.getElementById('ajuda-mascarador-btn'); // Pega o botão de ajuda
    
    const formElementsToToggle = [entradaEl, agenciaEl, contaEl, botaoCopiar];

    if (tipo === 'Imagens') {
        formElementsToToggle.forEach(el => el.style.display = 'none');
        mascaradorOutputContainer.style.display = 'none';
        imagemEditorContainer.style.display = 'flex';
        ajudaMascaradorBtn.style.display = 'none'; // Esconde o botão de ajuda do mascarador
    } else {
        imagemEditorContainer.style.display = 'none';
        botaoCopiar.style.display = 'inline-block';
        mascaradorOutputContainer.style.display = 'block';
        ajudaMascaradorBtn.style.display = 'block'; // Mostra o botão de ajuda do mascarador

        const valor = entradaEl.value.trim();
        const alertaBancarioEl = document.getElementById('alerta-bancario');
        const mensagemPadraoEl = document.getElementById('mensagemPadrao');

        if (tipo === 'Dados Bancários') {
            entradaEl.style.display = 'none';
            agenciaEl.style.display = 'inline-block';
            contaEl.style.display = 'inline-block';
            mensagemPadraoEl.style.display = 'none';
            alertaBancarioEl.style.display = 'block';

            const agencia = agenciaEl.value.trim();
            const conta = contaEl.value.trim();
            const entradaValida = agencia.length > 0 && conta.length > 0;
            const agenciaConta = `Agência: ${maskData('Agência', agencia)} | Conta: ${maskData('Conta', conta)}`;
            saidaEl.textContent = entradaValida ? agenciaConta : '';
            botaoCopiar.disabled = !entradaValida;
        } else {
            entradaEl.style.display = 'inline-block';
            agenciaEl.style.display = 'none';
            contaEl.style.display = 'none';
            mensagemPadraoEl.style.display = 'block';
            alertaBancarioEl.style.display = 'none';

            if ((tipo === 'CEP' && valor.replace(/\D/g, '').length !== 8) || (tipo === 'CPF' && valor.replace(/\D/g, '').length !== 11)) {
                saidaEl.textContent = '';
                botaoCopiar.disabled = true;
                return;
            }

            const resultado = maskData(tipo, valor);
            if (resultado !== valor && resultado.includes('*')) {
                saidaEl.textContent = resultado;
                botaoCopiar.disabled = false;
            } else {
                saidaEl.textContent = '';
                botaoCopiar.disabled = true;
            }
        }
    }
}

  // Listeners
  entradaEl.addEventListener('input', atualizar);
  tipoEl.addEventListener('change', atualizar);
  botaoCopiar.addEventListener('click', copiar);
  agenciaEl.addEventListener('input', atualizar);
  contaEl.addEventListener('input', atualizar);
  
  // Inicializa a visualização correta
  atualizar();

  // --- INÍCIO DA LÓGICA DO TUTORIAL E EDITOR ---
  document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica do Tutorial ---
    const mascaradorTutorial = document.getElementById('mascarador-tutorial');
    const imagensTutorial = document.getElementById('imagens-tutorial');
    const ajudaMascaradorBtn = document.getElementById('ajuda-mascarador-btn');
    const ajudaImagensBtn = document.getElementById('ajuda-imagens-btn');

    const showTutorial = (tutorialElement) => {
      tutorialElement.style.display = 'flex';
    };

    ajudaMascaradorBtn.addEventListener('click', () => showTutorial(mascaradorTutorial));
    ajudaImagensBtn.addEventListener('click', () => showTutorial(imagensTutorial));

    document.querySelectorAll('.tutorial-overlay').forEach(overlay => {
      const closeBtn = overlay.querySelector('.tutorial-close-btn');
      const okBtn = overlay.querySelector('.tutorial-ok-btn');

      const handleClose = () => {
        overlay.style.display = 'none';
      };

      closeBtn.addEventListener('click', handleClose);
      okBtn.addEventListener('click', handleClose);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) handleClose();
      });
    });

    // --- Lógica do Editor de Imagens ---
    const canvasWrapper = document.getElementById('canvasWrapper');
    const mainCanvas = document.getElementById('mainCanvas');
    const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
    const previewCanvas = document.getElementById('previewCanvas');
    const previewCtx = previewCanvas.getContext('2d');
    const uploadInput = document.getElementById('upload');
    const selectionBox = document.getElementById('selectionBox');
    const toolBtns = document.querySelectorAll('.tool-btn');
    const pixelControls = document.getElementById('pixelControls');
    const drawControls = document.getElementById('drawControls');
    const pixelSlider = document.getElementById('pixelSize');
    const pixelValue = document.getElementById('pixelValue');
    const lineColorInput = document.getElementById('lineColor');
    const lineWidthSlider = document.getElementById('lineWidth');
    const lineWidthValue = document.getElementById('lineWidthValue');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const overlayConfirm = document.getElementById('overlay');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmYesBtn = document.getElementById('confirmYes');
    const confirmNoBtn = document.getElementById('confirmNo');
    const state = { isDrawing: false, startPos: { x: 0, y: 0 }, undoStack: [], redoStack: [], hasImage: false, initialWidth: 600, initialHeight: 400, currentTool: 'pixelate', lineColor: '#e74c3c', lineWidth: 5 };
    
    function setCanvasSize(width, height) {
      canvasWrapper.style.width = `${width + 24}px`; canvasWrapper.style.height = `${height + 24}px`;
      mainCanvas.width = previewCanvas.width = width; mainCanvas.height = previewCanvas.height = height;
    }
    function loadImage(src) {
      const img = new Image();
      img.onload = () => {
        mainCanvas.classList.remove('empty');
        const scale = Math.min(800 / img.width, 800 / img.height, 1);
        const newWidth = img.width * scale; const newHeight = img.height * scale;
        setCanvasSize(newWidth, newHeight); mainCtx.drawImage(img, 0, 0, newWidth, newHeight);
        state.hasImage = true; resetHistory(); saveState(); updateButtonStates(); URL.revokeObjectURL(src);
      };
      img.src = src;
    }
    function drawLine(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = state.lineColor; ctx.lineWidth = state.lineWidth; ctx.lineCap = 'round'; ctx.stroke(); }
    function drawArrow(ctx, x1, y1, x2, y2) {
      const headlen = Math.max(10, state.lineWidth * 3); const angle = Math.atan2(y2 - y1, x2 - x1);
      drawLine(ctx, x1, y1, x2, y2); ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x2, y2); ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6)); ctx.stroke();
    }
    function applyPixelation(ctx, x1, y1, x2, y2) {
      const pixelSize = parseInt(pixelSlider.value, 10);
      const x = Math.min(x1, x2); const y = Math.min(y1, y2);
      const width = Math.abs(x2 - x1); const height = Math.abs(y2 - y1);
      if (width < 1 || height < 1) return;
      const imgData = ctx.getImageData(x, y, width, height); const data = imgData.data;
      for (let row = 0; row < height; row += pixelSize) {
        for (let col = 0; col < width; col += pixelSize) {
          const r = data[(row * width + col) * 4]; const g = data[(row * width + col) * 4 + 1]; const b = data[(row * width + col) * 4 + 2];
          for (let py = row; py < row + pixelSize && py < height; py++) {
            for (let px = col; px < col + pixelSize && px < width; px++) {
              const i = (py * width + px) * 4; data[i] = r; data[i + 1] = g; data[i + 2] = b;
            }
          }
        }
      }
      ctx.putImageData(imgData, x, y);
    }
    function saveState() { state.undoStack.push(mainCanvas.toDataURL()); state.redoStack = []; updateButtonStates(); }
    function restoreState(dataUrl) { const img = new Image(); img.onload = () => { mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height); mainCtx.drawImage(img, 0, 0); }; img.src = dataUrl; }
    function undo() { if (state.undoStack.length <= 1) return; state.redoStack.push(state.undoStack.pop()); restoreState(state.undoStack[state.undoStack.length - 1]); updateButtonStates(); }
    function redo() { if (state.redoStack.length === 0) return; const nextState = state.redoStack.pop(); state.undoStack.push(nextState); restoreState(nextState); updateButtonStates(); }
    function resetHistory() { state.undoStack = []; state.redoStack = []; }
    function updateButtonStates() { undoBtn.disabled = state.undoStack.length <= 1; redoBtn.disabled = state.redoStack.length === 0; downloadBtn.disabled = !state.hasImage; clearBtn.disabled = !state.hasImage; }
    function clearCanvas() { setCanvasSize(state.initialWidth, state.initialHeight); mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height); mainCanvas.classList.add('empty'); state.hasImage = false; resetHistory(); updateButtonStates(); uploadInput.value = ''; }
    function getMousePos(e) { const rect = previewCanvas.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top }; }
    previewCanvas.addEventListener('mousedown', (e) => { if (!state.hasImage) return; state.isDrawing = true; state.startPos = getMousePos(e); });
    previewCanvas.addEventListener('mousemove', (e) => {
      if (!state.isDrawing) return; const currentPos = getMousePos(e);
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height); selectionBox.style.display = 'none';
      switch (state.currentTool) {
        case 'pixelate':
          const w = currentPos.x - state.startPos.x; const h = currentPos.y - state.startPos.y; selectionBox.style.display = 'block';
          selectionBox.style.left = `${mainCanvas.offsetLeft + Math.min(state.startPos.x, currentPos.x)}px`; selectionBox.style.top = `${mainCanvas.offsetTop + Math.min(state.startPos.y, currentPos.y)}px`;
          selectionBox.style.width = `${Math.abs(w)}px`; selectionBox.style.height = `${Math.abs(h)}px`; break;
        case 'line': let { x: endX, y: endY } = currentPos; if (Math.abs(endX - state.startPos.x) > Math.abs(endY - state.startPos.y)) { endY = state.startPos.y; } else { endX = state.startPos.x; } drawLine(previewCtx, state.startPos.x, state.startPos.y, endX, endY); break;
        case 'arrow': drawArrow(previewCtx, state.startPos.x, state.startPos.y, currentPos.x, currentPos.y); break;
      }
    });
    previewCanvas.addEventListener('mouseup', (e) => {
      if (!state.isDrawing) return; state.isDrawing = false; const currentPos = getMousePos(e);
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height); selectionBox.style.display = 'none';
      switch (state.currentTool) {
        case 'pixelate': applyPixelation(mainCtx, state.startPos.x, state.startPos.y, currentPos.x, currentPos.y); break;
        case 'line': let { x: endX, y: endY } = currentPos; if (Math.abs(endX - state.startPos.x) > Math.abs(endY - state.startPos.y)) { endY = state.startPos.y; } else { endX = state.startPos.x; } drawLine(mainCtx, state.startPos.x, state.startPos.y, endX, endY); break;
        case 'arrow': drawArrow(mainCtx, state.startPos.x, state.startPos.y, currentPos.x, currentPos.y); break;
      }
      saveState();
    });
    previewCanvas.addEventListener('mouseleave', () => { state.isDrawing = false; });
    function setupEventListeners() {
      toolBtns.forEach(btn => { btn.addEventListener('click', () => { toolBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.currentTool = btn.dataset.tool; pixelControls.classList.toggle('hidden', state.currentTool !== 'pixelate'); drawControls.classList.toggle('hidden', state.currentTool === 'pixelate'); }); });
      lineColorInput.addEventListener('input', (e) => state.lineColor = e.target.value);
      lineWidthSlider.addEventListener('input', (e) => { state.lineWidth = e.target.value; lineWidthValue.textContent = e.target.value; });
      pixelSlider.addEventListener('input', (e) => pixelValue.textContent = e.target.value);
      uploadInput.addEventListener('change', e => { const file = e.target.files?.[0]; if (file) loadImage(URL.createObjectURL(file)); });
      window.addEventListener('paste', e => { const file = e.clipboardData?.files?.[0]; if (file) loadImage(URL.createObjectURL(file)); });
      window.addEventListener('dragover', e => e.preventDefault());
      window.addEventListener('drop', e => { e.preventDefault(); const file = e.dataTransfer?.files?.[0]; if(file) loadImage(URL.createObjectURL(file)); });
      undoBtn.addEventListener('click', undo); redoBtn.addEventListener('click', redo);
      downloadBtn.addEventListener('click', () => { const link = document.createElement('a'); link.download = `editado-${Date.now()}.jpg`; link.href = mainCanvas.toDataURL(); link.click(); });
      clearBtn.addEventListener('click', () => { overlayConfirm.classList.remove('hidden'); confirmDialog.classList.remove('hidden'); });
      confirmYesBtn.addEventListener('click', () => { clearCanvas(); overlayConfirm.classList.add('hidden'); confirmDialog.classList.add('hidden'); });
      confirmNoBtn.addEventListener('click', () => { overlayConfirm.classList.add('hidden'); confirmDialog.classList.add('hidden'); });
    }
    clearCanvas(); setupEventListeners();
  });
  // --- FIM DA LÓGICA DO TUTORIAL E EDITOR ---
