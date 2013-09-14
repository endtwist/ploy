define( [ 'backbone', 'underscore', 'model/player' ], function( Backbone, _, Player ) {

    var PlayerCollection = Backbone.Collection.extend( {
        model: Player
    } );

    return PlayerCollection;

} );