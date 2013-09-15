define( [ 'backbone', 'underscore', 'model/pieces' ], function( Backbone, _, Pieces ) {

    var PiecesCollection = Backbone.Collection.extend( {
        model: Pieces.Base
    } );

    return PiecesCollection;
    
} );