document.addEventListener('DOMContentLoaded', function() {
    // Переменные для управления чатом
    let ChatDiv = null;
    const wrapper = document.querySelector(".wrapper");
    const contact = document.querySelectorAll(".contact");

    // Эмодзи данные
    const emojiData = {
        smile: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
        animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🦄', '🐺'],
        food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥭', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄'],
        travel: ['✈️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛳', '⛴', '🚢', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍'],
        objects: ['💡', '🔦', '🕯', '🧯', '🛢', '💈', '🧲', '🪛', '⛏', '🔨', '🔧', '🪛', '🔩', '⚙️', '🧰', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊']
    };

    // Функция для переключения игрового режима
    function initGameModeToggle() {
        const gameModeRow = document.querySelector('.game_mode');
        
        if (gameModeRow) {
            // Удаляем все предыдущие обработчики
            const newElement = gameModeRow.cloneNode(true);
            gameModeRow.parentNode.replaceChild(newElement, gameModeRow);
            
            newElement.addEventListener('click', () => {
                const oldIcon = newElement.querySelector('i.bi-toggle2-off, i.bi-toggle2-on');
                if (oldIcon) {
                    const newIcon = document.createElement('i');
                    newIcon.className = oldIcon.classList.contains('bi-toggle2-off')
                        ? 'bi bi-toggle2-on'
                        : 'bi bi-toggle2-off';
                    oldIcon.replaceWith(newIcon);
                    
                    const isGameModeOn = newIcon.classList.contains('bi-toggle2-on');
                    console.log('Игровой режим:', isGameModeOn ? 'Включен' : 'Выключен');
                }
            });
        }
    }

    // Функция для создания чата
    function createChat(name, status, avatar) {
        // Удаляем предыдущий чат, если он существует
        if (ChatDiv) {
            ChatDiv.remove();
            ChatDiv = null;
        }

        // Создаем новый чат
        ChatDiv = document.createElement('div');
        ChatDiv.classList.add('messages_chats');
        wrapper.appendChild(ChatDiv);

        // Обновляем содержимое ChatDiv
        ChatDiv.innerHTML = `
            <div class="heada_chat">
                <div class="left_head_chat">
                    <button class="to_go_out_chat"><i class="bi bi-arrow-left"></i></button>
                    <img src="${avatar.src}" alt="" width="50px" height="50px">
                    <div>
                        <div class="title_chat">${name.textContent}</div>
                        <p class="status_contact">${status.textContent}</p>
                    </div>
                </div>
                
                <div class="chat_actions">
                    <button class="search_chat"><i class="bi bi-search"></i></button>
                    <button class="telephone_chat"><i class="bi bi-telephone-fill"></i></button>
                    <button class="settings_chat"><i class="bi bi-gear-fill"></i></button>
                </div>
            </div>
            
            <div class="messages_chat"></div>
            
            <div class="block_chats">
                <div class="sendmessage">
                    <button class="files"><i class="bi bi-paperclip"></i></button>
                    <input type="text" class="message-input">
                    <button class="gift_btn"><i class="bi bi-gift"></i></button>
                    <button class="emoji_btn"><i class="bi bi-emoji-wink"></i></button>
                    <button class="send_message"><i class="bi bi-send-fill"></i></button>
                </div>

                <div class="emoji-picker" style="display: none;">
                    <div class="search-box">
                        <input type="text" placeholder="🔍 Поиск эмодзи..." id="emoji-search">
                    </div>
                    
                    <div class="categories" id="categories">
                        <button class="category-btn active" data-category="all">Все</button>
                        <button class="category-btn" data-category="smile">😊 Смайлы</button>
                        <button class="category-btn" data-category="animals">🐶 Животные</button>
                        <button class="category-btn" data-category="food">🍎 Еда</button>
                        <button class="category-btn" data-category="travel">✈️ Путешествия</button>
                        <button class="category-btn" data-category="objects">💡 Объекты</button>
                    </div>
                    
                    <div class="emoji-grid" id="emoji-grid"></div>
                </div>
                
              <div class="keyboard" role="application" aria-label="Виртуальная клавиатура">
                    <!-- Цифры -->
                    <div class="line" role="row">
                      <div class="key" role="button" tabindex="0" style="height:30px"><i class="bi bi-camera"></i></div>
                      <div class="key" role="button" tabindex="0" style="height:30px"><i class="bi bi-images"></i></div>
                      <div class="key" role="button" tabindex="0" style="height:30px"><i class="bi bi-camera-video"></i></div>
                      <div class="key" role="button" tabindex="0" style="height:30px"><i class="bi bi-clipboard" style="font-size: 24px;"></i></div>
                      <div class="key" role="button: taindex="0" style="height:30px"><i class="bi bi-code-slash"></i></div>
                    </div>
                
                    <div class="line" role="row">
                      <div class="key" role="button" tabindex="0">1</div>
                      <div class="key" role="button" tabindex="0">2</div>
                      <div class="key" role="button" tabindex="0">3</div>
                      <div class="key" role="button" tabindex="0">4</div>
                      <div class="key" role="button" tabindex="0">5</div>
                      <div class="key" role="button" tabindex="0">6</div>
                      <div class="key" role="button" tabindex="0">7</div>
                      <div class="key" role="button" tabindex="0">8</div>
                      <div class="key" role="button" tabindex="0">9</div>
                      <div class="key" role="button" tabindex="0">0</div>
                    </div>
                
                    <!-- Вторая строка -->
                    <div class="line" role="row">
                      <div class="key" role="button" tabindex="0">й</div>
                      <div class="key" role="button" tabindex="0">ц</div>
                      <div class="key" role="button" tabindex="0">у</div>
                      <div class="key" role="button" tabindex="0">к</div>
                      <div class="key" role="button" tabindex="0">е</div>
                      <div class="key" role="button" tabindex="0">н</div>
                      <div class="key" role="button" tabindex="0">г</div>
                      <div class="key" role="button" tabindex="0">ш</div>
                      <div class="key" role="button" tabindex="0">щ</div>
                      <div class="key" role="button" tabindex="0">з</div>
                      <div class="key" role="button" tabindex="0">х</div>
                      <div class="key" role="button" tabindex="0">ъ</div>
                    </div>
                
                    <!-- Третья строка -->
                    <div class="line" role="row">
                      <div class="key" role="button" tabindex="0">ф</div>
                      <div class="key" role="button" tabindex="0">ы</div>
                      <div class="key" role="button" tabindex="0">в</div>
                      <div class="key" role="button" tabindex="0">а</div>
                      <div class="key" role="button" tabindex="0">п</div>
                      <div class="key" role="button" tabindex="0">р</div>
                      <div class="key" role="button" tabindex="0">о</div>
                      <div class="key" role="button" tabindex="0">л</div>
                      <div class="key" role="button" tabindex="0">д</div>
                      <div class="key" role="button" tabindex="0">ж</div>
                      <div class="key" role="button" tabindex="0">э</div>
                    </div>
                
                    <!-- Четвёртая строка -->
                    <div class="line" role="row">
                      <div class="key wide" role="button" tabindex="0" title="Caps Lock">
                        <i class="bi bi-capslock"></i>
                      </div>
                      <div class="key" role="button" tabindex="0">я</div>
                      <div class="key" role="button" tabindex="0">ч</div>
                      <div class="key" role="button" tabindex="0">с</div>
                      <div class="key" role="button" tabindex="0">м</div>
                      <div class="key" role="button" tabindex="0">и</div>
                      <div class="key" role="button" tabindex="0">т</div>
                      <div class="key" role="button" tabindex="0">ь</div>
                      <div class="key" role="button" tabindex="0">б</div>
                      <div class="key" role="button" tabindex="0">ю</div>
                      <div class="key backspace wide" role="button" tabindex="0" title="Backspace">
                        <i class="bi bi-backspace"></i>
                      </div>
                    </div>
                
                    <!-- Пятая строка -->
                    <div class="line" role="row">
                      <div class="key wide" role="button" tabindex="0" title="Переключить на цифры и символы">
                        ?<i class="bi bi-123"></i>
                      </div>
                      <div class="key" role="button" tabindex="0" title="Эмодзи">
                        <i class="bi bi-emoji-smile"></i>
                      </div>
                      <div class="key" role="button" tabindex="0" title="Сменить язык">
                        <i class="bi bi-globe"></i>
                      </div>
                      <div class="key space" role="button" tabindex="0" title="Пробел"></div>
                      <div class="key" role="button" tabindex="0">.</div>
                      <div class="key wide_send" role="button" tabindex="0" title="Enter">
                        <i class="bi bi-arrow-return-left"></i>
                      </div>
                    </div>
                  </div>
            </div>
        `;

        // Инициализируем все обработчики событий для нового чата
        initChatHandlers();
    }
            
    // Функция для инициализации ВСЕХ обработчиков событий чата
    function initChatHandlers() {
        if (!ChatDiv) return;

        // Обработчик выхода из чата
        const exitButton = ChatDiv.querySelector(".to_go_out_chat");
        if (exitButton) {
            // Удаляем предыдущие обработчики
            const newExitButton = exitButton.cloneNode(true);
            exitButton.parentNode.replaceChild(newExitButton, exitButton);
            
            newExitButton.addEventListener("click", exitChat);
        }

        // Обработчики отправки сообщений
        const sendButton = ChatDiv.querySelector(".send_message");
        const messageInput = ChatDiv.querySelector(".message-input");
        
        if (sendButton) {
            // Удаляем предыдущие обработчики
            const newSendButton = sendButton.cloneNode(true);
            sendButton.parentNode.replaceChild(newSendButton, sendButton);
            
            newSendButton.addEventListener("click", sendMessage);
        }
        
        if (messageInput) {
            // Удаляем предыдущие обработчики
            const newMessageInput = messageInput.cloneNode(true);
            messageInput.parentNode.replaceChild(newMessageInput, messageInput);
            
            newMessageInput.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    sendMessage();
                }
            });
        }
            
        // keyboard клавиатура на телефонах 
        const keyboard = document.querySelector(".keyboard");
        if (keyboard) {
            const keyboard_line_keys = keyboard.querySelectorAll(".key");
            const messageInput = ChatDiv.querySelector(".message-input");  // Определяем input вне цикла
            
            function isMobile() {
                return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            }
        
            function showKeyboard() {
                keyboard.style.display = 'block';
            }
        
            function hideKeyboard() {
                keyboard.style.display = 'none';
            }
        
            // Обработчики событий на input (действуют только на мобильных)
            messageInput.addEventListener("focus", function(e) {
                if (isMobile()) {
                    e.preventDefault();
                    this.blur();
                }
            });
        
            messageInput.addEventListener("touchstart", function(e) {
                if (isMobile()) {
                    e.preventDefault();
                    showKeyboard();
                }
            });
        
            messageInput.addEventListener("click", function(e) {
                if (isMobile()) {
                    e.preventDefault();
                    showKeyboard();
                }
            });
        
            // Обработчик клавиш (работает на всех устройствах)
            keyboard_line_keys.forEach(key => {
                key.addEventListener("click", function() {
                    const audio_press = new Audio("/static/js/keyboard_press.mp3");
                    audio_press.play()
                        .then(() => {
                            setTimeout(() => {
                                audio_press.pause();
                                audio_press.currentTime = 0;
                            }, 500);
                        })
                        .catch(error => console.error("Ошибка воспроизведения звука:", error));
                
                    const keyText = key.textContent.trim();
                    if (key.classList.contains("space")) {
                        messageInput.value += " ";
                    }
                    
                    if (key.classList.contains("wide_send")) {
                        sendMessage();
                    }
                    
                    if (key.classList.contains("backspace")) {
                        messageInput.value = messageInput.value.slice(0, -1);
                    } else {
                        messageInput.value += keyText;
                    }
                });
            });
        
            // Скрываем клавиатуру при клике вне input и клавиатуры (только на мобильных)
            document.addEventListener("click", function(event) {
                if (isMobile()) {
                    const target = event.target;
                    const clickedInsideInput = messageInput.contains(target);
                    const clickedInsideKeyboard = keyboard.contains(target);
        
                    if (!clickedInsideInput && !clickedInsideKeyboard) {
                        hideKeyboard();
                    }
                }
            });
        
            // Опционально: обновляем поведение при изменении размера окна (например, поворот экрана)
            window.addEventListener("resize", function() {
                // Если ширина изменилась, поведение обновится автоматически при следующем событии
                // Но если нужно, можно добавить логику для перезагрузки обработчиков
            });
        }


        // Обработчик emoji кнопки
        const emojiBtn = ChatDiv.querySelector(".emoji_btn");
        const emojiDiv = ChatDiv.querySelector(".emoji-picker");
        
        if (emojiBtn && emojiDiv) {
            // Удаляем предыдущие обработчики
            const newEmojiBtn = emojiBtn.cloneNode(true);
            emojiBtn.parentNode.replaceChild(newEmojiBtn, emojiBtn);
            
            newEmojiBtn.addEventListener("click", function() {
                emojiDiv.style.display = emojiDiv.style.display === "block" ? "none" : "block";
                // Инициализируем emoji пикер при каждом открытии
                if (emojiDiv.style.display === "block") {
                    initEmojiPicker();
                }
            });
        }

        // Инициализация emoji пикера при создании чата
        initEmojiPicker();

        // Обработчики других кнопок
        const telephoneBtn = ChatDiv.querySelector(".telephone_chat");
        const settingsBtn = ChatDiv.querySelector(".settings_chat");
        const filesBtn = ChatDiv.querySelector(".files");
        const giftBtn = ChatDiv.querySelector(".gift_btn");
        const searchBtn = ChatDiv.querySelector(".search_chat");
        
        const profile_user = ChatDiv.querySelector(".left_head_chat img");
        
        if (profile_user) {
            const name = document.querySelector(".left_head_chat .title_chat");
            const avatar = document.querySelector(".left_head_chat img");
            const status = document.querySelector(".left_head_chat .status_contact");
            
            profile_user.addEventListener("click", function() {
                const profile_div = document.createElement("div");
                profile_div.classList.add("profile");
                profile_div.innerHTML = `
                    <div class="profile-header">
                        <p>Информация</p>
                        <div class="header-buttons">
                            <button class="header-button" title="Позвонить">
                                <i class="bi bi-telephone-fill"></i>
                            </button>
                            <button class="header-button" title="Меню">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <button class="header-button close-chat" title="Закрыть">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="profile_info">
                        <img src="${avatar.src}" alt="Аватар пользователя">
                        <div class="description">
                            <p>${name.textContent}</p>
                            <p class="status">${status.textContent}</p>
                        </div>
                    </div>
                    
                    <div class="about-chat">
                        <div class="container">
                            <p><i class="bi bi-info-circle"></i> О себе</p>
                            <div class="description">Я девелопер дизайнер работаю над проектом chattera</div>
                        </div>
                    </div>
                    
                    <div class="url_profile">
                        <div class="main-container">
                            <div class="left">
                                <a href="">@${name.textContent}</a>
                                <p>Имя пользователя</p>
                            </div>
                            
                            <div class="right">
                                <button><i class="bi bi-qr-code"></i></button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="notifications">
                        <div>
                            <p><i class="bi bi-bell-fill"></i> Уведомления</p>
                            <button><i class="bi bi-toggle2-off"></i></button>
                        </div>
                    </div>
                    <div class="handler-profile-user">
                        <button><i class="bi bi-ban"></i> Заблокировать</button>
                    </div>
                `;
                
                // Закрытие по кнопке
                profile_div.querySelector(".close-chat").addEventListener("click", function() {
                    profile_div.remove();
                    document.removeEventListener("click", closeProfileOnClickOutside);
                });
                
                wrapper.appendChild(profile_div);
                
                // Функция для закрытия при клике вне профиля
                function closeProfileOnClickOutside(event) {
                    if (!profile_div.contains(event.target) && event.target !== profile_user) {
                        profile_div.remove();
                        document.removeEventListener("click", closeProfileOnClickOutside);
                    }
                }
                
                // Добавляем обработчик на весь документ с небольшой задержкой, чтобы не сработал сразу
                setTimeout(() => {
                    document.addEventListener("click", closeProfileOnClickOutside);
                }, 10);
            });
        }
        
        if (telephoneBtn) {
            // Удаляем предыдущие обработчики
            const newTelephoneBtn = telephoneBtn.cloneNode(true);
            telephoneBtn.parentNode.replaceChild(newTelephoneBtn, telephoneBtn);
            
            newTelephoneBtn.addEventListener('click', () => alert('Функция звонка будет реализована позже'));
        }
        
        if (settingsBtn) {
            // Клонируем кнопку, чтобы удалить старые обработчики
            const newSettingsBtn = settingsBtn.cloneNode(true);
            settingsBtn.parentNode.replaceChild(newSettingsBtn, settingsBtn);
        
            // Переменная для отслеживания состояния блока настроек
            let settingsDivVisible = false;
        
            newSettingsBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // чтобы клик на кнопке не закрывал сразу
        
                const messagersChat = document.querySelector(".messages_chats");
                let settings_div = wrapper.querySelector(".settings_div_chat");
        
                if (!settings_div) {
                    // Создаём блок настроек, если его нет
                    settings_div = document.createElement("div");
                    settings_div.classList.add("settings_div_chat");
                    
                    settings_div.style = `
                        display: block;
                        color: white;
                        position: absolute;
                        z-index: 9999;
                        top: 70px;
                        right: 7px;
                    `;
                        
                    settings_div.innerHTML = `
                        <div>Сквозное шифрование</div>
                        <div>Уведомления</div>
                        <div>Звук</div>
                        <div>Настройки чата</div>
                        <div class="remove_messages_to_chat">Очистить историю</div>
                        <div>Сменить обои</div>
                        <div>Заблокировать</div>
                        <div class="delete_chat">Удалить чат</div>
                    `;
                    
                    messagersChat.appendChild(settings_div);
                }
        
                // Показываем или скрываем блок (toggle)
                if (settingsDivVisible) {
                    settings_div.style.display = "none";
                    settingsDivVisible = false;
                } else {
                    settings_div.style.display = "block";
                    settingsDivVisible = true;
                }
                
                const remove_messages_chat = document.querySelector(".remove_messages_to_chat");
                
                remove_messages_chat.addEventListener("click", function() {
                    const messages_chat = document.querySelector(".messages_chat");
                    
                    messages_chat.innerHTML = "";
                    
                    settings_div.style.display = "none";
                    settingsDivVisible = false;
                })
            });
        
            // Обработчик клика вне блока и кнопки — скрываем блок настроек
            document.addEventListener('click', (event) => {
                const wrapper = document.querySelector(".wrapper");
                const settings_div = wrapper.querySelector(".settings_div_chat");
        
                if (settingsDivVisible && settings_div && !settings_div.contains(event.target) && event.target !== newSettingsBtn) {
                    settings_div.style.display = "none";
                    settingsDivVisible = false;
                }
            });
        }
        
        if (filesBtn) {
            // Удаляем предыдущие обработчики
            const newFilesBtn = filesBtn.cloneNode(true);
            filesBtn.parentNode.replaceChild(newFilesBtn, filesBtn);
            
            newFilesBtn.addEventListener('click', () => alert('Функция отправки файлов будет реализована позже'));
        }
        if (giftBtn) {
            // Удаляем предыдущие обработчики
            const newGiftBtn = giftBtn.cloneNode(true);
            giftBtn.parentNode.replaceChild(newGiftBtn, giftBtn);
            
            newGiftBtn.addEventListener('click', () => alert('Функция отправки подарков будет реализована позже'));
        }
        
        // Обработчик поиска
        if (searchBtn) {
            // Удаляем предыдущие обработчики
            const newSearchBtn = searchBtn.cloneNode(true);
            searchBtn.parentNode.replaceChild(newSearchBtn, searchBtn);
            
            newSearchBtn.addEventListener('click', handleSearchClick);
        }
    }

    // Функция выхода из чата
    function exitChat() {
        if (ChatDiv && ChatDiv.parentNode === wrapper) {
            wrapper.removeChild(ChatDiv);
            ChatDiv = null;
        }
    }

    // Функция для получения активного контакта по имени
    function getActiveContact() {
        if (!ChatDiv) return null;
        const chatName = ChatDiv.querySelector(".title_chat").textContent;
        const contacts = document.querySelectorAll(".contact");
        for (let contact of contacts) {
            const nameElement = contact.querySelector(".name");
            if (nameElement && nameElement.textContent === chatName) {
                return contact;
            }
        }
        return null;
    }

    // Функция отправки сообщения плюс обработка события при нажатии
    function sendMessage() {
        if (!ChatDiv) return;
        const messageInput = ChatDiv.querySelector(".message-input");
        const messagesChat = ChatDiv.querySelector(".messages_chat");

        if (messageInput && messageInput.value.trim() !== "") {
            const messageUser = document.createElement('div');
            messageUser.className = 'message user-message';
            
            const activeContact = getActiveContact();
            const lastMessage = activeContact ? activeContact.querySelector(".last_message") : null;
            const datatime_message = activeContact ? activeContact.querySelector(".datatime_message") : null;
            
            messageUser.innerHTML = `
                <div class="message-content">
                    <p>${messageInput.value}</p>
                    <div class="data_time_and_writer_message">
                        <span class="message-time">${new Date().toLocaleTimeString().slice(0, -3)}</span>
                        <button style='margin-left:3px;'><i class="bi bi-check2"></i></button>
                    </div>
                </div>
            `;
            
            const audio_press = new Audio("/static/js/iphone-send-w.mp3");
            audio_press.play()
            
            if (lastMessage) {
                lastMessage.textContent = "Вы: " + messageInput.value;
            }
            if (datatime_message) {
                datatime_message.textContent = new Date().toLocaleTimeString().slice(0, -3);
            }
            
            // Получаем блок с классом message-content
            const messageContent = messageUser.querySelector('.message-content');
    
            // Добавляем обработчик правой кнопки мыши только на message-content
            messageContent.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                showContextMenu(e.clientX, e.clientY, messageUser);
            });

            // Добавляем поддержку долгого тапа только на message-content
            let touchTimer;
            messageContent.addEventListener('touchstart', function (e) {
                touchTimer = setTimeout(() => {
                    const touch = e.touches[0];
                    e.preventDefault();
                    showContextMenu(touch.clientX, touch.clientY, messageUser);
                }, 500);
            });
    
            messageContent.addEventListener('touchend', function () {
                clearTimeout(touchTimer);
            });
            
            messageContent.addEventListener('touchmove', function () {
                clearTimeout(touchTimer);
            });
    
            if (messagesChat) {
                messagesChat.appendChild(messageUser);
                messageInput.value = "";
                messagesChat.scrollTop = messagesChat.scrollHeight;
    
                const emojiDiv = ChatDiv.querySelector(".emoji-picker");
                if (emojiDiv) {
                    emojiDiv.style.display = "none";
                }
            }
        }
    }
    
    function showContextMenu(x, y, messageElement) {
        const existingMenu = document.querySelector('.context-menu');
        const time_message = messageElement.querySelector(".message-time");
        
        if (existingMenu) existingMenu.remove();
    
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x-100}px;
            background: #111;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            min-width: 150px;
        `;
    
        contextMenu.innerHTML = `
            <div class="menu-item" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #1e1e1e;">Отправленно в: ${time_message ? time_message.textContent : ''}</div>
            <div class="menu-item" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #1e1e1e;">Копировать</div>
            <div class="menu-item" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #1e1e1e;">Редактировать</div>
            <div class="menu-item" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #1e1e1e;">Ответить</div>
            <div class="menu-item" style="padding: 8px 12px; cursor: pointer; color: red;">Удалить</div>
        `;
    
        document.body.appendChild(contextMenu);
    
        const menuItems = contextMenu.querySelectorAll('.menu-item');
        menuItems[1].addEventListener('click', (e) => {
            e.stopPropagation();
            copyMessage(messageElement);
            contextMenu.remove();
        });
        menuItems[2].addEventListener('click', (e) => {
            e.stopPropagation();
            editMessage(messageElement);
            contextMenu.remove();
        });
        menuItems[4].addEventListener('click', (e) => {
            e.stopPropagation();
            deleteMessage(messageElement);
            contextMenu.remove();
        });
    
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!contextMenu.contains(e.target)) {
                    contextMenu.remove();
                    document.removeEventListener('click', closeMenu);
                    document.removeEventListener('touchstart', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
            document.addEventListener('touchstart', closeMenu);
        }, 10);
    }
    
    function copyMessage(messageElement) {
        const text = messageElement.querySelector('p').textContent;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Сообщение скопировано!');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Сообщение скопировано!');
        });
    }
    
    function editMessage(messageElement) {
        const textElement = messageElement.querySelector('p');
        const currentText = textElement.textContent;
        
        const activeContact = getActiveContact();
        const lastMessage = activeContact ? activeContact.querySelector(".last_message") : null;
        const datatime_message = activeContact ? activeContact.querySelector(".datatime_message") : null;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.style.cssText = `
            width: 100%;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: #111;
            color: white;
        `;
        
        textElement.replaceWith(input);
        input.focus();
        
        const saveChanges = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                const newTextElement = document.createElement('p');
                newTextElement.textContent = newText;
                if (input.parentNode) {
                    if (lastMessage) {
                        lastMessage.textContent = "Вы: " + newText;
                    }
                    input.replaceWith(newTextElement);
                }
                
                // Обновляем время и добавляем индикацию редактирования
                const timeSpan = messageElement.querySelector('.message-time');
                if (timeSpan) {
                    const editedTime = new Date().toLocaleTimeString().slice(0, -3);
                    if (datatime_message) {
                        datatime_message.textContent = editedTime;
                    }
                    timeSpan.innerHTML = `${editedTime} <span style="color: #a1a1aa; font-size: 12px;"><i class="bi bi-pencil-fill"></i> изменено</span>`;
                }
            } else {
                const oldTextElement = document.createElement('p');
                oldTextElement.textContent = currentText;
                if (input.parentNode) {
                    input.replaceWith(oldTextElement);
                }
            }
        };
        
        input.addEventListener('blur', saveChanges);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveChanges();
            }
        });
    }
    
    function deleteMessage(messageElement) {
        if (confirm('Удалить сообщение?')) {
            messageElement.remove();
            
            // Обновляем last_message на последнее оставшееся сообщение
            updateLastMessageFromChat();
        }
    }
    
    // Новая функция для обновления last_message на основе последнего сообщения в чате
    function updateLastMessageFromChat() {
        const messagesChat = ChatDiv ? ChatDiv.querySelector(".messages_chat") : null;
        const activeContact = getActiveContact();
        const lastMessage = activeContact ? activeContact.querySelector(".last_message") : null;
        const datatime_message = activeContact ? activeContact.querySelector(".datatime_message") : null;
        
        if (!messagesChat || !lastMessage || !datatime_message) return;
        
        const messages = messagesChat.querySelectorAll('.message');
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            const text = lastMsg.querySelector('p') ? lastMsg.querySelector('p').textContent : '';
            const time = lastMsg.querySelector('.message-time') ? lastMsg.querySelector('.message-time').textContent : '';
            
            lastMessage.textContent = "Вы: " + text;
            datatime_message.textContent = time;
        } else {
            // Если сообщений нет, очищаем
            lastMessage.textContent = "";
            datatime_message.textContent = "";
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #111;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1001;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Функция для обработки поиска
    function handleSearchClick() {
        if (!ChatDiv) return;
        
        const headaChat = ChatDiv.querySelector(".heada_chat");
        if (!headaChat) return;
        
        const originalContent = headaChat.innerHTML;

        headaChat.style.cssText = `
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-around;
        `;
        
        headaChat.innerHTML = `
            <button class="back"><i class="bi bi-arrow-left"></i></button>
            <input class="search-chat" type='text' placeholder='Искать'/>
            <button class="prev-match" style="display: none;"><i class="bi bi-chevron-up"></i></button>
            <button class="next-match" style="display: none;"><i class="bi bi-chevron-down"></i></button>
            <span class="match-info" style="display: none; color: #a1a1aa; font-size: 12px;"></span>
        `;
        
        const searchInput = headaChat.querySelector(".search-chat");
        const prevBtn = headaChat.querySelector(".prev-match");
        const nextBtn = headaChat.querySelector(".next-match");
        const matchInfo = headaChat.querySelector(".match-info");
        let foundMessages = [];
        let currentMatchIndex = -1;
        
        // Функция для поиска сообщений
        function searchMessages(query) {
            const messagesChat = ChatDiv.querySelector(".messages_chat");
            if (!messagesChat) return;
            
            // Очищаем предыдущие выделения
            messagesChat.querySelectorAll('.message.highlight').forEach(msg => {
                msg.classList.remove('highlight');
            });
            
            foundMessages = [];
            currentMatchIndex = -1;
            
            if (query.trim() === '') {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                matchInfo.style.display = 'none';
                return;
            }
            
            const messages = messagesChat.querySelectorAll('.message p');
            messages.forEach((p, index) => {
                if (p.textContent.toLowerCase().includes(query.toLowerCase())) {
                    foundMessages.push(p.closest('.message'));
                }
            });
            
            if (foundMessages.length > 0) {
                prevBtn.style.display = 'inline-block';
                nextBtn.style.display = 'inline-block';
                matchInfo.style.display = 'inline-block';
                updateMatchInfo();
                goToMatch(0);
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                matchInfo.style.display = 'none';
                showNotification('Совпадений не найдено');
            }
        }
        
        // Функция для перехода к совпадению
        function goToMatch(index) {
            if (index < 0 || index >= foundMessages.length) return;
            
            // Убираем предыдущее выделение
            if (currentMatchIndex >= 0) {
                foundMessages[currentMatchIndex].classList.remove('highlight');
            }
            
            currentMatchIndex = index;
            const message = foundMessages[currentMatchIndex];
            message.classList.add('highlight');
            message.scrollIntoView({ behavior: 'smooth', block: 'center' });
            updateMatchInfo();
        }
        
        // Функция для обновления информации о совпадениях
        function updateMatchInfo() {
            matchInfo.textContent = `${currentMatchIndex + 1} из ${foundMessages.length}`;
        }
        
        // Обработчик ввода в поле поиска
        searchInput.addEventListener('input', function() {
            searchMessages(this.value);
        });
        
        // Обработчик кнопки "Предыдущее"
        prevBtn.addEventListener('click', function() {
            if (foundMessages.length > 0) {
                let newIndex = currentMatchIndex - 1;
                if (newIndex < 0) newIndex = foundMessages.length - 1;
                goToMatch(newIndex);
            }
        });
        
        // Обработчик кнопки "Следующее"
        nextBtn.addEventListener('click', function() {
            if (foundMessages.length > 0) {
                let newIndex = currentMatchIndex + 1;
                if (newIndex >= foundMessages.length) newIndex = 0;
                goToMatch(newIndex);
            }
        });
        
        // Назначаем обработчик для кнопки "Назад"
        const backButton = headaChat.querySelector(".back");
        if (backButton) {
            // Удаляем предыдущие обработчики
            const newBackButton = backButton.cloneNode(true);
            backButton.parentNode.replaceChild(newBackButton, backButton);
            
            newBackButton.addEventListener("click", function() {
                // Очищаем выделения перед выходом
                const messagesChat = ChatDiv.querySelector(".messages_chat");
                if (messagesChat) {
                    messagesChat.querySelectorAll('.message.highlight').forEach(msg => {
                        msg.classList.remove('highlight');
                    });
                }
                
                headaChat.style.cssText = '';
                headaChat.innerHTML = originalContent;
                
                // Переинициализируем обработчики после возврата
                setTimeout(() => {
                    initChatHandlers();
                }, 0);
            });
        }
        
        // Фокус на поле поиска
        searchInput.focus();
    }

    // Функция для инициализации emoji пикера
    function initEmojiPicker() {
        if (!ChatDiv) return;
        
        const categoryButtons = ChatDiv.querySelectorAll('.category-btn');
        const emojiGrid = ChatDiv.querySelector('#emoji-grid');
        const messageInput = ChatDiv.querySelector('.message-input');
        const emojiSearch = ChatDiv.querySelector('#emoji-search');
        
        if (!emojiGrid) return;
        
        // Удаляем предыдущие обработчики и создаем новые
        categoryButtons.forEach(btn => {
            const category = btn.getAttribute('data-category');
            
            // Удаляем предыдущие обработчики
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                ChatDiv.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active');
                });
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');
                
                displayEmojis(category);
            });
        });
        
        function displayEmojis(category) {
            if (!emojiGrid) return;
            
            emojiGrid.innerHTML = '';
            
            let emojisToShow = [];
            
            if (category === 'all') {
                for (const cat in emojiData) {
                    emojisToShow = emojisToShow.concat(emojiData[cat]);
                }
            } else {
                emojisToShow = emojiData[category] || [];
            }
            
            emojisToShow.forEach(emoji => {
                const emojiElement = document.createElement('div');
                emojiElement.className = 'emoji-item';
                emojiElement.textContent = emoji;
                emojiElement.addEventListener('click', () => {
                    if (messageInput) {
                        messageInput.value += emoji;
                        messageInput.focus();
                    }
                });
                emojiGrid.appendChild(emojiElement);
            });
        }
        
        // Поиск эмодзи
        if (emojiSearch) {
            // Удаляем предыдущие обработчики
            const newSearch = emojiSearch.cloneNode(true);
            emojiSearch.parentNode.replaceChild(newSearch, emojiSearch);
            
            newSearch.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const activeCategoryBtn = ChatDiv.querySelector('.category-btn.active');
                const activeCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-category') : 'all';
                
                let filteredEmojis = [];
                
                if (activeCategory === 'all') {
                    for (const cat in emojiData) {
                        filteredEmojis = filteredEmojis.concat(
                            emojiData[cat].filter(emoji => {
                                return emoji.includes(searchTerm);
                            })
                        );
                    }
                } else {
                    filteredEmojis = emojiData[activeCategory].filter(emoji => {
                        return emoji.includes(searchTerm);
                    });
                }
                
                emojiGrid.innerHTML = '';
                filteredEmojis.forEach(emoji => {
                    const emojiElement = document.createElement('div');
                    emojiElement.className = 'emoji-item';
                    emojiElement.textContent = emoji;
                    emojiElement.addEventListener('click', () => {
                        if (messageInput) {
                            messageInput.value += emoji;
                            messageInput.focus();
                        }
                    });
                    emojiGrid.appendChild(emojiElement);
                });
            });
        }
        
        // Инициализация эмодзи
        displayEmojis('all');
    }

    // Функция для управления панелью
    function initPanel() {
        const panel_btn = document.querySelector(".panel_btn");
        const panel = document.querySelector(".panel");
        
        if (!panel_btn || !panel) return;
        
        function hidePanel() {
            panel.classList.remove("mobule-panel");
        }
        
        function togglePanel() {
            if (window.innerWidth >= 1050) {
                return;
            }
            
            panel.classList.toggle("mobule-panel");
            
            if (panel.classList.contains("mobule-panel")) {
                setTimeout(() => {
                    document.addEventListener('click', handleClickOutside);
                }, 0);
            } else {
                document.removeEventListener('click', handleClickOutside);
            }
        }
        
        function handleClickOutside(event) {
            if (!panel.contains(event.target) && event.target !== panel_btn) {
                hidePanel();
                document.removeEventListener('click', handleClickOutside);
            }
        }
        
        // Удаляем предыдущие обработчики
        const newPanelBtn = panel_btn.cloneNode(true);
        panel_btn.parentNode.replaceChild(newPanelBtn, panel_btn);
        
        newPanelBtn.addEventListener("click", function(event) {
            event.stopPropagation();
            togglePanel();
        });
        
        panel.addEventListener("click", function(event) {
            event.stopPropagation();
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1050) {
                panel.classList.remove("mobule-panel");
            }
        });
    }

    // Инициализация обработчиков для контактов
    contact.forEach(element => {
        // Удаляем предыдущие обработчики
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        newElement.addEventListener('click', () => {
            const name = newElement.querySelector(".name");
            const status = newElement.querySelector(".status_contact");
            const avatar = newElement.querySelector(".logo").querySelector("img");
            
            if (name && status && avatar) {
                createChat(name, status, avatar);
            }
        });
    });

    // Инициализация всех компонентов при загрузке
    initGameModeToggle();
    initPanel();
});

document.addEventListener("DOMContentLoaded", function() {
    const search_user_input = document.querySelector(".search_user_input");
    const search_div_result = document.querySelector(".contacts");
    const search_button = document.querySelector(".search_btn");

    // Сохраняем оригинальные контакты как массив элементов
    const originalContacts = Array.from(search_div_result.querySelectorAll(".contact"));

    async function doSearch() {
        const inputValue = search_user_input.value.trim();
        const query = inputValue.startsWith("@") ? inputValue.slice(1) : inputValue;

        // Если input пустой — показываем все контакты
        if (query === "") {
            originalContacts.forEach(contact => {
                contact.style = "";
            });
            return;
        }

        if (inputValue.startsWith("@")) {
            // Поиск по БД: отправляем запрос на сервер
            search_div_result.innerHTML = '<p>Ищу...</p>';
            try {
                const response = await fetch(`/search?q=${encodeURIComponent(query)}`);  // Исправлено: q вместо query
                if (!response.ok) throw new Error('Ошибка сервера');
                const users = await response.json();

                // Очищаем контакты и добавляем результаты из БД
                search_div_result.innerHTML = "";
                if (users.length === 0) {
                    search_div_result.innerHTML = '<p>Ничего не найдено</p>';
                } else {
                    users.forEach(userData => {
                        const user = document.createElement("div");
                        user.classList.add("contact");
                        user.innerHTML = `
                            <div class="logo">
                                <img src="https://default-avatar-url.com" alt="">  <!-- Дефолтный аватар -->
                                <div class="contactInfo">
                                    <p class="name">${userData.number}</p>  <!-- Исправлено: number вместо name -->
                                    <p class="status_contact">${userData.status_user || 'оффлайн'}</p>  <!-- Статус пользователя -->
                                    <p class="last_message">${userData.message || 'Нет сообщений'}</p>  <!-- Исправлено: message вместо last_message -->
                                </div>
                            </div>
                            <div class="datatime_message">
                                <p>19:00</p>  <!-- Добавь время из БД, если есть -->
                            </div>`;
                        search_div_result.appendChild(user);
                    });
                }
            } catch (error) {
                console.error('Ошибка поиска:', error);
                search_div_result.innerHTML = '<p>Ошибка поиска. Попробуйте позже.</p>';
            }
        } else {
            // Обычный поиск: фильтруем существующие контакты
            let hasMatches = false;
            originalContacts.forEach(contact => {
                const nameElement = contact.querySelector(".name");
                if (nameElement) {
                    const name = nameElement.textContent.toLowerCase();
                    if (name.includes(query.toLowerCase())) {
                        contact.style = "";
                        hasMatches = true;
                    } else {
                        contact.style.display = "none";
                    }
                }
            });

            if (!hasMatches) {
                // Можно добавить сообщение, но оставлю без
            }
        }
    }

    // Автоматический поиск с debounce
    let searchTimeout;
    search_user_input.addEventListener("input", function() {
        const inputValue = search_user_input.value.trim();
        clearTimeout(searchTimeout);
        if (inputValue.startsWith("@")) {
            // Если начинается с @ — ничего не делаем
            return;
        }
        // Иначе — выполняем поиск с задержкой
        searchTimeout = setTimeout(() => {
            doSearch();
        }, 300);
    });

    // Поиск при клике по кнопке
    search_button.addEventListener("click", doSearch);
});

document.addEventListener("DOMContentLoaded", function() {
    let ChatDiv = null;

    // Глобальный доступ к ChatDiv через свойство окна
    Object.defineProperty(window, 'ChatDiv', {
        get: () => ChatDiv,
        set: (value) => { ChatDiv = value; }
    });

    // Получаем wrapper (если он глобален, можешь его убрать и использовать напрямую)
    const wrapper = document.querySelector('.wrapper');

    const contacts = document.querySelectorAll('.contact');
    if (contacts.length === 0) {
        console.warn("Нет элементов с классом .contact");
        return;
    }

    const contextMenu = document.createElement('div');
    contextMenu.id = 'customContextMenu';
    contextMenu.style.cssText = `
        position: absolute;
        background: #111;
        color: white;
        padding: 8px 12px;
        border-radius: 5px;
        border-right: 1px solid #1e1e1e;
        box-shadow: 0 2px 6px rgba(0,0,0,0.5);
        display: none;
        z-index: 1000;
        max-width: 200px;
        white-space: nowrap;
        user-select: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;

    contextMenu.innerHTML = `
        <div onclick="handleMenuOption('закрепить')" style="padding: 4px 0; cursor:pointer; width:100%; display:flex; justify-content:space-between; align-items:center;">
            Закрепить
        </div>
        <div onclick="handleMenuOption('пустой')" style="padding: 4px 0; cursor:pointer; width:100%; display:flex; justify-content:space-between; align-items:center;">
            Настройки
        </div>
        <div onclick="handleMenuOption('удалить')" style="padding: 4px 0; color:red; cursor:pointer; width:100%; display:flex; justify-content:space-between; align-items:center;">
            Удалить
        </div>
    `;
    document.body.appendChild(contextMenu);

    let selectedElement = null;

    // Полностью заменённая функция handleMenuOption
    window.handleMenuOption = function(option) {
        if (!selectedElement) return;

        switch(option) {
            case 'закрепить':
                alert(`Закреплён чат под названием ${selectedElement.querySelector(".name").textContent}`);
                selectedElement.classList.add('pinned');
                break;
                
            case 'удалить':
                if (confirm(`Удалить чат с пользователем ${selectedElement.querySelector(".name").textContent}?`)) {
                    // Проверить и удалить .messages_chats из wrapper, если оно там есть
                    if (wrapper) {
                        const messagesChat = wrapper.querySelector('.messages_chats');
                        if (messagesChat && messagesChat.querySelector('.title_chat').textContent == selectedElement.querySelector('.name').textContent) {
                            messagesChat.remove();
                        }
                    }
                    
                    // Обнулить ChatDiv, если совпадает имя
                    if (window.ChatDiv && window.ChatDiv.querySelector('.title_chat')?.textContent === selectedElement.querySelector('.name')?.textContent) {
                        window.ChatDiv = null;
                    }
                    
                    // Всегда удалить контакт
                    selectedElement.remove();
                }
                break;
                
            case 'пустой':
                alert('Открыты настройки');
                break;
            default:
                alert(`Выбрана: ${option}`);
        }
        hideContextMenu();
    };

    function hideContextMenu() {
        contextMenu.style.display = 'none';
        selectedElement = null;
    }

    contacts.forEach(contact => {
        contact.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            selectedElement = contact;  // Запоминаем элемент для меню

            const rect = contact.getBoundingClientRect();
            const menuWidth = contextMenu.offsetWidth || 200;
            const menuHeight = contextMenu.offsetHeight || 120;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let left = rect.left + (rect.width / 2) - (menuWidth / 2);
            let top = rect.bottom + 5;

            if (left < 10) left = 10;
            if (top + menuHeight > windowHeight) top = rect.top - menuHeight - 5;
            if (left + menuWidth > windowWidth) left = windowWidth - menuWidth - 10;

            contextMenu.style.left = left + 'px';
            contextMenu.style.top = top + 'px';
            contextMenu.style.display = 'block';
            contextMenu.style.opacity = '1';
        });
    });

    document.addEventListener('click', function(e) {
        if (!contextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const panel = document.querySelector(".panel");
    const divs = panel.querySelectorAll(":scope > div");
    const wrapper = document.querySelector(".wrapper");

    const info_panel = document.createElement("div");
    info_panel.classList.add("tooltip");

    info_panel.innerHTML = `
        <div class="menu_togle">
            <p class="title">Настройки</p>
            <div style="display:flex; align-items:center;">
                <button class="redaction"><i class="bi bi-pencil-fill"></i></button>
                <button class="close" style="margin-left:20px;"><i class="bi bi-x-lg"></i></button>
            </div>
        </div>
        <div class="info"></div>
    `;

    // Закрытие окна по кнопке
    info_panel.querySelector(".menu_togle div .close").addEventListener("click", function(e) {
        e.stopPropagation();
        if (wrapper.contains(info_panel)) {
            wrapper.removeChild(info_panel);
        }
    });

    // Объект с заголовками и контентом для каждого элемента
    const contentMap = {
            0: {
                title: "Профиль",
                content: `
                    <div class="profile_info">
                        <img src="">
                        <div class="description">
                            <p>Артур</p>
                            <p class="status">Онлайн</p>
                        </div>
                    </div>
                    
                    <div class="container" style="gap: 20px; padding: 25px 30px; background: #111; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); margin-top: 1px; animation: fadeIn 0.8s ease-out 0.1s both;">
                        <p><i class="bi bi-info-circle"></i> О себе</p>
                        <div class="description">Я девелопер дизайнер работаю над проектом chattera</div>
                    </div>
                    
                    <div class="url_profile" style="border:none; padding:0;">
                        <div class="main-container" style="border:none; background: #111; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                            <div class="left">
                                <a href="">@Артур</a>
                                <p>Имя пользователя</p>
                            </div>
                            
                            <div class="right">
                                <button><i class="bi bi-qr-code"></i></button>
                            </div>
                        </div>
                    </div>
                `
            },
            1: {
                title: "Настройки",
                content: `
                    
                `
            },
            2: {
                title: "Контакты",
                content: `
                <div class="contact">
                    <div class="logo">
                        <img src="https://tse4.mm.bing.net/th/id/OIP.nA5UqQBbt-JU3E9mYn6piQHaEK?r=0&w=1280&h=720&rs=1&pid=ImgDetMain&o=7&rm=3" alt="">
                        <div class="contactInfo">
                            <p class="name">Арагудян</p> 
                            <p class="status_contact">онлайн</p>
                        </div>
                    </div>
                </div>
                `
            },
            4: {
                title: "Djarvis ai",
                content: `
                    <div class="ai_message">
                        
                    </div>
                    
                    <div class="send_message_ai">
                        <input placeholder="Ведите сообщение">
                        <button class="send"><i class="bi bi-send-fill"></i></button>
                    </div>
                `
            }
    };
    
    // Функция открытия окна с заголовком и уникальным контентом
    function openTooltipWithContent(title, content) {
        const titleP = info_panel.querySelector("p.title");
        const infoDiv = info_panel.querySelector(".info");

        if (titleP) titleP.textContent = title || "Без названия";
        if (infoDiv) infoDiv.innerHTML = content || "";

        if (wrapper.contains(info_panel)) {
            wrapper.removeChild(info_panel);
        }

        wrapper.appendChild(info_panel);
    }

    const activeIndices = [0, 1, 2, 4];

    activeIndices.forEach(index => {
        if (divs[index]) {
            divs[index].addEventListener("click", function(e) {
                e.stopPropagation();

                const data = contentMap[index] || {title: "Без названия", content: "<p>Контент отсутствует.</p>"};

                openTooltipWithContent(data.title, data.content);

                // Добавляем функционал отправки сообщений для индекса 4
                if (index === 4) {
                    const input = info_panel.querySelector(".send_message_ai input");
                    const sendBtn = info_panel.querySelector(".send_message_ai .send");
                    const aiMessageContainer = info_panel.querySelector(".ai_message");

                    function sendMessage() {
                        const text = input.value.trim();
                        if (text === "") return;

                        const msgDiv = document.createElement("div");
                        msgDiv.classList.add("message");
                        msgDiv.innerHTML = `
                            <p>Вы</p> 
                            <p>${text}</p>
                            <div style="display:flex; justify-content: flex-end;">
                                <p>${new Date().toISOString().replace('T', ' ').slice(0, 19)}</p>
                            </div>
                        `;
                        msgDiv.style.display = "flex";
                        msgDiv.style.background = "#272727ff";
                        msgDiv.style.padding = "8px 12px";
                        msgDiv.style.marginBottom = "8px";
                        msgDiv.style.borderRadius = "10px";
                        msgDiv.style.maxWidth = "80%";

                        aiMessageContainer.appendChild(msgDiv);
                        aiMessageContainer.scrollTop = aiMessageContainer.scrollHeight;

                        input.value = "";
                        input.focus();
                    }

                    sendBtn.addEventListener("click", function(ev) {
                        ev.stopPropagation();
                        sendMessage();
                    });

                    input.addEventListener("keydown", function(ev) {
                        if (ev.key === "Enter") {
                            ev.preventDefault();
                            sendMessage();
                        }
                    });
                }
                
            });
        }
    });

    // Клик по странице закрывает окно, кроме кликов внутри info_panel
    document.body.addEventListener("click", function(event) {
        if (wrapper.contains(info_panel) && !info_panel.contains(event.target)) {
            wrapper.removeChild(info_panel);
        }
    });
});
