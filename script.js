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

    // Obter agendamentos do Local Storage
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    displayAppointments();

    document.getElementById('appointment-form').reset();
});

// Função para exibir agendamentos
function displayAppointments() {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = ''; // Limpar lista existente

    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.forEach((app, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Agendamento - ${app.name} - ${app.service} - ${app.date} - ${app.time}`;

        // Botão de Editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editAppointment(index);
        listItem.appendChild(editButton);

        // Botão de Excluir
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteAppointment(index);
        listItem.appendChild(deleteButton);

        appointmentList.appendChild(listItem);
    });
}

// Função para editar agendamento
function editAppointment(index) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments[index];

    // Preencher o formulário com os dados do agendamento
    document.getElementById('student-name').value = appointment.name;
    document.getElementById('service').value = appointment.service;
    document.getElementById('date').value = appointment.date;
    document.getElementById('time').value = appointment.time;

    // Remover o agendamento antigo antes de adicionar o novo
    deleteAppointment(index);
}

// Função para excluir agendamento
function deleteAppointment(index) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.splice(index, 1); // Remove o agendamento pelo índice
    localStorage.setItem('appointments', JSON.stringify(appointments));
    displayAppointments(); // Atualiza a lista
}

// Chamar a função para exibir agendamentos ao carregar a página
document.addEventListener('DOMContentLoaded', displayAppointments);
