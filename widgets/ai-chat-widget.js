class AIChatWidget extends WidgetBase {
  constructor() {
    super();
    this.apiKey = null;
    this.apiType = null;
    this.messages = [];
    this.isLoading = false;
    this.hasOnboarded = false;
    this.loadCredentials();
  }

  // SVG Icons
  get icons() {
    return {
      chat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="96px" height="96px"><radialGradient id="oDvWy9qKGfkbPZViUk7TCa" cx="-670.437" cy="617.13" r=".041" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1ba1e3"/><stop offset="0" stop-color="#1ba1e3"/><stop offset=".3" stop-color="#5489d6"/><stop offset=".545" stop-color="#9b72cb"/><stop offset=".825" stop-color="#d96570"/><stop offset="1" stop-color="#f49c46"/></radialGradient><path fill="url(#oDvWy9qKGfkbPZViUk7TCa)" d="M22.882,31.557l-1.757,4.024c-0.675,1.547-2.816,1.547-3.491,0l-1.757-4.024    c-1.564-3.581-4.378-6.432-7.888-7.99l-4.836-2.147c-1.538-0.682-1.538-2.919,0-3.602l4.685-2.08    c3.601-1.598,6.465-4.554,8.002-8.258l1.78-4.288c0.66-1.591,2.859-1.591,3.52,0l1.78,4.288c1.537,3.703,4.402,6.659,8.002,8.258    l4.685,2.08c1.538,0.682,1.538,2.919,0,3.602l-4.836,2.147C27.26,25.126,24.446,27.976,22.882,31.557z"/><radialGradient id="oDvWy9qKGfkbPZViUk7TCb" cx="-670.437" cy="617.13" r=".041" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1ba1e3"/><stop offset="0" stop-color="#1ba1e3"/><stop offset=".3" stop-color="#5489d6"/><stop offset=".545" stop-color="#9b72cb"/><stop offset=".825" stop-color="#d96570"/><stop offset="1" stop-color="#f49c46"/></radialGradient><path fill="url(#oDvWy9qKGfkbPZViUk7TCb)" d="M39.21,44.246l-0.494,1.132    c-0.362,0.829-1.51,0.829-1.871,0l-0.494-1.132c-0.881-2.019-2.467-3.627-4.447-4.506l-1.522-0.676    c-0.823-0.366-0.823-1.562,0-1.928l1.437-0.639c2.03-0.902,3.645-2.569,4.511-4.657l0.507-1.224c0.354-0.853,1.533-0.853,1.886,0    l0.507,1.224c0.866,2.088,2.481,3.755,4.511,4.657l1.437,0.639c0.823,0.366,0.823,1.562,0,1.928l-1.522,0.676    C41.677,40.619,40.091,42.227,39.21,44.246z"/></svg>`,
      user: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>`,
      bot: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
        <circle cx="12" cy="5" r="2"/>
        <path d="M12 7v4"/>
      </svg>`,
      settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m20.5-4.5L17 7m-10 10L3.5 21.5M21.5 3.5L17 8m-10 10l-4.5 4.5"/>
      </svg>`,
      send: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>`,
      openai: `<svg viewBox='0 0 320 320' fill="currentColor" xmlns='http://www.w3.org/2000/svg' width="40" height="40">
      <path d='m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z'/>
      </svg>`,
      gemini: `<svg height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <title>Gemini</title>
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="#3186FF"></path>
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#lobe-icons-gemini-fill-0)"></path>
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#lobe-icons-gemini-fill-1)"></path>
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#lobe-icons-gemini-fill-2)"></path>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="lobe-icons-gemini-fill-0" x1="7" x2="11" y1="15.5" y2="12">
            <stop stop-color="#08B962"></stop>
            <stop offset="1" stop-color="#08B962" stop-opacity="0"></stop>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="lobe-icons-gemini-fill-1" x1="8" x2="11.5" y1="5.5" y2="11">
            <stop stop-color="#F94543"></stop>
            <stop offset="1" stop-color="#F94543" stop-opacity="0"></stop>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="lobe-icons-gemini-fill-2" x1="3.5" x2="17.5" y1="13.5" y2="12">
            <stop stop-color="#FABC12"></stop>
            <stop offset=".46" stop-color="#FABC12" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>`,
      close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>`,
      newChat: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>`,
      logout: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>`,
    };
  }

  get category() {
    return "other";
  }

  get name() {
    return "AIChatWidget";
  }

  async createContent() {
    const container = document.createElement("div");
    container.className = "ai-chat-widget-container";

    if (!this.hasOnboarded || !this.apiKey) {
      container.appendChild(await this.createOnboarding());
    } else {
      container.appendChild(await this.createChatInterface());
    }

    return container;
  }

  async createPreview() {
    const preview = document.createElement("div");
    preview.className = "ai-chat-preview";

    const previewElementIcon = document.createElement("div");
    previewElementIcon.innerHTML = this.icons.chat;

    const previewElementTitle = document.createElement("div");
    previewElementTitle.className = "ai-chat-preview-title";
    previewElementTitle.innerText = "AI Chat";

    preview.appendChild(previewElementTitle);
    preview.appendChild(previewElementIcon);

    return preview;
  }

  async createOnboarding() {
    const onboarding = document.createElement("div");
    onboarding.className = "ai-chat-onboarding";

    onboarding.innerHTML = `
      <div class="ai-chat-header">
        <h3>AI Chat Setup</h3>
      </div>
      <div class="ai-chat-onboarding-content">
        <p>Choose your AI provider and enter your API key:</p>

        <div class="ai-provider-selection">
          <label class="ai-provider-option">
            <input type="radio" name="ai-provider" value="gpt" checked>
            <div class="ai-provider-card">
              <div class="ai-provider-icon">${this.icons.openai}</div>
              <div class="ai-provider-name">OpenAI GPT</div>
            </div>
          </label>

          <label class="ai-provider-option">
            <input type="radio" name="ai-provider" value="gemini">
            <div class="ai-provider-card">
              <div class="ai-provider-icon">${this.icons.gemini}</div>
              <div class="ai-provider-name">Google Gemini</div>
            </div>
          </label>
        </div>

        <div class="ai-api-key-section">
          <label for="ai-api-key">API Key:</label>
          <input type="password" id="ai-api-key" placeholder="Enter your API key" class="ai-api-key-input">
          <div class="ai-key-info">
            <small>⚠️ <strong>Important:</strong> API usage may incur costs. Free tiers have usage limits.</small>
          </div>
          <div class="ai-key-help" id="api-key-help">
            <!-- Help content will be inserted here based on selected provider -->
          </div>
        </div>

        <div class="ai-onboarding-actions">
          <button class="ai-save-btn" disabled>Save & Start Chatting</button>
        </div>
      </div>
    `;

    const saveBtn = onboarding.querySelector(".ai-save-btn");
    const apiKeyInput = onboarding.querySelector("#ai-api-key");
    const providerRadios = onboarding.querySelectorAll(
      'input[name="ai-provider"]',
    );
    const helpDiv = onboarding.querySelector("#api-key-help");

    const updateProviderHelp = (provider) => {
      if (provider === "gpt") {
        helpDiv.innerHTML = `
          <div class="ai-help-content">
            <strong>📖 OpenAI Setup:</strong>
            <ul>
              <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com/api-keys</a></li>
              <li>Create an API key (requires account with payment method)</li>
              <li>New accounts get $5 free credit</li>
              <li>GPT-5 nano: ~$0.002 per 1K tokens</li>
              <li>Monitor usage at platform.openai.com/usage</li>
            </ul>
          </div>
        `;
      } else if (provider === "gemini") {
        helpDiv.innerHTML = `
          <div class="ai-help-content">
            <strong>📖 Gemini Setup:</strong>
            <ul>
              <li>Visit <a href="https://aistudio.google.com/apikey" target="_blank">https://aistudio.google.com/apikey</a></li>
              <li>Uses gemini-2.5-flash-latest model</li>
              <li>Free tier available with generous limits</li>
              <li>No payment method required for free tier</li>
              <li>May require enabling billing for higher limits</li>
              <li>Monitor usage at <a href="https://console.cloud.google.com" target="_blank">console.cloud.google.com</a></li>
            </ul>
          </div>
        `;
      }
    };

    const updateSaveButton = () => {
      const hasKey = apiKeyInput.value.trim().length > 0;
      saveBtn.disabled = !hasKey;
    };

    apiKeyInput.addEventListener("input", updateSaveButton);
    providerRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        updateSaveButton();
        updateProviderHelp(e.target.value);
      });
    });

    // Initialize help content
    updateProviderHelp("gpt");

    saveBtn.addEventListener("click", async () => {
      const selectedProvider = onboarding.querySelector(
        'input[name="ai-provider"]:checked',
      ).value;
      const apiKey = apiKeyInput.value.trim();

      if (apiKey) {
        await this.saveCredentials(selectedProvider, apiKey);
        this.hasOnboarded = true;
        this.apiType = selectedProvider;
        this.apiKey = apiKey;

        const container = onboarding.parentElement;
        container.innerHTML = "";
        container.appendChild(await this.createChatInterface());
      }
    });

    return onboarding;
  }

  async createChatInterface() {
    const chatInterface = document.createElement("div");
    chatInterface.className = "ai-chat-interface";

    chatInterface.innerHTML = `
      <div class="ai-chat-header">
        <h3>AI Chat (${this.apiType.toUpperCase()})</h3>
        <div class="ai-header-actions">
          <button class="ai-new-chat-btn" title="Nieuwe chat">${this.icons.newChat}</button>
          <button class="ai-logout-btn" title="Terug naar instellingen">${this.icons.logout}</button>
        </div>
      </div>

      <div class="ai-chat-messages"></div>

      <div class="ai-chat-input-container">
        <textarea class="ai-chat-input" placeholder="Type your message..." rows="1"></textarea>
        <button class="ai-send-btn" disabled>${this.icons.send}</button>
      </div>
    `;

    const messagesContainer = chatInterface.querySelector(".ai-chat-messages");
    const inputField = chatInterface.querySelector(".ai-chat-input");
    const sendBtn = chatInterface.querySelector(".ai-send-btn");
    const newChatBtn = chatInterface.querySelector(".ai-new-chat-btn");
    const logoutBtn = chatInterface.querySelector(".ai-logout-btn");

    this.loadMessages();
    this.renderMessages(messagesContainer);

    const updateSendButton = () => {
      sendBtn.disabled = !inputField.value.trim() || this.isLoading;
    };

    inputField.addEventListener("input", updateSendButton);
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) {
          this.sendMessage(inputField.value, messagesContainer);
          inputField.value = "";
          updateSendButton();
        }
      }
    });

    sendBtn.addEventListener("click", () => {
      if (!sendBtn.disabled) {
        this.sendMessage(inputField.value, messagesContainer);
        inputField.value = "";
        updateSendButton();
      }
    });

    newChatBtn.addEventListener("click", () => {
      this.clearChat();
      this.renderMessages(messagesContainer);
    });

    logoutBtn.addEventListener("click", () => {
      this.resetToSetup();
    });

    return chatInterface;
  }

  async sendMessage(message, messagesContainer) {
    if (!message.trim() || this.isLoading) return;

    this.addMessage("user", message);
    this.renderMessages(messagesContainer);
    this.isLoading = true;

    try {
      const response = await this.callAIAPI(message);
      this.addMessage("assistant", response);
      this.saveMessages();
    } catch (error) {
      this.addMessage("assistant", `Error: ${error.message}`);
    } finally {
      this.isLoading = false;
      this.renderMessages(messagesContainer);
    }
  }

  async callAIAPI(message) {
    const headers = {
      "Content-Type": "application/json",
    };

    let body, url;

    if (this.apiType === "gpt") {
      url = "https://api.openai.com/v1/chat/completions";
      headers["Authorization"] = `Bearer ${this.apiKey}`;
      body = {
        model: "gpt-5-nano-2025-08-07",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...this.messages.map((msg) => ({
            role: msg.type === "user" ? "user" : "assistant",
            content: msg.content,
          })),
          { role: "user", content: message },
        ],
        max_tokens: 1000,
      };
    } else if (this.apiType === "gemini") {
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      body = {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = errorData.error?.message || "API request failed";

      if (this.apiType === "gpt" && errorMessage.includes("quota")) {
        errorMessage = `⚠️ Quota exceeded. Your OpenAI API key has reached its usage limit. Please:\n• Check your usage at platform.openai.com\n• Add a payment method if using free trial\n• Upgrade your plan or wait for quota reset`;
      }

      if (this.apiType === "gemini" && errorMessage.includes("quota")) {
        errorMessage = `⚠️ Quota exceeded. Your Gemini API key has reached its usage limit. Please:\n• Check your usage at console.cloud.google.com\n• Verify your billing is enabled\n• Wait for quota reset or upgrade your plan`;
      }

      // Handle invalid API key errors
      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("unauthorized") ||
        response.status === 401
      ) {
        errorMessage = `⚠️ Invalid API key. Please:\n• Verify your API key is correct\n• Check if the key is active\n• Generate a new key if needed`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (this.apiType === "gpt") {
      return data.choices[0].message.content;
    } else if (this.apiType === "gemini") {
      // Handle Gemini API response structure
      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
      ) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    }
  }

  addMessage(type, content) {
    this.messages.push({ type, content, timestamp: Date.now() });
    if (this.messages.length > 50) {
      this.messages = this.messages.slice(-50);
    }
  }

  renderMessages(container) {
    container.innerHTML = "";
    this.messages.forEach((msg) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `ai-chat-message ${msg.type}`;

      const content = document.createElement("div");
      content.className = "ai-chat-message-content";
      content.innerHTML = this.parseMarkdown(msg.content);

      messageDiv.appendChild(content);
      container.appendChild(messageDiv);
    });

    container.scrollTop = container.scrollHeight;
  }

  clearChat() {
    this.messages = [];
    this.saveMessages();
  }

  resetToSetup() {
    localStorage.removeItem("ai_chat_credentials");
    localStorage.removeItem("ai_chat_messages");
    location.reload();
  }

  // Basic markdown parser
  parseMarkdown(text) {
    return (
      text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Code blocks (multiline)
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        // Inline code
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        // Links
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
        )
        // Line breaks
        .replace(/\n/g, "<br>")
    );
  }

  async saveCredentials(apiType, apiKey) {
    const encrypted = await this.encryptData(apiKey);
    localStorage.setItem(
      "ai_chat_credentials",
      JSON.stringify({
        apiType,
        encryptedKey: encrypted,
        onboarded: true,
      }),
    );
  }

  async loadCredentials() {
    try {
      const stored = localStorage.getItem("ai_chat_credentials");
      if (stored) {
        const credentials = JSON.parse(stored);
        this.apiType = credentials.apiType;
        this.apiKey = await this.decryptData(credentials.encryptedKey);
        this.hasOnboarded = credentials.onboarded;
      }
    } catch (error) {
      console.error("Failed to load credentials:", error);
    }
  }

  async encryptData(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const cryptoKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      dataBuffer,
    );

    const exportedKey = await crypto.subtle.exportKey("raw", cryptoKey);
    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv),
      key: Array.from(new Uint8Array(exportedKey)),
    };
  }

  async decryptData(encryptedData) {
    try {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        new Uint8Array(encryptedData.key),
        { name: "AES-GCM" },
        true,
        ["decrypt"],
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(encryptedData.iv) },
        cryptoKey,
        new Uint8Array(encryptedData.encrypted),
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  }

  saveMessages() {
    localStorage.setItem("ai_chat_messages", JSON.stringify(this.messages));
  }

  loadMessages() {
    try {
      const stored = localStorage.getItem("ai_chat_messages");
      if (stored) {
        this.messages = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      this.messages = [];
    }
  }

  async showSettings(container) {
    const settings = document.createElement("div");
    settings.className = "ai-chat-settings";
    settings.innerHTML = `
      <div class="ai-settings-header">
        <h4>Settings</h4>
        <button class="ai-close-settings">${this.icons.close}</button>
      </div>
      <div class="ai-settings-content">
        <button class="ai-clear-chat">Clear Chat History</button>
        <button class="ai-reset-credentials">Reset API Key</button>
        <div class="ai-provider-info">
          <strong>Current Provider:</strong> ${this.apiType.toUpperCase()}
        </div>
      </div>
    `;

    const closeBtn = settings.querySelector(".ai-close-settings");
    const clearBtn = settings.querySelector(".ai-clear-chat");
    const resetBtn = settings.querySelector(".ai-reset-credentials");

    closeBtn.addEventListener("click", () => settings.remove());

    clearBtn.addEventListener("click", () => {
      this.messages = [];
      this.saveMessages();
      const messagesContainer = container.querySelector(".ai-chat-messages");
      this.renderMessages(messagesContainer);
      settings.remove();
    });

    resetBtn.addEventListener("click", () => {
      localStorage.removeItem("ai_chat_credentials");
      localStorage.removeItem("ai_chat_messages");
      location.reload();
    });

    container.appendChild(settings);
  }

  async onThemeChange() {
    const container = this.element?.querySelector(".ai-chat-widget-container");
    if (container) {
      container.classList.toggle(
        "dark-theme",
        document.body.classList.contains("dark-theme"),
      );
    }
  }
}

registerWidget(new AIChatWidget());
