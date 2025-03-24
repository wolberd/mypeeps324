// DOM Elements
const addPersonBtn = document.getElementById('addPersonBtn');
const modal = document.getElementById('addPersonModal');
const closeBtn = document.querySelector('.close');
const addPersonForm = document.getElementById('addPersonForm');
const personsList = document.getElementById('personsList');

// Get persons from localStorage or initialize empty array
let persons = JSON.parse(localStorage.getItem('persons')) || [];

// Event Listeners
addPersonBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
addPersonForm.addEventListener('submit', addPerson);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Functions
function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    addPersonForm.reset();
}

function addPerson(e) {
    e.preventDefault();

    const person = {
        id: Date.now(),
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        notes: document.getElementById('notes').value,
        dateAdded: new Date().toLocaleDateString()
    };

    persons.push(person);
    savePersons();
    displayPersons();
    closeModal();
}

function savePersons() {
    localStorage.setItem('persons', JSON.stringify(persons));
}

function displayPersons() {
    personsList.innerHTML = '';
    
    persons.forEach(person => {
        const personCard = document.createElement('div');
        personCard.className = 'person-card';
        personCard.innerHTML = `
            <h3>${person.name}</h3>
            ${person.role ? `<p><strong>Role:</strong> ${person.role}</p>` : ''}
            ${person.notes ? `<p><strong>Notes:</strong> ${person.notes}</p>` : ''}
            <p><small>Added on: ${person.dateAdded}</small></p>
            <button onclick="deletePerson(${person.id})" class="delete-btn">Delete</button>
        `;
        personsList.appendChild(personCard);
    });
}

function deletePerson(id) {
    if (confirm('Are you sure you want to delete this person?')) {
        persons = persons.filter(person => person.id !== id);
        savePersons();
        displayPersons();
    }
}

// Initial display of persons
displayPersons(); 