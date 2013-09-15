define( [
    'backbone',
    'underscore',
    'model/pieces',
    'collection/pieces',
    'vent/board',
    'backbone-relational'
], function( Backbone, _, Pieces, PiecesCollection, BoardVent ) {

    var Player = Backbone.RelationalModel.extend( {
        defaults: {
            name: '',
            moves: []
        },

        relations: [{
            type: Backbone.HasMany,
            key: 'pieces',
            relatedModel: Pieces.Base,
            collectionType: PiecesCollection,
            reverseRelation: {
                key: 'player'
            }
        }],

        initialize: function( options ) {
            this.set( 'name', options.name || 'Random Player ' + Math.floor( Math.random() * 10000 ) );

            // Depending on the side of the board, the pieces need to start facing a either 0° or 180°.
            var piecesStartFacing = 0,
                piecePositions = [
                    [3, 2], [4, 2], [5, 2],
                    [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
                    [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]
                ];

            if( 'side' in options && options.side === 'top' ) {
                piecesStartFacing = 180;
                piecePositions = [
                    [5, 6], [4, 6], [3, 6],
                    [6, 7], [5, 7], [4, 7], [3, 7], [2, 7],
                    [7, 8], [6, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8]
                ];
            }

            this.listenTo( this.get( 'pieces' ), 'add', function( piece ) {
                BoardVent.trigger( 'add', piece.get( 'position' ), piece.get( 'type' ) );
            } );

            this.listenTo( this.get( 'pieces' ), 'remove', function( piece ) {
                BoardVent.trigger( 'remove', piece.get( 'position' ), piece.get( 'type' ) );
            } );

            this.get( 'pieces' ).add( [
                new Pieces.Shield( { position: piecePositions[ 0 ], facing: piecesStartFacing } ),
                new Pieces.Shield( { position: piecePositions[ 1 ], facing: piecesStartFacing } ),
                new Pieces.Shield( { position: piecePositions[ 2 ], facing: piecesStartFacing } ),

                new Pieces.HeavyProbe1( { position: piecePositions[ 3 ], facing: piecesStartFacing } ),
                new Pieces.MediumProbe( { position: piecePositions[ 4 ], facing: piecesStartFacing } ),
                new Pieces.LightProbe(  { position: piecePositions[ 5 ], facing: piecesStartFacing } ),
                new Pieces.MediumProbe( { position: piecePositions[ 6 ], facing: piecesStartFacing } ),
                new Pieces.HeavyProbe2( { position: piecePositions[ 7 ], facing: piecesStartFacing } ),

                new Pieces.MediumLance( { position: piecePositions[ 8 ],  facing: piecesStartFacing } ),
                new Pieces.LightLance(  { position: piecePositions[ 9 ],  facing: piecesStartFacing } ),
                new Pieces.HeavyLance(  { position: piecePositions[ 10 ], facing: piecesStartFacing } ),
                new Pieces.Commander(   { position: piecePositions[ 11 ], facing: piecesStartFacing } ),
                new Pieces.HeavyLance(  { position: piecePositions[ 12 ], facing: piecesStartFacing } ),
                new Pieces.LightLance(  { position: piecePositions[ 13 ], facing: piecesStartFacing } ),
                new Pieces.MediumLance( { position: piecePositions[ 14 ], facing: piecesStartFacing } )
            ] );
        },

        movePieceTo: function( piece, newPosition, test ) {
            var piece = this.get( 'pieces' ).get( piece ),
                oldPosition = piece.get( 'position' ),
                moveMade = piece.moveTo( newPosition, test );

            if( moveMade )
                BoardVent.trigger( 'move', oldPosition, newPosition, piece.get( 'type' ) );

            return moveMade;
        },

        getPieceAtPosition: function( position ) {
            var pieces = this.get( 'pieces' ),
                pieceAtPos;

            pieceAtPos = this.get( 'pieces' ).filter( function( piece ) {
                var pos = piece.get( 'position' );
                return pos[ 0 ] === position[ 0 ] && pos[ 1 ] === position[ 1 ];
            } );

            if( pieceAtPos.length ) {
                return pieceAtPos[ 0 ];
            }

            return false;
        },

        capturePiece: function( piece ) {
            if( !piece ) return false;

            return this.get( 'pieces' ).remove( piece );
        }
    } );

    return Player;

} );