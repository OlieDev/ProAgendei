// Importando Firebase e os produtos necessários
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDDdBiq0Ym4ia4ci8oeuVuWgdLGLn9Ka7I",
    authDomain: "proagendei.firebaseapp.com",
    databaseURL: "https://proagendei-default-rtdb.firebaseio.com",
    projectId: "proagendei",
    storageBucket: "proagendei.appspot.com",
    messagingSenderId: "585572746877",
    appId: "1:585572746877:web:f68f5d260531968d649314",
    measurementId: "G-LXM6CJV798"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Formulário e lista de agendamentos
const appointmentForm = document.getElementById('appointment-form');
const appointmentList = document.getElementById('appointment-list');

// Função para renderizar os agendamentos
function renderAppointments(snapshot) {
    appointmentList.innerHTML = ''; // Limpa a lista antes de renderizar novamente
    snapshot.forEach(function (childSnapshot) {
        const appointment = childSnapshot.val();
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${appointment.studentName}</strong> - ${appointment.service} - 
            ${appointment.date} às ${appointment.time}
            <button class="edit" data-id="${childSnapshot.key}">Editar</button>
            <button class="delete" data-id="${childSnapshot.key}">Excluir</button>
        `;
        appointmentList.appendChild(li);
    });
}

// Lê os agendamentos em tempo real
const appointmentsRef = ref(database, 'appointments/');
onValue(appointmentsRef, (snapshot) => {
    if (snapshot.exists()) {
        renderAppointments(snapshot);
    } else {
        appointmentList.innerHTML = '<li>Nenhum agendamento encontrado.</li>';
    }
});

// Adicionar um agendamento
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

    // Limpar o formulário
    appointmentForm.reset();
});

// Editar um agendamento
appointmentList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit')) {
        const id = e.target.getAttribute('data-id');
        const studentName = prompt("Digite o novo nome do aluno:");
        const service = prompt("Digite o novo serviço:");
        const date = prompt("Digite a nova data (YYYY-MM-DD):");
        const time = prompt("Digite o novo horário (HH:MM):");
        
        const appointmentRef = ref(database, 'appointments/' + id);
        update(appointmentRef, { studentName, service, date, time });
    }
});

// Excluir um agendamento
appointmentList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        const id = e.target.getAttribute('data-id');
        const appointmentRef = ref(database, 'appointments/' + id);
        remove(appointmentRef);
    }
});
