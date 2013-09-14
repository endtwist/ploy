require.config( {
    baseUrl: 'js/lib',

    paths: {
        'backbone': '../vendor/backbone-min',
        'backbone-relational': '../vendor/backbone-relational',
        'underscore': '../vendor/underscore-min',
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min'
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
            '': 'init',
            'play': 'play'
        },

        init: function() {
            $( 'a' ).off().on( 'click', _.bind( function() {
                this.navigate( '/play', { trigger: true } );
                return false;
            }, this ) );
        },

        play: function() {
            this.currentGame = new Game();
            this.currentGame.render();

            this.currentGame.move( [3, 2], [3, 3] );
        }
    } );

    $(function() {
        // var game = new Game();
        // window.G = game;

        // game.render();
        // game.move( [3, 2], [3, 3] );
        // G.playMove(0, G.currentPlayer().get('pieces').at(0), [3,3]);

        new PloyRouter();
        Backbone.history.start( { pushState: true } );
    });

} );