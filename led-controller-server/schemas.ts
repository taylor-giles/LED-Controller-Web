import * as mongoose from 'mongoose';

enum DisplayType{
    COLOR = "Color",
    CYCLE = "Cycle",
    COLOR_STROBE = "Strobe",
    GRADIENT = "Gradient",
    WAVE = "Gradient Wave",
}

interface IGradient{
    name: string,
    colors: string[]
}

interface IDisplay {
    type: DisplayType,
    brightness: number,
    color: string,
    gradient: IGradient,
    speed: number,
    isForward: boolean
}

interface IDevice {
    colors: string[],
    gradients: IGradient[],
    currentDisplay: IDisplay,
    isGuest?: Boolean
}

const gradientSchema = new mongoose.Schema<IGradient>({
    name: {type: String, required: true},
    colors: {type: [String], required: true}
}, {_id: false});

const displaySchema = new mongoose.Schema<IDisplay>({
    type: {type: String, required: true},
    brightness: {type: Number, required: true},
    color: {type: String, required: true},
    gradient: {type: gradientSchema, required: true},
    speed: {type: Number, required: true},
    isForward: {type: Boolean, required: true}
}, {_id: false});

const deviceSchema = new mongoose.Schema<IDevice>({
    colors: {type: [String], required: true},
    gradients: {type: [gradientSchema], required: true},
    currentDisplay: {type: displaySchema, required: true},
    isGuest: {type: Boolean}
});

const Device = mongoose.model<IDevice>('Device', deviceSchema);

export type { IDevice, IGradient, IDisplay };
export { DisplayType, Device };