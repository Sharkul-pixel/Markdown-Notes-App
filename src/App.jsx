import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem('myNotesKey')) || [])  // --> Avoids undefined errors
    console.log(notes)
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    // console.log(`these are the each note id: ${currentNoteId}`)
    // React.useEffect(() => {
    //     console.log('These are the notes:');
    //     notes.map(note => {              --> can use map or forEach
    //         console.log(note);
    //     });
    // }, [notes]);

    React.useEffect(() => {
        const jsonString = JSON.stringify(notes);
     // Save the JSON string to localStorage under a specific key
        localStorage.setItem('myNotesKey', jsonString);
       // const retrieveNames = JSON.parse(localStorage.getItem('myNotesKey'));
       // console.log("These are retrieved names:" + retrieveNames)
        //setNotes(retrieveNames)
    }, [notes]); // Run this effect whenever 'notes' changes
    

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    // function updateNote(text) {
    //    // console.log("this is text:" + text)
    //     setNotes(oldNotes => oldNotes.map(oldNote => {
    //         return oldNote.id === currentNoteId
    //             ? { ...oldNote, body: text }
    //             : oldNote
    //     }))
    // }

    // function updateNote(text) {       --> method 1 of updating edited note to the top
    //     setNotes(oldNotes => {
    //       const updatedNotes = oldNotes.map(oldNote => {
    //         return oldNote.id === currentNoteId
    //           ? { ...oldNote, body: text }
    //           : oldNote;
    //       });
    
    //       // Remove the edited note from the array
    //       const editedNoteIndex = updatedNotes.findIndex(note => note.id === currentNoteId);
    //       //console.log("updated notes " + editedNoteIndex)
    //       const editedNote = updatedNotes.splice(editedNoteIndex, 1)[0];
    //       //console.log("edited note " + editedNote)
    //       // Re-insert the edited note at the beginning of the array
    //       return [editedNote, ...updatedNotes];
    //     });
    // }

    function updateNote(text) {
        setNotes(oldNotes => {
            const newNotesArray = [];
            for(let i = 0; i < oldNotes.length; i++) {
                if(oldNotes[i].id === currentNoteId) {
                    newNotesArray.unshift({...oldNotes[i], body: text})
                }else {
                    newNotesArray.push(oldNotes[i])
                }
            }
            return newNotesArray;
        })
    }
    
     /**
     * Challenge: complete and implement the deleteNote function
     * 
     * Hints: 
     * 1. What array method can be used to return a new
     *    array that has filtered out an item based 
     *    on a condition?
     * 2. Notice the parameters being based to the function
     *    and think about how both of those parameters
     *    can be passed in during the onClick event handler
     */
    
     function deleteNote(event, noteId) {
        event.stopPropagation()
        //console.log("Deleted Note: ", noteId)
        setNotes(notes.filter(note => note.id !== noteId))
        // Your code here
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    onDeleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
