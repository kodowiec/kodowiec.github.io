export class Language {
    constructor(lang_code, emoji, lang_name, common_strings = null) {
        this.code = lang_code;
        this.emoji = emoji;
        this.name = lang_name;

        this.common_strings = common_strings?? {
            "lang_change": "CHANGE_LANGUAGE",
            "home": "HOMEPAGE",
            "dark_mode": "DARK_MODE",
            "light_mode": "LIGHT_MODE",
            "cookie_notice": "COOKIE_NOTICE",
            "available_languages": "AVAILABLE_LANGUAGES"
        }
    }
}

export class LanguageManager {
    constructor(available_languages) {
        this.available_languages = available_languages;
        this.languages = [];
        this.current_language = null;
    }

    getString(id) {
        return this.current_language.common_strings[id];
    }

    async readLanguages() {
        this.available_languages.forEach(async lang_short => {
            try {
                const metadataResponse = await fetch(`./languages/${lang_short}.json`);
                if (!metadataResponse.ok) {
                    throw new Error(`Network response error for ${lang_short}`);
                }
                const metadata = await metadataResponse.json();

                if (!metadata['lang_short'] || metadata == null) return null;

                this.languages.push(
                    new Language(
                        metadata['lang_short'],
                        metadata['emoji'],
                        metadata['lang_full'],
                        {
                            "lang_change": metadata['lang_change'],
                            "home": metadata['home'],
                            "dark_mode": metadata['dark_mode'],
                            "light_mode": metadata['light_mode'],
                            "cookie_notice": metadata['cookie_notice'],
                            "available_languages": metadata['available_languages']

                        }
                    ));

            } catch (error) {

                console.error(`Error finding ${lang_short}:`, error);
                return null;
            }
        });
    }

    setLanguage(code){
        this.current_language = this.languages.find(item => item.code == code);
    }
}