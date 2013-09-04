define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var MediumProbe = Piece.extend( {
        defaults: {
            type: 'Medium Probe',
            flags: 2,
            range: 2,

            flagAngles: [45, 315]
        }
    } );

    return MediumProbe;

} );