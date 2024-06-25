// View
export class View {
    constructor(id, title, language, content) {
        this.id = id;
        this.title = title;
        this.language = language;
        this.content = content;
        this.current_page_id = null;
    }
};


export class Controller {
    constructor(html_element, language, page_name) {
        this.html_container = html_element;
        this.lang = language;
        this.views = [];
        this.page_name = page_name;
    }

    setContent(content) {
        this.html_container.innerHTML = content;
    }

    setTitle(title) {
        document.title = title;
    }

    addView(view) {
        if (!this.views || this.views == null) {
            this.views = Array.of(view);
        }
        else {
            this.views.push(view);
        }
    }

    setView(view_name) {
        var i = this.views.find(item => item.id == view_name);

        if (i) {
            this.setTitle(`${i.title} - ${this.page_name}`);
            this.setContent(i.content);
            this.current_page_id = i.id;
        }
    }

    getView(view_name) { this.views.find(item => item.id == view_name); }
}

export async function findPage(page_id, language) {
    try {
        const metadataResponse = await fetch(`./pages/${page_id}/${language}/metadata.json`);
        if (!metadataResponse.ok) {
            throw new Error(`Network response error for ${language}_${page_id}`);
        }
        const metadata = await metadataResponse.json();

        if (!metadata['id'] || metadata == null) return null;

        const htmlResponse = await fetch(`./pages/${page_id}/${language}/content.html`);
        if (!htmlResponse.ok) {
            throw new Error(`Network response error for ${language}_${page_id}`);
        }
        const htmlData = await htmlResponse.text();

        return new View(metadata['id'], metadata['title'], metadata['lang'], htmlData);
    } catch (error) {
        if (error instanceof TypeError) {
            // Suppress the error for metadata.json fetch
            return null;
        } else {
            console.error(`Error finding page ${language}_${page_id}:`, error);
            return null;
        }
    }
}
