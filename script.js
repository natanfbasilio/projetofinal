
function login() {
  const u = document.getElementById('usuario').value;
  const s = document.getElementById('senha').value;
  if (u === 'usuario' && s === '1234') {
    location.href = 'home.html';
  } else {
    alert('Login inválido');
  }
}

function carregarLista() {
  const lista = JSON.parse(localStorage.getItem('lista') || '[]');
  return lista;
}

function salvarLista(lista) {
  localStorage.setItem('lista', JSON.stringify(lista));
}

function adicionarItem() {
  const campo = document.getElementById('novoItem');
  if (!campo.value.trim()) return;
  const lista = carregarLista();
  lista.push({ id: Date.now(), texto: campo.value.trim(), status: 'pendente' });
  salvarLista(lista);
  campo.value = '';
  renderizarLista();
}

function alternarStatus(id) {
  const lista = carregarLista();
  const item = lista.find(i => i.id === id);
  if (item) {
    item.status = item.status === 'feito' ? 'pendente' : 'feito';
    salvarLista(lista);
    renderizarLista();
  }
}

function removerItem(id) {
  let lista = carregarLista();
  lista = lista.filter(i => i.id !== id);
  salvarLista(lista);
  renderizarLista();
}

function editarItem(id) {
  const novoTexto = prompt('Editar Produto:');
  if (!novoTexto) return;
  const lista = carregarLista();
  const item = lista.find(i => i.id === id);
  if (item) {
    item.texto = novoTexto;
    salvarLista(lista);
    renderizarLista();
  }
}

function compartilharItem(id) {
  const url = `${location.origin}/detalhes.html?id=${id}`;
  navigator.clipboard.writeText(url);
  alert('Link copiado: ' + url);
}

function renderizarLista() {
  const lista = carregarLista();
  const ul = document.getElementById('lista');
  if (!ul) return;
  ul.innerHTML = '';
  lista.forEach(i => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center border p-3 rounded';
    li.innerHTML = `
      <div>
        <p class="font-medium ${i.status === 'feito' ? 'line-through text-gray-400' : ''}">${i.texto}</p>
        <p class="text-sm text-gray-500">Status: ${i.status}</p>
      </div>
      <div class="space-x-2">
        <button onclick="alternarStatus(${i.id})" class="bg-yellow-400 text-white px-2 py-1 rounded">Status</button>
        <button onclick="editarItem(${i.id})" class="bg-blue-400 text-white px-2 py-1 rounded">Editar</button>
        <button onclick="removerItem(${i.id})" class="bg-red-500 text-white px-2 py-1 rounded">Remover</button>
        <button onclick="compartilharItem(${i.id})" class="bg-cyan-500 text-white px-2 py-1 rounded">Compartilhar</button>
      </div>`;
    ul.appendChild(li);
  });
}

function renderizarDetalhe() {
  const id = new URLSearchParams(location.search).get('id');
  const lista = carregarLista();
  const item = lista.find(i => i.id == id);
  const div = document.getElementById('detalhe');
  if (div) {
    div.innerHTML = item
      ? `<p class="text-xl">${item.texto}</p><p class="text-sm text-gray-600">Status: ${item.status}</p>`
      : '<p class="text-red-500">Produto não encontrado.</p>';
  }
}

window.onload = () => {
  if (location.pathname.includes('home.html')) renderizarLista();
  if (location.pathname.includes('detalhes.html')) renderizarDetalhe();
};

function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle('dark');
  localStorage.setItem('tema', html.classList.contains('dark') ? 'dark' : 'light');
}
(function aplicarTemaSalvo() {
  const tema = localStorage.getItem('tema');
  if (tema === 'dark') document.documentElement.classList.add('dark');
})();

document.addEventListener('DOMContentLoaded', () => {
  const tema = localStorage.getItem('tema');
  if (tema === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
