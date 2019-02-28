(function () {
    const menuTemplate = `
        <div class="nav-menu slideInDown animated">
            <menu-item icon='fa-home' routerLink='\Home'></menu-item>
            <menu-item icon='fa-money-bill-alt' routerLink='\Goals'></menu-item>
            <logout-button icon='fa-sign-out-alt'></logout-button>
        </div>
    `;

    const menuItemTemplate = `
        <router-link :to='routerLink' class='menu-item'>
            <i v-bind:class="['fas', icon]"></i>
        </router-link>
    `;

    // We need to load a resource on the server, not a Vue route.
    const logoutButtonTemplate = `
        <a href='Identity/Account/Logout' class="menu-item">
            <i v-bind:class="['fas', icon]"></i>
        </a>
    `;

    Vue.component('nav-menu', {
        components: {
            'menu-item': {
                props: ['icon', 'routerLink'],
                template: menuItemTemplate,
            },
            'logout-button': {
                props: ['icon'],
                template: logoutButtonTemplate,
            },
        },
        template: menuTemplate
    });
})();