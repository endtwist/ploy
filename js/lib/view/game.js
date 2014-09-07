define( [
    'backbone',
    'underscore',
    'model/game',
    'view/board'
], function( Backbone, _, GameModel, Board ) {

    var Game = Backbone.View.extend( {
        tagName: 'div',

        initialize: function() {
            this.model = new GameModel();
            this.board = new Board();

            this.listenTo( this.board, 'move', this.move );
            this.listenTo( this.board, 'rotate', this.rotate );
        },

        render: function() {
            this.board.render();
            this.$el.append( this.board.$el );

            _.defer( _.bind( this.model.start, this.model ) );

            this.$el.appendTo( 'body' );
        },

        move: function( pieceAt, moveTo ) {
            var piece = this.model.pieceAtPosition( pieceAt );

            this.model.playMove( this.model.get( 'players' ).indexOf( this.model.currentPlayer() ), piece, moveTo );
        },

        rotate: function( pieceAt, rotation, finalize ) {
            var piece = this.model.pieceAtPosition( pieceAt );

            this.model.rotatePiece( this.model.get( 'players' ).indexOf( this.model.currentPlayer() ), piece, rotation, finalize );
        },

        end: function() {
            this.$el.remove();
        }
    } );

    return Game;

} );