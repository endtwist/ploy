define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var HeavyProbe2 = Piece.extend( {
        defaults: {
            name: 'Heavy Probe',
            flags: 2,
            range: 2,

            flagAngles: [0, 315]
        }
    } );

    _.defaults(HeavyProbe2.prototype.defaults, Piece.prototype.defaults);

    return HeavyProbe2;

} );