import * as mongoose from "mongoose";
import { Device, IDisplay } from "./schemas";
import { Request, Response, NextFunction } from "express";
import { renderer } from "./server";

export async function ensureId(req: Request, res: Response, next: NextFunction) {
    if (!req || !req.params || !req.params.id) {
        res.status(400).send("Request must include device ID in header");
        return;
    }
    next();
}

export async function setDisplay(req: Request, res: Response) {
    const id = req.params.id;
    console.log(`[${Date.now()}] Setting display for ${id}`);

    Device.findOneAndUpdate({ _id: id }, { currentDisplay: req.body }, { returnOriginal: false }, (error, result) => {
        if (error) {
            console.log(`[${Date.now()}] Failure setting display`, error)
            res.status(400).json({ error: error, result: result })
        } else {
            res.status(200).json(result)
        }
    });
}

export async function setSavedColors(req: Request, res: Response) {
    const id = req.params.id;
    console.log(`[${Date.now()}] Setting colors for ${id}`);

    Device.findOneAndUpdate({ _id: id }, { colors: req.body }, { returnOriginal: false }, (error, result) => {
        if (error) {
            console.log(`[${Date.now()}] Failure setting colors`, error)
            res.status(400).json({ error: error, result: result })
        } else {
            res.status(200).json(result)
        }
    });
}

export async function setSavedGradients(req: Request, res: Response) {
    const id = req.params.id;
    console.log(`[${Date.now()}] Setting gradients for ${id}`);

    Device.findOneAndUpdate({ _id: id }, { gradients: req.body }, { returnOriginal: false }, (error, result) => {
        if (error) {
            console.log(`[${Date.now()}] Failure setting gradients`, error)
            res.status(400).json({ error: error, result: result })
        } else {
            res.status(200).json(result)
        }
    });
}

export async function getConfig(req: Request, res: Response) {
    const id = req.params.id;
    console.log(`[${Date.now()}] Sending config for ${id}`);

    Device.findOne({ _id: id }, null, null, (error, result) => {
        if (error) {
            console.log(`[${Date.now()}] Failure getting config`, error)
            res.status(400).json({ error: error, result: result })
        } else {
            res.status(200).json(result)
            renderer.updateDisplay(id);
        }
    });
}



function getNewDefaultDevice(numPixels = 1) {
    return new Device({
        colors: ["FF0000", "FFFF00", "00FF00", "00FFFF", "0000FF", "FF00FF", "FFFFFF"],
        gradients: [{ name: "Rainbow", colors: ["FF0000", "FFFF00", "00FF00", "00FFFF", "0000FF", "FF00FF"] }],
        currentDisplay: {
            type: "Color",
            brightness: 100,
            color: "FF0000",
            gradient: { name: "Rainbow", colors: ["FF0000", "FFFF00", "00FF00", "00FFFF", "0000FF", "FF00FF"] },
            speed: 50,
            isForward: true
        },
        numPixels: numPixels
    });
}
export async function generateNewDisplay(req: Request, res: Response) {
    const newDevice = getNewDefaultDevice(req.body.numPixels);
    newDevice.save((error, result) => {
        if (error) {
            console.log(`[${Date.now()}] Failure generating new device`, error)
            res.status(500).json({ error: error, result: result });
        } else {
            console.log(`[${Date.now()}] Generated new device: ${result._id}`);
            res.status(200).json(result);
        }
    });
}

export async function getGuest(req: Request, res: Response) {
    console.log(`[${Date.now()}] Guest device requested`);
    Device.findOne({ guest: true }, null, null, (error, result) => {
        if (error) {
            res.status(500).json({ error: error, result: result });
        } else if (!result) {
            //If there is no guest device, make one
            console.log(`[${Date.now()}] Generating new guest device`);
            const newGuest = getNewDefaultDevice();
            newGuest.set("isGuest", true);
            newGuest.save((error, result) => {
                if (error) {
                    console.log(`[${Date.now()}] Failure generating new guest device`, error)
                    res.status(500).json({ error: error, result: result });
                } else {
                    res.status(200).json(result)
                }
            })
        } else {
            res.status(200).json(result)
        }
    });
}