import { hexToRgb, linearlyInterpolate } from "../utils";
import { Device, DisplayType, IDisplay } from "./schemas";

const FRAMES_PER_SECOND: number = 30;
const MIN_DURATION = 2; //The duration of the quickest display. Max duration will be 100sec * MIN_DURATION

//NOTE: This MUST be an integer (so make sure that MIN_DURATION * FRAMES_PER_SECOND is divisible by 2)
//This is the number of times to turn OFF THEN ON
const NUM_TIMES_TO_STROBE = (MIN_DURATION * FRAMES_PER_SECOND) / 2;

interface IPixel {
    r: number
    g: number
    b: number
}

interface IActiveDisplay {
    frames: IPixel[][]
    frameArrays: number[][]
    currentFrameIndex: number
}

export default class Renderer {
    private currentDisplays: Record<string, IActiveDisplay> = {}

    public getNextFrame(deviceId: string): IPixel[] {
        let display = this.currentDisplays[deviceId];
        if (!display) {
            console.log(`Display not found for ${deviceId}. Forcing update...`);
            this.updateDisplay(deviceId);
            display = this.currentDisplays[deviceId];
            if (!display) {
                return [];
            }
        }
        let index = display.currentFrameIndex;
        this.currentDisplays[deviceId].currentFrameIndex = (index + 1) % display.frames.length;
        return display.frames[index];
    }

    public async getNextFrameAsArray(deviceId: string): Promise<number[]> {
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
        this.currentDisplays[deviceId].currentFrameIndex = (index + 1) % display.frameArrays.length;
        return display.frameArrays[index];
    }

    /**
     * Queries the DB for the current display of the specified device and updates the dictionary
     * @param id The ID of the device to update display for
     */
    public async updateDisplay(id: string) {
        await Device.findOne({ _id: id }).then((result) => {
            if (result) {
                let frames = Renderer.calculateFrames(result.currentDisplay, result.numPixels)
                let arrFrames: number[][] = []
                for (let frame of frames) {
                    let arrFrame: number[] = []
                    for (let pixel of frame) {
                        arrFrame.push(pixel.r);
                        arrFrame.push(pixel.g);
                        arrFrame.push(pixel.b);
                    }
                    arrFrames.push(arrFrame)
                }

                this.currentDisplays[id] = {
                    frames: frames, frameArrays: arrFrames, currentFrameIndex: 0
                }
            }
        })
    }

    /**
     * Calculates the frames for a given display
     * @param display The display obj to calculate frames for
     */
    private static calculateFrames(display: IDisplay, numPixels: number): IPixel[][] {
        const duration = Math.round((MIN_DURATION * 100) / (display.speed + 0.01)); //Add small value to avoid dividing by zero
        let numFrames = FRAMES_PER_SECOND * duration;
        let output: IPixel[][] = []


        function calcColorFrames() {
            let color = hexToRgb(display.color);
            for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
                let frame: IPixel[] = [];
                for (let pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
                    let pixel = { r: color[0], g: color[1], b: color[2] };
                    frame.push(pixel);
                }
                output.push(frame);
            }
        }


        function calcGradientFrames() {
            // Calculate the relative position of each color in gradient on scale of 0-numPixels
            let colorPositions: number[] = []
            let gradientColors = display.gradient.colors.map((c) => hexToRgb(c)).map((c) => { return { r: c[0], g: c[1], b: c[2] } })
            for (let i = 0; i < gradientColors.length; i++) {
                colorPositions.push((i * numPixels) / gradientColors.length);
            }

            //Populate frame values
            for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
                let frame: IPixel[] = [];
                let prevColorIndex = 0;
                for (let pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
                    if (pixelIndex >= colorPositions[prevColorIndex + 1]) {
                        prevColorIndex++;
                    }

                    //Calculate relative position of this pixel between the gradient colors
                    let pixelPosition = (pixelIndex - colorPositions[prevColorIndex]) / (colorPositions[prevColorIndex + 1] - colorPositions[prevColorIndex])

                    //Linearly interpolate
                    let pixel = linearlyInterpolate(gradientColors[prevColorIndex], gradientColors[prevColorIndex + 1], pixelPosition)
                    frame.push(pixel);
                }
                output.push(frame);
            }
        }


        function calcWaveFrames() {
            // Calculate the relative position of each color in gradient on scale of 0-numPixels
            let colorPositions: number[] = []
            let gradientColors = display.gradient.colors.map((c) => hexToRgb(c)).map((c) => { return { r: c[0], g: c[1], b: c[2] } })
            for (let i = 0; i < gradientColors.length; i++) {
                colorPositions.push((i * numPixels) / gradientColors.length);
            }

            //Populate frame values
            for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
                let offset = frameIndex * (numPixels / numFrames);
                if (display.isForward) {
                    offset += -1;
                }

                let frame: IPixel[] = [];
                let prevColorIndex = 0;
                for (let pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
                    if (pixelIndex >= colorPositions[prevColorIndex + 1]) {
                        prevColorIndex++;
                    }

                    //Calculate relative position of this pixel between the gradient colors
                    let pixelPosition = (((pixelIndex - colorPositions[prevColorIndex]) / (colorPositions[prevColorIndex + 1] - colorPositions[prevColorIndex])) + offset) % numPixels

                    //Linearly interpolate
                    let pixel = linearlyInterpolate(gradientColors[prevColorIndex], gradientColors[prevColorIndex + 1], pixelPosition)
                    frame.push(pixel);
                }
                output.push(frame);
            }
        }


        function calcCycleFrames() {
            // Calculate the relative position of each color in gradient on scale of 0-numFrames
            let colorPositions: number[] = []
            let gradientColors = display.gradient.colors.map((c) => hexToRgb(c)).map((c) => { return { r: c[0], g: c[1], b: c[2] } })
            for (let i = 0; i < gradientColors.length; i++) {
                colorPositions.push((i * numFrames) / gradientColors.length);
            }

            //Populate frame values
            let prevColorIndex = 0;
            for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
                let frame: IPixel[] = []
                if (frameIndex >= colorPositions[prevColorIndex + 1]) {
                    prevColorIndex++;
                }

                //Calculate relative position of this pixel between the gradient colors
                let framePosition = (frameIndex - colorPositions[prevColorIndex]) / (colorPositions[prevColorIndex + 1] - colorPositions[prevColorIndex])

                //Linearly interpolate
                let color = linearlyInterpolate(gradientColors[prevColorIndex], gradientColors[prevColorIndex + 1], framePosition)

                for (let pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
                    frame.push(color)
                }
                output.push(frame);
            }
        }


        function calcStrobeFrames() {
            //Change numFrames to the nearest multiple of NUM_TIMES_TO_STROBE
            numFrames = Math.ceil(numFrames / NUM_TIMES_TO_STROBE) * NUM_TIMES_TO_STROBE

            //Populate the output array with the gradient cycle
            calcCycleFrames();

            //Calculate the length of each segment (number of frames to have lights on/off for).
            let segLen = numFrames / NUM_TIMES_TO_STROBE;

            //Set the appropriate frames to black
            for (let frameIndex = 0; frameIndex < numFrames; frameIndex += segLen) {
                for (let segIndex = 0; segIndex < segLen / 2; segIndex++) {
                    for (let pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
                        output[frameIndex + segIndex][pixelIndex] = { r: 0, g: 0, b: 0 }
                    }
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
