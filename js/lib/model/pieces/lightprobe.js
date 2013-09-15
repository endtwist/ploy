define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var LightProbe = Piece.extend( {
        defaults: {
            name: 'Light Probe',
            flags: 2,
            range: 2,

            flagAngles: [0, 180]
        }
    } );

    _.defaults(LightProbe.prototype.defaults, Piece.prototype.defaults);

    return LightProbe;

} );