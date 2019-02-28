(function () {
    const modalTemplate = `
            <div class='modal'>
                <div class='header'>
                    <h2 class='header-content'>{{headerContent}}</h2>
                </div>
                <hr>
                <div class='body'>
                    <slot>Default Content!</slot>
                </div>
            </div>
        `;

    Vue.component('Modal', {
        template: modalTemplate,
        props: ['headerContent'],
    });
})();