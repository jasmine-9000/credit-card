let logo;
window.onload = () => {
    console.log("Hello world")
    const expirationSelectElement = document.querySelector("[data-expiration-year]")
    const currentYear = new Date().getFullYear();
    for(let i = currentYear; i < currentYear + 10; i++) {
        // input new year into option
        const option = document.createElement("option");
        option.value = i;
        option.innerText = i;
        expirationSelectElement.append(option)
    }
    logo = document.querySelector("[data-logo]")
    document.addEventListener("keydown", keydownHandler)
    document.addEventListener("paste", pasteHandler);
}

// handle people pasting in card numbers
function pasteHandler(e) {
    const input = e.target;
    const data = e.clipboardData.getData("text");
    if(!isConnectedInput(input)) return;
    if(!data.match(/^[0-9]+$/)) return e.preventDefault()

    console.log("Hello!");
    console.log(data)
    e.preventDefault()
    onInputChange(input, data)
}


function keydownHandler(e) {
    const input = e.target;
    const key = e.key;
    if(!isConnectedInput(input)) return;
    switch(key) {
        case "ArrowLeft": {
            /* selection must be at the start, then move current focus to next one. */
            if(input.selectionStart === 0 && input.selectionEnd === 0) {
                const prev = input.previousElementSibling;
                prev.focus()
                prev.selectionStart = prev.value.length - 1;
                prev.selectionEnd = prev.value.length - 1;
                e.preventDefault()
            }
            break;
        }
        case "ArrowRight": {
            /* selection must be at the end, then move it to the next one.. */
            if(input.selectionStart === input.value.length - 1 && input.selectionEnd === input.value.length - 1) {
                const next = input.nextElementSibling;
                next.focus()
                next.selectionStart = 0;
                next.selectionEnd = 0;
                e.preventDefault()
            }
            break;
        }
        case "Delete": {
            /* selection must be at the end, then move it to the next one.. */
            if(input.selectionStart === input.value.length - 1 && input.selectionEnd === input.value.length - 1) {
                const next = input.nextElementSibling;
                next.value = next.value.substring(1, next.value.length);
                next.selectionStart = 0;
                next.selectionEnd = 0;
                e.preventDefault()
            }
            break;
        }
        case "Backspace": {
            /* selection must be at the start, then move current focus to next one. */
            if(input.selectionStart === 0 && input.selectionEnd === 0) {
                const prev = input.previousElementSibling;
                prev.value = prev.value.substring(0, prev.value.length - 1)
                prev.focus()
                prev.selectionStart = prev.value.length;
                prev.selectionEnd = prev.value.length;
                e.preventDefault()
            }
            break;
        }
        default: {
            console.log(e)
            if(e.ctrlKey || e.altKey) return;
            if(key.length > 1) return;
            if(key.match(/^[^0-9]$/)) {
                return e.preventDefault(); // only handle stuff
            } 
            if(key.match(/^[^0-9]+$/)) {
                return e.preventDefault(); // only handle stuff
            } 
            
            e.preventDefault()
            onInputChange(input, key);
            return;
        }
    }
}
const examplevalue = 12345678;
function onInputChange(input, newValue) {
    const start = input.selectionStart
    const end = input.selectionEnd
    updateInputValue(input, newValue, start, end);
    focusInput(input, newValue.length + start)
    const firstFour = input.closest("[data-connected-inputs]").querySelector("input").value; // select parent.
    if(firstFour.startsWith("4")) {
        logo.src = "visa.svg"
    } else if (firstFour.startsWith("5")) {
        logo.src = "mastercard.svg"
    } else if (firstFour.startsWith("34") || firstFour.startsWith("37")) {
        logo.src = "americanexpress.svg";
    }
}

function updateInputValue(input, extraValue, start=0,end=0){
    const newValue = `${input.value.substring(0, start)}${extraValue}${input.value.substring(end, 4)}`;
    console.log(newValue);
    input.value = newValue.substring(0, 4); // ensure each cell is only 4 characters long
    if(newValue > 4) {
        const next = input.nextElementSibling // go to next cell
        if(next === null) return;
        updateInputValue(next, newValue.substring(4) ) // input next 4 inputs into next cell. start and end are already 0. 
    }
}
function focusInput(input, dataLength) {
    let addedChars = dataLength;
    let currentInput = input;
    while(addedChars > 4 && currentInput.nextElementSibling != null) {
        addedChars -= 4;
        currentInput = currentInput.nextElementSibling
    }
    if(addedChars > 4) {
        addedChars = 4;
    }
    currentInput.selectionStart = addedChars;
    currentInput.selectionEnd = addedChars;

}

// ensure the left and right arrow is actually connected (data-connected-inputs is enabled in HTML)
function isConnectedInput(input) {
    const parent = input.closest("[data-connected-inputs]") // find the closest parent
    return input.matches("input") && parent != null;

}


