define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var HeavyLance = Piece.extend( {
        defaults: {
            name: 'Heavy Lance',
            flags: 3,
            range: 3,

            flagAngles: [0, 45, 315]
        }
    } );

    _.defaults(HeavyLance.prototype.defaults, Piece.prototype.defaults);

    return HeavyLance;

} );