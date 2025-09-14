document.addEventListener("DOMContentLoaded", function () {
    // Get all necessary elements
    const generateBtn = document.getElementById('generateBtn');
    const saveBtn = document.getElementById('saveBtn');
    const taskType = document.getElementById('taskType');
    const tone = document.getElementById('tone');
    const topic = document.getElementById('topic');
    const output = document.getElementById('output');
    const savedPromptsList = document.getElementById('savedPrompts');
    const loadingIndicator = document.getElementById("loadingIndicator");

    // Function to render saved prompts
    function renderSavedPrompts() {
        savedPromptsList.innerHTML = '';
        const saved = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
        saved.forEach((prompt, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.padding = '8px';
            li.style.borderBottom = '1px solid #ccc';

            const span = document.createElement('span');
            span.textContent = prompt;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '✕';
            removeBtn.style.marginLeft = '10px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.addEventListener('click', () => {
                const savedArray = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
                savedArray.splice(index, 1);
                localStorage.setItem('savedPrompts', JSON.stringify(savedArray));
                renderSavedPrompts();
            });

            li.appendChild(span);
            li.appendChild(removeBtn);
            savedPromptsList.appendChild(li);
        });
    }

    // Load saved prompts on page load
    renderSavedPrompts();

    // Generate Button Listener - calls local Node.js server
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const task = taskType.value.trim();
            const selectedTone = tone.value.trim();
            const topicText = topic.value.trim();

            if (!task || !selectedTone || !topicText) {
                output.value = '⚠️ Please select a task type, tone, and enter a topic.';
                return;
            }

            loadingIndicator.style.display = "block";
            generateBtn.disabled = true;
            output.value = "";

            try {
                const response = await fetch("http://localhost:3000/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        task: task,
                        tone: selectedTone,
                        topic: topicText
                    })
                });

                const data = await response.json();
                console.log(data); // Log the API response for debugging
                if (data && data.prompt) {
                    output.value = data.prompt;
                } else {
                    output.value = "Failed to generate prompt. Try again.";
                }
            } catch (error) {
                console.error(error);
                alert("Error generating prompt. Check console for details.");
            } finally {
                loadingIndicator.style.display = "none";
                generateBtn.disabled = false;
            }
        });
    }

    // Save Prompt Button Listener - only saves when clicked
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (output.value.trim()) {
                const saved = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
                saved.unshift(output.value.trim());
                localStorage.setItem('savedPrompts', JSON.stringify(saved));
                renderSavedPrompts();
            }
        });
    } else {
        console.error("Save button not found!");
    }
});
