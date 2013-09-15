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
        },

        render: function() {
            this.board.render();
            this.$el.append( this.board.$el );

            this.model.start();

            this.$el.appendTo( 'body' );
        },

        move: function( pieceAt, moveTo ) {
            var piece = this.model.pieceAtPosition( pieceAt );

            this.model.playMove( this.model.get( 'players' ).indexOf( this.model.currentPlayer() ), piece, moveTo );
        },

        end: function() {
            this.$el.remove();
        }
    } );

    return Game;

} );