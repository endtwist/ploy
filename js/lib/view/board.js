define( [
    'jquery',
    'backbone',
    'underscore',
    'raphael',
    'model/game',
    'vent/board'
], function( $, Backbone, _, Raphael, Game, BoardVent ) {

    var Board = Backbone.View.extend( {
        tagName: 'ul',
        id: 'board',

        initialize: function() {
            this.listenTo( BoardVent, 'add', this.drawPiece );
            this.listenTo( BoardVent, 'remove', this.removePiece );
            this.listenTo( BoardVent, 'move', this.movePiece );
            this.listenTo( BoardVent, 'rotate', this.drawRotatedPiece );

            $( 'body' ).on( 'keyup', _.bind( this.rotatePiece, this ) );
        },

        render: function( pieces ) {
            for( var col = 8; col >= 0; col-- ) {
                for( var row = 0; row <= 8; row++ ) {
                    var square = $( '<li data-row="' + row + '" data-col="' + col + '" />' );
                    square.on( 'click', _.bind( this.activateSquare, this ) );

                    this.$el.append( square );
                }
            }
        },

        drawPiece: function( position, piece ) {
            var square = this.$el.find( '[data-row="' + position[ 0 ] + '"][data-col="' + position[ 1 ] + '"]' ),
                pieceEl = square.find( '[data-id="' + piece.cid + '"]' );

            if( pieceEl.length ) {
                pieceEl.remove();
            }

            pieceEl = $( '<span data-id="' + piece.cid + '">' + /*piece.get( 'name' )*/'' + '</span>' );
            square.append( pieceEl );

            var pieceDims = { w: square.width(), h: square.height() },
                pieceOrigin = pieceDims.w / 2,
                pieceRadius = pieceDims.w * 0.4,
                pieceRender = Raphael( pieceEl[0], '100%', '100%' );

            var circle = pieceRender.circle( pieceOrigin, pieceOrigin, pieceRadius );
            circle.attr( 'fill', '#f00' );

            _.each( piece.get( 'flagAngles' ), function( angle ) {
                var facing = ( angle - 90 ) + piece.get( 'facing' ),
                    radians = facing * ( Math.PI / 180 ),
                    x = pieceOrigin + ( pieceRadius * Math.cos( radians ) ),
                    y = pieceOrigin + ( pieceRadius * Math.sin( radians ) ),
                    line = pieceRender.path( 'M' + x + ',' + y + 'L' + pieceOrigin + ',' + pieceOrigin );
                line.attr( 'stroke', '#000' );
            } );
        },

        drawRotatedPiece: function( position, rotation, piece ) {
            this.drawPiece( position, piece );
        },

        removePiece: function( position, piece ) {
            var square = this.$el.find( '[data-row="' + position[ 0 ] + '"][data-col="' + position[ 1 ] + '"]' );

            square.find( '[data-id="' + piece.cid + '"]' ).remove();
        },

        movePiece: function( from, to, piece ) {
            this.removePiece( from, piece );
            this.drawPiece( to, piece );
        },

        rotatePiece: function( evt ) {
            console.log(evt);
            if( !this.$selectedSquare )
                return false;

            // 37 == left, 39 == right
            if( evt.which === 37 || evt.which === 39 ) {
                this._pieceRotation += ( evt.which === 39 ? 1 : -1 );

                var position = [ this.$selectedSquare.data( 'row' ), this.$selectedSquare.data( 'col' ) ];
                this.trigger( 'rotate', position, ( evt.which === 39 ? 1 : -1 ), false /* finalize */ );

                console.log( 'Selected piece rotated', this._pieceRotation );
            } else if( evt.which === 13 && this._pieceRotation !== 0 ) {
                this.finalizePieceRotation();
            } else if( evt.which === 27 ) {
                this.cancelPieceRotation();
            }
        },

        finalizePieceRotation: function() {
            var position = [ this.$selectedSquare.data( 'row' ), this.$selectedSquare.data( 'col' ) ];

            this.trigger( 'rotate', position, 0, true /* finalize */ );

            this.$selectedSquare.removeClass( 'active' );
            this.$selectedSquare = null;
        },

        cancelPieceRotation: function() {
            var position = [ this.$selectedSquare.data( 'row' ), this.$selectedSquare.data( 'col' ) ];

            this.trigger( 'rotate', position, -1 * this._pieceRotation, false /* finalize */ );
            this._pieceRotation = 0;
        },

        activateSquare: function( evt ) {
            var square = $( evt.target );

            console.log( square );

            if( !this.$selectedSquare && square.find( '[data-id]' ).length ) {
                square.addClass( 'active' );
                this.$selectedSquare = square;
                this._pieceRotation = 0;
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