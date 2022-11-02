import * as mongoose from "mongoose";
import { Device, IDisplay } from "./schemas";
import { Request, Response, NextFunction } from "express";

export async function ensureId(req: Request, res: Response, next: NextFunction){
    if(!req || !req.params || !req.params.id){
        res.status(400).send("Request must include device ID in header");
        return;
    }
    next();
}

export async function setDisplay(req: Request, res: Response){
    const id = req.params.id;
    console.log(req.body);

    Device.findOneAndUpdate({_id: id}, { currentDisplay: req.body }, {returnOriginal: false}, (error, result) => {
        if(error){
            res.status(400).json({error: error, result: result})
        } else {
            res.status(200).json(result)
        }
    });
}

export async function setSavedColors(req: Request, res: Response){
    const id = req.params.id;
    console.log(req.body);

    Device.findOneAndUpdate({_id: id}, { colors: req.body }, {returnOriginal: false}, (error, result) => {
        if(error){
            res.status(400).json({error: error, result: result})
        } else {
            res.status(200).json(result)
        }
    });
}

export async function setSavedGradients(req: Request, res: Response){
    const id = req.params.id;
    console.log(req.body);

    Device.findOneAndUpdate({_id: id}, { gradients: req.body }, {returnOriginal: false}, (error, result) => {
        if(error){
            res.status(400).json({error: error, result: result})
        } else {
            res.status(200).json(result)
        }
    });
}

export async function getConfig(req: Request, res: Response){
    const id = req.params.id;

    Device.findOne({_id: id}, null, null, (error, result) => {
        if(error){
            res.status(400).json({error: error, result: result})
        } else {
            res.status(200).json(result)
        }
    });
}

export async function generateNewDisplay(req: Request, res: Response){
    const newDevice = new Device({
        colors: ["FF0000", "FFFF00", "00FF00", "00FFFF", "0000FF", "FF00FF", "FFFFFF"],
        gradients: [{name: "Rainbow", colors: ["FF0000", "FFFF00", "00FF00", "00FFFF", "0000FF", "FF00FF"]}],
        currentDisplay: {
            type: "Color",
            brightness: 100,
            color: "FF0000",
            gradient: {name: "Rainbow", colors: ["FF0000", "FFFF00", "00FF00", "00FFFF", "0000FF", "FF00FF"]},
            speed: 50,
            isForward: true
        }
    });
    newDevice.save((error, result)=>{
        if(error){
            res.status(500).json({error: error, result: result});
        } else {
            res.status(200).json(result);
        }
    });
}