// Estructura de datos
let cantantes = [];
let votosGuardados = JSON.parse(localStorage.getItem('votosVallenato')) || {};
let cantantesGuardados = JSON.parse(localStorage.getItem('cantantesVallenato')) || null;

// Cantantes iniciales predeterminados
const cantantesIniciales = [
    {
        id: 1,
        nombre: "Carlos Vives",
        imagen: "https://via.placeholder.com/300x200?text=Carlos+Vives",
        votos: 0
    },
    {
        id: 2,
        nombre: "Juan Luis Guerra",
        imagen: "https://via.placeholder.com/300x200?text=Juan+Luis+Guerra",
        votos: 0
    },
    {
        id: 3,
        nombre: "Silvio Brito",
        imagen: "https://via.placeholder.com/300x200?text=Silvio+Brito",
        votos: 0
    },
    {
        id: 4,
        nombre: "Grupo Sombras",
        imagen: "https://via.placeholder.com/300x200?text=Grupo+Sombras",
        votos: 0
    }
];

// Inicializar la aplicación
function inicializar() {
    // Cargar cantantes guardados o usar los iniciales
    if (cantantesGuardados) {
        cantantes = cantantesGuardados;
    } else {
        cantantes = JSON.parse(JSON.stringify(cantantesIniciales));
        guardarCantantes();
    }

    // Cargar votos guardados
    cantantes.forEach(cantante => {
        if (votosGuardados[cantante.id]) {
            cantante.votos = votosGuardados[cantante.id];
        }
    });

    cargarPaginaVotacion();
    cargarPanelAdmin();
}

// ===== PÁGINA DE VOTACIÓN =====

function cargarPaginaVotacion() {
    const container = document.getElementById('canistasContainer');
    container.innerHTML = '';

    cantantes.forEach(cantante => {
        const card = document.createElement('div');
        card.className = 'cantante-card';
        card.innerHTML = `
            <img src="${cantante.imagen}" alt="${cantante.nombre}" class="cantante-imagen" onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(cantante.nombre)}'">
            <div class="cantante-info">
                <div class="cantante-nombre">${cantante.nombre}</div>
                <div class="cantante-votos">Votos: ${cantante.votos}</div>
                <button class="btn-votar" onclick="votarPor(${cantante.id})">Votar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function votarPor(cantanteId) {
    const cantante = cantantes.find(c => c.id === cantanteId);
    if (cantante) {
        cantante.votos++;
        votosGuardados[cantanteId] = cantante.votos;
        localStorage.setItem('votosVallenato', JSON.stringify(votosGuardados));

        // Mostrar mensaje de agradecimiento
        const resultadoDiv = document.getElementById('resultadoVotacion');
        resultadoDiv.style.display = 'block';
        setTimeout(() => {
            resultadoDiv.style.display = 'none';
        }, 3000);

        // Recargar la página de votación
        cargarPaginaVotacion();
        cargarPanelAdmin();
    }
}

function volverAtras() {
    const votacionPage = document.getElementById('votacionPage');
    const adminPage = document.getElementById('adminPage');

    if (adminPage.style.display !== 'none') {
        irAPagina('votacionPage');
    } else {
        alert('Ya estás en la página principal. ¿Deseas cerrar la aplicación?');
    }
}

// ===== PANEL DE ADMINISTRADOR =====

function irAPagina(nombrePagina) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(nombrePagina).style.display = 'block';
}

function cargarPanelAdmin() {
    // Cargar tabla de cantantes
    const tabla = document.getElementById('tablaCantantes');
    tabla.innerHTML = '';

    cantantes.forEach(cantante => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${cantante.nombre}</td>
            <td>${cantante.votos}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarCantante(${cantante.id})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Cargar gráfico de resultados
    cargarGraficoResultados();
}

function agregarCantante() {
    const nombre = document.getElementById('nombreCantante').value.trim();
    const imagen = document.getElementById('imagenCantante').value.trim();

    if (!nombre) {
        alert('Por favor ingresa el nombre del cantante');
        return;
    }

    // Generar ID único
    const nuevoId = Math.max(...cantantes.map(c => c.id), 0) + 1;

    const nuevoCantante = {
        id: nuevoId,
        nombre: nombre,
        imagen: imagen || `https://via.placeholder.com/300x200?text=${encodeURIComponent(nombre)}`,
        votos: 0
    };

    cantantes.push(nuevoCantante);
    guardarCantantes();

    // Limpiar formulario
    document.getElementById('nombreCantante').value = '';
    document.getElementById('imagenCantante').value = '';

    alert(`¡${nombre} ha sido agregado exitosamente!`);

    // Recargar vistas
    cargarPaginaVotacion();
    cargarPanelAdmin();
}

function eliminarCantante(cantanteId) {
    const cantante = cantantes.find(c => c.id === cantanteId);
    
    if (confirm(`¿Estás seguro de que deseas eliminar a ${cantante.nombre}?`)) {
        cantantes = cantantes.filter(c => c.id !== cantanteId);
        
        // Limpiar votos del cantante eliminado
        delete votosGuardados[cantanteId];
        
        guardarCantantes();
        localStorage.setItem('votosVallenato', JSON.stringify(votosGuardados));

        alert(`${cantante.nombre} ha sido eliminado.`);
        
        // Recargar vistas
        cargarPaginaVotacion();
        cargarPanelAdmin();
    }
}

function cargarGraficoResultados() {
    const container = document.getElementById('resultadosGrafico');
    container.innerHTML = '';

    if (cantantes.length === 0) {
        container.innerHTML = '<p>No hay cantantes registrados</p>';
        return;
    }

    // Encontrar máximo de votos para escalar la barra
    const maxVotos = Math.max(...cantantes.map(c => c.votos), 1);

    cantantes.forEach(cantante => {
        const porcentaje = (cantante.votos / maxVotos) * 100;
        
        const barraDiv = document.createElement('div');
        barraDiv.className = 'barra-resultado';
        barraDiv.innerHTML = `
            <div class="barra-nombre">${cantante.nombre}</div>
            <div class="barra-progreso">
                <div class="barra-llena" style="width: ${porcentaje}%">
                    ${cantante.votos}
                </div>
            </div>
        `;
        
        container.appendChild(barraDiv);
    });
}

// ===== FUNCIONES DE ALMACENAMIENTO =====

function guardarCantantes() {
    localStorage.setItem('cantantesVallenato', JSON.stringify(cantantes));
}

// ===== INICIAR APLICACIÓN =====

window.addEventListener('load', inicializar);

// Botón para ir al panel admin (puedes agregar esto en el HTML)
function abrirPanelAdmin() {
    const password = prompt('Ingresa la contraseña del administrador:');
    if (password === '1234') {  // Contraseña simple (cambiar en producción)
        irAPagina('adminPage');
    } else {
        alert('Contraseña incorrecta');
    }
}

// Agregar un botón flotante de admin (opcional)
document.addEventListener('DOMContentLoaded', () => {
    // Detectar triple tap para abrir admin
    let tapCount = 0;
    document.addEventListener('click', () => {
        tapCount++;
        if (tapCount === 3) {
            abrirPanelAdmin();
            tapCount = 0;
        }
    });

    // Reset después de 1 segundo
    setInterval(() => {
        tapCount = 0;
    }, 1000);
});
