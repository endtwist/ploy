define( [
    'jquery',
    'backbone',
    'underscore',
    'model/game',
    'vent/board'
], function( $, Backbone, _, Game, BoardVent ) {

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
                    var square = $( '<li data-row="' + row + '" data-col="' + ( 8 - col ) + '" />' );
                    square.on( 'click', _.bind( this.activateSquare, this ) );

                    this.$el.append( square );
                }
            }
        },

        addPiece: function( position, piece ) {
            var square = this.$el.find( '[data-row="' + position[ 0 ] + '"][data-col="' + position[ 1 ] + '"]' );

            square.append( '<span data-id="' + piece.cid + '">' + piece.get( 'name' ) + '</span>' );
        },

        removePiece: function( position, piece ) {
            var square = this.$el.find( '[data-row="' + position[ 0 ] + '"][data-col="' + position[ 1 ] + '"]' );

            square.find( '[data-id="' + piece.cid + '"]' ).remove();
        },

        movePiece: function( from, to, piece ) {
            this.removePiece( from, piece );
            this.addPiece( to, piece );
        },

        activateSquare: function( evt ) {
            var square = $( evt.target );

            console.log( square );

            if( !this.$selectedSquare && square.find( '[data-id]' ).length ) {
                square.addClass( 'active' );
                this.$selectedSquare = square;
            } else if( this.$selectedSquare && square != this.$selectedSquare ) {
                var from = [ this.$selectedSquare.data( 'row' ), this.$selectedSquare.data( 'col' ) ],
                    to = [ square.data( 'row' ), square.data( 'col' ) ];

                this.trigger( 'move', from, to );

                this.$selectedSquare.removeClass( 'active' );
                this.$selectedSquare = null;
            }
        }
    } );

    return Board;

} );