define( [ 'backbone', 'underscore', 'backbone-relational' ], function( Backbone, _ ) {

    var Piece = Backbone.RelationalModel.extend( {
        defaults: {
            name: 'Shield',
            flags: 1,
            range: 1,

            /**      0°
                    *  *
                 *   ||   *
                *    ||    *  90°
                *          *
                 *        * 
                    *  *
             **/
            flagAngles: [ 0 ],
            facing: 0,

            position: []
        },

        subModelTypes: {
            'shield': 'Shield',
            'lightprobe': 'LightProbe',
            'mediumprobe': 'MediumProbe',
            'heavyprobe1': 'HeavyProbe1',
            'heavyprobe2': 'HeavyProbe2',
            'lightlance': 'LightLance',
            'mediumlance': 'MediumLance',
            'heavylance': 'HeavyLance',
            'commander': 'Commander'
        },

        moveTo: function( position, test ) {
            var curPos = this.get( 'position' ),
                angle = ( Math.atan2( position[0] - curPos[0], position[1] - curPos[1] ) * ( 180 / Math.PI ) + 360 ) % 360,
                dist = Math.floor( Math.sqrt( Math.pow( position[0] - curPos[0], 2 ) + Math.pow( position[1] - curPos[1], 2 ) ) );

            if( angle % 45 !== 0 ) {
                console.error( 'Movement not a multiple of 45!', angle );
                return false;
            }

            var matchesAngle = false,
                angles = this.get( 'flagAngles' ),
                facing = this.get( 'facing' );
            for( var i = 0; i < angles.length; i++ ) {
                if( ( angles[ i ] + facing ) % 360 == angle ) {
                    matchesAngle = true;
                    break;
                }
            }

            if( !matchesAngle ) {
                console.error( 'Can\'t move in that direction. Currently facing ' + facing + ' with vectors pointing at ' + angles );
                return false;
            }

            if( dist > this.get( 'range' ) ) {
                console.error( 'Movement greater than range!' );
                return false;
            }

            var stepX = 1, stepY = 1; // 0 -> 90
            if( angle >= 90 && angle < 180 ) {
                stepY = -1;
            } else if( angle >= 180 && angle < 270 ) {
                stepX = -1;
                stepY = -1;
            } else if( angle >= 270 && angle < 360 ) {
                stepX = -1;
            }

            var maxStep = Math.max( Math.abs( position[0] - curPos[0] ), Math.abs( position[1] - curPos[1] ) ),
                posX = curPos[0],
                posY = curPos[1],
                steps = [];
            for( var i = 0; i <= maxStep - 1; i++ ) {
                if( posX !== position[0] )
                    posX += stepX;

                if( posY !== position[1] )
                    posY += stepY;

                steps.push( [ posX, posY ] );
                if( typeof test === 'function' ) {
                    var result = test( [ posX, posY ] );

                    console.log('test', result)

                    if( result && ( i < maxStep - 1 || result.get( 'player' ) === this.get( 'player' ) ) ) {
                        console.error( 'Piece blocking the way!' );
                        return false;
                    }
                }
            }

            console.log(steps);

            this.set( 'position', position );
            return true;
        }
    } );

    return Piece;

} );