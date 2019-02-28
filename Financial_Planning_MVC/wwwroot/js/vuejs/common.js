// All JS files are scoped in order to avoid polluting the global namespace.
(function () {
    // Used to dynamically load components depending on the currently active route.
    const router = new VueRouter({
        mode: 'hash',
        routes: [
            { path: '/Home', component: Vue.component('Home') },
            { path: '/Goals', component: Vue.component('Goals')}
        ]
    });

    // Load the vue.
    new Vue({
        router: router,
        el: '#app',
    });

    // Define the default route.
    router.replace('/Home');
})();