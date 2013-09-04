define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var LightProbe = Piece.extend( {
        defaults: {
            type: 'Light Probe',
            flags: 2,
            range: 2,

            flagAngles: [0, 180]
        }
    } );

    return LightProbe;

} );