require.config( {
    baseUrl: '/js/lib',

    paths: {
        'backbone': '../vendor/backbone-min',
        'backbone-relational': '../vendor/backbone-relational',
        'underscore': '../vendor/underscore-min',
        'raphael': '../vendor/raphael-min',
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
        'socket.io': '/socket.io/socket.io.js'
    },

    shim: {
        'backbone': {
            deps: [ 'underscore', 'jquery' ],
            exports: 'Backbone'
        },

        'underscore': {
            exports: '_'
        },

        'backbone-relational': {
            deps: [ 'backbone' ]
        }
    }
} );

requirejs( [
    'jquery',
    'view/game'
], function( $, Game ) {

    var PloyRouter = Backbone.Router.extend( {
        routes: {
            '': 'home',
            'play/:roomId': 'play'
        },

        home: function() {
            if( this.currentGame )
                this.currentGame.end();

            $( '#play' ).off( 'click' ).show().on( 'click', _.bind( function() {
                this.navigate( '/play/' + Math.floor( Math.random() * 1000 ), { trigger: true } );
                return false;
            }, this ) );
        },

        play: function( roomId ) {
            $( '#play' ).hide();

            this.currentGame = new Game();
            this.currentGame.setRoom( roomId ).render();
        }
    } );

    $(function() {
        new PloyRouter();
        Backbone.history.start( { pushState: true } );
    });

} );