const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const selectBtn = document.getElementById('selectBtn');
const drawLineBtn = document.getElementById('drawLineBtn');
const drawArrowBtn = document.getElementById('drawArrowBtn');
const pixelLevelInput = document.getElementById('pixelLevel');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const colorPicker = document.getElementById('colorPicker');
const downloadBtn = document.getElementById('downloadBtn');
const uploadInput = document.getElementById('uploadInput');

let image = null;
let currentTool = null;
let startX, startY;
let actions = [];
let redoStack = [];

canvas.width = 800;
canvas.height = 600;

uploadInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      image = img;
      actions = [];
      redoStack = [];
      alert('Imagem carregada com sucesso 💚');
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

function setTool(tool) {
  currentTool = tool;
}

function saveState() {
  actions.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  redoStack = [];
}

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  canvas.addEventListener('mouseup', onMouseUp);
});

function onMouseUp(e) {
  const rect = canvas.getBoundingClientRect();
  const endX = e.clientX - rect.left;
  const endY = e.clientY - rect.top;

  saveState();

  if (currentTool === 'select') {
    applyPixelate(startX, startY, endX, endY);
  } else if (currentTool === 'line') {
    drawLine(startX, startY, endX, endY);
  } else if (currentTool === 'arrow') {
    drawArrow(startX, startY, endX, endY);
  }

  canvas.removeEventListener('mouseup', onMouseUp);
}

function applyPixelate(x0, y0, x1, y1) {
  const x = Math.min(x0, x1);
  const y = Math.min(y0, y1);
  const w = Math.abs(x1 - x0);
  const h = Math.abs(y1 - y0);
  const level = parseInt(pixelLevelInput.value);

  const imgData = ctx.getImageData(x, y, w, h);
  for (let yPix = 0; yPix < h; yPix += level) {
    for (let xPix = 0; xPix < w; xPix += level) {
      const i = (yPix * w + xPix) * 4;
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      for (let dy = 0; dy < level; dy++) {
        for (let dx = 0; dx < level; dx++) {
          const j = ((yPix + dy) * w + (xPix + dx)) * 4;
          imgData.data[j] = r;
          imgData.data[j + 1] = g;
          imgData.data[j + 2] = b;
        }
      }
    }
  }
  ctx.putImageData(imgData, x, y);
}

function drawLine(x0, y0, x1, y1) {
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function drawArrow(x0, y0, x1, y1) {
  const headLength = 10;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const angle = Math.atan2(dy, dx);
  drawLine(x0, y0, x1, y1);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - headLength * Math.cos(angle - Math.PI / 6), y1 - headLength * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x1 - headLength * Math.cos(angle + Math.PI / 6), y1 - headLength * Math.sin(angle + Math.PI / 6));
  ctx.lineTo(x1, y1);
  ctx.fillStyle = colorPicker.value;
  ctx.fill();
}

selectBtn.onclick = () => setTool('select');
drawLineBtn.onclick = () => setTool('line');
drawArrowBtn.onclick = () => setTool('arrow');

undoBtn.onclick = () => {
  if (actions.length > 0) {
    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    const prev = actions.pop();
    ctx.putImageData(prev, 0, 0);
  }
};

redoBtn.onclick = () => {
  if (redoStack.length > 0) {
    actions.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    const redo = redoStack.pop();
    ctx.putImageData(redo, 0, 0);
  }
};

downloadBtn.onclick = () => {
  const link = document.createElement('a');
  link.download = 'imagem-editada.png';
  link.href = canvas.toDataURL();
  link.click();
};
