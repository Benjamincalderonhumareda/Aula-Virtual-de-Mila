let semIdx = null; 
let mediaRecorder;
let audioChunks = [];

function abrirSemana(i) {
    if (cursoIdx === null) return;
    semIdx = i; 
    const semana = cursos[cursoIdx].semanas[semIdx];
    document.getElementById("tituloSemana").innerText = semana.nombre;
    mostrar('apuntes'); 
    renderApuntes();
}
// --- FUNCIÓN PARA ELIMINAR SEMANA ---
function eliminarSemana(index) {
    if (confirm("¿Amor quieres eliminar esta semana y todos tus apuntes?")) {
        // cursoIdx es la variable global que guarda el curso que estás viendo
        cursos[cursoIdx].semanas.splice(index, 1);
        
        guardar(); // Guarda los cambios en LocalStorage
        renderSemanas(); // Refresca la lista de semanas en pantalla
    }
}

// --- ASEGÚRATE DE QUE renderSemanas TENGA EL BOTÓN ---
// Busca tu función renderSemanas y asegúrate de que el HTML generado sea similar a este:
function renderSemanas() {
    const lista = document.getElementById("listaSemanas");
    lista.innerHTML = "";
    
    const semanas = cursos[cursoIdx].semanas || [];
    
    semanas.forEach((s, i) => {
        lista.innerHTML += `
            <div class="flex items-center gap-2 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-pink-100 dark:border-slate-700 animate-fade-in">
                <div onclick="abrirSemana(${i})" class="flex-1 cursor-pointer">
                    <p class="font-bold dark:text-white">${s.nombre}</p>
                </div>
                <button onclick="eliminarSemana(${i})" class="text-red-400 hover:text-red-600 p-2 text-lg">
                    🗑️
                </button>
            </div>
        `;
    });
}

function renderApuntes() {
    const lista = document.getElementById("listaApuntes");
    if (!lista) return;
    lista.innerHTML = "";
    const temas = cursos[cursoIdx].semanas[semIdx].temas || [];

    temas.forEach((t, i) => {
        lista.innerHTML += `
            <div class="bg-white p-5 rounded-3xl mb-6 shadow-sm border border-pink-100 dark:bg-slate-800 dark:border-slate-700">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-bold text-lg dark:text-pink-400">${t.titulo}</h4>
                    <button onclick="eliminarTema(${i})" class="text-gray-400 hover:text-red-500 transition-colors">
                        <small>Eliminar Tema 🗑</small>
                    </button>
                </div>
                
                <textarea onchange="actualizarContenido(${i}, this.value)" 
                    class="w-full p-3 bg-pink-50/30 dark:bg-slate-900/50 rounded-2xl outline-none text-sm min-h-[100px] mb-4 dark:text-gray-200" 
                    placeholder="Escribe tus notas aquí...">${t.contenido}</textarea>

                <div class="flex flex-wrap gap-2">
                    <button id="btn-grab-${i}" onclick="gestionarGrabacion(${i})" 
                        class="flex-1 p-2 bg-pink-500 text-white rounded-xl text-xs font-bold hover:bg-pink-600 transition-all">
                        🎤 Grabar Voz
                    </button>
                    
                    <label class="flex-1 p-2 bg-gray-100 dark:bg-slate-700 rounded-xl text-xs font-bold text-center cursor-pointer hover:bg-gray-200 dark:text-white">
                        📎 Adjuntar
                        <input type="file" class="hidden" onchange="subirArchivo(${i}, this)">
                    </label>
                </div>

                <div id="audio-container-${i}" class="mt-4">
                    ${t.audio ? `
                        <div class="flex items-center gap-2 bg-pink-50 dark:bg-slate-700 p-2 rounded-2xl">
                            <audio controls src="${t.audio}" class="flex-1 h-8"></audio>
                            <button onclick="eliminarAudio(${i})" class="bg-red-100 text-red-500 p-1 rounded-full hover:bg-red-200 px-2 font-bold" title="Eliminar audio">
                                ✕
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>`;
    });
}

// --- LÓGICA DE GRABACIÓN ---
async function gestionarGrabacion(i) {
    const btn = document.getElementById(`btn-grab-${i}`);

    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob); 
                reader.onloadend = () => {
                    const base64Audio = reader.result;
                    cursos[cursoIdx].semanas[semIdx].temas[i].audio = base64Audio;
                    guardar(); // Persistencia en LocalStorage
                    renderApuntes();
                };
            };

            mediaRecorder.start();
            btn.innerText = "🛑 Detener";
            btn.classList.replace("bg-pink-500", "bg-red-600");
        } catch (err) {
            alert("No se pudo acceder al micrófono. Dame permiso pues amor.");
        }
    } else {
        mediaRecorder.stop();
        btn.innerText = "🎤 Grabar Voz fea";
        btn.classList.replace("bg-red-600", "bg-pink-500");
    }
}
function agregarSeccion() {
    // 1. Verificamos que estemos dentro de un curso y una semana
    if (cursoIdx === null || semIdx === null) {
        alert("Amor primero debes seleccionar un curso y una semana.");
        return;
    }

    // 2. Pedimos el título al usuario
    const titulo = prompt("Amor escribe el título del nuevo tema:");
    
    // 3. Si el usuario cancela o deja vacío, no hacemos nada
    if (!titulo || titulo.trim() === "") return;

    // 4. Nos aseguramos de que el array de temas exista en esa semana
    if (!cursos[cursoIdx].semanas[semIdx].temas) {
        cursos[cursoIdx].semanas[semIdx].temas = [];
    }

    // 5. Agregamos el nuevo objeto con el título y los campos vacíos
    cursos[cursoIdx].semanas[semIdx].temas.push({ 
        titulo: titulo.trim(), 
        contenido: "",
        audio: null,
        archivo: null 
    });

    // 6. Guardamos en LocalStorage y refrescamos la pantalla
    guardar(); 
    renderApuntes();
}

// --- NUEVA FUNCIÓN: ELIMINAR SOLO EL AUDIO ---
function eliminarAudio(i) {
    if (confirm("¿Quieres borrar la nota de tu voz hermosa? Esto liberará espacio.")) {
        cursos[cursoIdx].semanas[semIdx].temas[i].audio = null; // Limpiamos el dato
        guardar(); // Actualizamos LocalStorage eliminando el string pesado
        renderApuntes(); // Refrescamos la vista
    }
}

function actualizarContenido(i, val) {
    cursos[cursoIdx].semanas[semIdx].temas[i].contenido = val;
    guardar();
}

function eliminarTema(i) {
    if (confirm("¿Linda, borraras toda esta seccion de apuntes  ?")) {
        cursos[cursoIdx].semanas[semIdx].temas.splice(i, 1);
        guardar();
        renderApuntes();
    }
}

// --- FUNCIÓN PARA PROCESAR LA IMAGEN ---
function subirArchivo(i, input) {
    const file = input.files[0];
    if (file) {
        // Validar que sea imagen
        if (!file.type.startsWith('image/')) {
            alert("Por favor, selecciona solo archivos de imagen.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            // Guardamos la imagen en Base64 en el objeto del tema
            cursos[cursoIdx].semanas[semIdx].temas[i].archivo = reader.result;
            guardar();
            renderApuntes();
        };
    }
}

// --- ACTUALIZA ESTA PARTE DENTRO DE renderApuntes() ---
// Busca donde se dibuja el tema y añade esto debajo del textarea:
/*
    <div id="media-preview-${i}" class="mt-3">
        ${t.archivo ? `
            <div class="relative inline-block">
                <img src="${t.archivo}" class="w-24 h-24 object-cover rounded-xl border-2 border-pink-200 shadow-sm">
                <button onclick="eliminarImagen(${i})" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs shadow-lg">✕</button>
            </div>
        ` : ''}
    </div>
*/

function eliminarImagen(i) {
    if (confirm("¿Quitar imagen?")) {
        cursos[cursoIdx].semanas[semIdx].temas[i].archivo = null;
        guardar();
        renderApuntes();
    }
}