const urlBar = document.getElementById('url-bar');
const webview = document.getElementById('view');
const suggestionsBox = document.getElementById('suggestions');
const homepage = document.getElementById('homepage');
const centerInput = document.getElementById('center-input');
const btnTheme = document.getElementById('btn-theme');

// configurations
const ENGINES = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    perplexity: 'https://www.perplexity.ai/search?q=', 
    chatgpt: 'https://chatgpt.com/' 
};

let currentEngine = 'google';
let aiEngine = 'perplexity';

// theme toggle
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    window.api.saveSetting('theme', isLight ? 'light' : 'dark');
}

(async () => {
    const settings = await window.api.getSettings();
    if (settings.theme === 'light') document.body.classList.add('light-mode');
    
    currentEngine = settings.engine || 'google';
    aiEngine = settings.aiEngine || 'perplexity';

    if (settings.lastUrl && settings.lastUrl !== 'about:blank' && !settings.lastUrl.includes('nexlyra')) {
        webview.src = settings.lastUrl;
        urlBar.value = settings.lastUrl;
        homepage.classList.add('hidden');
    } else {
        webview.src = 'about:blank';
        urlBar.value = 'nexlyra://home';
        homepage.classList.remove('hidden');
    }
})();

// intent recognition
function detectIntent(input) {
    input = input.trim();
    if (!input) return { type: 'SEARCH', query: '' };

    // Explicit AI
    if (input.startsWith('ask ') || input.startsWith('ai ') || input.startsWith('/ai')) {
        return { type: 'AI', query: input.replace(/^(ask|ai|\/ai)\s+/i, '') };
    }
    
    // URL checking 
    
    const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
    
    //logic: if it has URL pattern and no spaces, treat as URL
    if (urlPattern.test(input) && !input.includes(' ')) {
        return { type: 'URL', url: input };
    }
    
    //question detection for AI
    const questionWords = ['how', 'what', 'why', 'who', 'when', 'code', 'debug', 'write'];
    const firstWord = input.split(' ')[0].toLowerCase();
    if (input.endsWith('?') || questionWords.includes(firstWord)) {
        return { type: 'AI', query: input };
    }
    
    return { type: 'SEARCH', query: input };
}

//navigation handling
function handleNavigation(input, forceType = null) {
    if (!input) return;

    suggestionsBox.classList.add('hidden');
    homepage.classList.add('hidden');
    urlBar.blur();
    webview.focus();

    let intent = detectIntent(input);
    if (forceType) intent.type = forceType;

    const safeQuery = intent.query || input; 
    let targetUrl = '';

    if (input === 'nexlyra://home') {
        webview.src = 'about:blank';
        urlBar.value = 'nexlyra://home';
        homepage.classList.remove('hidden');
        return;
    }

    switch (intent.type) {
        case 'URL':
            // if it doesn't start with http/https, add https://
            targetUrl = intent.url.startsWith('http') ? intent.url : `https://${intent.url}`;
            break;
        case 'AI':
            if (aiEngine === 'perplexity') {
                targetUrl = ENGINES.perplexity + encodeURIComponent(safeQuery);
            } else {
                targetUrl = ENGINES.chatgpt; 
            }
            break;
        case 'SEARCH':
            const engineUrl = ENGINES[currentEngine] || ENGINES['google'];
            targetUrl = engineUrl + encodeURIComponent(safeQuery);
            break;
    }

    console.log(`Navigating to:`, targetUrl);
    webview.loadURL(targetUrl).catch(e => {}); // Ignore abort errors
    
    // Save state
    window.api.saveSetting('lastUrl', targetUrl);
}

//suggestion rendering
function renderSuggestions(inputText, intentType) {
    if (!inputText) {
        suggestionsBox.classList.add('hidden');
        return;
    }
    suggestionsBox.classList.remove('hidden');

    const searchEngineName = currentEngine.charAt(0).toUpperCase() + currentEngine.slice(1);
    const aiEngineName = aiEngine.charAt(0).toUpperCase() + aiEngine.slice(1);

    const searchSelected = intentType === 'SEARCH' || intentType === 'URL' ? 'selected' : '';
    const aiSelected = intentType === 'AI' ? 'selected' : '';

    suggestionsBox.innerHTML = `
        <div class="suggestion-item ${searchSelected}" data-action="SEARCH">
            <span>🔍 Search ${searchEngineName} for "${inputText}"</span>
            <span class="shortcut-hint">Ctrl+Enter</span>
        </div>
        <div class="suggestion-item ${aiSelected}" data-action="AI">
            <span>🤖 Ask ${aiEngineName}: "${inputText}"</span>
            <span class="shortcut-hint">Shift+Enter</span>
        </div>
    `;
}



// suggestion click handling
suggestionsBox.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const item = e.target.closest('.suggestion-item');
    if (item) {
        handleNavigation(urlBar.value, item.getAttribute('data-action'));
    }
});

//url bar events
urlBar.addEventListener('input', (e) => {
    const text = e.target.value;
    renderSuggestions(text, detectIntent(text).type);
});

urlBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (e.ctrlKey || e.metaKey) handleNavigation(urlBar.value, 'SEARCH');
        else if (e.shiftKey) handleNavigation(urlBar.value, 'AI');
        else handleNavigation(urlBar.value);
    }
    if (e.key === 'Escape') suggestionsBox.classList.add('hidden');
});

centerInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if(val.length > 0) {
        urlBar.value = val;
        urlBar.focus();
        renderSuggestions(val, detectIntent(val).type);
        centerInput.value = '';
    }
});

//webview state
webview.addEventListener('did-navigate', (e) => {
    if (e.url === 'about:blank') {
        urlBar.value = 'nexlyra://home';
        homepage.classList.remove('hidden');
    } else {
        urlBar.value = e.url;
        homepage.classList.add('hidden');
        window.api.saveSetting('lastUrl', e.url); // Persist location
    }
});

//controls 
document.getElementById('btn-back').onclick = () => webview.goBack();
if(btnTheme) btnTheme.onclick = toggleTheme;
document.getElementById('min-btn').onclick = () => window.api.controlWindow('minimize');
document.getElementById('max-btn').onclick = () => window.api.controlWindow('maximize');
document.getElementById('close-btn').onclick = () => window.api.controlWindow('close');

const settingsModal = document.getElementById('settings-modal');
const engineSelect = document.getElementById('setting-engine');
const aiSelect = document.getElementById('setting-ai');

document.getElementById('btn-settings').onclick = async () => {
    const settings = await window.api.getSettings();
    engineSelect.value = settings.engine || 'google';
    aiSelect.value = settings.aiEngine || 'perplexity';
    settingsModal.classList.remove('hidden');
};

document.getElementById('save-settings').onclick = async () => {
    await window.api.saveSetting('engine', engineSelect.value);
    await window.api.saveSetting('aiEngine', aiSelect.value);
    currentEngine = engineSelect.value;
    aiEngine = aiSelect.value;
    settingsModal.classList.add('hidden');
    urlBar.focus();
};

//keyboard shortcut to focus address bar

window.api.onFocusInput && window.api.onFocusInput(() => {
    urlBar.focus();
    urlBar.select();
});