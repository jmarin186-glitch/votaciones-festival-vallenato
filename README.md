# votaciones-festival-vallenato
Sistema de votaciones para el Festival Vallenato 2027 - Aplicación web móvil con gestión de candidatos
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Festival Vallenato 2027</title>
    <meta name="description" content="Sistema de votación del Festival Vallenato 2027" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                50: '#fff1f2',
                100: '#ffe4e6',
                200: '#fecdd3',
                300: '#fda4af',
                400: '#fb7185',
                500: '#f43f5e',
                600: '#e11d48',
                700: '#be123c',
                800: '#9f1239',
                900: '#881337'
              },
              gold: {
                300: '#fde68a',
                400: '#fbbf24',
                500: '#f59e0b',
                600: '#d97706'
              }
            },
            boxShadow: {
              glow: '0 16px 30px rgba(190, 18, 60, 0.35)'
            }
          }
        }
      };
    </script>
    <style>
      html, body {
        height: 100%;
        background: #020817;
        color: #f8fafc;
        font-family: Arial, Helvetica, sans-serif;
      }
      body {
        display: flex;
        justify-content: center;
        align-items: flex-start;
      }
      .app-shell {
        width: min(100%, 420px);
        min-height: 100vh;
        background: linear-gradient(180deg, #0b1020, #09090f 32%, #020617 100%);
        border-left: 1px solid rgba(248, 113, 113, 0.25);
        border-right: 1px solid rgba(248, 113, 113, 0.25);
        position: relative;
        overflow: hidden;
      }
      .topbar {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(190, 18, 60, 0.35);
      }
      .banner {
        background: linear-gradient(135deg, #7f1d1d 0%, #be123c 35%, #dc2626 75%, #7f1d1d 100%);
        position: relative;
      }
      .banner::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top right, rgba(250, 204, 21, 0.35), transparent 38%);
      }
      .tab-pill {
        white-space: nowrap;
      }
      .candidate-card {
        background: rgba(15,23,42,0.75);
        border: 1px solid rgba(190,18,60,0.25);
      }
      .button-glow {
        box-shadow: 0 12px 24px rgba(190, 18, 60, 0.35);
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .hidden-screen {
        display: none !important;
      }
      .toast {
        transform: translate(-50%, -140%);
        opacity: 0;
      }
      .toast.show {
        transform: translate(-50%, 0);
        opacity: 1;
      }
    </style>
  </head>
  <body>
    <div class="app-shell shadow-2xl">
      <div class="topbar px-4 py-3 flex items-center justify-between text-xs text-slate-200">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center font-black text-amber-300 shadow-glow">57°</div>
          <div>
            <div class="font-bold">Festival Vallenato</div>
            <div class="text-[10px] text-slate-400">Votaciones 2027</div>
          </div>
        </div>
        <button id="roleToggle" class="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[10px] font-semibold">
          Panel Admin
        </button>
      </div>

      <div id="screen-voter" class="screen">
        <div class="banner px-4 pt-4 pb-5 text-white relative z-10">
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl border border-amber-300/40 bg-slate-950/20 flex items-center justify-center">
                <i class="fa-solid fa-music text-xl text-amber-300"></i>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-bold">Festival oficial</div>
                <div class="font-black text-xl">Votación Popular</div>
              </div>
            </div>
            <button id="regBtn" class="bg-slate-950/30 border border-white/15 rounded-full px-2.5 py-1.5 text-[10px] font-semibold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span id="userLabel">Invitado</span>
            </button>
          </div>
          <div class="mt-4 flex items-center justify-between bg-slate-950/25 border border-white/10 rounded-xl px-3 py-2 relative z-10">
            <div class="flex items-center gap-2 text-xs text-slate-100">
              <i class="fa-solid fa-fire text-amber-300"></i>
              <span>Elige tus favoritos</span>
            </div>
            <span class="rounded-md border border-amber-300/40 bg-brand-800/60 px-2 py-1 text-[10px] font-bold text-amber-200">LIVE</span>
          </div>
        </div>

        <div class="bg-slate-900 px-3 py-2 border-b border-red-500/20">
          <div class="flex gap-2 overflow-x-auto no-scrollbar">
            <button class="tab-pill tab active px-3 py-2 rounded-full bg-brand-700 text-amber-300 font-bold text-[11px]" data-tab="reyes">Rey Vallenato</button>
            <button class="tab-pill tab px-3 py-2 rounded-full bg-slate-950 border border-slate-700 text-slate-300 font-medium text-[11px]" data-tab="musica">Álbum del Año</button>
            <button class="tab-pill tab px-3 py-2 rounded-full bg-slate-950 border border-slate-700 text-slate-300 font-medium text-[11px]" data-tab="comparsas">Piloneras</button>
            <button class="tab-pill tab px-3 py-2 rounded-full bg-slate-950 border border-slate-700 text-slate-300 font-medium text-[11px]" data-tab="reconocimiento">Leyenda viva</button>
          </div>
        </div>

        <div class="px-3 py-3 pb-20">
          <div class="flex items-center justify-between mb-3 px-1">
            <div>
              <div class="flex items-center gap-2 text-xs font-bold text-slate-100">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span id="categoryTitle">Rey Profesional Vallenato</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-1" id="categorySubtitle">Selecciona tu artista favorito.</div>
            </div>
            <span id="voteBadge" class="hidden rounded-full border border-emerald-800 bg-emerald-950 text-emerald-400 text-[10px] px-2 py-1 font-bold">
              <i class="fa-solid fa-check mr-1"></i>Votaste
            </span>
          </div>
          <div id="candidates" class="space-y-3"></div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 bg-slate-950/95 border-t border-red-500/20 px-3 py-2 flex items-center justify-around z-20">
          <button class="nav-btn active text-amber-300 font-semibold text-[10px] flex flex-col items-center gap-1" data-target="screen-voter">
            <i class="fa-solid fa-check-to-slot text-base"></i>
            Votar
          </button>
          <button class="nav-btn text-slate-400 font-medium text-[10px] flex flex-col items-center gap-1" data-target="screen-results">
            <i class="fa-solid fa-chart-pie text-base"></i>
            Resultados
          </button>
          <button class="nav-btn text-slate-400 font-medium text-[10px] flex flex-col items-center gap-1 relative" data-target="screen-certificate">
            <i class="fa-solid fa-shield-halved text-base"></i>
            Certificado
            <span id="certificateDot" class="hidden absolute -top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
          </button>
        </div>
      </div>

      <div id="screen-results" class="screen hidden-screen pt-4 pb-20">
        <div class="px-4 pb-2 flex items-center justify-between">
          <div>
            <div class="text-sm font-bold flex items-center gap-2"><i class="fa-solid fa-chart-simple text-amber-400"></i> Escrutinio</div>
            <div class="text-[10px] text-slate-400">Resultados reales del Festival</div>
          </div>
          <button id="refreshBtn" class="w-9 h-9 rounded-xl bg-slate-800 text-slate-200 border border-slate-700"><i class="fa-solid fa-rotate-right"></i></button>
        </div>
        <div class="px-4 pb-3">
          <div class="rounded-2xl bg-gradient-to-r from-brand-800 via-red-700 to-red-500 p-4 shadow-glow">
            <div class="text-[10px] uppercase tracking-widest text-amber-200">Total votos</div>
            <div id="totalVotes" class="text-3xl font-black mt-1">0</div>
          </div>
        </div>
        <div class="px-4 pb-3">
          <select id="resultsCategory" class="w-full rounded-xl bg-slate-900 border border-red-500/30 px-3 py-2 text-xs text-slate-200">
            <option value="reyes">Rey Vallenato</option>
            <option value="musica">Álbum del Año</option>
            <option value="comparsas">Piloneras</option>
            <option value="reconocimiento">Leyenda Viva</option>
          </select>
        </div>
        <div id="resultsList" class="px-4 space-y-3"></div>
      </div>

      <div id="screen-certificate" class="screen hidden-screen pt-4 pb-20 px-4">
        <div class="rounded-3xl border border-red-500/25 bg-[radial-gradient(circle_at_top,_rgba(190,18,60,0.22),_transparent_55%)] p-4 bg-slate-900">
          <div class="flex items-center justify-between pb-3 border-b border-red-500/20">
            <div>
              <div class="text-xs font-bold text-slate-100">Comprobante digital</div>
              <div class="text-[10px] text-slate-400">Festival Vallenato 2027</div>
            </div>
            <span class="rounded-full border border-emerald-800 bg-emerald-950 text-[9px] px-2 py-1 font-bold text-emerald-400">VERIFICADO</span>
          </div>
          <div id="certificateArea" class="mt-4"></div>
        </div>
      </div>

      <div id="screen-admin" class="screen hidden-screen pt-4 pb-20 px-4">
        <div class="rounded-2xl bg-slate-900 border border-red-500/20 p-3 mb-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center"><i class="fa-solid fa-sliders"></i></div>
              <div>
                <div class="text-xs font-bold text-slate-100">Consola Admin</div>
                <div class="text-[10px] text-slate-400">Control de votaciones</div>
              </div>
            </div>
            <button id="exitAdmin" class="text-[10px] font-semibold rounded-lg border border-red-500/30 bg-red-950/40 px-2 py-1 text-red-300">Salir</button>
          </div>
        </div>

        <div class="rounded-2xl bg-slate-900 border border-red-500/20 p-3 mb-3">
          <div class="text-[11px] font-bold mb-2 text-slate-200">Control de categorías</div>
          <div id="adminCategoryControls" class="space-y-2"></div>
        </div>

        <div class="rounded-2xl bg-slate-900 border border-red-500/20 p-3 mb-3">
          <div class="text-[11px] font-bold mb-2 text-slate-200">Agregar cantante a la votación</div>
          <div class="space-y-2">
            <input id="newName" type="text" placeholder="Nombre del cantante o grupo" class="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400" />
            <input id="newDesc" type="text" placeholder="Descripción o estilo" class="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400" />
            <select id="newCategory" class="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400">
              <option value="reyes">Rey Vallenato</option>
              <option value="musica">Álbum del Año</option>
              <option value="comparsas">Piloneras</option>
              <option value="reconocimiento">Leyenda Viva</option>
            </select>
            <button id="addCandidateBtn" class="w-full rounded-xl bg-brand-700 text-amber-300 font-bold py-2 text-xs button-glow">Guardar cantante</button>
          </div>
        </div>

        <button id="resetDataBtn" class="w-full rounded-xl border border-red-500/30 bg-red-950/40 text-red-200 font-bold py-2 text-xs">Reiniciar datos de prueba</button>
      </div>
    </div>

    <div id="modal-auth" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm hidden z-40">
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-sm rounded-3xl bg-slate-900 border border-red-500/30 p-4 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
            <div class="font-bold text-slate-100 text-sm">Identificación del votante</div>
            <button id="closeAuth" class="text-slate-400 text-sm"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="space-y-3">
            <input id="authName" type="text" placeholder="Nombre completo" class="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400" />
            <input id="authDoc" type="number" placeholder="Cédula o documento" class="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400" />
            <button id="saveUserBtn" class="w-full rounded-xl bg-brand-700 text-amber-300 font-bold py-2 text-xs button-glow">Habilitar voto</button>
          </div>
        </div>
      </div>
    </div>

    <div id="modal-vote" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm hidden z-40">
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-sm rounded-3xl bg-slate-900 border border-red-500/30 p-4 shadow-2xl">
          <div class="text-center">
            <div class="w-14 h-14 rounded-full bg-brand-900 border border-red-400/30 mx-auto flex items-center justify-center text-2xl text-amber-300"><i class="fa-solid fa-check-double"></i></div>
            <div class="mt-3 text-lg font-black text-white">Confirmar voto</div>
            <div class="mt-2 text-xs text-slate-300">Estás votando por:</div>
            <div id="voteTarget" class="mt-2 rounded-xl border border-red-500/25 bg-red-950/40 px-3 py-2 text-sm font-bold text-amber-300">--</div>
          </div>
          <div class="mt-4 flex gap-2">
            <button id="cancelVoteBtn" class="flex-1 rounded-xl bg-slate-800 text-slate-200 font-semibold py-2 text-xs">Cancelar</button>
            <button id="confirmVoteBtn" class="flex-1 rounded-xl bg-brand-700 text-white font-bold py-2 text-xs button-glow">Emitir voto</button>
          </div>
        </div>
      </div>
    </div>

    <button id="backBtn" class="fixed top-5 left-5 z-30 hidden w-9 h-9 rounded-full bg-slate-900/80 border border-red-500/30 text-white shadow-lg">
      <i class="fa-solid fa-arrow-left"></i>
    </button>

    <div id="toast" class="toast fixed left-1/2 bottom-24 z-50 bg-slate-900 border border-amber-500/25 rounded-xl px-3 py-2 text-[11px] text-slate-100 shadow-2xl">
      <div class="flex items-center gap-2">
        <i id="toastIcon" class="fa-solid fa-circle-check text-emerald-400"></i>
        <span id="toastText">Mensaje</span>
      </div>
    </div>

    <script>
      const DEFAULT_DATA = {
        categories: {
          reyes: {
            title: 'Rey Profesional Vallenato',
            subtitle: 'Selecciona tu acordeonero favorito.',
            active: true,
            candidates: [
              { id: 'r1', name: 'Alfonso “El Cocha” Molina', desc: 'Tradición, sentimiento y aborda finales agresivos.', votes: 42350, img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=300&q=80' },
              { id: 'r2', name: 'Sergio Luis Rodríguez', desc: 'Acordeón moderno con gran presencia escénica.', votes: 38910, img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80' },
              { id: 'r3', name: 'Javier Matta Correa', desc: 'Elegancia y fuerza en son, paseo y puya.', votes: 31200, img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=300&q=80' }
            ]
          },
          musica: {
            title: 'Mejor Álbum Vallenato del Año',
            subtitle: 'Escoge la producción que más te conmovió.',
            active: true,
            candidates: [
              { id: 'm1', name: 'Pasión Encendida', desc: 'Fusión de ritmo, sabor y energía festivalera.', votes: 58400, img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80' },
              { id: 'm2', name: 'Canto a la Tierra', desc: 'Fuerte arraigo y composición sentimental.', votes: 29100, img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=300&q=80' },
              { id: 'm3', name: 'Herederos del Folclor', desc: 'Perfil joven con mucha creatividad y fuerza.', votes: 21800, img: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=300&q=80' }
            ]
          },
          comparsas: {
            title: 'Mejor Grupo de Piloneras',
            subtitle: 'Danza, tradición y alegría de la región.',
            active: true,
            candidates: [
              { id: 'c1', name: 'Piloneras del Cañaguate', desc: 'Color, tradición y baile auténtico.', votes: 14200, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80' },
              { id: 'c2', name: 'Pilones de Valledupar', desc: 'Vibración regional con gran presencia.', votes: 11900, img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=300&q=80' }
            ]
          },
          reconocimiento: {
            title: 'Reconocimiento Especial del Público',
            subtitle: 'Tributo a la leyenda vallenata.',
            active: true,
            candidates: [
              { id: 'r0', name: 'Homenaje a los Compositores', desc: 'Memoria y poesía de la música vallenata.', votes: 24500, img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80' },
              { id: 'r9', name: 'Escuelas de Niños Acordeoneros', desc: 'Semilla y futuro del folclor.', votes: 19800, img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=300&q=80' }
            ]
          }
        }
      };

      let appData = JSON.parse(localStorage.getItem('vertical_vote_data')) || JSON.parse(JSON.stringify(DEFAULT_DATA));
      let currentUser = JSON.parse(localStorage.getItem('vertical_user')) || { name: '', doc: '', votes: {} };
      let activeTab = 'reyes';
      let selectedCandidate = null;
      let screenHistory = ['screen-voter'];

      const screens = {
        'screen-voter': document.getElementById('screen-voter'),
        'screen-results': document.getElementById('screen-results'),
        'screen-certificate': document.getElementById('screen-certificate'),
        'screen-admin': document.getElementById('screen-admin')
      };

      function saveState() {
        localStorage.setItem('vertical_vote_data', JSON.stringify(appData));
        localStorage.setItem('vertical_user', JSON.stringify(currentUser));
      }

      function showToast(msg, type = 'success') {
        const toast = document.getElementById('toast');
        const icon = document.getElementById('toastIcon');
        const text = document.getElementById('toastText');
        text.textContent = msg;
        if (type === 'success') {
          icon.className = 'fa-solid fa-circle-check text-emerald-400';
        } else if (type === 'error') {
          icon.className = 'fa-solid fa-circle-xmark text-red-400';
        } else {
          icon.className = 'fa-solid fa-circle-info text-amber-400';
        }
        toast.classList.add('show');
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
      }

      function renderCandidates() {
        const cat = appData.categories[activeTab];
        const container = document.getElementById('candidates');
        document.getElementById('categoryTitle').textContent = cat.title;
        document.getElementById('categorySubtitle').textContent = cat.subtitle;
        const hasVote = currentUser.votes && currentUser.votes[activeTab];
        document.getElementById('voteBadge').classList.toggle('hidden', !hasVote);

        if (!cat.active) {
          container.innerHTML = `
            <div class="rounded-2xl border border-red-500/30 bg-red-950/40 p-5 text-center">
              <i class="fa-solid fa-lock text-2xl text-brand-400"></i>
              <div class="mt-2 font-bold text-sm text-slate-100">Votación pausada</div>
              <div class="mt-1 text-[11px] text-slate-400">La categoría está temporalmente inactiva.</div>
            </div>
          `;
          return;
        }

        container.innerHTML = cat.candidates.map((candidate) => {
          const isSelected = hasVote && hasVote.candidateId === candidate.id;
          return `
            <div class="candidate-card rounded-2xl p-3 flex gap-3 ${isSelected ? 'ring-1 ring-amber-400/50 border-amber-400/40' : ''}">
              <div class="w-20 h-20 rounded-xl overflow-hidden border border-red-500/25 shrink-0">
                <img src="${candidate.img}" class="w-full h-full object-cover" alt="${candidate.name}" onerror="this.src='https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=300&q=80'" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-sm text-slate-100 leading-tight">${candidate.name}</div>
                <div class="mt-1 text-[10px] text-slate-400 line-clamp-2">${candidate.desc}</div>
                <div class="mt-3 flex items-center justify-between gap-2">
                  <div class="text-[10px] text-amber-300 font-semibold">${candidate.votes.toLocaleString('es-CO')} votos</div>
                  ${isSelected ? `
                    <span class="rounded-xl border border-amber-500/30 bg-amber-500/10 text-[10px] font-bold text-amber-300 px-2 py-1">
                      <i class="fa-solid fa-check mr-1"></i>Tu voto
                    </span>
                  ` : `
                    <button class="vote-btn rounded-xl bg-gradient-to-r from-brand-700 to-red-600 px-3 py-1.5 text-[10px] font-bold text-white button-glow" data-id="${candidate.id}" data-name="${candidate.name}">
                      Votar
                    </button>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('');

        document.querySelectorAll('.vote-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            if (!currentUser.doc) {
              openAuth();
              return;
            }
            if (currentUser.votes[activeTab]) {
              showToast('Ya votaste en esta categoría', 'error');
              return;
            }
            selectedCandidate = {
              id: btn.dataset.id,
              name: btn.dataset.name
            };
            document.getElementById('voteTarget').textContent = btn.dataset.name;
            document.getElementById('modal-vote').classList.remove('hidden');
          });
        });
      }

      function openAuth() {
        document.getElementById('modal-auth').classList.remove('hidden');
      }

      function closeAuth() {
        document.getElementById('modal-auth').classList.add('hidden');
      }

      function closeVoteModal() {
        document.getElementById('modal-vote').classList.add('hidden');
        selectedCandidate = null;
      }

      function handleUserSave() {
        const name = document.getElementById('authName').value.trim();
        const doc = document.getElementById('authDoc').value.trim();
        if (!name || !doc) {
          showToast('Completa nombre y documento', 'error');
          return;
        }
        currentUser = { name, doc, votes: currentUser.votes || {} };
        saveState();
        updateUserLabel();
        closeAuth();
        showToast('Votante habilitado', 'success');
      }

      function updateUserLabel() {
        const label = document.getElementById('userLabel');
        if (currentUser.name) {
          label.textContent = currentUser.name.split(' ')[0];
        } else {
          label.textContent = 'Invitado';
        }
      }

      function renderTabs() {
        document.querySelectorAll('.tab').forEach((tab) => {
          const isActive = tab.dataset.tab === activeTab;
          tab.className = isActive
            ? 'tab-pill tab active px-3 py-2 rounded-full bg-brand-700 text-amber-300 font-bold text-[11px]'
            : 'tab-pill tab px-3 py-2 rounded-full bg-slate-950 border border-slate-700 text-slate-300 font-medium text-[11px]';
        });
      }

      function switchTab(tabName) {
        activeTab = tabName;
        renderTabs();
        renderCandidates();
      }

      function confirmVote() {
        if (!selectedCandidate) return;
        const cat = appData.categories[activeTab];
        const candidate = cat.candidates.find((c) => c.id === selectedCandidate.id);
        if (!candidate) return;

        candidate.votes += 1;
        currentUser.votes[activeTab] = {
          candidateId: candidate.id,
          candidateName: candidate.name,
          category: cat.title,
          timestamp: new Date().toLocaleString('es-CO'),
          hash: 'FV2027-' + Math.random().toString(36).slice(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4)
        };
        saveState();
        closeVoteModal();
        renderCandidates();
        renderCertificate();
        document.getElementById('certificateDot').classList.remove('hidden');
        showToast('¡Voto emitido con éxito!', 'success');
      }

      function renderResults() {
        const category = document.getElementById('resultsCategory').value;
        const cat = appData.categories[category];
        const list = document.getElementById('resultsList');
        const total = cat.candidates.reduce((sum, item) => sum + item.votes, 0) || 1;
        const sorted = [...cat.candidates].sort((a, b) => b.votes - a.votes);
        document.getElementById('totalVotes').textContent = Object.values(appData.categories).reduce((sum, c) => sum + c.candidates.reduce((s, i) => s + i.votes, 0), 0).toLocaleString('es-CO');

        list.innerHTML = sorted.map((candidate, index) => {
          const percent = ((candidate.votes / total) * 100).toFixed(1);
          return `
            <div class="rounded-2xl bg-slate-900 border border-slate-800 p-3">
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded-full bg-brand-700 text-[10px] font-black text-amber-300 flex items-center justify-center">${index + 1}</div>
                  <div class="text-xs font-bold text-slate-100">${candidate.name}</div>
                </div>
                <div class="text-[10px] font-black text-amber-300">${percent}%</div>
              </div>
              <div class="h-2.5 rounded-full bg-slate-950 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-brand-700 to-amber-400" style="width:${percent}%"></div>
              </div>
              <div class="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>${candidate.votes.toLocaleString('es-CO')} votos</span>
                <span>${cat.title}</span>
              </div>
            </div>
          `;
        }).join('');
      }

      function renderCertificate() {
        const area = document.getElementById('certificateArea');
        const votes = Object.keys(currentUser.votes || {}).length;
        if (!votes) {
          area.innerHTML = `
            <div class="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-5 text-center">
              <div class="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400 text-xl">
                <i class="fa-solid fa-file-circle-xmark"></i>
              </div>
              <div class="mt-3 text-sm font-bold text-slate-100">Aún no has emitido votos</div>
              <div class="mt-1 text-[11px] text-slate-400">Tu comprobante aparecerá aquí después de participar en la votación.</div>
              <button class="mt-4 w-full rounded-xl bg-brand-700 text-amber-300 font-bold py-2 text-xs" data-target="screen-voter">Ir a votar</button>
            </div>
          `;
          area.querySelector('[data-target]')?.addEventListener('click', () => switchScreen('screen-voter'));
          return;
        }

        const items = Object.entries(currentUser.votes).map(([key, item]) => `
          <div class="rounded-xl border border-red-500/20 bg-slate-950 p-2.5 mb-2">
            <div class="text-[10px] uppercase tracking-wider text-amber-300 font-bold">${item.category}</div>
            <div class="mt-1 text-sm font-bold text-slate-100">${item.candidateName}</div>
            <div class="mt-1 text-[10px] text-slate-400">${item.hash}</div>
          </div>
        `).join('');

        area.innerHTML = `
          <div class="rounded-2xl border border-amber-500/30 bg-slate-950 p-4">
            <div class="text-[10px] text-slate-400">Votante</div>
            <div class="mt-1 text-sm font-bold text-slate-100">${currentUser.name}</div>
            <div class="mt-1 text-[10px] text-slate-400">ID: ***${String(currentUser.doc).slice(-4)}</div>
            <div class="mt-4 space-y-2">${items}</div>
            <div class="mt-4 bg-white p-3 rounded-2xl mx-auto w-28 h-28 flex items-center justify-center text-slate-950 text-5xl">
              <i class="fa-solid fa-qrcode"></i>
            </div>
            <button class="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black py-2 text-xs">Guardar comprobante</button>
          </div>
        `;
      }

      function renderAdminControls() {
        const container = document.getElementById('adminCategoryControls');
        container.innerHTML = Object.entries(appData.categories).map(([key, cat]) => `
          <div class="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 px-2.5 py-2">
            <div class="text-[11px] text-slate-200">${cat.title}</div>
            <button class="toggle-cat rounded-lg px-2 py-1 text-[10px] font-bold ${cat.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}" data-cat="${key}">
              ${cat.active ? 'ACTIVA' : 'PAUSADA'}
            </button>
          </div>
        `).join('');

        document.querySelectorAll('.toggle-cat').forEach((btn) => {
          btn.addEventListener('click', () => {
            const key = btn.dataset.cat;
            appData.categories[key].active = !appData.categories[key].active;
            saveState();
            renderAdminControls();
            renderCandidates();
            showToast('Categoria actualizada', 'info');
          });
        });
      }

      function switchScreen(target) {
        Object.entries(screens).forEach(([key, screen]) => {
          screen.classList.toggle('hidden-screen', key !== target);
        });

        const navs = document.querySelectorAll('.nav-btn');
        navs.forEach((nav) => {
          const active = nav.dataset.target === target;
          nav.classList.toggle('active', active);
          nav.classList.toggle('text-amber-300', active);
          nav.classList.toggle('text-slate-400', !active);
          nav.classList.toggle('font-semibold', active);
          nav.classList.toggle('font-medium', !active);
        });

        if (target === 'screen-voter') {
          screenHistory.push(target);
        }
        updateBackButton();
      }

      function updateBackButton() {
        const backBtn = document.getElementById('backBtn');
        const valid = screenHistory.length > 1 && screenHistory[screenHistory.length - 1] !== 'screen-voter';
        backBtn.classList.toggle('hidden', !valid);
      }

      function goBack() {
        if (screenHistory.length > 1) {
          screenHistory.pop();
          const previous = screenHistory[screenHistory.length - 1] || 'screen-voter';
          switchScreen(previous);
        }
      }

      document.querySelectorAll('.tab').forEach((tab) => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
      });

      document.getElementById('roleToggle').addEventListener('click', () => {
        const adminScreen = document.getElementById('screen-admin');
        const voterScreen = document.getElementById('screen-voter');
        const isAdminVisible = !adminScreen.classList.contains('hidden-screen');
        if (isAdminVisible) {
          switchScreen('screen-voter');
          document.getElementById('roleToggle').textContent = 'Panel Admin';
        } else {
          switchScreen('screen-admin');
          document.getElementById('roleToggle').textContent = 'Volver';
        }
      });

      document.getElementById('regBtn').addEventListener('click', openAuth);
      document.getElementById('closeAuth').addEventListener('click', closeAuth);
      document.getElementById('saveUserBtn').addEventListener('click', handleUserSave);
      document.getElementById('cancelVoteBtn').addEventListener('click', closeVoteModal);
      document.getElementById('confirmVoteBtn').addEventListener('click', confirmVote);
      document.getElementById('refreshBtn').addEventListener('click', renderResults);
      document.getElementById('resultsCategory').addEventListener('change', renderResults);
      document.getElementById('exitAdmin').addEventListener('click', () => {
        switchScreen('screen-voter');
        document.getElementById('roleToggle').textContent = 'Panel Admin';
      });
      document.getElementById('addCandidateBtn').addEventListener('click', () => {
        const name = document.getElementById('newName').value.trim();
        const desc = document.getElementById('newDesc').value.trim();
        const cat = document.getElementById('newCategory').value;
        if (!name || !desc) {
          showToast('Completa nombre y descripción', 'error');
          return;
        }
        appData.categories[cat].candidates.push({
          id: 'custom_' + Date.now(),
          name,
          desc,
          votes: 0,
          img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=300&q=80'
        });
        saveState();
        renderCandidates();
        renderResults();
        renderAdminControls();
        document.getElementById('newName').value = '';
        document.getElementById('newDesc').value = '';
        showToast('Cantante agregado', 'success');
      });
      document.getElementById('resetDataBtn').addEventListener('click', () => {
        localStorage.removeItem('vertical_vote_data');
        localStorage.removeItem('vertical_user');
        appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        currentUser = { name: '', doc: '', votes: {} };
        saveState();
        updateUserLabel();
        renderCandidates();
        renderResults();
        renderCertificate();
        renderAdminControls();
        showToast('Datos de prueba reiniciados', 'info');
      });

      document.getElementById('backBtn').addEventListener('click', goBack);

      document.querySelectorAll('.nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => switchScreen(btn.dataset.target));
      });

      updateUserLabel();
      renderTabs();
      renderCandidates();
      renderResults();
      renderCertificate();
      renderAdminControls();
    </script>
  </body>
</html>
