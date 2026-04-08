let modo = null; 
let tempUser = null; // Usuario seleccionado antes de poner la clave
let cursos = [];
let tareas = [];

// 1. Al tocar un usuario, mostramos el campo de contraseña
function prepararLogin(perfil) {
    tempUser = perfil;
    document.getElementById("accountSelector").classList.add("hidden");
    document.getElementById("passwordArea").classList.remove("hidden");
    document.getElementById("userDisplay").innerText = "Perfil: " + perfil.charAt(0).toUpperCase() + perfil.slice(1);
    document.getElementById("passInput").focus();
}

function volverASeleccion() {
    document.getElementById("accountSelector").classList.remove("hidden");
    document.getElementById("passwordArea").classList.add("hidden");
    document.getElementById("passInput").value = "";
}

// 2. Validar o Crear contraseña
function validarPassword() {
    const passInput = document.getElementById("passInput").value;
    const passSaved = localStorage.getItem("pass_" + tempUser);

    if (!passInput) return;

    if (!passSaved) {
        // Primera vez: Registramos la contraseña
        if (confirm("Esta será tu nueva contraseña para " + tempUser + ". ¿Deseas guardarla?")) {
            localStorage.setItem("pass_" + tempUser, passInput);
            ejecutarLogin(tempUser);
        }
    } else if (passInput === passSaved) {
        // Contraseña correcta
        ejecutarLogin(tempUser);
    } else {
        // Error
        const errorMsg = document.getElementById("passError");
        errorMsg.classList.remove("hidden");
        setTimeout(() => errorMsg.classList.add("hidden"), 2000);
    }
}

// 3. Entrar al sistema
function ejecutarLogin(perfil) {
    modo = perfil;
    const nombreApp = document.getElementById("nombreApp");
    const body = document.body;

    if (modo === "benjamin") {
        body.classList.add("dark");
        nombreApp.innerText = "🖤 Aula de Benjamin";
    } else {
        body.classList.remove("dark");
        nombreApp.innerText = "💖 Aula de Mila";
    }

    cursos = JSON.parse(localStorage.getItem("cursos_" + modo)) || [];
    tareas = JSON.parse(localStorage.getItem("tareas_" + modo)) || [];

    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("passInput").value = "";
    
    renderDashboard();
    renderCursos();
    renderTareas();
}

function guardar() {
    if (!modo) return;
    localStorage.setItem("cursos_" + modo, JSON.stringify(cursos));
    localStorage.setItem("tareas_" + modo, JSON.stringify(tareas));
}

// 4. Cerrar sesión y volver al inicio
function cerrarSesion() {
    if(confirm("¿Cerrar sesión?")){
        guardar();
        // Limpiamos variables y mostramos el login de nuevo
        modo = null;
        document.getElementById("loginScreen").classList.remove("hidden");
        document.getElementById("accountSelector").classList.remove("hidden");
        document.getElementById("passwordArea").classList.add("hidden");
        document.body.classList.remove("dark"); // Reset visual
    }
}