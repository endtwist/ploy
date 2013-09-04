define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var HeavyProbe2 = Piece.extend( {
        defaults: {
            type: 'Heavy Probe',
            flags: 2,
            range: 2,

            flagAngles: [0, 315]
        }
    } );

    return HeavyProbe2;

} );