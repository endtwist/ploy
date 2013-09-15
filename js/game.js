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
            '': 'home',
            'play': 'play'
        },

        home: function() {
            if( this.currentGame )
                this.currentGame.end();

            $( '#play' ).off( 'click' ).show().on( 'click', _.bind( function() {
                this.navigate( '/play', { trigger: true } );
                return false;
            }, this ) );
        },

        play: function() {
            $( '#play' ).hide();

            this.currentGame = new Game();
            this.currentGame.render();

            setTimeout( _.bind( function() {
                this.currentGame.move( [3, 2], [3, 3] );
            }, this ), 2000 );
        }
    } );

    $(function() {
        new PloyRouter();
        Backbone.history.start( { pushState: true } );
    });

} );