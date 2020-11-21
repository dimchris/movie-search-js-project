class Menubar extends HTMLElement{
    constructor(){
        super();
        this.classList.add('menubar')
    }

    connectedCallback(){
        this._render();
    }

    _render(){
        this.innerHTML = `
            <div id="menu-item-search" class="menu-item selected">
                search
            </div>
            <div id="menu-item-watchlist" class="menu-item">
                watchlist
            </div>
            <div id="menu-item-account" class="menu-item">
                account
            </div>
        `;
    }
}

customElements.define('cd-menubar', Menubar)