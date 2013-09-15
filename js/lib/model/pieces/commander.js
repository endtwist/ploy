define( [ 'backbone', 'underscore', 'model/pieces/base' ], function( Backbone, _, Piece ) {

    var Commander = Piece.extend( {
        defaults: {
            name: 'Commander',
            flags: 4,
            range: 1,

            flagAngles: [0, 90, 180, 270]
        }
    } );

    _.defaults(Commander.prototype.defaults, Piece.prototype.defaults);

    return Commander;

} );