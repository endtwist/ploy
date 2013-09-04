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
    'model/pieces/commander'
],
function( Base, Shield, LightProbe, MediumProbe, HeavyProbe1, HeavyProbe2, LightLance, MediumLance, HeavyLance, Commander ) {
    return {
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
} );