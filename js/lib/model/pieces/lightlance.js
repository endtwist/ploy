define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var LightLance = Piece.extend( {
        defaults: {
            name: 'Light Lance',
            flags: 3,
            range: 3,

            flagAngles: [45, 180, 315]
        }
    } );

    _.defaults(LightLance.prototype.defaults, Piece.prototype.defaults);

    return LightLance;

} );