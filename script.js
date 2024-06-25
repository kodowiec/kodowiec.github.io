import { Controller, findPage } from './scripts/controller.js';
import { Language, LanguageManager } from './scripts/language_manager.js';

// zbindowanie elementów witryny

const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");

// hosting jest wolny, więc nie będę tutaj dynamicznie skanował /pages zeby znalezc podstrony
// aczkolwiek jest to absolutnie mozliwe

const known_pages = ["home", "valuable", "bms", "dangers", "photos"];

const page_titles = {
    "pl": "Strona o pszczołach",
    "en": "Site about bees"
}

// inicjalizacja managera językowego
const lang_mgr = new LanguageManager(["pl", "en"]);
lang_mgr.readLanguages();

const queryParams = new URLSearchParams(window.location.search);

// znalezienie języka
let current_language = (queryParams.get('hl') ?? "pl");

if (!page_titles[current_language]) {
    // fallback do obslugiwanego jezyka
    current_language = "pl"
}

document.title = page_titles[current_language];

// inicjalizacja kontrolera i załadowanie stron

function menu_button_click(id) {
    if (main_controller.current_page_id != null) document.getElementById(`menu_${main_controller.current_page_id}`).classList.toggle("button-13-active");
    main_controller.setView(id);
    document.getElementById(`menu_${id}`).classList.toggle("button-13-active");
}

var main_controller = new Controller(content, current_language, page_titles[current_language]);

main_controller.setContent('loading... ten darmowy hosting jest całkiem powolny');

var menu = sidebar.getElementsByTagName("ul")[0];

// get homepage FIRST
{
    var found_page = await findPage("home", current_language);
    if (found_page != null) {
        main_controller.addView(found_page);
        var new_btn = document.createElement('a');
        new_btn.className = "button-13";
        new_btn.id = `menu_${found_page.id}`
        new_btn.style = "user-select: auto; width: 100%;";
        new_btn.innerText = found_page.title;
        new_btn.addEventListener('click', () => menu_button_click(found_page.id));
        menu.appendChild(new_btn);

        menu_button_click("home");
    };
}

known_pages.forEach(async page => {
    if (page != "home") {
        var found_page = await findPage(page, current_language);
        if (found_page != null) {
            main_controller.addView(found_page);
            var new_btn = document.createElement('a');
            new_btn.className = "button-13";
            new_btn.id = `menu_${found_page.id}`
            new_btn.style = "user-select: auto; width: 100%;";
            new_btn.innerText = found_page.title;
            new_btn.addEventListener('click', () => menu_button_click(found_page.id));
            menu.appendChild(new_btn);

            if (found_page.id == "home") {
                menu_button_click("home");
            }
        };
    }

});

lang_mgr.setLanguage(current_language);
document.getElementById("cookie-notice").innerText = lang_mgr.getString("cookie_notice");

var lang_div = document.getElementById("lang-selector");

lang_div.innerHTML = `<p style="font-size:10px;">${lang_mgr.getString("available_languages")}</p><ul id="lang-chooser-list"></ul>`;
var lang_list = lang_div.getElementsByTagName("ul")[0];
lang_mgr.languages.forEach(language => {
    var new_btn = document.createElement('a');
    new_btn.id = `langchsr_${language.code}`
    new_btn.style = "user-select: auto; width: 100%; margin: 4px; font-size: 12px";
    new_btn.innerText = `${language.emoji} ${language.name}`;
    new_btn.addEventListener('click', () => set_language(language.code));
    lang_list.appendChild(new_btn);
})

function set_language(code)
{
    window.location = `${window.location.href.split("?")[0]}?hl=${code}`;
}