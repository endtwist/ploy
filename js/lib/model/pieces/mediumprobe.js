define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var MediumProbe = Piece.extend( {
        defaults: {
            name: 'Medium Probe',
            flags: 2,
            range: 2,

            flagAngles: [45, 315]
        }
    } );

    _.defaults(MediumProbe.prototype.defaults, Piece.prototype.defaults);

    return MediumProbe;

} );