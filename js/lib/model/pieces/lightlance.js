define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var LightLance = Piece.extend( {
        defaults: {
            type: 'Light Lance',
            flags: 3,
            range: 3,

            flagAngles: [45, 180, 315]
        }
    } );

    return LightLance;

} );