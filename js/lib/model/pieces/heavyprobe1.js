define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var HeavyProbe1 = Piece.extend( {
        defaults: {
            type: 'Heavy Probe',
            flags: 2,
            range: 2,

            flagAngles: [0, 45]
        }
    } );

    return HeavyProbe1;

} );