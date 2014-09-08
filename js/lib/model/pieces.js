define( [
    'model/pieces/base',
    'model/pieces/shield',
    'model/pieces/lightprobe',
    'model/pieces/mediumprobe',
    'model/pieces/heavyprobe1',
    'model/pieces/heavyprobe2',
    'model/pieces/lightlance',
    'model/pieces/mediumlance',
    'model/pieces/heavylance',
    'model/pieces/commander',
    'backbone',
    'backbone-relational'
],
function( Base, Shield, LightProbe, MediumProbe, HeavyProbe1, HeavyProbe2, LightLance, MediumLance, HeavyLance, Commander, Backbone ) {
    var Pieces = {
        Base: Base,
        Shield: Shield,
        LightProbe: LightProbe,
        MediumProbe: MediumProbe,
        HeavyProbe1: HeavyProbe1,
        HeavyProbe2: HeavyProbe2,
        LightLance: LightLance,
        MediumLance: MediumLance,
        HeavyLance: HeavyLance,
        Commander: Commander
    };

    // haaaack.
    if( Backbone.Relational.store._modelScopes.indexOf( Pieces ) === -1 ) {
        Backbone.Relational.store.addModelScope( Pieces );
    }

    return Pieces;
} );