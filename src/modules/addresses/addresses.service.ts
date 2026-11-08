import { AddressesRepository } from "./addresses.repository";
import { CreateAddressDTO, UpdateAddressDTO } from "./addresses.types";
import { BaseError } from "../../common/errors/base.error";

function validateAddress(data: CreateAddressDTO) {
    const requiredFields = ["full_name", "phone", "city", "street"] as const
    if (requiredFields.some((field) => !data[field]?.trim())) {
        throw new BaseError("InvalidAddress", 400, true, "full_name, phone, city, and street are required")
    }
}

export class AddressesService {
    private addressesRepository: AddressesRepository

    constructor(addressesRepository: AddressesRepository) {
        this.addressesRepository = addressesRepository
    }

    async create(userId: string, data: CreateAddressDTO) {
        validateAddress(data)
        return this.addressesRepository.create(userId, data)
    }

    async getAddresses(userId: string) {
        return this.addressesRepository.findAllByUserId(userId)
    }

    async getAddress(userId: string, addressId: string) {
        const address = await this.addressesRepository.findByIdAndUserId(userId, addressId)
        if (!address) {
            throw new BaseError("AddressNotFound", 404, true, "Address not found")
        }
        return address
    }

    async update(userId: string, addressId: string, data: UpdateAddressDTO) {
        validateAddress(data)
        const address = await this.addressesRepository.updateByIdAndUserId(userId, addressId, data)
        if (!address) {
            throw new BaseError("AddressNotFound", 404, true, "Address not found")
        }
        return address
    }

    async delete(userId: string, addressId: string) {
        const address = await this.addressesRepository.deleteByIdAndUserId(userId, addressId)
        if (!address) {
            throw new BaseError("AddressNotFound", 404, true, "Address not found")
        }
    }
}
