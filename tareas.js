function agregarTarea() {
    const t = document.getElementById("tareaInput");
    const f = document.getElementById("fechaInput");
    if (!t.value || !f.value) return;
    tareas.push({ texto: t.value, fecha: f.value, hecho: false });
    t.value = ""; f.value = "";
    guardar();
    renderTareas();
    renderDashboard();
}

function renderTareas() {
    const lista = document.getElementById("listaTareas");
    if(!lista) return;
    lista.innerHTML = "";

    tareas.forEach((t, i) => {
        let tachado = t.hecho ? "line-through opacity-50 bg-green-50" : "bg-white/60";
        lista.innerHTML += `
        <div class="glass p-4 mb-3 rounded-xl flex justify-between items-center ${tachado}">
            <div>
                <b class="text-gray-800">${t.texto}</b><br>
                <small class="text-pink-500">${t.hecho ? "Terminado ✅" : "⏳ Pendiente"}</small>
            </div>
            <div class="flex gap-2">
                <button onclick="toggleTarea(${i})" class="p-2 bg-white rounded-lg shadow-sm">${t.hecho ? "↩️" : "✔"}</button>
                <button onclick="eliminarTarea(${i})" class="p-2 bg-red-50 text-white rounded-lg shadow-sm">🗑</button>
            </div>
        </div>`;
    });
}

function toggleTarea(i) {
    tareas[i].hecho = !tareas[i].hecho;
    guardar();
    renderTareas();
    renderDashboard();
}

function eliminarTarea(i) {
    if(confirm("¿Borrar tarea?")) {
        tareas.splice(i, 1);
        guardar();
        renderTareas();
        renderDashboard();
    }
}