define( [
    'backbone',
    'underscore',
    'model/game',
    'vent/board'
], function( Backbone, _, Game, BoardVent ) {

    var Board = Backbone.View.extend( {
        tagName: 'ul',
        id: 'board',

        initialize: function() {
            this.listenTo( BoardVent, 'add', this.addPiece );
            this.listenTo( BoardVent, 'remove', this.removePiece );
            this.listenTo( BoardVent, 'move', this.movePiece );
        },

        render: function( pieces ) {
            for( var col = 0; col < 9; col++ ) {
                for( var row = 0; row < 9; row++ ) {
                    this.$el.append( '<li data-row="' + row + '" data-col="' + col + '" />' );
                }
            }
        },

        addPiece: function( position, type ) {
            this.$el.find( '[data-row="' + position[ 0 ] + '"][data-col="' + position[ 1 ] + '"]' ).html( type );
        },

        removePiece: function( position, type ) {
            this.$el.find( '[data-row="' + position[ 0 ] + '"][data-col="' + position[ 1 ] + '"]' ).html( '' );
        },

        movePiece: function( from, to, type ) {
            this.removePiece( from, type );
            this.addPiece( to, type );
        }
    } );

    return Board;

} );