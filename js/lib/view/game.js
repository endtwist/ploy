define( [
    'backbone',
    'underscore',
    'model/game',
    'view/board',
    'socket.io'
], function( Backbone, _, GameModel, Board, io ) {

    var Game = Backbone.View.extend( {
        tagName: 'div',

        initialize: function( roomId ) {
            this.model = new GameModel();
            this.board = new Board();

            this.listenTo( this.board, 'move', _.bind( function( pieceAt, moveTo ) {
                if( this.move( this.playerIndex, pieceAt, moveTo ) ) {
                    this.socket.emit( 'move', {
                        player: this.playerId,
                        pieceAt: pieceAt,
                        moveTo: moveTo
                    } );
                }
            }, this ) );

            this.listenTo( this.board, 'rotate', _.bind( function( pieceAt, rotation, finalize ) {
                if( this.rotate( this.playerIndex, pieceAt, rotation, finalize ) ) {
                    this.socket.emit( 'rotate', {
                        player: this.playerId,
                        pieceAt: pieceAt,
                        rotation: rotation,
                        finalize: finalize
                    } );
                }
            }, this ) );
        },

        setRoom: function( id ) {
            this.socket = io.connect( 'http://localhost/' + id );
            this.playerId = localStorage.getItem( id + '-playerId' );
            this.playerIndex = localStorage.getItem( id + '-playerIndex' );

            this.socket.on( 'playerInfo', _.bind( function( data ) {
                this.playerId = data.playerId;
                this.playerIndex = data.playerIndex;
                console.log(this.playerId);
                localStorage.setItem( id + '-playerId', this.playerId );
                localStorage.setItem( id + '-playerIndex', this.playerIndex );
            }, this ) );

            this.socket.on( 'move', _.bind( function( data ) {
                console.log('move', data);
                this.move( data.player, data.pieceAt, data.moveTo );
            }, this ) );

            this.socket.on( 'rotate', _.bind( function( data ) {
                console.log('rotate', data);
                this.rotate( data.player, data.pieceAt, data.rotation, data.finalize );
            }, this ) );

            this.socket.on( 'state', _.bind( function( data ) {
                _.defer( _.bind( function() {
                    this.model.start( data.pieces, data.turn );
                }, this ) );
            }, this ) );

            return this;
        },

        render: function() {
            this.board.render();
            this.$el.append( this.board.$el );

            this.$el.appendTo( 'body' );
        },

        move: function( player, pieceAt, moveTo ) {
            var piece = this.model.pieceAtPosition( pieceAt );

            return this.model.playMove( player, piece, moveTo );
        },

        rotate: function( player, pieceAt, rotation, finalize ) {
            var piece = this.model.pieceAtPosition( pieceAt );

            return this.model.rotatePiece( player, piece, rotation, finalize );
        },

        end: function() {
            this.$el.remove();
        }
    } );

    return Game;

} );