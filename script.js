import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDDbBiq0Ym4ia4ci8oeuVuWgdLGLn9Ka7I",
    authDomain: "proagendei.firebaseapp.com",
    databaseURL: "https://proagendei-default-rtdb.firebaseio.com",
    projectId: "proagendei",
    storageBucket: "proagendei.appspot.com",
    messagingSenderId: "585572746877",
    appId: "1:585572746877:web:f68f5d260531968d649314",
    measurementId: "G-LXM6CJV798"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Função para abrir as abas
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Configura os ouvintes de eventos para os botões de aba
document.getElementById("today-tab").addEventListener("click", (event) => openTab(event, 'today'));
document.getElementById("future-tab").addEventListener("click", (event) => openTab(event, 'future'));

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("today").style.display = "block";
    const appointmentForm = document.getElementById('appointment-form');
    const todayAppointmentsList = document.getElementById('today-appointments');
    const futureAppointmentsList = document.getElementById('future-appointments');

    if (!appointmentForm || !todayAppointmentsList || !futureAppointmentsList) {
        console.error("Um ou mais elementos não foram encontrados.");
        return;
    }

    // Função para formatar a data para o padrão brasileiro (dd/mm/yyyy)
    function formatDateToBrazil(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    // Função para obter a data ajustada para o fuso horário brasileiro (UTC-3)
    function getBrazilDate(dateString) {
        const date = new Date(dateString);
        const brazilOffset = -3 * 60; // Offset para UTC-3 em minutos
        const localOffset = date.getTimezoneOffset(); // Offset local
        const offsetDiff = brazilOffset - localOffset; // Diferença entre UTC-3 e horário local
        return new Date(date.getTime() + offsetDiff * 60 * 1000); // Data ajustada para o fuso UTC-3
    }

    function isToday(dateString) {
        const today = getBrazilDate(new Date().toISOString().split('T')[0]); // Data de hoje ajustada para UTC-3
        const appointmentDate = getBrazilDate(dateString);

        return (
            today.getFullYear() === appointmentDate.getFullYear() &&
            today.getMonth() === appointmentDate.getMonth() &&
            today.getDate() === appointmentDate.getDate()
        );
    }

    function isFuture(dateString) {
        const today = getBrazilDate(new Date().toISOString().split('T')[0]);
        const appointmentDate = getBrazilDate(dateString);
        return appointmentDate > today;
    }

    // Função para obter o dia da semana corretamente no fuso horário brasileiro
    function getDayOfWeek(dateString) {
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day); // Cria uma nova data ajustada para o fuso horário do Brasil

        const options = { weekday: 'long' };
        return date.toLocaleDateString('pt-BR', options); // Retorna o dia da semana em português
    }


    function renderAppointments(snapshot) {
        todayAppointmentsList.innerHTML = '';
        futureAppointmentsList.innerHTML = '';

        snapshot.forEach(childSnapshot => {
            const appointment = childSnapshot.val();
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${appointment.studentName}</strong> - ${appointment.service} - 
                ${formatDateToBrazil(appointment.date)} às ${appointment.time} (${getDayOfWeek(appointment.date)})
                <button class="edit" data-id="${childSnapshot.key}">Editar</button>
                <button class="delete" data-id="${childSnapshot.key}">Excluir</button>
            `;

            if (isToday(appointment.date)) {
                todayAppointmentsList.appendChild(li);
            } else if (isFuture(appointment.date)) {
                futureAppointmentsList.appendChild(li);
            }
        });

        if (todayAppointmentsList.children.length === 0) {
            todayAppointmentsList.innerHTML = '<li>Nenhum agendamento para hoje.</li>';
        }
        if (futureAppointmentsList.children.length === 0) {
            futureAppointmentsList.innerHTML = '<li>Nenhum agendamento futuro encontrado.</li>';
        }
    }

    const appointmentsRef = ref(database, 'appointments/');
    onValue(appointmentsRef, snapshot => {
        if (snapshot.exists()) {
            renderAppointments(snapshot);
        } else {
            todayAppointmentsList.innerHTML = '<li>Nenhum agendamento encontrado.</li>';
            futureAppointmentsList.innerHTML = '<li>Nenhum agendamento encontrado.</li>';
        }
    });

    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentName = document.getElementById('student-name').value;
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        const newAppointmentRef = push(appointmentsRef);
        set(newAppointmentRef, {
            studentName,
            service,
            date,
            time
        });

        appointmentForm.reset();
    });

    todayAppointmentsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.getAttribute('data-id');
            const appointmentRef = ref(database, 'appointments/' + id);
            remove(appointmentRef);
        }
    });

    futureAppointmentsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.getAttribute('data-id');
            const appointmentRef = ref(database, 'appointments/' + id);
            remove(appointmentRef);
        }
    });
});
