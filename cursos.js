let cursoIdx = null; // Usaremos este nombre siempre para evitar confusiones

function renderCursos() {
    const lista = document.getElementById("listaCursos");
    if(!lista) return;
    lista.innerHTML = "";

    cursos.forEach((c, i) => {
        lista.innerHTML += `
        <div class="glass p-4 mb-3 rounded-xl flex justify-between items-center shadow-sm bg-white/40 dark:bg-slate-800">
            <h3 class="font-bold dark:text-white">${c.nombre}</h3>
            <div class="flex gap-2">
                <button onclick="abrirCurso(${i})" class="bg-pink-400 text-white px-3 py-1 rounded-lg text-sm font-bold hover:bg-pink-500 transition-all">Entrar</button>
                <button onclick="eliminarCurso(${i})" class="text-red-400">🗑</button>
            </div>
        </div>`;
    });
}

function agregarCurso() {
    const input = document.getElementById("cursoInput");
    if (!input.value) return;
    
    // Estructura limpia para el curso
    cursos.push({ 
        nombre: input.value, 
        semanas: [] 
    });
    
    input.value = "";
    guardar();
    renderCursos();
    if(typeof renderDashboard === 'function') renderDashboard();
}

function abrirCurso(i) {
    cursoIdx = i; // Seteamos el curso actual
    const curso = cursos[i];
    
    document.getElementById("tituloCurso").innerText = curso.nombre;
    mostrar("semanas");
    renderSemanas();
}

function agregarSemana() {
    const input = document.getElementById("semanaInput");
    if (!input.value) return;

    // ERROR CORREGIDO AQUÍ:
    // 1. Usamos cursoIdx (el que definimos en abrirCurso)
    // 2. Usamos "nombre" para que coincida con el render
    // 3. Usamos "temas" para que coincida con apuntes.js
    if (!cursos[cursoIdx].semanas) cursos[cursoIdx].semanas = [];
    
    cursos[cursoIdx].semanas.push({ 
        nombre: input.value, 
        temas: [] 
    });

    input.value = "";
    guardar(); // Guarda en LocalStorage
    renderSemanas(); // Refresca la lista de semanas
}

function renderSemanas() {
    const lista = document.getElementById("listaSemanas");
    if (!lista) return;
    lista.innerHTML = "";
    
    const sems = cursos[cursoIdx].semanas || [];

    if (sems.length === 0) {
        lista.innerHTML = `<p class="text-gray-400 text-sm italic p-4 text-center">No hay semanas creadas. ¡Añade la primera!</p>`;
    }

    sems.forEach((s, i) => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-white p-4 rounded-xl shadow-sm dark:bg-slate-800 border dark:border-slate-700 mb-2";
        div.innerHTML = `
            <span class="font-medium dark:text-white">${s.nombre}</span>
            <button onclick="abrirSemana(${i})" class="bg-pink-100 text-pink-600 px-3 py-1 rounded-lg font-bold hover:bg-pink-200 transition-all">
                📝 Ver Apuntes
            </button>
        `;
        lista.appendChild(div);
    });
}

function eliminarCurso(i) {
    if (confirm("Amor eliminaras el curso y todos sus datos?")) {
        cursos.splice(i, 1);
        guardar();
        renderCursos();
        if(typeof renderDashboard === 'function') renderDashboard();
    }
}