const entryList = document.querySelector('#entry-list');
const form = document.querySelector('#add-entry-form');

// create element & render journal
function renderEntry(doc){
    let li = document.createElement('li');
    let author = document.createElement('span');
    let entry = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    author.textContent = doc.data().author;
    entry.textContent = doc.data().entry;
    cross.textContent = 'x';

    li.appendChild(author);
    li.appendChild(entry);
    li.appendChild(cross);

    entryList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('entries').doc(id).delete();
    });
}

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('entries').add({
        author: form.author.value,
        entry: form.entry.value,
        created_at: new Date()
    });
    form.author.value = '';
    form.entry.value = '';
});

// real-time listener
db.collection('entries').orderBy('created_at').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderEntry(change.doc);
        } else if (change.type == 'removed'){
            let li = entryList.querySelector('[data-id=' + change.doc.id + ']');
            entryList.removeChild(li);
        }
    });
});