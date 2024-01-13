var fileUploadButton = document.getElementById('file_upload_button')
var heading = document.getElementById('heading')
var listContainer = document.getElementById('list_container')
var button = document.createElement('button')
var input = document.createElement('input')
var save_game = document.getElementById('save_game')
var load_games = document.getElementById('load_games')
input.type = 'file';


// function createFileEntry(fileList) {
//     for (const child of listContainer.children) {
//         if (child.className == 'list_entry') {
//             child.remove()
//         }
//     }

//     for (const file of fileList) {
//         let listEntry = document.createElement('div')
//         listEntry.className = 'list_entry'
//         listEntry.appendChild(Object.assign(document.createElement('p'), {innerHTML: file.name}))
//         listEntry.appendChild(Object.assign(document.createElement('p'), {innerHTML: file.size + "B"}))
//         listEntry.appendChild(Object.assign(document.createElement('p'), {innerHTML: file.lastModified.toUTCString()}))
//         listContainer.appendChild(listEntry)
//     }

// }++


save_game.addEventListener('click', () => {
    console.log('save click');
    let gameName = '3111111';
    window.electronAPI.saveGame(gameName);
})



window.electronAPI.updategameList((event, gameList) => {
    //console.log(gameList);
    // Cleans listContainer of list entries
    /*for (const child of Array.from(listContainer.children)) {
        if (child.className == 'list_entry') {
            child.remove()
        }
    }*/


    // Creates listEntry div with details and buttons

    //console.log(gameList);

    for (const child of Array.from(listContainer.children)) {
        if (child.className == 'list_entry') {
            child.remove()
        }
    }

    var result = [];

    for (var i in gameList) {
        result.push([i, gameList[i]]);
    }
    //console.log(result);



    for (const games of result) {
        game = games[1][0];
        //console.log(game);
        let listEntry = document.createElement('div')
        listEntry.className = 'list_entry'
        // listEntry.id = 
        listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: game['name'] }))
        listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: game['path'] }))
        listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: "31.12.2024" }))
        listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: "10.12.2024" }))
        listEntry.appendChild(Object.assign(document.createElement('button'), { innerHTML: 'Upload to Cloud' }))
        listEntry.appendChild(Object.assign(document.createElement('button'), { innerHTML: 'Download to Local' }))
        listEntry.appendChild(Object.assign(document.createElement('button'), { innerHTML: 'Delete Game' }))
        listContainer.appendChild(listEntry)
    }
})



heading.addEventListener('click', () => {
    console.log('heading click2')
})

// When file selected using upload button, send to main for adding to list
fileUploadButton.onchange = e => {
    uploadedFile = e.target.files[0]
    // console.log(uploadedFile)
    window.electronAPI.addFile(uploadedFile.path)
}

// Upon updateList call, cleans list and for each file creates an entry with associated details
window.electronAPI.updateList((event, fileList) => {
    // Cleans listContainer of list entries
    for (const child of Array.from(listContainer.children)) {
        if (child.className == 'list_entry') {
            child.remove()
        }
    }

    // Creates listEntry div with details and buttons
    for (const file of fileList) {
        let listEntry = document.createElement('div')
        listEntry.className = 'list_entry'
        // listEntry.id = 
        listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: file.name }))
        listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: file.size + "B" }))
        listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: file.lastModified.toUTCString() }))
        listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: 'NaN' }))
        listEntry.appendChild(Object.assign(document.createElement('button'), { innerHTML: 'Upload' }))
        listEntry.appendChild(Object.assign(document.createElement('button'), { innerHTML: 'Download' }))
        listEntry.appendChild(Object.assign(document.createElement('button'), { innerHTML: 'Delete' }))
        listContainer.appendChild(listEntry)
    }
})