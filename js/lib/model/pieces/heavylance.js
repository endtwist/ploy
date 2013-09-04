define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var HeavyLance = Piece.extend( {
        defaults: {
            type: 'Heavy Lance',
            flags: 3,
            range: 3,

            flagAngles: [0, 45, 315]
        }
    } );

    return HeavyLance;

} );