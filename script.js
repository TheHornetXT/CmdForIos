document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('command-input');
    const output = document.querySelector('.output');
    const prompt = document.querySelector('.prompt');
    const welcomeMessage = document.getElementById('welcome-message');

    // Initialize random number between 1 and 99
    let randomNumber = Math.floor(Math.random() * 99) + 1;

    // Initial username and prompt
    let username = `User${randomNumber}`;
    let promptText = `${username}/GPU`;

    // Developer mode username
    let devUsername = ''; // Store developer mode username separately

    // Set the initial prompt text
    updatePrompt(promptText);

    // Flag for developer mode
    let isDevMode = false;
    // Flag for file compilation mode
    let isCompilingFile = false;
    // Content for the file
    let fileContent = '';

    // Last saved file content
    let lastSavedFileContent = '';

    // List of popular URLs
    const popularURLs = [
        'google.com',
        'youtube.com',
        'facebook.com',
        'amazon.com',
        'twitter.com',
        'wikipedia.org',
        'instagram.com',
        'linkedin.com',
        'netflix.com',
        'reddit.com',
    ];

    input.addEventListener('keydown', handleCommands);

    // Ensure input is focused on touch devices
    input.addEventListener('touchstart', () => input.focus());

    function handleCommands(event) {
        const command = input.value.trim();
        if (event.key === 'Enter') {
            if (isCompilingFile) {
                if (command.toLowerCase().includes('done')) {
                    // Save file and exit file compilation mode
                    saveFile();
                    exitFileCompilation();
                } else {
                    // Append command to file content
                    fileContent += `${command}\n`; // Append with newline
                    output.innerHTML += `<div style="color: ${prompt.style.color}">Added to file: ${command}</div>`;
                }
            } else {
                // Process commands in normal mode
                if (command) {
                    if (command === '/reset') {
                        // Clear the output and restore welcome message
                        output.innerHTML = '';
                        output.appendChild(welcomeMessage);
                    } else if (command === `/user${randomNumber}`) {
                        // Display the username message
                        output.innerHTML += `<div style="color: ${prompt.style.color}">Your username is: ${username}</div>`;
                    } else if (command === '/devmode') {
                        // Enter developer mode
                        isDevMode = true;
                        devUsername = `${username}/GPU?dev`;
                        promptText = devUsername;
                        updatePrompt(promptText);
                        output.innerHTML += `<div style="color: ${prompt.style.color}">Developer mode activated. Username changed to: ${devUsername}</div>`;
                    } else if (isDevMode && command === '/CGuser') {
                        // Enter custom username mode
                        output.innerHTML += `<div style="color: ${prompt.style.color}">Enter your desired username:</div>`;
                        input.value = ''; // Clear input for username entry
                        input.removeEventListener('keydown', handleCommands); // Disable normal command handling

                        // Listen for username input
                        input.addEventListener('keydown', function handleUsernameInput(event) {
                            if (event.key === 'Enter') {
                                const newUsername = input.value.trim();
                                if (newUsername) {
                                    devUsername = `User${newUsername}/GPU?dev`;
                                    promptText = devUsername;
                                    updatePrompt(promptText);
                                    output.innerHTML += `<div style="color: ${prompt.style.color}">Username changed to: ${devUsername}</div>`;
                                    // Reset input handling
                                    input.removeEventListener('keydown', handleUsernameInput);
                                    input.addEventListener('keydown', handleCommands);
                                    input.value = ''; // Clear input after processing
                                } else {
                                    output.innerHTML += `<div style="color: ${prompt.style.color}">Please enter a valid username.</div>`;
                                }
                            }
                        });
                    } else if (isDevMode && command === '/devO') {
                        // Exit developer mode
                        isDevMode = false;
                        promptText = `${username}/GPU`;
                        updatePrompt(promptText);
                        output.innerHTML += `<div style="color: ${prompt.style.color}">Developer mode deactivated. Back to normal prompt.</div>`;
                    } else if (isDevMode && command === '/forceFile') {
                        // Create a new file
                        output.innerHTML += `<div style="color: ${prompt.style.color}">New file created.</div>`;
                        isCompilingFile = true;
                        fileContent = ''; // Clear existing file content
                    } else if (isDevMode && command === '/compileFile') {
                        // Start compiling file
                        if (!isCompilingFile) {
                            output.innerHTML += `<div style="color: ${prompt.style.color}">No file created. Use /forceFile to create a new file first.</div>`;
                        } else {
                            output.innerHTML += `<div style="color: ${prompt.style.color}">Enter file content. Type "done" to save and exit.</div>`;
                            input.value = ''; // Clear input for file content
                            input.removeEventListener('keydown', handleCommands); // Disable normal command handling

                            // Listen for file content input
                            input.addEventListener('keydown', function handleFileContentInput(event) {
                                if (event.key === 'Enter') {
                                    const content = input.value.trim();
                                    if (content.toLowerCase() === 'done') {
                                        // Save file and exit file compilation mode
                                        saveFile();
                                        exitFileCompilation();
                                    } else {
                                        // Append to file content
                                        fileContent += `${content}\n`; // Append with newline
                                        output.innerHTML += `<div style="color: ${prompt.style.color}">Added to file: ${content}</div>`;
                                        input.value = ''; // Clear input after processing
                                    }
                                }
                            });
                        }
                    } else if (isDevMode && command === '/downFile') {
                        // Download the last saved file content
                        if (!lastSavedFileContent) {
                            output.innerHTML += `<div style="color: ${prompt.style.color}">No file has been saved yet. Use /forceFile and /compileFile to create and compile a file first.</div>`;
                        } else {
                            downloadFile(lastSavedFileContent, 'compiled_file.txt');
                            output.innerHTML += `<div style="color: ${prompt.style.color}">File downloaded.</div>`;
                        }
                    } else if (command.startsWith('/urlDown')) {
                        // Open URL in a new tab
                        const url = command.substring(9).trim(); // Remove '/urlDown ' from command
                        if (isValidURL(url)) {
                            openURL(url);
                        } else {
                            showURLList();
                        }
                    } else if (command.startsWith('?')) {
                        // Change text color
                        const color = command.substring(1); // Remove '?' from command
                        if (isValidColor(color)) {
                            prompt.style.color = color; // Change prompt color
                            output.innerHTML += `<div style="color: ${prompt.style.color}">Prompt color changed to: ${color}</div>`;
                        } else {
                            output.innerHTML += `<div style="color: ${prompt.style.color}">Invalid color: ${color}. Valid colors are: red, blue, green.</div>`;
                        }
                    } else {
                        // Display the entered command
                        output.innerHTML += `<div style="color: ${prompt.style.color}">${promptText} ${command}</div>`;
                    }
                    input.value = ''; // Clear input after processing
                }
            }
        }
    }

    // Function to update the prompt text
    function updatePrompt(text) {
        prompt.textContent = text;
    }

    // Function to save the file content and exit file compilation mode
    function saveFile() {
        lastSavedFileContent = fileContent;
        output.innerHTML += `<div style="color: ${prompt.style.color}">File saved with content:</div><div>${lastSavedFileContent}</div>`;
    }

    // Function to exit file compilation mode
    function exitFileCompilation() {
        isCompilingFile = false;
        fileContent = '';
        input.addEventListener('keydown', handleCommands); // Restore command handling
    }

    // Function to download a file
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to validate and open a URL
    function isValidURL(url) {
        const popularURLPattern = new RegExp(popularURLs.join('|'), 'i');
        return popularURLPattern.test(url);
    }

    // Function to open a URL in a new tab
    function openURL(url) {
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        window.open(url, '_blank');
        output.innerHTML += `<div style="color: ${prompt.style.color}">Opening ${url}...</div>`;
    }

    // Function to show the list of popular URLs
    function showURLList() {
        output.innerHTML += `<div style="color: ${prompt.style.color}">Invalid URL. Please use one of the popular URLs: ${popularURLs.join(', ')}. This program is still under development.</div>`;
    }

    // Function to validate colors
    function isValidColor(color) {
        const validColors = ['red', 'blue', 'green'];
        return validColors.includes(color.toLowerCase());
    }
});
