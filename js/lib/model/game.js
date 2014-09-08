define( [
    'backbone',
    'underscore',
    'collection/players',
    'model/pieces',
    'model/player',
    'vent/board',
    'backbone-relational'
], function( Backbone, _, PlayerCollection, Pieces, Player, BoardVent ) {

    var Game = Backbone.RelationalModel.extend( {
        defaults: {
            turn: null,
            running: true,
            winner: null
        },

        relations: [ {
            type: Backbone.HasMany,
            key: 'players',
            relatedModel: Player,
            collectionType: PlayerCollection,
            reverseRelation: {
                key: 'game'
            }
        } ],

        initialize: function() {
            _.bindAll( this, 'pieceAtPosition' );

            this._dirtyRotation = false;
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

        start: function( pieces, turn ) {
            if( !pieces ) {
                pieces = [ false, false ];
            }

            this.get( 'players' ).add( { side: 'bottom', pieces: pieces[ 0 ] } );
            this.get( 'players' ).add( { side: 'top', pieces: pieces[ 1 ] } );

            if( turn ) {
                this.set( 'turn', turn );
            }
        },

        pieceCaptureEvent: function( player, piece ) {
            console.log( 'Piece captured!', player.get( 'name' ), piece.get( 'name' ) );

            if( piece instanceof Pieces.Commander || player.get( 'pieces' ).length === 1 ) {
                this.set( 'running', false );
                this.set( 'winner',
                          this.currentPlayer() === player ? player : this.opponentPlayer()
                        );
            }
        },

        playMove: function( player, piece, move ) {
            var currentPlayer = this.get( 'players' ).at( player ),
                opponent = this.get( 'players' ).at( player == 0 ? 1 : 0 );

            if( !this.get( 'running' ) ) {
                console.log( 'Game ended!' );
                return false;
            }

            console.log( piece, piece.get( 'player' ) );

            if( this.get( 'turn' ) === player && piece.get( 'player' ) === currentPlayer ) {
                if( this._dirtyRotation ) {
                    console.error( 'Cannot rotate and move in the same turn!' );
                    return false;
                } else if( currentPlayer.movePieceTo( piece, move, this.pieceAtPosition ) ) {
                    var capturedPiece = opponent.getPieceAtPosition( move );

                    if( capturedPiece ) {
                        console.log( 'Player ' + currentPlayer.get( 'name' ) + '\'s ' + piece.get( 'name' ) + ' captures player ' + opponent.get( 'name' ) + '\'s ' + capturedPiece.get( 'name' ) );
                        opponent.capturePiece( capturedPiece );
                    }

                    this.turnPlayed();
                    return true;
                }
            } else {
                console.error( 'It is not ' + this.get( 'players' ).at( player ).get( 'name' ) + '\'s turn!' );
                return false;
            }
        },

        rotatePiece: function( player, piece, rotation, finalize ) {
            var currentPlayer = this.get( 'players' ).at( player );

            if( !this.get( 'running' ) ) {
                console.log( 'Game ended!' );
                return false;
            }

            if( this.get( 'turn' ) === player && piece.get( 'player' ) === currentPlayer ) {
                if( finalize ) {
                    this.turnPlayed();
                } else {
                    currentPlayer.rotatePiece( piece, rotation );
                    this._dirtyRotation = ( rotation !== 0 ? true : false );
                }

                return true;
            } else {
                console.error( 'It is not ' + this.get( 'players' ).at( player ).get( 'name' ) + '\'s turn!' );
                return false;
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
            this._dirtyRotation = false;
            this.set( 'turn', this.get( 'turn' ) == 0 ? 1 : 0 );
        },

        toJSON: function() {
            return {
                pieces: this.get( 'players' ).map( function( player ) {
                        return player.getPieces().toJSON();
                    } ),
                turn: this.get( 'turn' )
            };
        },

        currentPlayer: function() {
            return this.get( 'players' ).at( this.get( 'turn' ) );
        },

        opponentPlayer: function() {
            return this.get( 'players' ).at( this.get( 'turn' ) == 0 ? 1 : 0 );
        }
    } );

    return Game;

} );