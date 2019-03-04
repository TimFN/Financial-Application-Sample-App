(function () {
    /* We use the goal object as the key in order to workaround an animation bug that exists in Vuejs.
     * Using the index as the key would result in the leave animation triggering on the last goal no 
     * matter which goal is being removed. This workaround causes Vuejs to throw warnings however I have
     * not been able to find a workaround to this.*/
    const goalsTemplate = `
        <div class='Goals'>
            <div v-if='loading' class='loader-container'>
                <i class='fas fa-sync fa-spin loader'></i>
            </div>
            <div v-show='!loading' class='goals-page-header'>
                <h2 class='goals-page-header-text'>Personal Financial Goals</h2>
            </div>
            <div class='goals-page-body'>
                <div v-show='!loading' v-bind:style="{'flex-direction': layout, 'flex-wrap': wrap, 'justify-content': justifyContent}" class='goals-container'>
                    <transition name='custom-classes-transition' mode='out-in' enter-active-class='animated slideInLeft' leave-active-class='animated slideOutLeft'>
                        <div class='no-goals-container' v-show='noGoals && !loading'>
                            <p>
                                You have no active financial goals!
                                <br>
                                Create a new financial goal by clicking the plus icon located at the bottom right.
                            </p>
                        </div>
                    </transition>
                    <Goal v-for='(goal, index) in goals'
                        v-bind:index='index'
                        v-bind:key='goal'
                        v-bind:goal='goal'
                        @deleteGoal='deleteGoal'>
                    </Goal>
                </div>
                <div class='utility-button-container'>
                    <button v-show='!loading' v-on:click='changeLayout()' class='utility-button change-layout-button'>
                        <i class="fas fa-th"></i>
                    </button>
                    <button v-show='!loading' v-on:click='addGoal()' class='utility-button round'>
                        <i class='fas fa-plus-circle'></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    const goalTemplate = `
        <transition name='custom-classes-transition' mode='out-in' enter-active-class='animated slideInRight' leave-active-class='animated slideOutRight'>
            <div class='Goal'>
                <div class='header'>
                    <div v-if='!editing' class='goal-name'>
                        {{goal.name}}
                    </div>
                    <input v-else v-model='goal.name' type='text' class='goal-name' placeholder='Enter your goal name'>
                </div>
                <hr>
                <div class='body'>
                    <div class='label'>
                        Description:
                    </div>
                    <div v-if='!editing' class='goal-description'>
                        <p>{{goal.description}}</p>
                    </div>
                    <textarea v-else v-model='goal.description' placeholder='Enter your goal description' class='goal-description'>Goal</textarea>
                    <div class='label'>
                        Target Amount:
                    </div>
                    <div v-if='!editing'>
                        \${{goal.targetAmount}}
                    </div>
                    <input v-else v-model='goal.targetAmount' type='number' step='0.01'>
                    <div class='label'>
                        Amount Saved:
                    </div>
                    <div v-if='!editing'>
                        \${{goal.amountSaved}}
                    </div>
                    <input v-else v-model='goal.amountSaved' type='number' step='0.01'>
                    <div class='progress-bar'>
                        <span v-bind:style="{width: percentage + '%'}"></span>
                    </div>
                </div>
                <hr>
                <div class='footer'>
                    <button v-if='!editing' v-on:click='deleting = true; deleteSelf()' v-bind:disabled="deleting" class='footer-button'>Delete Goal</button>
                    <button v-if='!editing' v-on:click='editing = !editing' class='footer-button'>Edit Goal</button>
                    <button v-if='editing' v-on:click='saving = true; saveGoal()' v-bind:disabled='saving === true' class='footer-button save'>Save Goal</button>
                </div>
            </div>
        </transition>
    `;

    Vue.component('Goals', {
        data: function () {
            return {
                loading: true,
                layout: 'column',
                goals: [],
            }
        },
        computed: {
            noGoals: function () {
                return this.goals.length === 0;
            },
            justifyContent: function () {
                return this.layout === 'row' ? 'center' : 'flex-start';
            },
            wrap: function () {
                return this.layout === 'row' ? 'wrap' : 'nowrap';
            },
        },
        template: goalsTemplate,
        // When this component is created by the vue-router, make a GET request to our Goal API to fetch the currently authenticated user's goals.
        created: function () {
            // Delay fetching goals by one second. I want to give the loader animation a chance to appear for this demo.
            setTimeout(this.fetchUserGoals, 1000);
        },
        methods: {
            fetchUserGoals: function () {
                fetch('/api/Goal/', {
                    method: 'GET'
                })
                .then(response => {
                    if (response.ok === false) {
                        alert(`Error: ${response.status}`);

                        this.loading = false;
                    }
                    else {
                        response.json()
                            .then(goals => {
                                this.loading = false;
                                this.goals   = goals;
                            });
                    }
                });
            },
            addGoal: function () {
                const goal = {
                    name: '',
                    targetAmount: 0,
                    amountSaved: 0,
                    description: '',
                }

                fetch('/api/Goal/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(goal),
                })
                .then(response => {
                    if (response.ok === false) {
                        // There was an error creating the goal, display the error.
                        response.text()
                            .then(error => {
                                alert(`Error: ${error}`);
                            });
                    }
                    else {
                        response.json()
                            .then(goal => {
                                goal.new = true;

                                this.goals.push(goal);
                            });
                    }
                });
            },
            deleteGoal: function (goalComponent) {
                this.deleting = true;

                fetch(`/api/Goal/${goalComponent.goal.id}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok === false) {
                        // There was an error deleting the goal, display the error.
                        response.text()
                            .then(error => {
                                alert(`Error: ${error}`);
                            });
                    }
                    else {
                        // Clicking the delete button on the child goal component causes the component to emit a 'deleteGoal' 
                        // event containing the goal's component which this parent component listens for.
                        this.goals.splice(goalComponent.$el.getAttribute('index'), 1);
                    }
                })
            },
            changeLayout: function () {
                this.layout = this.layout === 'row' ? 'column' : 'row';
            },
        },
        components: {
            'Goal': {
                data: function () {
                    return {
                        editing: false,
                        saving: false,
                        deleting: false,
                        // Make a copy of the goal object representing the goal model.
                        // This is used to create a JSON patch document for a PATCH request.
                        cachedGoal: Object.assign({}, this.goal),
                    }
                },
                props: ['goal'],
                computed: {
                    percentage: function () {
                        const percentage = (this.goal.amountSaved / this.goal.targetAmount) * 100;

                        // Clamp percentage from 0 to 100 for the progress bar width.
                        return percentage > 100 ? 100 : (percentage < 0 ? 0 : percentage);
                    },
                },
                template: goalTemplate,
                mounted: function () {
                    const container = this.$el.closest('.goals-page-body');

                    if (container) {
                        // Scroll the container to the bottom to view the newly added goal.
                        container.scrollTop = container.scrollHeight;
                    }

                    if (this.goal.new === true) {
                        // A new goal is being created, enable edit mode.
                        this.editing = true;
                    }
                },
                methods: {
                    saveGoal: function () {
                        const patch = [];

                        // Disable the save button on this component.
                        this.saving = true;

                        // Goal is no longer new. Prevents edit mode from being enabled by default.
                        delete this.goal.new;

                        // Loop over all properties of the goal object and compare the values of each
                        // property to the values of the cached goal we originally received from the server.
                        // If the values between the goal object and the cached goal differs, generate a
                        // patch operation to have the API update the columns that need to be updated.
                        for (var property in this.goal) {
                            if (this.cachedGoal[property] !== this.goal[property]) {
                                patch.push({
                                    'op': 'replace',
                                    'path': `/${property}`,
                                    'value': this.goal[property],
                                });
                            }
                        }

                        // Only make a request to the server if there are actually changes.
                        if (patch.length !== 0) {
                            fetch(`/api/Goal/${this.goal.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(patch),
                            })
                            .then(response => {
                                if (response.ok === false) {
                                    // There was an error updating the goal, display the error.
                                    response.text()
                                        .then(error => {
                                            alert(`Error: ${error}`);

                                            this.editing = false;
                                            this.saving  = false;
                                        });
                                }
                                else {
                                    response.json()
                                        .then(goal => {
                                            // Update the cached goal for the next save operation if it happens.
                                            this.cachedGoal = Object.assign({}, goal);
                                            this.editing    = false;
                                            this.saving     = false;
                                        });
                                }
                            });
                        }
                        else {
                            this.editing = false;
                            this.saving  = false;
                        }

                    },
                    deleteSelf: function () {
                        // Emit an event to the parent Goal component to let it know that we want to delete this goal.
                        this.$emit('deleteGoal', this);
                    },
                }
            }
        }
    });
})();