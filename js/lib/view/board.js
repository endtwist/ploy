define( [
    'backbone',
    'underscore',
    'model/game'
], function( Backbone, _, Game ) {

    var Board = Backbone.View.extend( {
        tagName: 'ul',

        render: function() {
            for( var row = 0; row < 9; row++ ) {
                for( var col = 0; col < 9; col++ ) {
                    this.$el.append( '<li/>' );
                }
            }
        }
    } );

    return Board;
    
} );