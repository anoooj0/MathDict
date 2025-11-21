// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
}

// DOM Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const latexInput = document.getElementById('latexInput');
const preview = document.getElementById('preview');
const status = document.getElementById('status');
const notesList = document.getElementById('notesList');
const graphContainer = document.getElementById('graphContainer');

// Math term to LaTeX conversion dictionary
const mathDictionary = {
    // Powers
    'squared': '^{2}',
    'cubed': '^{3}',
    'to the power of': '^{',
    'to the': '^{',
    'power': '}',

    // Roots
    'square root of': '\\sqrt{',
    'square root': '\\sqrt{',
    'cube root of': '\\sqrt[3]{',
    'nth root of': '\\sqrt[n]{',

    // Fractions
    'fraction': '\\frac{',
    'numerator': '',
    'over': '}{',
    'denominator': '',

    // Calculus
    'integral': '\\int',
    'integral from': '\\int_{',
    'to': '}^{',
    'of': '}',
    'derivative': '\\frac{d}{dx}',
    'partial derivative': '\\frac{\\partial}{\\partial x}',
    'limit': '\\lim',
    'sum': '\\sum',
    'product': '\\prod',

    // Greek letters
    'alpha': '\\alpha',
    'beta': '\\beta',
    'gamma': '\\gamma',
    'delta': '\\delta',
    'epsilon': '\\epsilon',
    'theta': '\\theta',
    'lambda': '\\lambda',
    'mu': '\\mu',
    'pi': '\\pi',
    'sigma': '\\sigma',
    'omega': '\\omega',
    'phi': '\\phi',
    'psi': '\\psi',

    // Operators
    'plus': '+',
    'minus': '-',
    'times': '\\times',
    'divided by': '\\div',
    'equals': '=',
    'not equal': '\\neq',
    'less than': '<',
    'greater than': '>',
    'less than or equal': '\\leq',
    'greater than or equal': '\\geq',
    'approximately': '\\approx',
    'infinity': '\\infty',

    // Trigonometry
    'sine': '\\sin',
    'cosine': '\\cos',
    'tangent': '\\tan',
    'cosecant': '\\csc',
    'secant': '\\sec',
    'cotangent': '\\cot',

    // Functions
    'log': '\\log',
    'natural log': '\\ln',
    'exponential': 'e^{',

    // Sets and logic
    'element of': '\\in',
    'not element of': '\\notin',
    'subset': '\\subset',
    'union': '\\cup',
    'intersection': '\\cap',
    'for all': '\\forall',
    'there exists': '\\exists',

    // Symbols
    'therefore': '\\therefore',
    'because': '\\because',
    'implies': '\\implies',
    'if and only if': '\\iff',
};

// Convert spoken math to LaTeX
function convertToLatex(text) {
    let latex = text.toLowerCase();

    // Handle "x over 2" style fractions
    latex = latex.replace(/(\w+)\s+over\s+(\w+)/gi, '\\frac{$1}{$2}');

    // Handle powers like "x to the power of n"
    latex = latex.replace(/(\w+)\s+to\s+the\s+power\s+of\s+(\w+)/gi, '$1^{$2}');

    // Handle "integral from a to b of f(x) dx"
    latex = latex.replace(/integral\s+from\s+(\w+)\s+to\s+(\w+)\s+of\s+(.+?)\s+d(\w+)/gi,
        '\\int_{$1}^{$2} $3 \\, d$4');

    // Replace math terms with LaTeX
    for (const [term, latexCode] of Object.entries(mathDictionary)) {
        const regex = new RegExp('\\b' + term + '\\b', 'gi');
        latex = latex.replace(regex, latexCode);
    }

    // Handle closing braces for common patterns
    latex = latex.replace(/\\sqrt\{([^}]+)(?!})/g, '\\sqrt{$1}');
    latex = latex.replace(/\\frac\{([^}]+)\}\{([^}]+)(?!})/g, '\\frac{$1}{$2}');

    return latex;
}

// Detect and extract graph commands
function detectGraphCommand(text) {
    const graphPatterns = [
        /(?:plot|graph)\s+(?:y\s*=\s*|)(.+)/i,
        /(?:plot|graph)\s+(.+)/i
    ];

    for (const pattern of graphPatterns) {
        const match = text.match(pattern);
        if (match) {
            return match[1].trim();
        }
    }
    return null;
}

// Render graph
function renderGraph(expression) {
    try {
        // Convert spoken math to function format
        let func = expression
            .replace(/x\s+squared/gi, 'x^2')
            .replace(/x\s+cubed/gi, 'x^3')
            .replace(/sine/gi, 'sin')
            .replace(/cosine/gi, 'cos')
            .replace(/tangent/gi, 'tan');

        graphContainer.innerHTML = '';
        graphContainer.classList.add('active');

        functionPlot({
            target: '#graphContainer',
            width: graphContainer.clientWidth - 40,
            height: 300,
            yAxis: { domain: [-10, 10] },
            xAxis: { domain: [-10, 10] },
            grid: true,
            data: [{
                fn: func,
                color: '#667eea'
            }]
        });
    } catch (error) {
        console.error('Error rendering graph:', error);
        graphContainer.innerHTML = '<p style="color: red;">Error rendering graph. Please check your expression.</p>';
    }
}

// Render LaTeX preview
function renderPreview() {
    const text = latexInput.value;
    preview.innerHTML = '';

    if (!text.trim()) {
        preview.innerHTML = '<p style="color: #999;">Preview will appear here...</p>';
        return;
    }

    // Split by lines and render each
    const lines = text.split('\n');
    lines.forEach(line => {
        if (!line.trim()) {
            preview.appendChild(document.createElement('br'));
            return;
        }

        const p = document.createElement('p');
        try {
            katex.render(line, p, {
                throwOnError: false,
                displayMode: true
            });
        } catch (e) {
            p.textContent = line;
        }
        preview.appendChild(p);
    });
}

// Speech Recognition Event Handlers
if (recognition) {
    recognition.onstart = () => {
        isListening = true;
        status.textContent = '🎤 Listening...';
        status.classList.add('listening');
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onend = () => {
        isListening = false;
        status.textContent = 'Ready to dictate...';
        status.classList.remove('listening');
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript) {
            // Check for graph command
            const graphCmd = detectGraphCommand(finalTranscript);
            if (graphCmd) {
                renderGraph(graphCmd);
                status.textContent = '📊 Graph rendered!';
                setTimeout(() => {
                    status.textContent = '🎤 Listening...';
                }, 2000);
            } else {
                // Convert to LaTeX and append
                const latex = convertToLatex(finalTranscript);
                latexInput.value += latex + '\n';
                renderPreview();
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        status.textContent = `Error: ${event.error}`;
        status.classList.remove('listening');
    };
}

// Button Event Listeners
startBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
    } else {
        alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
});

stopBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.stop();
    }
});

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all content?')) {
        latexInput.value = '';
        renderPreview();
        graphContainer.classList.remove('active');
        graphContainer.innerHTML = '';
    }
});

saveBtn.addEventListener('click', () => {
    const content = latexInput.value.trim();
    if (!content) {
        alert('Nothing to save!');
        return;
    }

    const title = prompt('Enter a title for this note:');
    if (!title) return;

    const note = {
        id: Date.now(),
        title: title,
        content: content,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const notes = JSON.parse(localStorage.getItem('mathNotes') || '[]');
    notes.push(note);
    localStorage.setItem('mathNotes', JSON.stringify(notes));

    loadSavedNotes();
    alert('Note saved successfully!');
});

// Load saved notes
function loadSavedNotes() {
    const notes = JSON.parse(localStorage.getItem('mathNotes') || '[]');
    notesList.innerHTML = '';

    if (notes.length === 0) {
        notesList.innerHTML = '<p style="color: #999;">No saved notes yet.</p>';
        return;
    }

    notes.reverse().forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';

        const header = document.createElement('div');
        header.className = 'note-card-header';

        const titleEl = document.createElement('div');
        titleEl.className = 'note-card-title';
        titleEl.textContent = note.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'note-card-delete';
        deleteBtn.textContent = '🗑';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm('Delete this note?')) {
                deleteNote(note.id);
            }
        };

        header.appendChild(titleEl);
        header.appendChild(deleteBtn);

        const preview = document.createElement('div');
        preview.className = 'note-card-preview';
        preview.textContent = note.content.substring(0, 100) + '...';

        card.appendChild(header);
        card.appendChild(preview);

        card.onclick = () => {
            latexInput.value = note.content;
            renderPreview();
        };

        notesList.appendChild(card);
    });
}

function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem('mathNotes') || '[]');
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('mathNotes', JSON.stringify(notes));
    loadSavedNotes();
}

// Auto-render preview on input
latexInput.addEventListener('input', renderPreview);

// Initialize
renderPreview();
loadSavedNotes();

// Check browser support
if (!recognition) {
    status.textContent = '⚠️ Speech recognition not supported. Please use Chrome or Edge.';
    status.style.background = '#ffebee';
    status.style.color = '#c62828';
    startBtn.disabled = true;
}
