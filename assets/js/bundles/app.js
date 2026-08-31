
/* ===== assets/js/app.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/app.js
 Version : 3.0.0
==================================================*/

const App = {

    init() {

console.log("App.init() called");

        initializeUsers();

        this.bindGlobalSearch();

        this.loadUser();

        this.loadSession();

        /*==============================
          Login Check
        ==============================*/

       if (typeof isLoggedIn === "function" && isLoggedIn()) {

    Layout.show();

    Dashboard.render();

    if (typeof Menu !== "undefined") {

        Menu.apply();

    }

    if (typeof Session !== "undefined") {

        Session.start();

    }

}

        else if (

            typeof Session !== "undefined" &&

            Session.autoLogin()

        ) {

            if (typeof Menu !== "undefined") {

                Menu.apply();

            }

        }

        else {

            Layout.hide();

Login.render();

        }

        console.log(

            "SVMS Professional Initialized"

        );

    },

    /*==============================
      Global Search
    ==============================*/

    bindGlobalSearch() {

        const searchBox =

            document.getElementById(

                "globalSearch"

            );

        if (!searchBox) return;

        searchBox.addEventListener(

            "keyup",

            function(e){

                if(e.key==="Enter"){

                    GlobalSearch.search(

                        this.value

                    );

                }

            }

        );

    },

    /*==============================
      Current User
    ==============================*/

    loadUser() {

        const el =

            document.getElementById(

                "currentUser"

            );

        if (!el) return;

        if (

            typeof currentUser ===

            "function"

        ) {

            const user =

                currentUser();

            if (user) {

                el.textContent =

                    user.name;

            }

        }

    },

    /*==============================
      Session
    ==============================*/

    loadSession() {

        const el =

            document.getElementById(

                "currentSession"

            );

        if (!el) return;

        el.textContent =

            CONFIG.CURRENT_SESSION || "";

    },

    /*==============================
      Navigation
    ==============================*/

    navigate(module){

        openSecureModule(module);

    },

    /*==============================
      Refresh Dashboard
    ==============================*/

    refreshDashboard(){

        Dashboard.render();

    }

};

/*==========================================
 Auto Initialize
==========================================*/

/* v35.11: legacy App DOMContentLoaded auto-start removed. Admin-only runtime owns cold start. */
