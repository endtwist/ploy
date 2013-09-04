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

requirejs( [ 'backbone', 'underscore', 'jquery', 'model/pieces', 'model/player', 'backbone-relational' ], function( Backbone, _, $, Pieces, Player ) {

var PlayerCollection = Backbone.Collection.extend( {
    model: Player
} );

var Game = Backbone.RelationalModel.extend( {
    defaults: {
        turn: null,
        running: true,
        winner: null
    },

    relations: [{
        type: Backbone.HasMany,
        key: 'players',
        relatedModel: Player,
        collectionType: PlayerCollection,
        reverseRelation: {
            key: 'game'
        }
    }],

    initialize: function() {
        _.bindAll( this, 'pieceAtPosition' );

        this.get( 'players' ).add( { side: 'bottom' } );
        this.get( 'players' ).add( { side: 'top' } );

        this.set( 'turn', 0 );

        this.get( 'players' ).on( 'remove:pieces', _.bind( function( piece, pieces ) {
            this.pieceCaptureEvent( pieces.player, piece );
        }, this ) );

        this.on( 'change:winner', _.bind( function( game, player ) {
            if( player ) {
                console.log( 'Game over! Player ' + player.get( 'name' ) + ' wins!' );
            }
        }, this ) );
    },

    pieceCaptureEvent: function( player, piece ) {
        console.log( 'Piece captured!', player.get( 'name' ), piece.get( 'type' ) );

        if( piece instanceof Pieces.Commander || player.get( 'pieces' ).length === 1 ) {
            this.set( 'running', false );
            this.set( 'winner',
                      this.currentPlayer() === player ? player : this.opponentPlayer()
                    );
        }
    },

    playMove: function( player, piece, move ) {
        var currentPlayer = this.currentPlayer(),
            opponent = this.opponentPlayer();

        if( !this.get( 'running' ) ) {
            console.log( 'Game ended!' );
            return false;
        }

        if( player === this.get( 'turn' ) ) {
            if( currentPlayer.movePieceTo( piece, move, this.pieceAtPosition ) ) {
                var capturedPiece = opponent.getPieceAtPosition( move );

                if( capturedPiece ) {
                    console.log( 'Player ' + currentPlayer.get( 'name' ) + ' captures player ' + opponent.get( 'name' ) + '\'s ' + capturedPiece.get( 'type' ) );
                    opponent.capturePiece( capturedPiece );
                }

                this.turnPlayed();
            }
        } else {
            console.error( 'It is not ' + this.get( 'players' ).at( player ).get( 'name' ) + '\'s turn!' );
        }
    },

    pieceAtPosition: function( position ) {
        var players = this.get( 'players' ),
            piece;

        for( var i = 0; i < players.length; i++ ) {
            piece = players.at( i ).getPieceAtPosition( position );
            if( piece ) return piece;
        }

        return false;
    },

    turnPlayed: function() {
        this.set( 'turn', this.get( 'turn' ) == 0 ? 1 : 0 );
    },

    currentPlayer: function() {
        return this.get( 'players' ).at( this.get( 'turn' ) );
    },

    opponentPlayer: function() {
        return this.get( 'players' ).at( this.get( 'turn' ) == 0 ? 1 : 0 );
    }
} );

$(function() {
    window.G = new Game();
    G.playMove(0, G.currentPlayer().get('pieces').at(0), [3,3]);
});

} );