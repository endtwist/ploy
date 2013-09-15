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
        },

        render: function() {
            this.board.render();
            this.$el.append( this.board.$el );

            this.model.start();

            this.$el.appendTo( 'body' );
        },

        move: function( pieceAt, moveTo ) {
            this.model.playMove( 0, this.model.pieceAtPosition( pieceAt ), moveTo );
        },

        end: function() {
            this.$el.remove();
        }
    } );

    return Game;

} );