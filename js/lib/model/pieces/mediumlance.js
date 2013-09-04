define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var MediumLance = Piece.extend( {
        defaults: {
            type: 'Medium Lance',
            flags: 3,
            range: 3,

            flagAngles: [0, 90, 180]
        }
    } );

    return MediumLance;

} );