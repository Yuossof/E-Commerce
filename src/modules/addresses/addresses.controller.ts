import { NextFunction, Request, Response } from "express";
import { AddressesService } from "./addresses.service";
import { CreateAddressDTO, UpdateAddressDTO } from "./addresses.types";

export class AddressesController {
    private addressesService: AddressesService

    constructor(addressesService: AddressesService) {
        this.addressesService = addressesService
    }

    createAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const address = await this.addressesService.create(
                req.user.userId,
                req.body as CreateAddressDTO
            )

            return res.status(201).json({ data: address })
        } catch (error) {
            next(error)
        }
    }

    getAddresses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const addresses = await this.addressesService.getAddresses(req.user.userId)
            return res.status(200).json({ data: addresses })
        } catch (error) {
            next(error)
        }
    }

    getAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const address = await this.addressesService.getAddress(
                req.user.userId,
                req.params.addressId as string
            )

            return res.status(200).json({ data: address })
        } catch (error) {
            next(error)
        }
    }

    updateAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const address = await this.addressesService.update(
                req.user.userId,
                req.params.addressId as string,
                req.body as UpdateAddressDTO
            )

            return res.status(200).json({ data: address })
        } catch (error) {
            next(error)
        }
    }

    deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.addressesService.delete(
                req.user.userId,
                req.params.addressId as string
            )

            return res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
