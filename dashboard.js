function renderDashboard() {
    const resumen = document.getElementById("resumen");
    if (!resumen) return;

    const pendientes = tareas.filter(t => !t.hecho).length;

    resumen.innerHTML = `
    <div onclick="toggleAccesoCursos()" class="glass p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all border-b-4 border-pink-400 bg-white/50">
        <h3 class="font-bold text-lg">📚 Mis Cursos</h3>
        <p class="text-3xl font-bold">${cursos.length}</p>
        <p class="text-[10px] text-gray-500">Toca para abrir</p>
    </div>

    <div onclick="mostrar('tareas')" class="glass p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all border-b-4 border-blue-400 bg-white/50">
        <h3 class="font-bold text-lg">✅ Tareas</h3>
        <p class="text-3xl font-bold">${pendientes}</p>
        <p class="text-[10px] text-gray-500">Ir a lista</p>
    </div>
    `;
}

function toggleAccesoCursos() {
    const divAcceso = document.getElementById("accesoDirectoCursos");
    const lista = document.getElementById("listaCursosDirectos");
    
    if (!divAcceso.classList.contains("hidden")) {
        divAcceso.classList.add("hidden");
        return;
    }

    if (cursos.length === 0) {
        alert("Primero crea un curso en la sección de Cursos ✨");
        return;
    }

    divAcceso.classList.remove("hidden");
    lista.innerHTML = "";

    cursos.forEach((c, i) => {
        lista.innerHTML += `
        <div onclick="abrirCursoDesdeDash(${i})" class="bg-white p-4 rounded-xl shadow-sm border border-pink-100 flex justify-between items-center cursor-pointer hover:bg-pink-50 transition-colors mb-2">
            <span class="font-bold text-gray-700">${c.nombre}</span>
            <span class="text-pink-500 font-bold text-xs">ABRIR →</span>
        </div>`;
    });
}

function abrirCursoDesdeDash(index) {
    cursoActual = index;
    document.getElementById("tituloCurso").innerText = cursos[index].nombre;
    mostrar("semanas");
    renderSemanas();
}