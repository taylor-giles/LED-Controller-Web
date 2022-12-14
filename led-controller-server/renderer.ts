import { hexToRgb, linearlyInterpolate } from "../utils";
import { Device, DisplayType, IDisplay } from "./schemas";

export const FRAMES_PER_SECOND: number = 30;
const MIN_DURATION = 2; //The duration of the quickest display. Max duration will be 100sec * MIN_DURATION

//The maximum number of frames to show each color during strobe. Set to 2sec.
const MAX_STROBE_SEGMENT_LENGTH = FRAMES_PER_SECOND * 2;

//Frames are of the format [r,g,b,r,g,b,r,g,b,...] where each set of 3 (r,g,b) is a pixel value
interface IActiveDisplay {
    frames: number[][]
    currentFrameIndex: number
}

export default class Renderer {
    private currentDisplays: Record<string, IActiveDisplay> = {}

    public async getNextFrame(deviceId: string): Promise<number[]> {
        let display = this.currentDisplays[deviceId];
        if (!display) {
            console.log(`Display not found for ${deviceId}. Forcing update...`);
            await this.updateDisplay(deviceId);
            display = this.currentDisplays[deviceId];
            if (!display) {
                return [];
            }
        }
        let index = display.currentFrameIndex;
        this.currentDisplays[deviceId].currentFrameIndex = (index + 1) % display.frames.length;
        return display.frames[index];
    }

    /**
     * Queries the DB for the current display of the specified device and updates the dictionary
     * @param id The ID of the device to update display for
     */
    public async updateDisplay(id: string) {
        try {
            await Device.findOne({ _id: id }).then((result) => {
                if (result) {
                    let frames = Renderer.calculateFrames(result.currentDisplay, result.numPixels)
                    this.currentDisplays[id] = {
                        frames: frames, currentFrameIndex: 0
                    }
                }
            })
        } catch {
            return
        }
    }

    /**
     * Calculates the frames for a given display
     * @param display The display obj to calculate frames for
     */
    private static calculateFrames(display: IDisplay, numPixels: number): number[][] {
        let speed = display.speed;
        if(speed == 0) speed = 1;
        const duration = Math.round((MIN_DURATION * 100) / speed);
        const brightnessRatio = display.brightness / 100;
        let numFrames = FRAMES_PER_SECOND * duration;
        let output: number[][] = []


        function calcColorFrames() {
            //Only one frame - all pixels are the same color
            let color = hexToRgb(display.color);
            let frame: number[] = []
            for (let i = 0; i < numPixels; i++) {
                frame.push(color[0] * brightnessRatio)
                frame.push(color[1] * brightnessRatio)
                frame.push(color[2] * brightnessRatio)
            }
            output.push(frame);
        }


        function calcGradientFrames() {
            //Only one frame

            // Calculate the relative position of each color in gradient on scale of 0-numPixels
            let colorPositions: number[] = []
            let gradientColors = display.gradient.colors.map((c) => hexToRgb(c)).map((c) => { return { r: c[0], g: c[1], b: c[2] } })
            for (let i = 0; i < gradientColors.length; i++) {
                colorPositions.push((i * numPixels) / (gradientColors.length - 1));
            }

            //Populate frame values
            let frame: number[] = [];
            let prevColorIndex = 0;
            for (let pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
                if (pixelIndex >= colorPositions[prevColorIndex + 1]) {
                    prevColorIndex++;
                }

                //Calculate relative position of this pixel between the gradient colors
                let pixelPosition = (pixelIndex - colorPositions[prevColorIndex]) / (colorPositions[prevColorIndex + 1] - colorPositions[prevColorIndex])

                //Linearly interpolate
                let pixel = linearlyInterpolate(gradientColors[prevColorIndex], gradientColors[prevColorIndex + 1], pixelPosition)
                frame.push(pixel.r * brightnessRatio);
                frame.push(pixel.g * brightnessRatio);
                frame.push(pixel.b * brightnessRatio);
            }
            output.push(frame);
        }


        function calcWaveFrames() {
            // Calculate the relative position of each color in gradient on scale of 0-numPixels
            let colorPositions: number[] = []
            let gradientColors = display.gradient.colors.map((c) => hexToRgb(c)).map((c) => { return { r: c[0], g: c[1], b: c[2] } })
            for (let i = 0; i < gradientColors.length; i++) {
                colorPositions.push((i * numPixels) / (gradientColors.length - 1));
            }

            //Populate frame values
            for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
                let offset = (frameIndex/ numFrames) * numPixels;
                if (display.isForward) {
                    offset *= -1;
                }

                let frame: number[] = [];
                let prevColorIndex = 0;
                for (let pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
                    let offsetIndex = pixelIndex + offset;
                    while(offsetIndex < 0){
                        offsetIndex += numPixels
                    }
                    let pixelLocation = offsetIndex % numPixels;

                    //Find the gradient position closest to this pixel
                    for (let positionIndex=0; positionIndex < colorPositions.length-1; positionIndex++) {
                        if (colorPositions[positionIndex] <= pixelLocation && colorPositions[positionIndex + 1] >= pixelLocation) {
                            prevColorIndex = positionIndex;
                        }
                    }

                    //Calculate relative position of this pixel between the gradient colors
                    let pixelPosition = ((pixelLocation - colorPositions[prevColorIndex]) / (colorPositions[prevColorIndex + 1] - colorPositions[prevColorIndex]))

                    //Linearly interpolate
                    let pixel = linearlyInterpolate(gradientColors[prevColorIndex], gradientColors[prevColorIndex + 1], pixelPosition)
                    frame.push(pixel.r * brightnessRatio);
                    frame.push(pixel.g * brightnessRatio);
                    frame.push(pixel.b * brightnessRatio);
                }
                output.push(frame);
            }
        }


        function calcCycleFrames() {
            // Calculate the relative position of each color in gradient on scale of 0-numFrames
            let colorPositions: number[] = []
            let gradientColors = display.gradient.colors.map((c) => hexToRgb(c)).map((c) => { return { r: c[0], g: c[1], b: c[2] } })
            for (let i = 0; i < gradientColors.length; i++) {
                colorPositions.push((i * numFrames) / (gradientColors.length - 1));
            }
            output = []

            //Populate frame values
            let prevColorIndex = 0;
            for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
                let frame: number[] = [];
                if (frameIndex >= colorPositions[prevColorIndex + 1]) {
                    prevColorIndex++;
                }
                
                //Calculate relative position of this frame between the gradient colors
                let framePosition = (frameIndex - colorPositions[prevColorIndex]) / (colorPositions[prevColorIndex + 1] - colorPositions[prevColorIndex]);
                
                //Linearly interpolate
                let pixel = linearlyInterpolate(gradientColors[prevColorIndex], gradientColors[prevColorIndex + 1], framePosition)
                for (let pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
                    frame.push(pixel.r * brightnessRatio);
                    frame.push(pixel.g * brightnessRatio);
                    frame.push(pixel.b * brightnessRatio);
                }
                output.push(frame);
            }
        }


        function calcStrobeFrames() {
            //Determine the segment length
            let segLen = Math.round((1 - (display.speed / 100)) * MAX_STROBE_SEGMENT_LENGTH + 1)

            //Get the gradient colors
            let gradientColors = display.gradient.colors.map((c) => hexToRgb(c)).map((c) => { return { r: c[0], g: c[1], b: c[2] } })

            for (let color of gradientColors) {
                //Color frames
                for (let i = 0; i < segLen; i++) {
                    let frame: number[] = []
                    for (let pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
                        frame.push(color.r * brightnessRatio);
                        frame.push(color.g * brightnessRatio);
                        frame.push(color.b * brightnessRatio);
                    }
                    output.push(frame);
                }
            }
        }

        switch (display.type) {
            case DisplayType.COLOR:
                calcColorFrames();
                break;

            case DisplayType.CYCLE:
                calcCycleFrames();
                break;

            case DisplayType.GRADIENT:
                calcGradientFrames();
                break;

            case DisplayType.WAVE:
                calcWaveFrames();
                break;

            case DisplayType.COLOR_STROBE:
                calcStrobeFrames();
                break;
        }
        return output;
    }
}
