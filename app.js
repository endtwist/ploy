var express = require( 'express' ),
    requirejs = require( 'requirejs' ),
    bodyParser = require( 'body-parser' ),
    app = express(),
    server = require( 'http' ).Server( app ),
    io = require( 'socket.io' )( server );

requirejs.config( {
    baseUrl: 'js/lib',
    nodeRequire: require
} );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( express.static( __dirname ) );

var games = {};

app.get( '/', function( req, res ) {
    res.sendFile( 'index.html', { root: __dirname } );
} );

requirejs( [ 'model/game' ], function( Game ) {
    app.get( '/play/:roomId', function( req, res ) {
        res.sendFile( 'index.html', { root: __dirname } );

        var roomId = req.param( 'roomId' );
        if( !games[ roomId ] ) {
            var room = games[ roomId ] = {
                socket: io.of( req.param( 'roomId' ) ),
                game: new Game(),
                players: [],
                assignedPlayers: []
            };

            room.game.start();

            room.players = room.game.get( 'players' ).map( function() {
                return Math.floor( Math.random() * 10000000000 ).toString();
            } );

            room.socket.on( 'connection', function( socket ) {
                socket.emit( 'state', room.game );

                if( room.assignedPlayers.length < room.players.length ) {
                    var playerId = room.players.slice( room.assignedPlayers.length, room.assignedPlayers.length + 1 )[ 0 ];
                    room.assignedPlayers.push( playerId );

                    socket.emit( 'playerInfo', {
                        playerId: playerId,
                        playerIndex: room.assignedPlayers.length - 1
                    } );
                }

                socket.on( 'move', function( data ) {
                    console.log( 'move', data );

                    var piece = room.game.pieceAtPosition( data.pieceAt );

                    data.player = room.assignedPlayers.indexOf( data.player );

                    if( room.game.playMove( data.player, piece, data.moveTo ) ) {
                        socket.broadcast.emit( 'move', data );
                    } else {
                        socket.emit( 'invalidMove', data );
                    }
                } );

                socket.on( 'rotate', function( data ) {
                    console.log( 'rotate', data );

                    var piece = room.game.pieceAtPosition( data.pieceAt );

                    data.player = room.assignedPlayers.indexOf( data.player );

                    if( room.game.rotatePiece( data.player, piece, data.rotation, data.finalize ) ) {
                        socket.broadcast.emit( 'rotate', data );
                    } else {
                        socket.emit( 'invalidRotation', data );
                    }
                } );
            } );
        }
    } );
} );

server.listen( 3000 );
