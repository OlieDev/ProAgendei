// Configuração do Firebase com seu URL de banco de dados
const firebaseConfig = {
    apiKey: "SUA_API_KEY", // Substitua pela sua API Key do Firebase
    authDomain: "proagendei.firebaseapp.com", // Substitua pelo seu authDomain
    databaseURL: "https://proagendei-default-rtdb.firebaseio.com/", // Este é o seu databaseURL
    projectId: "proagendei", // Substitua pelo seu projectId
    storageBucket: "proagendei.appspot.com", // Substitua pelo seu storageBucket
    messagingSenderId: "SEU_MESSAGING_SENDER_ID", // Substitua pelo seu Messaging Sender ID
    appId: "SEU_APP_ID" // Substitua pelo seu App ID
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();


// Função para salvar agendamento no Firebase
function saveAppointment(appointment) {
    const ref = database.ref('appointments');
    ref.push(appointment);
}

// Função para carregar agendamentos do Firebase
function loadAppointments() {
    const ref = database.ref('appointments');
    ref.on('value', (snapshot) => {
        const appointments = snapshot.val();
        displayAppointments(appointments);
    });
}

// Função para exibir agendamentos na lista
function displayAppointments(appointments) {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = ''; // Limpa a lista existente

    for (const key in appointments) {
        const app = appointments[key];
        const listItem = document.createElement('li');
        listItem.textContent = `Agendamento - ${app.name} - ${app.service} - ${app.date} - ${app.time}`;

        // Botão de Editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editAppointment(key, app);
        listItem.appendChild(editButton);

        // Botão de Excluir
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteAppointment(key);
        listItem.appendChild(deleteButton);

        appointmentList.appendChild(listItem);
    }
}

// Função para editar agendamento
function editAppointment(key, appointment) {
    document.getElementById('student-name').value = appointment.name;
    document.getElementById('service').value = appointment.service;
    document.getElementById('date').value = appointment.date;
    document.getElementById('time').value = appointment.time;

    // Excluir o agendamento antigo para que ele seja atualizado ao salvar
    deleteAppointment(key);
}

// Função para excluir agendamento
function deleteAppointment(key) {
    const ref = database.ref('appointments/' + key);
    ref.remove();
}

// Chama a função de carregar agendamentos ao carregar a página
document.addEventListener('DOMContentLoaded', loadAppointments);

// Evento de envio do formulário para criar novo agendamento
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('student-name').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const appointment = {
        name,
        service,
        date,
        time
    };

    saveAppointment(appointment);
    document.getElementById('appointment-form').reset();
});
