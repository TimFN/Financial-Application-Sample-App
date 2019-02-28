(function () {
    const headerMessage = `
        Financial Sample Application
    `;

    const homeTemplate = `
        <div class='Home'>
            <Modal v-bind:headerContent='headerContent'>
                <p>Hello <slot>Unauthenticated user. How did you get in?</slot></p>
                <p>Thank you for logging into this financial sample application!</p>
                <p>The e-mail address above has been sent an e-mail confirming this successful login.</p>
                <p>This application makes use of Vuejs components, routing, and animations. The content located below the navigation menu is generated from a router view using Vuejs components.</p>
                <p>Animations are provided by the Animate.css animation libary and are handled by Vuejs. All icons are provided by the Font Awesome icon library. The components, styling, and layout are custom-made with the exception of the transition animations.</p>
                <p>The server-side routing of the login and index views is done in .NET Core MVC. A .NET Core RESTful API is used to allow securely retrieving, updating, and inserting financial goals.</p>
                <p>In order to interact with this API, the requesting user must be authenticated. The API will not allow a user to retrieve or modify data that does not belong to them.</p>
                <span style='align-self: flex-start'>-Timon Feldmann</span>
            </Modal>
        </div>
    `;

    Vue.component('Home', {
        template: homeTemplate,
        data: function () {
            return {
                headerContent: headerMessage
            }
        }
    });
})();