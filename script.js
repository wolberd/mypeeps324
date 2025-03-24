// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDaTkbW0WWe4L9e-01g4HPlpk6Neh2s8P0",
    authDomain: "peopleapp-5143a.firebaseapp.com",
    projectId: "peopleapp-5143a",
    storageBucket: "peopleapp-5143a.firebasestorage.app",
    messagingSenderId: "49774629896",
    appId: "1:49774629896:web:ee3e89dba171cabc282dbd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const addPersonBtn = document.getElementById('addPersonBtn');
const modal = document.getElementById('addPersonModal');
const closeBtn = document.querySelector('.close');
const addPersonForm = document.getElementById('addPersonForm');
const personsList = document.getElementById('personsList');

// Collection reference
const personsCollection = window.collection(window.db, 'persons');

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

async function addPerson(e) {
    e.preventDefault();

    const person = {
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        notes: document.getElementById('notes').value,
        dateAdded: new Date().toLocaleDateString()
    };

    try {
        console.log('Attempting to add person:', person);
        const docRef = await window.addDoc(personsCollection, person);
        console.log('Person added with ID:', docRef.id);
        await displayPersons();
        closeModal();
    } catch (error) {
        console.error("Error adding person:", error);
        console.error("Error details:", {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        alert(`Error adding person: ${error.message}`);
    }
}

async function displayPersons() {
    personsList.innerHTML = '';
    
    try {
        console.log('Attempting to fetch persons...');
        const snapshot = await window.getDocs(personsCollection);
        console.log('Fetched persons:', snapshot.size);
        
        if (snapshot.empty) {
            personsList.innerHTML = '<p>No persons added yet.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const person = doc.data();
            console.log('Person data:', { id: doc.id, ...person });
            const personCard = document.createElement('div');
            personCard.className = 'person-card';
            personCard.innerHTML = `
                <h3>${person.name}</h3>
                ${person.role ? `<p><strong>Role:</strong> ${person.role}</p>` : ''}
                ${person.notes ? `<p><strong>Notes:</strong> ${person.notes}</p>` : ''}
                <p><small>Added on: ${person.dateAdded}</small></p>
                <button onclick="deletePerson('${doc.id}')" class="delete-btn">Delete</button>
            `;
            personsList.appendChild(personCard);
        });
    } catch (error) {
        console.error("Error getting persons:", error);
        console.error("Error details:", {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        personsList.innerHTML = `<p>Error loading persons: ${error.message}</p>`;
    }
}

// Make deletePerson available globally for the onclick handler
window.deletePerson = async function(id) {
    if (confirm('Are you sure you want to delete this person?')) {
        try {
            console.log('Attempting to delete person:', id);
            await window.deleteDoc(window.doc(window.db, 'persons', id));
            console.log('Person deleted successfully');
            await displayPersons();
        } catch (error) {
            console.error("Error deleting person:", error);
            console.error("Error details:", {
                code: error.code,
                message: error.message,
                stack: error.stack
            });
            alert(`Error deleting person: ${error.message}`);
        }
    }
}

// Initial display of persons
console.log('Initializing app...');
displayPersons(); 