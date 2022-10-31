export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    //Formula from:
    //https://www.rapidtables.com/convert/color/hsl-to-rgb.html

    let c = (1 - Math.abs((2 * l) - 1) * s);
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - (c / 2);
    let r = 0, g = 0, b = 0;
    let h_mod: number = h % 360;
    switch (true) {
        case h_mod < 60:
            r = c; g = x; b = 0;
            break;
        case h_mod < 120:
            r = x; g = c; b = 0;
            break;
        case h_mod < 180:
            r = 0; g = c; b = x;
            break;
        case h_mod < 240:
            r = 0; g = x; b = c;
            break;
        case h_mod < 300:
            r = x; g = 0; b = c;
            break;
        default:
            r = c; g = 0; b = x;
            break;
    }

    return [
        ((r + m) * 255),
        ((g + m) * 255),
        ((b + m) * 255)
    ]
}

export function rgbToHex(r: number, g: number, b: number) {
    let rStr = Math.round(r).toString(16);
    let gStr = Math.round(g).toString(16);
    let bStr = Math.round(b).toString(16);
    let output = "";
    for (let str of [rStr, gStr, bStr]) {
        if (str.length < 2) {
            output += "0" + str;
        } else {
            output += str;
        }
    }
    return output.toUpperCase();
}

export function hslToHex(h: number, s: number, l: number) {
    return rgbToHex(...hslToRgb(h, s, l))
}

export function hexToRgb(hex: string): [number, number, number] {
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b]
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    //Formula from:
    //https://www.rapidtables.com/convert/color/rgb-to-hsl.html

    r = r / 255;
    g = g / 255;
    b = b / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let delta = max - min;

    let hue = 0;
    switch (true) {
        case delta == 0:
            hue = 0;
            break;
        case max == r:
            hue = 60 * (((g - b) / delta) + 6);
            break;
        case max == g:
            hue = 60 * (((b - r) / delta) + 2);
            break;
        case max == b:
            hue = 60 * (((r - g) / delta) + 4);
            break;
    }

    let light = (max + min) / 2;

    let sat = 0;
    if (delta != 0) {
        sat = (delta / (1 - Math.abs((2 * light) - 1)));
    }

    console.log(hue)
    return [hue, sat, light];
}

export function hexToHsl(hex: string): [number, number, number] {
    return rgbToHsl(...hexToRgb(hex));
}

export function rgbRelativeLuminance(r: number, g: number, b: number): number {
    //0-255 -> 0-1
    let r_s = r / 255;
    let g_s = g / 255;
    let b_s = b / 255;

    //Linearize
    let r_lin: number, g_lin: number, b_lin: number;
    if (r_s > 0.03928)
        r_lin = Math.pow(((r_s + 0.055) / 1.055), 2.4)
    else
        r_lin = r_s / 12.92

    if (g_s > 0.03928)
        g_lin = Math.pow(((g_s + 0.055) / 1.055), 2.4)
    else
        g_lin = g_s / 12.92

    if (b_s > 0.03928)
        b_lin = Math.pow(((b_s + 0.055) / 1.055), 2.4)
    else
        b_lin = b_s / 12.92

    return 0.2126*r_lin + 0.7152*g_lin + 0.0722*b_lin;
}

export function hslRelativeLuminance(h: number, s: number, l: number){
    return(rgbRelativeLuminance(...hslToRgb(h, s, l)));
}