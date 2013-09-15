define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var HeavyProbe1 = Piece.extend( {
        defaults: {
            name: 'Heavy Probe',
            flags: 2,
            range: 2,

            flagAngles: [0, 45]
        }
    } );

    _.defaults(HeavyProbe1.prototype.defaults, Piece.prototype.defaults);

    return HeavyProbe1;

} );