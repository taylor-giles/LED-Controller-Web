import { DisplayType } from "../../../led-controller-server/schemas";

export const MONOCHROME_EFFECTS = [DisplayType.COLOR, DisplayType.CYCLE, DisplayType.COLOR_STROBE]
export const ADDRESSABLE_EFFECTS = [DisplayType.GRADIENT, DisplayType.WAVE];

export const EFFECTS = [
    ...MONOCHROME_EFFECTS,
    ...ADDRESSABLE_EFFECTS
];